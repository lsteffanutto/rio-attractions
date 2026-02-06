/**
 * Attraction Card Component
 *
 * A detailed card component that displays comprehensive information
 * about an attraction. Used in the sidebar list and detail views.
 *
 * Features:
 * - Preview image with lazy loading
 * - Category badge with distinct colors
 * - Cost breakdown (BRL and USD)
 * - Best time to visit
 * - Transport options from Copacabana and Centro
 * - Safety notes for favelas
 * - Local tips
 * - Interactive hover/selected states
 *
 * Performance Optimizations:
 * - Image lazy loading with loading="lazy"
 * - Memoized formatting functions
 * - CSS transitions for smooth animations (GPU-accelerated)
 */

import { useState, useMemo, memo } from 'react';
import type { Attraction, TransportOption } from '../data/attractions';
import { categoryInfo } from '../data/attractions';
import { formatBRL, formatUSD, cn } from '../utils/helpers';
import {
  Clock,
  DollarSign,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  Bus,
  Car,
  Train,
  Footprints,
  AlertTriangle,
  Lightbulb,
  Timer,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AttractionCardProps {
  /** The attraction data to display */
  attraction: Attraction;
  /** Whether this card is currently selected */
  isSelected?: boolean;
  /** Callback when the card is clicked */
  onClick?: () => void;
  /** Whether to show the expanded detail view */
  expanded?: boolean;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Transport Mode Icon
 *
 * Returns the appropriate icon for each transport mode.
 * Icons help users quickly identify transport options.
 */
function TransportIcon({ mode }: { mode: string }) {
  const iconClass = 'h-4 w-4 flex-shrink-0';

  // Determine which icon to show based on transport mode
  if (mode.toLowerCase().includes('metro') || mode.toLowerCase().includes('train')) {
    return <Train className={cn(iconClass, 'text-purple-600')} />;
  }
  if (mode.toLowerCase().includes('bus') || mode.toLowerCase().includes('vlt')) {
    return <Bus className={cn(iconClass, 'text-blue-600')} />;
  }
  if (mode.toLowerCase().includes('walk')) {
    return <Footprints className={cn(iconClass, 'text-green-600')} />;
  }
  // Default to car for Uber/Taxi
  return <Car className={cn(iconClass, 'text-gray-600')} />;
}

/**
 * Transport Option Display
 *
 * Renders a single transport option with mode, duration, and cost.
 */
function TransportOptionDisplay({ option }: { option: TransportOption }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-gray-50 p-2 text-sm">
      <TransportIcon mode={option.mode} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">{option.mode}</span>
          <span className="text-xs text-gray-500">{option.duration}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">
            {option.costBRL === 0 ? 'Free' : formatBRL(option.costBRL)}
          </span>
          {option.notes && (
            <span className="max-w-[150px] truncate text-gray-400" title={option.notes}>
              {option.notes}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AttractionCard Component
 *
 * The main card component for displaying attraction information.
 * Uses React.memo for performance optimization - only re-renders when props change.
 */
const AttractionCard = memo(function AttractionCard({
  attraction,
  isSelected = false,
  onClick,
  expanded: controlledExpanded,
}: AttractionCardProps) {
  // State for expandable sections (when not controlled)
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTransport, setShowTransport] = useState(false);

  // Use controlled expanded state if provided
  const expanded = controlledExpanded ?? isExpanded;

  // Get category styling
  const category = categoryInfo[attraction.category];

  /**
   * Format cost display
   *
   * Memoized to prevent recalculation on every render.
   */
  const costDisplay = useMemo(() => {
    if (attraction.cost.brl === 0) {
      return {
        text: 'Free',
        subtext: attraction.cost.description,
        isFree: true,
      };
    }
    return {
      text: formatBRL(attraction.cost.brl),
      subtext: `≈ ${formatUSD(attraction.cost.usd)}`,
      isFree: false,
    };
  }, [attraction.cost]);

  /**
   * Handle card click
   *
   * Calls the onClick prop and toggles expansion if not controlled.
   */
  const handleClick = () => {
    onClick?.();
    if (controlledExpanded === undefined) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <article
      /**
       * Card Styling
       *
       * Uses conditional classes for selected state.
       * The transform and transition properties are GPU-accelerated for 60fps.
       */
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white shadow-card',
        'transition-all duration-200 ease-out',
        'hover:shadow-card-hover',
        isSelected && 'ring-2 ring-rio-green ring-offset-2',
        onClick && 'cursor-pointer'
      )}
      onClick={handleClick}
      /**
       * Accessibility
       *
       * role="button" and tabIndex make the card keyboard-accessible.
       * aria-expanded indicates the expansion state for screen readers.
       */
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/**
       * Image Section
       *
       * Fixed height with object-cover for consistent card sizes.
       * Gradient overlay improves text readability on hover.
       */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={attraction.image}
          alt={`${attraction.name} - ${category.label} in Rio de Janeiro`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/400x200/0077B6/FFFFFF?text=Rio';
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/**
         * Category Badge
         *
         * Positioned in top-left with category color.
         */}
        <div
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white shadow-md"
          style={{ backgroundColor: category.markerColor }}
        >
          <Tag className="h-3 w-3" />
          {category.label}
        </div>

        {/**
         * Free Badge (Conditional)
         *
         * Shows a "Free" badge for zero-cost attractions.
         */}
        {costDisplay.isFree && (
          <div className="absolute right-3 top-3 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-md">
            FREE
          </div>
        )}
      </div>

      {/**
       * Content Section
       *
       * Contains all the text content and details.
       */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-rio-green">
          {attraction.name}
        </h3>

        {/* Description - truncated when not expanded */}
        <p
          className={cn(
            'mb-3 text-sm text-gray-600',
            expanded ? '' : 'line-clamp-2'
          )}
        >
          {attraction.description}
        </p>

        {/**
         * Quick Info Row
         *
         * Shows cost and best time in a horizontal layout.
         */}
        <div className="mb-3 flex items-center gap-4 text-sm">
          {/* Cost */}
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-gray-900">{costDisplay.text}</span>
          </div>

          {/* Separator */}
          <span className="text-gray-300">|</span>

          {/* Best Time */}
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{attraction.bestTime.hours}</span>
          </div>
        </div>

        {/* Visit Duration */}
        {attraction.visitDuration && (
          <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
            <Timer className="h-4 w-4" />
            <span>Typical visit: {attraction.visitDuration}</span>
          </div>
        )}

        {/**
         * Tags Row
         *
         * Horizontal scrollable row of tag badges.
         */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {attraction.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/**
         * Expanded Content
         *
         * Additional details shown when card is expanded.
         */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t pt-4 animate-fade-in">
            {/* Best Time Reason */}
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="flex items-center gap-2 font-medium text-blue-800">
                <Clock className="h-4 w-4" />
                Why visit at {attraction.bestTime.hours}?
              </div>
              <p className="mt-1 text-sm text-blue-700">
                {attraction.bestTime.reason}
              </p>
            </div>

            {/* Cost Details */}
            <div className="rounded-lg bg-green-50 p-3">
              <div className="flex items-center gap-2 font-medium text-green-800">
                <DollarSign className="h-4 w-4" />
                Cost Details
              </div>
              <p className="mt-1 text-sm text-green-700">
                {costDisplay.isFree ? (
                  attraction.cost.description
                ) : (
                  <>
                    {formatBRL(attraction.cost.brl)} ({formatUSD(attraction.cost.usd)})
                    <br />
                    <span className="text-green-600">
                      {attraction.cost.description}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Safety Notes (for favelas) */}
            {attraction.safetyNotes && (
              <div className="rounded-lg bg-amber-50 p-3">
                <div className="flex items-center gap-2 font-medium text-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  Safety Information
                </div>
                <p className="mt-1 text-sm text-amber-700">
                  {attraction.safetyNotes}
                </p>
              </div>
            )}

            {/* Local Tips */}
            {attraction.localTips && (
              <div className="rounded-lg bg-rio-green/10 p-3">
                <div className="flex items-center gap-2 font-medium text-rio-green">
                  <Lightbulb className="h-4 w-4" />
                  Local Tip
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  {attraction.localTips}
                </p>
              </div>
            )}

            {/**
             * Transport Section (Collapsible)
             *
             * Shows how to get there from Copacabana and Centro.
             */}
            <div className="rounded-lg border">
              <button
                className="flex w-full items-center justify-between p-3 text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTransport(!showTransport);
                }}
              >
                <div className="flex items-center gap-2 font-medium text-gray-800">
                  <MapPin className="h-4 w-4" />
                  How to Get There
                </div>
                {showTransport ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {showTransport && (
                <div className="space-y-4 border-t p-3 animate-fade-in">
                  {/* From Copacabana */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">
                      From Copacabana
                    </h4>
                    <div className="space-y-2">
                      {attraction.transport.fromCopacabana.map((option, idx) => (
                        <TransportOptionDisplay key={idx} option={option} />
                      ))}
                    </div>
                  </div>

                  {/* From Centro */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">
                      From Centro (Downtown)
                    </h4>
                    <div className="space-y-2">
                      {attraction.transport.fromCentro.map((option, idx) => (
                        <TransportOptionDisplay key={idx} option={option} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/**
         * Expand/Collapse Button
         *
         * Shows at the bottom to indicate more content is available.
         */}
        {controlledExpanded === undefined && (
          <button
            className="mt-3 flex w-full items-center justify-center gap-1 text-sm text-gray-500 hover:text-rio-green"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
});

export default AttractionCard;
