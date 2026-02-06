/**
 * PostCSS Configuration
 *
 * PostCSS is a tool for transforming CSS with JavaScript plugins.
 * It processes our CSS files and applies various transformations.
 *
 * Plugins used:
 * - tailwindcss: Processes Tailwind CSS directives and utilities
 * - autoprefixer: Adds vendor prefixes for cross-browser compatibility
 *
 * How it works:
 * 1. PostCSS reads the CSS file
 * 2. Tailwind replaces @tailwind directives with actual CSS
 * 3. Tailwind processes @apply directives
 * 4. Autoprefixer adds vendor prefixes where needed
 * 5. Final CSS is output
 */
export default {
  plugins: {
    // Process Tailwind CSS
    tailwindcss: {},

    // Add vendor prefixes automatically
    // Example: transform → -webkit-transform, -ms-transform, transform
    autoprefixer: {},
  },
};
