/**
 * Helper Utilities
 *
 * This file contains general-purpose utility functions used throughout
 * the application. These functions handle common operations like:
 * - Currency formatting
 * - Debouncing for performance
 * - Class name merging
 * - Date/time formatting
 *
 * Why separate utility files?
 * - Keeps code DRY (Don't Repeat Yourself)
 * - Makes testing easier (pure functions)
 * - Improves code organization and maintainability
 */

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format currency in Brazilian Reais
 *
 * Uses the Intl.NumberFormat API for proper locale-aware formatting.
 * This ensures correct decimal separators and currency symbols.
 *
 * @param value - The numeric value to format
 * @returns Formatted string like "R$ 150,00"
 *
 * @example
 * formatBRL(150) // "R$ 150,00"
 * formatBRL(1500.5) // "R$ 1.500,50"
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format currency in US Dollars
 *
 * @param value - The numeric value to format
 * @returns Formatted string like "$30.00"
 *
 * @example
 * formatUSD(30) // "$30.00"
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Debounce Function
 *
 * Debouncing is a technique to limit how often a function can be called.
 * It's essential for performance in scenarios like:
 * - Search input (don't search on every keystroke)
 * - Window resize handlers
 * - Scroll event handlers
 *
 * How it works:
 * 1. When the function is called, start a timer
 * 2. If called again before timer expires, reset the timer
 * 3. Only execute when timer completes (no new calls for `delay` ms)
 *
 * @param func - The function to debounce
 * @param delay - Milliseconds to wait (default: 300ms)
 * @returns A debounced version of the function
 *
 * @example
 * const debouncedSearch = debounce((query) => {
 *   // This only runs 300ms after the user stops typing
 *   searchAPI(query);
 * }, 300);
 *
 * input.addEventListener('input', (e) => debouncedSearch(e.target.value));
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    // Clear any existing timeout
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Throttle Function
 *
 * Throttling ensures a function is called at most once per interval.
 * Unlike debounce, it guarantees execution during continuous calls.
 *
 * Use cases:
 * - Scroll progress indicators (update regularly, not on every pixel)
 * - Map marker updates during pan/zoom
 * - Analytics event tracking
 *
 * @param func - The function to throttle
 * @param limit - Minimum milliseconds between calls
 * @returns A throttled version of the function
 *
 * @example
 * const throttledScroll = throttle(() => {
 *   updateScrollProgress();
 * }, 100); // Max 10 updates per second
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Merge CSS Class Names
 *
 * A simple utility to combine CSS class names, filtering out falsy values.
 * This is useful for conditional class application.
 *
 * Why not use a library like clsx or classnames?
 * - This simple implementation covers 90% of use cases
 * - Zero dependencies = smaller bundle size
 * - Easy to understand and maintain
 *
 * @param classes - Class names or conditional expressions
 * @returns Combined class string
 *
 * @example
 * cn('btn', isActive && 'btn-active', size === 'lg' && 'btn-lg')
 * // Returns "btn btn-active btn-lg" if conditions are true
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================================================
// DATE/TIME UTILITIES
// ============================================================================

/**
 * Format time for display
 *
 * Converts 24-hour time strings to a more readable format.
 *
 * @param time - Time string like "14:00"
 * @returns Formatted time like "2:00 PM"
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get current time in Rio de Janeiro
 *
 * Rio is in the BRT timezone (UTC-3).
 * This function returns the current time in Rio.
 *
 * @returns Object with hours, minutes, and formatted string
 */
export function getRioTime(): { hours: number; minutes: number; formatted: string } {
  const now = new Date();
  const rioTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  );

  return {
    hours: rioTime.getHours(),
    minutes: rioTime.getMinutes(),
    formatted: rioTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncate text with ellipsis
 *
 * Shortens long text while keeping it readable.
 * Useful for card descriptions, previews, etc.
 *
 * @param text - The text to truncate
 * @param maxLength - Maximum character length (default: 100)
 * @returns Truncated text with "..." if needed
 *
 * @example
 * truncate("This is a very long description...", 20)
 * // Returns "This is a very lon..."
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Slugify a string
 *
 * Converts a string to a URL-friendly slug.
 *
 * @param text - The text to slugify
 * @returns URL-safe slug
 *
 * @example
 * slugify("Cristo Redentor") // "cristo-redentor"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Shuffle an array (Fisher-Yates algorithm)
 *
 * Creates a randomly shuffled copy of an array.
 * Used for randomizing attraction suggestions.
 *
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Group array by a key
 *
 * Groups array items by a specified property.
 * Useful for organizing attractions by category.
 *
 * @param array - The array to group
 * @param key - The property key to group by
 * @returns Object with grouped items
 *
 * @example
 * groupBy(attractions, 'category')
 * // Returns { beach: [...], monument: [...], ... }
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Check if a value is empty
 *
 * Returns true for null, undefined, empty strings, empty arrays, etc.
 *
 * @param value - The value to check
 * @returns True if empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

/**
 * Safe localStorage getter
 *
 * Safely retrieves values from localStorage with JSON parsing.
 * Returns defaultValue if not found or on error.
 *
 * @param key - The storage key
 * @param defaultValue - Value to return if not found
 * @returns The stored value or defaultValue
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safe localStorage setter
 *
 * Safely stores values in localStorage with JSON stringification.
 *
 * @param key - The storage key
 * @param value - The value to store
 */
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// ============================================================================
// IMAGE UTILITIES
// ============================================================================

/**
 * Generate placeholder image URL
 *
 * Creates a placeholder image URL using a service.
 * Useful for development and fallback images.
 *
 * @param width - Image width
 * @param height - Image height
 * @param text - Optional text to display
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(
  width: number = 400,
  height: number = 300,
  text: string = 'Rio'
): string {
  // Using placeholder.com as a reliable placeholder service
  return `https://via.placeholder.com/${width}x${height}/0077B6/FFFFFF?text=${encodeURIComponent(text)}`;
}

/**
 * Preload an image
 *
 * Loads an image in the background for smoother UX.
 * Returns a promise that resolves when loaded.
 *
 * @param src - The image source URL
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}
