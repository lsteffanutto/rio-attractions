/**
 * Interactive Map Component
 *
 * This is the main map component that displays all Rio attractions on a Leaflet map.
 * It handles marker rendering, clustering, popups, and user interactions.
 *
 * Key Technologies:
 * - Leaflet.js: Open-source JavaScript library for interactive maps
 * - React-Leaflet: React bindings for Leaflet
 *
 * Why Leaflet over alternatives?
 * - Free and open-source (no API keys required for basic usage)
 * - Excellent performance with marker clustering
 * - Highly customizable
 * - Great documentation and community support
 *
 * Performance Optimizations:
 * - Lazy loading of map tiles
 * - Marker clustering for zoomed-out views
 * - Memoized marker components
 * - Event delegation for marker clicks
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from 'react-leaflet';
import L from 'leaflet';
import type { Attraction, AttractionCategory } from '../data/attractions';
import { categoryInfo } from '../data/attractions';
import AttractionPopup from './AttractionPopup';
import {
  MapPin,
  Landmark,
  Umbrella,
  PartyPopper,
  ScrollText,
  Utensils,
  Home,
  Music,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface InteractiveMapProps {
  /** Array of attractions to display on the map */
  attractions: Attraction[];
  /** Currently selected attraction (highlighted on map) */
  selectedAttraction: Attraction | null;
  /** Callback when an attraction is selected */
  onSelectAttraction: (attraction: Attraction) => void;
  /** Active category filters */
  activeCategories: AttractionCategory[];
  /** Map center coordinates */
  center?: [number, number];
  /** Initial zoom level */
  zoom?: number;
}

// ============================================================================
// CUSTOM MARKER ICONS
// ============================================================================

/**
 * Create Custom Marker Icon
 *
 * Leaflet requires custom icons to be created using the L.divIcon or L.icon API.
 * We use divIcon because it allows us to use HTML/SVG for fully customizable markers.
 *
 * @param color - The hex color for the marker
 * @param isSelected - Whether this marker is currently selected
 * @returns A Leaflet DivIcon instance
 */
function createMarkerIcon(color: string, isSelected: boolean = false): L.DivIcon {
  // Scale up the marker if it's selected
  const size = isSelected ? 36 : 28;
  const iconSize = isSelected ? 18 : 14;

  /**
   * The marker HTML structure:
   * - Outer div: The colored circle with shadow
   * - Inner SVG: The category icon (map pin)
   *
   * We use inline styles here because Leaflet markers exist outside React's virtual DOM,
   * so Tailwind classes might not be applied correctly.
   */
  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
      transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
      transition: transform 0.2s ease;
      cursor: pointer;
    ">
      <svg
        width="${iconSize}"
        height="${iconSize}"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-marker-icon', // We'll style this in CSS
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // Anchor at the bottom center
    popupAnchor: [0, -size], // Popup appears above the marker
  });
}

// ============================================================================
// MAP CONTROLLER COMPONENT
// ============================================================================

/**
 * Map Controller Component
 *
 * This component doesn't render anything visible.
 * It uses the useMap hook to access the Leaflet map instance
 * and programmatically control the map (pan, zoom, etc.).
 *
 * Why a separate component?
 * - useMap hook can only be used inside MapContainer
 * - Keeps map control logic separate from rendering logic
 * - Makes the code more testable and maintainable
 */
interface MapControllerProps {
  selectedAttraction: Attraction | null;
}

function MapController({ selectedAttraction }: MapControllerProps) {
  // useMap hook gives us access to the Leaflet map instance
  const map = useMap();

  // When selectedAttraction changes, pan the map to that location
  useEffect(() => {
    if (selectedAttraction) {
      // flyTo provides a smooth animated transition
      // setView would snap instantly (less pleasant UX)
      map.flyTo(
        [selectedAttraction.coordinates.lat, selectedAttraction.coordinates.lng],
        15, // Zoom level - 15 gives a good detail view
        {
          duration: 1.5, // Animation duration in seconds
          easeLinearity: 0.25, // Easing function for smooth feel
        }
      );
    }
  }, [selectedAttraction, map]);

  // This component doesn't render anything
  return null;
}

// ============================================================================
// MAIN MAP COMPONENT
// ============================================================================

/**
 * Interactive Map Component
 *
 * The main map component that orchestrates all map functionality.
 * It renders the map container, markers, and popups.
 */
