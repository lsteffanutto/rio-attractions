/**
 * Main App Component
 *
 * This is the root React component that orchestrates the entire application.
 * It manages global state and coordinates communication between components.
 *
 * Architecture Overview:
 * - App (this component) manages global state
 *   ├── Header: Logo, navigation, quick facts
 *   ├── Sidebar: Search, filters, attraction list
 *   │   ├── SearchBar: Text search input
 *   │   ├── CategoryFilter: Category toggles
 *   │   └── AttractionCard: Individual attraction cards
 *   └── InteractiveMap: Leaflet map with markers
 *       └── AttractionPopup: Marker popup content
 *
 * State Management:
 * - Uses React's built-in useState for state
 * - Props drilling for state distribution (fine for this size)
 * - For larger apps, consider Context API or state libraries
 *
 * Data Flow:
 * 1. User interactions trigger callbacks (onClick, onChange)
 * 2. Callbacks update state in App
 * 3. State changes trigger re-renders with new props
 * 4. Components re-render with updated data
 */

import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import type { Attraction, AttractionCategory } from '../data/attractions';
import { attractions } from '../data/attractions';
import Sidebar from './Sidebar';
import WeatherWidget from './WeatherWidget';
import QuickFacts from './QuickFacts';
import { cn } from '../utils/helpers';
import {
  Map as MapIcon,
  List,
  Info,
  X,
  Menu,
} from 'lucide-react';

// ============================================================================
// LAZY-LOADED COMPONENTS
// ============================================================================

/**
 * Lazy load the map component
 *
 * The map is a heavy component (Leaflet is ~150KB).
 * Lazy loading splits it into a separate chunk that loads on demand.
 * This improves initial page load time significantly.
 *
 * IMPORTANT: Leaflet requires browser APIs (window, document), so we need
 * to ensure it only loads on the client side. We use a combination of:
 * 1. React.lazy() for code splitting
 * 2. A "mounted" state check to ensure we're in the browser
 *
 * How it works:
 * 1. React.lazy() creates a component that loads the module on first render
 * 2. Suspense shows a fallback while the module is loading
 * 3. Once loaded, the component renders normally
 * 4. The isMounted check prevents SSR from trying to import Leaflet
 */
const InteractiveMap = lazy(() => import('./InteractiveMap'));

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ViewMode = 'map' | 'list';

// ============================================================================
// LOADING FALLBACK
// ============================================================================

/**
 * Map Loading Skeleton
 *
 * Shows while the map component is being loaded.
 * Uses a pulsing animation to indicate loading.
 */
function MapLoadingSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <p className="mt-2 text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Client-Side Mount State
   *
   * Tracks whether the component has mounted on the client.
   * This is crucial for components that use browser-only APIs (like Leaflet).
   * During SSR, this will be false, preventing Leaflet from being imported.
   */
  const [isMounted, setIsMounted] = useState(false);

  /**
   * Effect to track client-side mounting
   *
   * useEffect only runs on the client side, never during SSR.
   * This pattern ensures browser-only code (like Leaflet) doesn't
   * cause errors during server-side rendering.
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Selected Attraction State
   *
   * Tracks which attraction is currently selected/highlighted.
   * Used for:
   * - Highlighting the marker on the map
   * - Expanding the card in the sidebar
   * - Centering the map on the location
   */
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);

  /**
   * Active Categories State
   *
   * Array of categories currently selected for filtering.
   * Empty array means "show all" (no filter applied).
   */
  const [activeCategories, setActiveCategories] = useState<AttractionCategory[]>([]);

  /**
   * Search Query State
   *
   * Current text in the search input.
   * Used to filter attractions by name, description, and tags.
   */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Sidebar Open State
   *
   * Controls sidebar visibility on mobile devices.
   * Desktop: Always visible
   * Mobile: Toggle with button
   */
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /**
   * View Mode State (Mobile)
   *
   * On mobile, users can toggle between map and list views.
   * On desktop, both are visible side by side.
   */
  const [mobileViewMode, setMobileViewMode] = useState<ViewMode>('map');

  /**
   * Quick Facts Panel State
   *
   * Controls visibility of the quick facts overlay.
   */
  const [showQuickFacts, setShowQuickFacts] = useState(false);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle Attraction Selection
   *
   * Called when a user clicks on a marker or card.
   * Uses useCallback to prevent unnecessary re-renders.
   */
  const handleSelectAttraction = useCallback((attraction: Attraction) => {
    setSelectedAttraction(attraction);
  }, []);

  /**
   * Handle Category Change
   *
   * Called when category filters are toggled.
   */
  const handleCategoryChange = useCallback((categories: AttractionCategory[]) => {
    setActiveCategories(categories);
  }, []);

  /**
   * Handle Search Change
   *
   * Called when search input changes (debounced in SearchBar).
   */
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  /**
   * Toggle Sidebar
   *
   * Opens/closes the sidebar (mainly for mobile).
   */
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      {/**
       * Header Bar
       *
       * Contains logo, navigation, and quick actions.
       * Fixed at the top of the screen.
       */}
      <header className="z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rio-green to-carnival-pink">
            <MapIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Rio <span className="text-rio-green">Attractions</span>
            </h1>
            <p className="text-xs text-gray-500">
              Discover the Marvelous City
            </p>
          </div>
        </div>

        {/* Center - Weather Widget (Desktop) */}
        <div className="hidden md:block">
          <WeatherWidget size="compact" />
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Facts Button */}
          <button
            onClick={() => setShowQuickFacts(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Facts</span>
          </button>

          {/* Mobile View Toggle */}
          <div className="flex rounded-lg border p-1 md:hidden">
            <button
              onClick={() => setMobileViewMode('map')}
              className={cn(
                'rounded-md p-2 transition-colors',
                mobileViewMode === 'map'
                  ? 'bg-rio-green text-white'
                  : 'text-gray-400'
              )}
              aria-label="Map view"
            >
              <MapIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileViewMode('list')}
              className={cn(
                'rounded-md p-2 transition-colors',
                mobileViewMode === 'list'
                  ? 'bg-rio-green text-white'
                  : 'text-gray-400'
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Menu Button (Mobile) */}
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/**
       * Main Content Area
       *
       * Contains the sidebar and map in a flex layout.
       * Desktop: Side by side
       * Mobile: Full screen with view toggle
       */}
      <div className="relative flex flex-1 overflow-hidden">
        {/**
         * Sidebar Component
         *
         * Contains search, filters, and attraction list.
         * On mobile: Overlay that slides in from left
         * On desktop: Fixed width side panel
         */}
        <div
          className={cn(
            'md:block',
            mobileViewMode === 'list' ? 'block w-full' : 'hidden'
          )}
        >
          <Sidebar
            attractions={attractions}
            selectedAttraction={selectedAttraction}
            onSelectAttraction={handleSelectAttraction}
            activeCategories={activeCategories}
            onCategoryChange={handleCategoryChange}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/**
         * Map Container
         *
         * Takes remaining space after sidebar.
         * Uses Suspense for lazy loading.
         *
         * IMPORTANT: Only renders when isMounted is true.
         * This prevents Leaflet from being imported during SSR,
         * which would cause "window is not defined" errors.
         */}
        <div
          className={cn(
            'flex-1',
            mobileViewMode === 'map' ? 'block' : 'hidden md:block'
          )}
        >
          {isMounted ? (
            <Suspense fallback={<MapLoadingSkeleton />}>
              <InteractiveMap
                attractions={attractions}
                selectedAttraction={selectedAttraction}
                onSelectAttraction={handleSelectAttraction}
                activeCategories={activeCategories}
              />
            </Suspense>
          ) : (
            <MapLoadingSkeleton />
          )}
        </div>
      </div>

      {/**
       * Quick Facts Modal
       *
       * Overlay showing interesting facts about Rio.
       */}
      {showQuickFacts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in">
            <button
              onClick={() => setShowQuickFacts(false)}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <QuickFacts />
          </div>
        </div>
      )}

      {/**
       * Mobile Weather Widget
       *
       * Fixed at the bottom on mobile devices.
       */}
      <div className="fixed bottom-4 right-4 z-30 md:hidden">
        <WeatherWidget size="compact" />
      </div>
    </div>
  );
}
