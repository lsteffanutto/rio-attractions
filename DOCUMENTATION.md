# Rio Attractions - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Component Hierarchy](#component-hierarchy)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [Styling System](#styling-system)
8. [Performance Optimizations](#performance-optimizations)
9. [SEO Implementation](#seo-implementation)
10. [Deployment](#deployment)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

### Purpose

Rio Attractions is an interactive web application designed to help tourists and locals discover the best attractions in Rio de Janeiro. It provides a visual, map-based experience with detailed information about each location.

### Goals

1. **Discoverability** - Help users find attractions that match their interests
2. **Information** - Provide practical details (cost, transport, timing)
3. **Planning** - Enable users to plan their visits effectively
4. **Performance** - Fast loading and smooth interactions
5. **Accessibility** - Usable by everyone, including screen reader users

### Target Users

- International tourists planning trips to Rio
- Domestic travelers from other Brazilian cities
- Local residents looking to explore their city
- Travel bloggers and content creators

---

## Technology Stack

### Why These Technologies?

#### Astro (v4.x)

**What it is:** A modern static site generator that outputs minimal JavaScript.

**Why we chose it:**
- **Partial Hydration** - Only sends JavaScript for interactive components
- **Multi-Framework** - Supports React, Vue, Svelte, and more
- **Performance First** - Generates static HTML by default
- **Great DX** - Excellent developer experience with hot module replacement

**How it works:**
```astro
---
// This runs at build time (server-side)
import MyComponent from './MyComponent.astro';
import ReactComponent from './ReactComponent';
---

<!-- Static HTML -->
<h1>Hello World</h1>

<!-- React component, hydrated on client -->
<ReactComponent client:load />
```

#### React (v18.x)

**What it is:** A JavaScript library for building user interfaces.

**Why we chose it:**
- **Component Model** - Reusable, composable UI pieces
- **Hooks** - Elegant state and side-effect management
- **Ecosystem** - Rich library of compatible packages
- **Team Familiarity** - Most common frontend framework

**Key React Concepts Used:**
- `useState` - Local component state
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized computations
- `useEffect` - Side effects (data fetching, DOM updates)
- `lazy/Suspense` - Code splitting and loading states

#### Tailwind CSS (v3.x)

**What it is:** A utility-first CSS framework.

**Why we chose it:**
- **Rapid Development** - Style directly in HTML
- **Consistency** - Design tokens for spacing, colors, etc.
- **Tree Shaking** - Unused styles removed in production
- **Responsive** - Built-in responsive modifiers

**Example:**
```jsx
// Instead of writing CSS:
// .card { padding: 1rem; border-radius: 0.5rem; background: white; }

// Use utilities directly:
<div className="p-4 rounded-lg bg-white">Card content</div>
```

#### Leaflet.js (v1.9.x)

**What it is:** An open-source JavaScript library for interactive maps.

**Why we chose it:**
- **Free** - No API keys required for basic usage
- **Lightweight** - Small footprint (~40KB)
- **Customizable** - Full control over markers, popups, etc.
- **Well Documented** - Excellent documentation and community

**Integration with React:**
We use `react-leaflet` which provides React components wrapping Leaflet:
```jsx
<MapContainer center={[lat, lng]} zoom={12}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <Marker position={[lat, lng]}>
    <Popup>Hello!</Popup>
  </Marker>
</MapContainer>
```

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────────────────────────┐  │
│  │   Layout    │  │              App (React)                 │  │
│  │   (Astro)   │  │  ┌─────────┐  ┌─────────────────────┐  │  │
│  │             │  │  │ Sidebar │  │   InteractiveMap    │  │  │
│  │  - Head     │  │  │         │  │                     │  │  │
│  │  - Meta     │  │  │ Search  │  │  Leaflet + Markers  │  │  │
│  │  - SEO      │  │  │ Filter  │  │  Popups             │  │  │
│  │  - Scripts  │  │  │ Cards   │  │  Controls           │  │  │
│  │             │  │  └─────────┘  └─────────────────────┘  │  │
│  └─────────────┘  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   attractions.ts                          │   │
│  │  - Attraction[]     - categoryInfo                        │   │
│  │  - Helper functions - Type definitions                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure Explanation

```
rio-attractions/
├── public/                 # Static assets (served as-is)
│   ├── favicon.svg         # Vector favicon for modern browsers
│   └── robots.txt          # Search engine crawling rules
│
├── src/
│   ├── components/         # React components (interactive)
│   │   ├── App.tsx         # Root component, manages global state
│   │   ├── InteractiveMap.tsx  # Leaflet map integration
│   │   ├── Sidebar.tsx     # Left panel with list
│   │   ├── AttractionCard.tsx  # Individual attraction display
│   │   ├── AttractionPopup.tsx # Map marker popup content
│   │   ├── CategoryFilter.tsx  # Category toggle buttons
│   │   ├── SearchBar.tsx   # Search input with debounce
│   │   ├── WeatherWidget.tsx   # Current weather display
│   │   └── QuickFacts.tsx  # Rio information modal
│   │
│   ├── data/
│   │   └── attractions.ts  # All attraction data + TypeScript types
│   │
│   ├── layouts/
│   │   └── Layout.astro    # Base HTML structure, SEO tags
│   │
│   ├── pages/
│   │   └── index.astro     # Home page entry point
│   │
│   ├── styles/
│   │   └── global.css      # Tailwind directives + custom CSS
│   │
│   └── utils/
│       └── helpers.ts      # Utility functions (debounce, format, etc.)
│
├── astro.config.mjs        # Astro build configuration
├── tailwind.config.mjs     # Tailwind customization
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## Component Hierarchy

### Component Tree

```
App (State Manager)
├── Header
│   ├── Logo
│   ├── WeatherWidget
│   └── ViewToggle (mobile)
│
├── Sidebar
│   ├── SearchBar
│   ├── CategoryFilter
│   └── AttractionCard[] (list)
│       └── TransportOptionDisplay
│
├── InteractiveMap
│   ├── MapContainer (Leaflet)
│   │   ├── TileLayer
│   │   ├── ZoomControl
│   │   ├── Marker[]
│   │   │   └── Popup
│   │   │       └── AttractionPopup
│   │   └── MapController (pan/zoom)
│   └── Legend
│
└── QuickFacts (modal)
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `App` | State management, component orchestration |
| `Sidebar` | Display list of attractions, handle filters |
| `SearchBar` | Text input with debouncing |
| `CategoryFilter` | Toggle category buttons |
| `AttractionCard` | Display attraction details in list |
| `InteractiveMap` | Render Leaflet map with markers |
| `AttractionPopup` | Compact info in map popup |
| `WeatherWidget` | Fetch and display weather |
| `QuickFacts` | Static Rio information |

---

## Data Flow

### Unidirectional Data Flow

React follows a unidirectional data flow pattern:

```
User Action → State Update → Re-render → DOM Update
     │             │              │
     │             └── App.tsx ───┘
     │
     └── onClick, onChange, etc.
```

### Example: Selecting an Attraction

1. **User clicks marker on map**
   ```tsx
   // InteractiveMap.tsx
   <Marker onClick={() => onSelectAttraction(attraction)}>
   ```

2. **Callback propagates to App**
   ```tsx
   // App.tsx
   const handleSelectAttraction = (attraction) => {
     setSelectedAttraction(attraction);  // Update state
   };
   ```

3. **State change triggers re-renders**
   ```tsx
   // React re-renders components that use selectedAttraction
   <Sidebar selectedAttraction={selectedAttraction} />
   <InteractiveMap selectedAttraction={selectedAttraction} />
   ```

4. **Components update their display**
   - Sidebar highlights the selected card
   - Map pans to the selected marker
   - Marker icon scales up

### Data Sources

```
┌───────────────────┐
│  attractions.ts   │  Static data embedded in bundle
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   App Component   │  Imports and distributes data
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌───────┐   ┌───────┐
│Sidebar│   │  Map  │  Receive filtered data as props
└───────┘   └───────┘
```

---

## State Management

### Why useState (Not Redux/Zustand)?

For this application's scope, React's built-in `useState` is sufficient:

1. **Limited State** - Only a few pieces of global state
2. **Shallow Hierarchy** - State only needs to pass 1-2 levels
3. **Simple Updates** - No complex state transformations
4. **Performance** - Native React is fast for our use case

### State Structure

```tsx
// App.tsx - All global state lives here
const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
const [activeCategories, setActiveCategories] = useState<AttractionCategory[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [sidebarOpen, setSidebarOpen] = useState(true);
const [mobileViewMode, setMobileViewMode] = useState<'map' | 'list'>('map');
const [showQuickFacts, setShowQuickFacts] = useState(false);
```

### State Flow Diagram

```
                    App (State Owner)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    Sidebar           Map            QuickFacts
        │                 │
   ┌────┴────┐      ┌────┴────┐
   ▼         ▼      ▼         ▼
Search   Filter  Markers   Popup
```

---

## Styling System

### Tailwind Configuration

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rio: { green: '#009739', yellow: '#FEDD00', blue: '#012169' },
        carnival: { pink: '#FF1493', orange: '#FF6B35' },
        category: { monument: '#E11D48', beach: '#0EA5E9', /* ... */ },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
    },
  },
};
```

### Color Palette Purpose

| Color Group | Purpose |
|-------------|---------|
| `rio-*` | Brazilian flag colors for branding |
| `carnival-*` | Festive accents for CTAs |
| `beach-*` | Nature-inspired tones |
| `category-*` | Map marker colors |

### CSS Architecture

```css
/* global.css */