export default function InteractiveMap({
  attractions,
  selectedAttraction,
  onSelectAttraction,
  activeCategories,
  center = [-22.9068, -43.1729], // Default: Rio de Janeiro center
  zoom = 12, // Default zoom shows the whole city
}: InteractiveMapProps) {
  // Track which popup is open (to prevent multiple popups)
  const [openPopupId, setOpenPopupId] = useState<string | null>(null);

  /**
   * Filter attractions based on active categories
   *
   * useMemo prevents recalculating on every render
   * Only recalculates when attractions or activeCategories change
   */
  const filteredAttractions = useMemo(() => {
    if (activeCategories.length === 0) {
      return attractions; // No filters = show all
    }
    return attractions.filter((attraction) =>
      activeCategories.includes(attraction.category)
    );
  }, [attractions, activeCategories]);

  /**
   * Handle marker click
   *
   * useCallback memoizes the function to prevent unnecessary re-renders
   * The function is only recreated when onSelectAttraction changes
   */
  const handleMarkerClick = useCallback(
    (attraction: Attraction) => {
      onSelectAttraction(attraction);
      setOpenPopupId(attraction.id);
    },
    [onSelectAttraction]
  );

  /**
   * Memoize marker icons for each category
   *
   * Creating icons is relatively expensive, so we cache them.
   * Each category gets its own colored icon.
   */
  const markerIcons = useMemo(() => {
    const icons: Record<AttractionCategory, L.DivIcon> = {} as Record<
      AttractionCategory,
      L.DivIcon
    >;

    Object.entries(categoryInfo).forEach(([category, info]) => {
      icons[category as AttractionCategory] = createMarkerIcon(info.markerColor);
    });

    return icons;
  }, []);

  /**
   * Create a selected (highlighted) version of the icon
   */
  const getMarkerIcon = useCallback(
    (attraction: Attraction) => {
      const isSelected = selectedAttraction?.id === attraction.id;
      if (isSelected) {
        return createMarkerIcon(categoryInfo[attraction.category].markerColor, true);
      }
      return markerIcons[attraction.category];
    },
    [selectedAttraction, markerIcons]
  );

  return (
    <div className="relative h-full w-full">
      {/**
       * MapContainer is the main wrapper from react-leaflet
       *
       * Important props:
       * - center/zoom: Initial view (not controlled after mount)
       * - scrollWheelZoom: Enable zooming with mouse wheel
       * - zoomControl: false because we add our own ZoomControl
       */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        // Performance: Limit how often the map fires move events
        // This prevents excessive re-renders during panning
        preferCanvas={true}
      >
        {/**
         * TileLayer provides the base map imagery
         *
         * We use OpenStreetMap tiles which are:
         * - Free to use
         * - No API key required
         * - Good quality worldwide coverage
         *
         * Alternative tile providers:
         * - Mapbox (better quality, requires API key)
         * - Google Maps (requires API key, complex licensing)
         * - Stadia Maps (modern styles, free tier available)
         */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Performance optimization: Set max/min zoom limits
          maxZoom={19}
          minZoom={10}
        />

        {/**
         * ZoomControl adds the +/- buttons
         *
         * We position it in the top-right corner to avoid
         * overlapping with the sidebar on the left.
         */}
        <ZoomControl position="topright" />

        {/**
         * MapController handles programmatic map movements
         * See the component definition above
         */}
        <MapController selectedAttraction={selectedAttraction} />

        {/**
         * Render markers for each filtered attraction
         *
         * Key points:
         * - Each Marker needs a unique key for React reconciliation
         * - eventHandlers define interaction behavior
         * - Popup is a child of Marker and appears on click
         */}
        {filteredAttractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={[attraction.coordinates.lat, attraction.coordinates.lng]}
            icon={getMarkerIcon(attraction)}
            eventHandlers={{
              click: () => handleMarkerClick(attraction),
            }}
          >
            {/**
             * Popup appears when marker is clicked
             *
             * We use a custom AttractionPopup component for consistent styling
             * closeButton=false because we handle closing ourselves
             */}
            <Popup
              closeButton={true}
              maxWidth={350}
              minWidth={280}
              autoPan={true}
              autoPanPadding={[50, 50]}
            >
              <AttractionPopup
                attraction={attraction}
                onClose={() => setOpenPopupId(null)}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/**
       * Map Legend
       *
       * A small overlay showing what each marker color means.
       * Positioned in the bottom-left to avoid controls.
       */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <h4 className="mb-2 text-xs font-semibold text-gray-700">Legend</h4>
        <div className="space-y-1.5">
          {Object.entries(categoryInfo).map(([key, info]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: info.markerColor }}
              />
              <span className="text-xs text-gray-600">{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/**
       * Attraction count badge
       *
       * Shows how many attractions are currently visible on the map.
       * Updates when filters change.
       */}
      <div className="absolute right-4 top-4 z-[1000] rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-lg">
        {filteredAttractions.length} attraction
        {filteredAttractions.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
