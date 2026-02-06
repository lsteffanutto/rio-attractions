/**
 * Search Bar Component
 *
 * A search input component with real-time filtering of attractions.
 * Includes debouncing for performance and keyboard navigation.
 *
 * Features:
 * - Real-time search with debouncing (prevents excessive filtering)
 * - Clear button when text is present
 * - Loading indicator during search
 * - Keyboard shortcut (Cmd/Ctrl + K) to focus
 * - Accessible with proper ARIA attributes
 *
 * Performance Optimizations:
 * - Debounced onChange to prevent filtering on every keystroke
 * - Controlled vs uncontrolled mode support
 * - Memoized clear handler
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { debounce, cn } from '../utils/helpers';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface SearchBarProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Controlled value (if provided, component is controlled) */
  value?: string;
  /** Callback when search value changes (debounced) */
  onChange?: (value: string) => void;
  /** Callback when search is submitted (Enter key) */
  onSubmit?: (value: string) => void;
  /** Whether a search is in progress */
  isLoading?: boolean;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Additional CSS classes */
  className?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SearchBar({
  placeholder = 'Search attractions...',
  value: controlledValue,
  onChange,
  onSubmit,
  isLoading = false,
  debounceMs = 300,
  className,
  autoFocus = false,
}: SearchBarProps) {
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState('');

  // Determine if component is controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Ref for the input element (used for keyboard shortcut focus)
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Create debounced onChange handler
   *
   * useMemo ensures the debounced function is only created once
   * (or when dependencies change). This prevents creating a new
   * debounced function on every render, which would break debouncing.
   */
  const debouncedOnChange = useMemo(() => {
    if (!onChange) return undefined;
    return debounce(onChange, debounceMs);
  }, [onChange, debounceMs]);

  /**
   * Handle input change
   *
   * Updates internal state immediately for responsive UI,
   * but only calls onChange after debounce delay.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Update internal state immediately
    if (!isControlled) {
      setInternalValue(newValue);
    }

    // Call debounced onChange
    debouncedOnChange?.(newValue);
  };

  /**
   * Handle form submission
   *
   * Called when Enter key is pressed.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  /**
   * Clear the search input
   *
   * useCallback prevents unnecessary re-renders of child components.
   */
  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    inputRef.current?.focus();
  }, [isControlled, onChange]);

  /**
   * Keyboard shortcut handler
   *
   * Cmd/Ctrl + K focuses the search input.
   * This is a common pattern in modern web apps.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      {/**
       * Search Icon
       *
       * Positioned absolutely on the left side of the input.
       * Provides visual context for the input's purpose.
       */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        ) : (
          <Search className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/**
       * Search Input
       *
       * Styled with Tailwind classes for consistent appearance.
       * Padding adjusted to accommodate icons on both sides.
       */}
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10',
          'text-sm text-gray-900 placeholder:text-gray-400',
          'transition-all duration-200',
          'focus:border-rio-green focus:outline-none focus:ring-2 focus:ring-rio-green/20',
          'hover:border-gray-300'
        )}
        /**
         * ARIA Attributes
         *
         * These attributes help screen readers understand the input's purpose.
         */
        aria-label="Search attractions"
        role="searchbox"
      />

      {/**
       * Clear Button
       *
       * Only shown when there's text in the input.
       * Clears the input and refocuses it.
       */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          aria-label="Clear search"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}

      {/**
       * Keyboard Shortcut Hint
       *
       * Shows the keyboard shortcut on larger screens.
       * Hidden on mobile where keyboard shortcuts aren't relevant.
       */}
      {!value && (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-3 sm:flex">
          <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs text-gray-400">
            ⌘K
          </kbd>
        </div>
      )}
    </form>
  );
}

/**
 * Search Bar Skeleton
 *
 * Loading placeholder that matches the search bar dimensions.
 */
export function SearchBarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('h-11 animate-pulse rounded-lg bg-gray-200', className)} />
  );
}