/* 1. Tailwind Base - Browser normalization */
@tailwind base;

/* 2. Custom Base - Default element styles */
@layer base {
  body { @apply bg-gray-50 font-body; }
  h1, h2, h3 { @apply font-display font-bold; }
}

/* 3. Tailwind Components */
@tailwind components;

/* 4. Custom Components - Reusable patterns */
@layer components {
  .card { @apply rounded-xl bg-white shadow-card; }
  .btn { @apply rounded-lg px-4 py-2 font-medium; }
}

/* 5. Tailwind Utilities */
@tailwind utilities;

/* 6. Leaflet Overrides */
.leaflet-popup-content-wrapper { @apply rounded-xl; }
```

---

## Performance Optimizations

### 1. Code Splitting

```tsx
// Lazy load the heavy map component
const InteractiveMap = lazy(() => import('./InteractiveMap'));

// Show fallback while loading
<Suspense fallback={<MapLoadingSkeleton />}>
  <InteractiveMap />
</Suspense>
```

**Result:** Separate chunk for map code (~150KB), loads in parallel

### 2. Debounced Search

```tsx
const debouncedSearch = useMemo(
  () => debounce((query) => onSearch(query), 300),
  [onSearch]
);
```

**Result:** Search only triggers 300ms after user stops typing

### 3. Memoized Components

```tsx
const AttractionCard = memo(function AttractionCard({ attraction }) {
  // Only re-renders when attraction prop changes
});
```

**Result:** Prevents unnecessary re-renders of card list

### 4. Memoized Computations

```tsx
const filteredAttractions = useMemo(() => {
  return attractions
    .filter(/* expensive filtering */)
    .sort(/* expensive sorting */);
}, [attractions, filters]);
```

**Result:** Filtering only runs when dependencies change

### 5. Image Optimization

```html
<!-- Lazy loading -->
<img loading="lazy" src="..." />

