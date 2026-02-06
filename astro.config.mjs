/**
 * Astro Configuration File
 *
 * This configuration file sets up the core build settings for our Astro project.
 * Astro is a modern static site generator that allows us to use React components
 * while maintaining excellent performance through partial hydration.
 *
 * Key Concepts:
 * - Integrations: Plugins that extend Astro's functionality
 * - Output: Determines if the site is static or server-rendered
 * - Site: The production URL used for generating sitemaps and canonical URLs
 */

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
// Note: Sitemap plugin temporarily disabled due to compatibility issue
// import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  /**
   * The production URL of your site. This is used by:
   * - The sitemap generator to create absolute URLs
   * - SEO components for canonical URLs
   * - Open Graph meta tags for social sharing
   */
  site: 'https://rio-attractions.example.com',

  /**
   * Integrations extend Astro's functionality
   *
   * @astrojs/react - Enables React components with client-side interactivity
   *   - Uses 'client:*' directives to control hydration
   *   - Supports all React hooks and state management
   *
   * @astrojs/tailwind - Adds Tailwind CSS support
   *   - Automatically processes Tailwind classes
   *   - Purges unused CSS in production for smaller bundles
   *
   * @astrojs/sitemap - Generates XML sitemap for SEO
   *   - Automatically creates sitemap.xml during build
   *   - Helps search engines discover all pages
   */
  integrations: [
    react(),
    tailwind({
      // Apply base Tailwind styles globally
      applyBaseStyles: true,
    }),
    // sitemap(), // Temporarily disabled - re-enable for production
  ],

  /**
   * Build Configuration
   *
   * inlineStylesheets: 'auto' - Astro will automatically inline small CSS
   * files and external link larger ones for optimal performance.
   * This improves First Contentful Paint (FCP) by reducing render-blocking CSS.
   */
  build: {
    inlineStylesheets: 'auto',
  },

  /**
   * Vite Configuration
   *
   * Vite is the underlying build tool that Astro uses.
   * We can customize its behavior here for optimization.
   */
  vite: {
    build: {
      // Enable CSS code splitting for better caching
      cssCodeSplit: true,
      // Optimize chunks for better loading
      rollupOptions: {
        output: {
          // Create separate chunks for better caching
          manualChunks: {
            // Group React-related code together
            'react-vendor': ['react', 'react-dom'],
            // Group Leaflet map code separately (it's large)
            'leaflet-vendor': ['leaflet', 'react-leaflet'],
          },
        },
      },
    },
    // Optimize dependencies for faster dev server startup
    optimizeDeps: {
      include: ['react', 'react-dom', 'leaflet', 'react-leaflet', 'lucide-react'],
    },
  },

  /**
   * Prefetch Configuration
   *
   * Prefetch links when they're visible or hovered to make navigation
   * feel instant. This significantly improves perceived performance.
   */
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
