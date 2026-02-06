/**
 * Weather Widget Component
 *
 * Displays current weather information for Rio de Janeiro.
 * Uses a free weather API or simulated data for demonstration.
 *
 * Features:
 * - Current temperature
 * - Weather condition with icon
 * - Humidity and wind speed
 * - Auto-refresh every 30 minutes
 * - Loading and error states
 *
 * API Note:
 * This component uses simulated weather data for demonstration.
 * In production, you would replace this with a real weather API
 * like OpenWeatherMap, WeatherAPI, or AccuWeather.
 *
 * Performance:
 * - Data is cached in localStorage to reduce API calls
 * - Uses SWR-like pattern for stale-while-revalidate behavior
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Wind,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { cn, getFromStorage, saveToStorage } from '../utils/helpers';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
  humidity: number;
  windSpeed: number;
  description: string;
  updatedAt: number;
}

interface WeatherWidgetProps {
  /** Size variant */
  size?: 'compact' | 'full';
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// WEATHER SIMULATION
// ============================================================================

/**
 * Simulate Weather Data
 *
 * Generates realistic weather data for Rio de Janeiro.
 * Rio has a tropical climate with temperatures typically between 20-35°C.
 *
 * In production, replace this with an actual API call.
 */
function simulateWeatherData(): WeatherData {
  // Rio's typical temperature range
  const baseTemp = 25 + Math.random() * 10; // 25-35°C
  const conditions: WeatherData['condition'][] = [
    'sunny',
    'partly-cloudy',
    'cloudy',
    'rainy',
  ];

  // Weight towards sunny/partly-cloudy (Rio is usually sunny)
  const conditionWeights = [0.4, 0.35, 0.15, 0.1];
  let random = Math.random();
  let conditionIndex = 0;

  for (let i = 0; i < conditionWeights.length; i++) {
    random -= conditionWeights[i];
    if (random <= 0) {
      conditionIndex = i;
      break;
    }
  }

  const condition = conditions[conditionIndex];

  const descriptions: Record<WeatherData['condition'], string> = {
    sunny: 'Clear skies, perfect beach day!',
    'partly-cloudy': 'Some clouds, still great for sightseeing',
    cloudy: 'Overcast, good for exploring indoor attractions',
    rainy: 'Showers expected, bring an umbrella',
  };

  return {
    temperature: Math.round(baseTemp),
    feelsLike: Math.round(baseTemp + (Math.random() - 0.5) * 4),
    condition,
    humidity: Math.round(60 + Math.random() * 30), // 60-90%
    windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
    description: descriptions[condition],
    updatedAt: Date.now(),
  };
}

// ============================================================================
// WEATHER ICON COMPONENT
// ============================================================================

/**
 * Weather Icon
 *
 * Returns the appropriate icon for the weather condition.
 * Icons are color-coded for quick visual recognition.
 */
function WeatherIcon({
  condition,
  className,
}: {
  condition: WeatherData['condition'];
  className?: string;
}) {
  const iconProps = { className: cn('w-full h-full', className) };

  switch (condition) {
    case 'sunny':
      return <Sun {...iconProps} className={cn(iconProps.className, 'text-yellow-500')} />;
    case 'partly-cloudy':
      return <CloudSun {...iconProps} className={cn(iconProps.className, 'text-yellow-400')} />;
    case 'cloudy':
      return <Cloud {...iconProps} className={cn(iconProps.className, 'text-gray-400')} />;
    case 'rainy':
      return <CloudRain {...iconProps} className={cn(iconProps.className, 'text-blue-400')} />;
    default:
      return <Sun {...iconProps} />;
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WeatherWidget({
  size = 'compact',
  className,
}: WeatherWidgetProps) {
  // Weather data state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch Weather Data
   *
   * Checks cache first, then fetches new data if stale.
   * Cache duration: 30 minutes
   */
  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = getFromStorage<WeatherData | null>('rio-weather', null);
      const cacheAge = cached ? Date.now() - cached.updatedAt : Infinity;
      const cacheMaxAge = 30 * 60 * 1000; // 30 minutes

      if (cached && cacheAge < cacheMaxAge) {
        setWeather(cached);
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In production, replace with actual API call:
      // const response = await fetch(`https://api.openweathermap.org/...`);
      // const data = await response.json();

      const data = simulateWeatherData();
      setWeather(data);
      saveToStorage('rio-weather', data);
    } catch {
      setError('Failed to load weather');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch weather on mount
  useEffect(() => {
    fetchWeather();

    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Format update time
   *
   * Shows how long ago the weather was updated.
   */
  const lastUpdated = useMemo(() => {
    if (!weather) return '';

    const minutes = Math.floor((Date.now() - weather.updatedAt) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  }, [weather?.updatedAt]);

  // Loading state
  if (isLoading && !weather) {
    return (
      <div
        className={cn(
          'animate-pulse rounded-xl bg-gradient-to-br from-blue-400 to-blue-500',
          size === 'compact' ? 'h-16 w-48' : 'h-32 w-64',
          className
        )}
      />
    );
  }

  // Error state
  if (error && !weather) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600',
          className
        )}
      >
        <span>{error}</span>
        <button onClick={fetchWeather} className="hover:underline">
          Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  // Compact variant
  if (size === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl bg-gradient-to-br from-beach-sky to-beach-ocean p-3 text-white shadow-lg',
          className
        )}
      >
        <div className="h-10 w-10">
          <WeatherIcon condition={weather.condition} />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{weather.temperature}°</span>
            <span className="text-sm opacity-80">C</span>
          </div>
          <div className="flex items-center gap-1 text-xs opacity-80">
            <MapPin className="h-3 w-3" />
            Rio de Janeiro
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-gradient-to-br from-beach-sky to-beach-ocean text-white shadow-lg',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-white/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">Rio de Janeiro</span>
        </div>
        <button
          onClick={fetchWeather}
          className="rounded p-1 hover:bg-white/10"
          aria-label="Refresh weather"
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16">
            <WeatherIcon condition={weather.condition} />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{weather.temperature}°</span>
              <span className="text-lg opacity-80">C</span>
            </div>
            <p className="text-sm opacity-80">
              Feels like {weather.feelsLike}°C
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm">{weather.description}</p>

        {/* Weather Details */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 opacity-80" />
            <span className="text-sm">{weather.humidity}% Humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 opacity-80" />
            <span className="text-sm">{weather.windSpeed} km/h</span>
          </div>
        </div>

        {/* Last Updated */}
        <p className="mt-3 text-right text-xs opacity-60">
          Updated {lastUpdated}
        </p>
      </div>
    </div>
  );
}
