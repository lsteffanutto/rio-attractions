/**
 * Category Filter Component
 *
 * A filter UI that allows users to show/hide attractions by category.
 * Uses toggle buttons with visual feedback for active/inactive states.
 *
 * Features:
 * - Toggle individual categories on/off
 * - "All" button to reset filters
 * - Visual count of attractions per category
 * - Color-coded buttons matching map markers
 * - Keyboard accessible
 *
 * State Management:
 * - This is a controlled component - parent manages active categories
 * - Uses callbacks to communicate filter changes
 */

import { useMemo } from 'react';
import type { AttractionCategory } from '../data/attractions';
import { categoryInfo, attractions } from '../data/attractions';
import { cn } from '../utils/helpers';
import {
  Landmark,
  Umbrella,
  PartyPopper,
  ScrollText,
  Utensils,
  Home,
  Music,
  Filter,
  X,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CategoryFilterProps {
  /** Currently active category filters */
  activeCategories: AttractionCategory[];
  /** Callback when categories change */
  onCategoryChange: (categories: AttractionCategory[]) => void;
  /** Layout variant - horizontal or vertical */
  variant?: 'horizontal' | 'vertical';
  /** Whether to show attraction counts */
  showCounts?: boolean;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

// ============================================================================
// ICON MAP
// ============================================================================

/**
 * Category Icon Map
 *
 * Maps each category to its corresponding Lucide icon component.
 * This allows us to dynamically render the correct icon.
 */
const categoryIcons: Record<AttractionCategory, React.ComponentType<{ className?: string }>> = {
  monument: Landmark,
  beach: Umbrella,
  carnival: PartyPopper,
  historical: ScrollText,
  food: Utensils,
  favela: Home,
  bloco: Music,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CategoryFilter({
  activeCategories,
  onCategoryChange,
  variant = 'horizontal',
  showCounts = true,
  compact = false,
}: CategoryFilterProps) {
  /**
   * Calculate attraction counts per category
   *
   * Memoized to prevent recounting on every render.
   * Only recalculates when the attractions data changes.
   */
  const categoryCounts = useMemo(() => {
    const counts: Record<AttractionCategory, number> = {
      monument: 0,
      beach: 0,
      carnival: 0,
      historical: 0,
      food: 0,
      favela: 0,
      bloco: 0,
    };

    attractions.forEach((attraction) => {
      counts[attraction.category]++;
    });

    return counts;
  }, []);

  /**
   * Check if all categories are active (or none, which shows all)
   */
  const allActive = activeCategories.length === 0;

  /**
   * Toggle a single category
   *
   * If the category is active, remove it from the list.
   * If inactive, add it to the list.
   */
  const toggleCategory = (category: AttractionCategory) => {
    if (activeCategories.includes(category)) {
      // Remove category from active list
      onCategoryChange(activeCategories.filter((c) => c !== category));
    } else {
      // Add category to active list
      onCategoryChange([...activeCategories, category]);
    }
  };

  /**
   * Clear all filters (show all categories)
   */
  const clearFilters = () => {
    onCategoryChange([]);
  };

  /**
   * Select only one category
   */
  const selectOnlyCategory = (category: AttractionCategory) => {
    onCategoryChange([category]);
  };

  return (
    <div
      className={cn(
        'space-y-3',
        variant === 'horizontal' && 'flex flex-wrap items-center gap-2 space-y-0'
      )}
      role="group"
      aria-label="Filter attractions by category"
    >
      {/**
       * Filter Header (vertical variant only)
       */}
      {variant === 'vertical' && !compact && (
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter className="h-4 w-4" />
            Filter by Category
          </h3>
          {activeCategories.length > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {/**
       * "All" Button
       *
       * Shows all attractions when active.
       * Provides a quick way to reset filters.
       */}
      <button
        onClick={clearFilters}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200',
          compact && 'px-2 py-1.5 text-xs',
          allActive
            ? 'border-rio-green bg-rio-green text-white shadow-md'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        )}
        aria-pressed={allActive}
      >
        All
        {showCounts && !compact && (
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-xs',
              allActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            )}
          >
            {attractions.length}
          </span>
        )}
      </button>

      {/**
       * Category Buttons
       *
       * One button per category with icon, label, and count.
       */}
      {(Object.entries(categoryInfo) as [AttractionCategory, typeof categoryInfo[AttractionCategory]][]).map(
        ([key, info]) => {
          const Icon = categoryIcons[key];
          const isActive = activeCategories.includes(key);
          const count = categoryCounts[key];

          return (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={cn(
                'group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200',
                compact && 'px-2 py-1.5 text-xs',
                isActive
                  ? 'border-transparent text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              )}
              style={{
                backgroundColor: isActive ? info.markerColor : undefined,
              }}
              aria-pressed={isActive}
              title={info.description}
            >
              <Icon
                className={cn(
                  'h-4 w-4',
                  compact && 'h-3.5 w-3.5',
                  isActive ? 'text-white' : 'text-gray-500'
                )}
              />
              <span className={cn(compact && 'hidden sm:inline')}>
                {info.label}
              </span>
              {showCounts && !compact && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        }
      )}
    </div>
  );
}

/**
 * Category Filter Skeleton
 *
 * Loading placeholder while data is being fetched.
 * Matches the layout of the actual filter for smooth transition.
 */
export function CategoryFilterSkeleton({
  variant = 'horizontal',
}: {
  variant?: 'horizontal' | 'vertical';
}) {
  return (
    <div
      className={cn(
        'space-y-2',
        variant === 'horizontal' && 'flex flex-wrap items-center gap-2 space-y-0'
      )}
    >
      {/* All button skeleton */}
      <div className="h-10 w-16 animate-pulse rounded-lg bg-gray-200" />

      {/* Category button skeletons */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-28 animate-pulse rounded-lg bg-gray-200"
        />
      ))}
    </div>
  );
}
