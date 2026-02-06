/**
 * Sidebar Component
 *
 * The main side panel that displays the list of attractions.
 * Includes search, filters, view toggle, and attraction cards.
 *
 * Features:
 * - Collapsible on mobile (slide in/out animation)
 * - Search with real-time filtering
 * - Category filters
 * - Toggle between grid and list views
 * - Scrollable list with virtual scrolling potential
 * - Selected attraction highlighting
 *
 * Mobile UX:
 * - Full-screen overlay on mobile
 * - Swipe to close gesture support
 * - Backdrop for dismissing
 */

import { useState, useMemo, useCallback } from 'react';
import type { Attraction, AttractionCategory } from '../data/attractions';
import { searchAttractions } from '../data/attractions';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import AttractionCard from './AttractionCard';
import { cn } from '../utils/helpers';
import {
  X,
  List,
  Grid,
  MapPin,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface SidebarProps {
  /** All attractions to display */
  attractions: Attraction[];
  /** Currently selected attraction */
  selectedAttraction: Attraction | null;
  /** Callback when an attraction is selected */
  onSelectAttraction: (attraction: Attraction) => void;
  /** Active category filters */
  activeCategories: AttractionCategory[];
  /** Callback when categories change */
  onCategoryChange: (categories: AttractionCategory[]) => void;
  /** Whether sidebar is open (for mobile) */
  isOpen: boolean;
  /** Callback to toggle sidebar open/closed */
  onToggle: () => void;
  /** Search query value */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Sidebar({
  attractions,
  selectedAttraction,
  onSelectAttraction,
  activeCategories,
  onCategoryChange,
  isOpen,
  onToggle,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  // View mode: list (single column) or grid (two columns)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter panel visibility on mobile
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Filter attractions based on search query and categories
   *
   * Memoized to prevent recalculating on every render.
   * Dependencies: attractions, searchQuery, activeCategories
   */
  const filteredAttractions = useMemo(() => {
    // Start with all attractions or search results
    let results = searchQuery
      ? searchAttractions(searchQuery)
      : attractions;

    // Apply category filters
    if (activeCategories.length > 0) {
      results = results.filter((attraction) =>
        activeCategories.includes(attraction.category)
      );
    }

    return results;
  }, [attractions, searchQuery, activeCategories]);

  /**
   * Handle attraction selection
   *
   * Closes sidebar on mobile after selection
   */
  const handleSelectAttraction = useCallback(
    (attraction: Attraction) => {
      onSelectAttraction(attraction);
      // Close sidebar on mobile after selection
      if (window.innerWidth < 768) {
        onToggle();
      }
    },
    [onSelectAttraction, onToggle]
  );

  return (
    <>
      {/**
       * Mobile Backdrop
       *
       * Semi-transparent overlay that closes sidebar when clicked.
       * Only visible on mobile when sidebar is open.
       */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/**
       * Sidebar Toggle Button (Mobile)
       *
       * Floating button to open the sidebar on mobile.
       * Hidden when sidebar is open.
       */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-4 left-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-rio-green text-white shadow-lg md:hidden"
          aria-label="Open attraction list"
        >
          <List className="h-6 w-6" />
        </button>
      )}

      {/**
       * Main Sidebar Container
       *
       * Fixed position on the left side of the screen.
       * Slides in/out on mobile with transform animation.
       */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-full bg-white shadow-xl',
          'transition-transform duration-300 ease-out',
          'md:relative md:z-10 md:w-[400px] md:translate-x-0 md:shadow-lg',
          'lg:w-[450px]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="complementary"
        aria-label="Attractions sidebar"
      >
        {/**
         * Sidebar Header
         *
         * Contains title, close button, and view toggle.
         */}
        <header className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-rio-green" />
              <h2 className="text-lg font-bold text-gray-900">
                Discover Rio
              </h2>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex rounded-lg border p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'rounded-md p-1.5 transition-colors',
                    viewMode === 'list'
                      ? 'bg-rio-green text-white'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'rounded-md p-1.5 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-rio-green text-white'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'rounded-lg p-2 md:hidden',
                  showFilters
                    ? 'bg-rio-green text-white'
                    : 'text-gray-400 hover:text-gray-600'
                )}
                aria-label="Toggle filters"
                aria-expanded={showFilters}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>

              {/* Close Button (Mobile) */}
              <button
                onClick={onToggle}
                className="rounded-lg p-2 text-gray-400 hover:text-gray-600 md:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search beaches, monuments, food..."
            />
          </div>

          {/* Category Filters */}
          <div
            className={cn(
              'mt-3 overflow-hidden transition-all duration-300',
              showFilters || 'max-h-0 md:max-h-none'
            )}
          >
            <CategoryFilter
              activeCategories={activeCategories}
              onCategoryChange={onCategoryChange}
              variant="horizontal"
              compact
            />
          </div>

          {/* Results Count */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>
              {filteredAttractions.length} attraction
              {filteredAttractions.length !== 1 ? 's' : ''} found
            </span>
            {(searchQuery || activeCategories.length > 0) && (
              <button
                onClick={() => {
                  onSearchChange('');
                  onCategoryChange([]);
                }}
                className="text-rio-green hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </header>

        {/**
         * Attractions List
         *
         * Scrollable container for attraction cards.
         * Uses CSS grid for layout with different column counts.
         */}
        <div className="h-[calc(100%-200px)] overflow-y-auto p-4">
          {filteredAttractions.length === 0 ? (
            /**
             * Empty State
             *
             * Shown when no attractions match the current filters.
             */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No attractions found
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Try adjusting your search or filters to find what you're
                looking for.
              </p>
              <button
                onClick={() => {
                  onSearchChange('');
                  onCategoryChange([]);
                }}
                className="text-sm font-medium text-rio-green hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            /**
             * Attractions Grid/List
             *
             * Responsive grid that switches between 1 and 2 columns.
             */
            <div
              className={cn(
                'grid gap-4',
                viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
              )}
            >
              {filteredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  isSelected={selectedAttraction?.id === attraction.id}
                  onClick={() => handleSelectAttraction(attraction)}
                  expanded={
                    viewMode === 'list' &&
                    selectedAttraction?.id === attraction.id
                  }
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/**
       * Sidebar Collapse Toggle (Desktop)
       *
       * Button to collapse/expand sidebar on desktop.
       */}
      <button
        onClick={onToggle}
        className={cn(
          'fixed left-[400px] top-1/2 z-30 hidden -translate-y-1/2 rounded-r-lg bg-white p-2 shadow-md md:block',
          'hover:bg-gray-50',
          'lg:left-[450px]',
          !isOpen && 'left-0'
        )}
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-600" />
        )}
      </button>
    </>
  );
}

/**
 * Sidebar Skeleton
 *
 * Loading placeholder for the sidebar.
 */
export function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 top-0 z-50 h-full w-full bg-white shadow-xl md:relative md:w-[400px] lg:w-[450px]">
      <header className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-3 h-11 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </header>
      <div className="space-y-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-gray-200">
            <div className="h-48 rounded-t-xl bg-gray-300" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 rounded bg-gray-300" />
              <div className="h-4 w-full rounded bg-gray-300" />
              <div className="h-4 w-2/3 rounded bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
