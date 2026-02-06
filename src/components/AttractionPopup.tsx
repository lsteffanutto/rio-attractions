/**
 * Attraction Popup Component
 *
 * This component displays detailed information about an attraction
 * inside a Leaflet map popup. It's shown when a user clicks on a marker.
 *
 * Design Considerations:
 * - Compact layout to fit within popup constraints
 * - Clear visual hierarchy with image, title, and key info
 * - Quick access to important details (cost, timing)
 * - Consistent styling with the rest of the app
 *
 * Accessibility:
 * - Semantic HTML structure
 * - Clear contrast ratios
 * - Descriptive alt text for images
 */

import { useMemo } from 'react';
import type { Attraction } from '../data/attractions';
import { categoryInfo } from '../data/attractions';
import { formatBRL, formatUSD } from '../utils/helpers';
import {
  Clock,
  DollarSign,
  Tag,
  AlertTriangle,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AttractionPopupProps {
  /** The attraction to display */
  attraction: Attraction;
  /** Callback when the popup should close */
  onClose?: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AttractionPopup Component
 *
 * Renders a compact information card within the map popup.
 * Designed to provide essential info at a glance.
 */
export default function AttractionPopup({
  attraction,
  onClose,
}: AttractionPopupProps) {
  // Get category styling information
  const category = categoryInfo[attraction.category];

  /**
   * Format cost display
   *
   * Shows both BRL and USD, or "Free" if cost is 0.
   * Memoized to avoid recalculation on re-renders.
   */
  const costDisplay = useMemo(() => {
    if (attraction.cost.brl === 0) {
      return { text: 'Free', subtext: null };
    }
    return {
      text: formatBRL(attraction.cost.brl),
      subtext: `≈ ${formatUSD(attraction.cost.usd)}`,
    };
  }, [attraction.cost]);

  return (
    <div className="popup-content w-[300px]">
      {/**
       * Header Image
       *
       * Full-width image at the top for visual appeal.
       * Uses object-cover to maintain aspect ratio.
       * Lazy loading for performance (images in closed popups won't load).
       */}
      <div className="relative h-36 w-full overflow-hidden rounded-t-lg">
        <img
          src={attraction.image}
          alt={`${attraction.name} - ${attraction.category} in Rio de Janeiro`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/300x150/0077B6/FFFFFF?text=Rio';
          }}
        />

        {/**
         * Category Badge
         *
         * Positioned in the top-left corner over the image.
         * Uses the category color for instant recognition.
         */}
        <div
          className="absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: category.markerColor }}
        >
          <Tag className="h-3 w-3" />
          {category.label}
        </div>
      </div>

      {/**
       * Content Section
       *
       * Contains the attraction name, description, and key details.
       * Uses a clean, organized layout with icons for scannability.
       */}
      <div className="p-3">
        {/* Attraction Name */}
        <h3 className="mb-1 text-base font-bold text-gray-900">
          {attraction.name}
        </h3>

        {/**
         * Brief Description
         *
         * Truncated to 2 lines to keep the popup compact.
         * Full description available in the sidebar card.
         */}
        <p className="mb-3 line-clamp-2 text-xs text-gray-600">
          {attraction.description}
        </p>

        {/**
         * Quick Info Grid
         *
         * Two-column layout showing cost and best time.
         * Icons help users quickly scan for the info they need.
         */}
        <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
          {/* Cost Info */}
          <div className="flex items-start gap-1.5 rounded-md bg-gray-50 p-2">
            <DollarSign className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-600" />
            <div>
              <div className="font-medium text-gray-900">{costDisplay.text}</div>
              {costDisplay.subtext && (
                <div className="text-gray-500">{costDisplay.subtext}</div>
              )}
            </div>
          </div>

          {/* Best Time Info */}
          <div className="flex items-start gap-1.5 rounded-md bg-gray-50 p-2">
            <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Best Time</div>
              <div className="text-gray-500">{attraction.bestTime.hours}</div>
            </div>
          </div>
        </div>

        {/**
         * Safety Notes (Conditional)
         *
         * Only shown for favelas where safety context is important.
         * Uses warning styling to draw attention appropriately.
         */}
        {attraction.safetyNotes && (
          <div className="mb-3 flex gap-2 rounded-md bg-amber-50 p-2 text-xs">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-amber-800">{attraction.safetyNotes}</p>
          </div>
        )}

        {/**
         * Local Tips (Conditional)
         *
         * Helpful insider information from locals.
         * Adds value beyond basic tourist information.
         */}
        {attraction.localTips && (
          <div className="mb-3 rounded-md bg-rio-green/5 p-2 text-xs">
            <span className="font-medium text-rio-green">💡 Local Tip: </span>
            <span className="text-gray-700">{attraction.localTips}</span>
          </div>
        )}

        {/**
         * Tags
         *
         * Quick keywords for at-a-glance categorization.
         * Displayed as small badges.
         */}
        <div className="mb-3 flex flex-wrap gap-1">
          {attraction.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/**
         * Visit Duration
         *
         * Helps tourists plan their itinerary.
         */}
        {attraction.visitDuration && (
          <p className="text-xs text-gray-500">
            <span className="font-medium">Typical visit:</span>{' '}
            {attraction.visitDuration}
          </p>
        )}
      </div>
    </div>
  );
}
