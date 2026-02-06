/**
 * Tailwind CSS Configuration
 *
 * This file customizes Tailwind CSS for our Rio de Janeiro attractions app.
 * Tailwind is a utility-first CSS framework that provides low-level utility
 * classes to build custom designs without writing custom CSS.
 *
 * Key Concepts:
 * - Content: Tells Tailwind where to look for class usage (for purging)
 * - Theme: Extends or overrides default design tokens
 * - Plugins: Adds additional functionality
 */

/** @type {import('tailwindcss').Config} */
export default {
  /**
   * Content Paths
   *
   * Tailwind scans these files to find which classes are actually used.
   * Unused classes are removed in production builds (tree-shaking).
   * This drastically reduces CSS file size - from ~3MB to often <10KB!
   */
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  theme: {
    extend: {
      /**
       * Custom Color Palette - Rio Carnival Inspired
       *
       * These colors capture the vibrant energy of Rio de Janeiro:
       * - Brazilian flag colors (green, yellow, blue)
       * - Carnival festivity colors (hot pink, orange, purple)
       * - Beach and nature tones (sand, ocean, sunset)
       *
       * Usage: bg-rio-yellow, text-rio-green, border-carnival-pink, etc.
       */
      colors: {
        // Primary Rio Colors - Based on Brazilian flag
        rio: {
          green: '#009739', // Brazilian flag green
          yellow: '#FEDD00', // Brazilian flag yellow
          blue: '#012169', // Brazilian flag blue
          white: '#FFFFFF',
        },
        // Carnival-inspired vibrant colors
        carnival: {
          pink: '#FF1493', // Deep pink for festivities
          orange: '#FF6B35', // Vibrant orange
          purple: '#8B5CF6', // Royal purple
          gold: '#FFD700', // Shimmering gold
          cyan: '#00CED1', // Tropical cyan
        },
        // Beach and nature tones
        beach: {
          sand: '#F5DEB3', // Sandy beach color
          ocean: '#0077B6', // Deep ocean blue
          sky: '#87CEEB', // Clear sky blue
          sunset: '#FF7F50', // Coral sunset
          palm: '#228B22', // Palm tree green
        },
        // Category-specific colors for map markers
        category: {
          monument: '#E11D48', // Rose for monuments
          beach: '#0EA5E9', // Sky blue for beaches
          carnival: '#F59E0B', // Amber for carnival
          historical: '#8B5CF6', // Purple for historical
          food: '#10B981', // Emerald for food
          favela: '#6366F1', // Indigo for favelas
          bloco: '#EC4899', // Pink for blocos
        },
      },

      /**
       * Custom Fonts
       *
       * We define font families that match Rio's energetic vibe.
       * The 'display' font is for headings, 'body' for regular text.
       */
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },

      /**
       * Custom Animations
       *
       * Smooth animations for UI interactions.
       * Target: 60fps for buttery-smooth experience.
       */
      animation: {
        // Fade in animation for cards and modals
        'fade-in': 'fadeIn 0.3s ease-out',
        // Slide up animation for panels
        'slide-up': 'slideUp 0.4s ease-out',
        // Slide in from right for side panels
        'slide-in-right': 'slideInRight 0.3s ease-out',
        // Pulse animation for loading states
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        // Bounce for attention-grabbing elements
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
        // Spin for loading spinners
        'spin-slow': 'spin 2s linear infinite',
        // Scale animation for hover effects
        'scale-in': 'scaleIn 0.2s ease-out',
        // Marker drop animation
        'marker-drop': 'markerDrop 0.5s ease-out',
      },

      /**
       * Keyframe Definitions
       *
       * These define the actual animation steps.
       * CSS transforms are used for GPU acceleration (better performance).
       */
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        markerDrop: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '60%': { transform: 'translateY(5px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      /**
       * Custom Box Shadows
       *
       * Shadows add depth and hierarchy to UI elements.
       * Multiple shadow layers create more realistic effects.
       */
      boxShadow: {
        // Card shadow for elevated elements
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        // Stronger shadow for modals and overlays
        'card-hover':
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        // Glow effect for highlighted elements
        glow: '0 0 20px rgba(254, 221, 0, 0.3)',
        // Inner shadow for pressed states
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },

      /**
       * Custom Backdrop Blur Values
       *
       * Blur effects for glassmorphism UI patterns.
       */
      backdropBlur: {
        xs: '2px',
      },

      /**
       * Custom Spacing Values
       *
       * Extended spacing scale for specific layout needs.
       */
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },

      /**
       * Custom Border Radius
       *
       * Rounded corners that match our design language.
       */
      borderRadius: {
        '4xl': '2rem',
      },

      /**
       * Custom Transitions
       *
       * Smooth transitions for interactive elements.
       */
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
    },
  },

  /**
   * Plugins
   *
   * We don't need additional plugins for this project,
   * but this is where you'd add things like @tailwindcss/forms,
   * @tailwindcss/typography, etc.
   */
  plugins: [],
};