<!-- Responsive images -->
<img srcset="small.jpg 400w, medium.jpg 800w" sizes="(max-width: 600px) 400px, 800px" />
```

### 6. CSS Optimization

- Tailwind purges unused classes
- Critical CSS is inlined by Astro
- Animations use `transform` (GPU-accelerated)

### Lighthouse Targets

| Metric | Target | Achieved |
|--------|--------|----------|
| Performance | 90+ | ✓ |
| Accessibility | 90+ | ✓ |
| Best Practices | 90+ | ✓ |
| SEO | 90+ | ✓ |

---

## SEO Implementation

### Meta Tags (Layout.astro)

```html
<!-- Primary -->
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
```

### Structured Data (JSON-LD)

```javascript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": "Rio de Janeiro",
  "description": "...",
  "geo": { "@type": "GeoCoordinates", ... }
};
```

### Sitemap

Generated automatically by `@astrojs/sitemap` at build time:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rio-attractions.example.com/</loc>
    <lastmod>2024-01-01</lastmod>
  </url>
</urlset>
```

### robots.txt

```
User-agent: *
Disallow:
Sitemap: https://rio-attractions.example.com/sitemap-index.xml
```

---

## Deployment

### Build Process

```bash
npm run build
```

This command:
1. Compiles TypeScript
2. Processes Astro pages
3. Bundles React components
4. Purges unused CSS
5. Optimizes assets
6. Generates sitemap
7. Outputs to `./dist/`

### Deployment Options

#### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

#### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Static Hosting

Upload `./dist/` folder to any static host:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE` | Yes | Production URL for sitemap |
| `WEATHER_API_KEY` | No | For real weather data |

---

## Testing

### Manual Testing Checklist

- [ ] Map loads and displays markers
- [ ] Category filters work correctly
- [ ] Search filters attractions
- [ ] Clicking markers opens popups
- [ ] Clicking cards selects attractions
- [ ] Sidebar opens/closes on mobile
- [ ] Weather widget displays data
- [ ] Quick Facts modal opens/closes
- [ ] All links are accessible
- [ ] Keyboard navigation works

### Lighthouse Audit

```bash
npm run build && npm run preview
# Open Chrome DevTools → Lighthouse → Run audit
```

---

## Troubleshooting

### Common Issues

#### Map not displaying

**Cause:** Leaflet CSS not loaded
**Solution:** Ensure CSS is imported in Layout.astro:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

#### Markers not clickable

**Cause:** Z-index conflict with other elements
**Solution:** Add higher z-index to map container

#### Hydration mismatch

**Cause:** Server and client render different content
**Solution:** Use `client:only` for browser-dependent components

#### Build fails with TypeScript error

**Cause:** Type mismatch in component props
**Solution:** Check TypeScript errors with `npx tsc --noEmit`

### Debug Mode

```typescript
// Enable React DevTools
if (import.meta.env.DEV) {
  console.log('Development mode');
}
```

---

## Future Enhancements

1. **Real Weather API** - Replace simulated data
2. **User Authentication** - Save favorite attractions
3. **Itinerary Builder** - Plan multi-day trips
4. **Offline Support** - Service worker for offline use
5. **Multi-language** - Portuguese and Spanish translations
6. **Photo Gallery** - More images per attraction
7. **User Reviews** - Community ratings and tips

---

*Documentation last updated: February 2026*
