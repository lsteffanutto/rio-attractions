# Architecture Overview

This document provides visual diagrams of the Rio Attractions application architecture.

## Component Dependency Tree

```mermaid
graph TD
    subgraph "Astro Layer"
        A[index.astro] --> B[Layout.astro]
    end

    subgraph "React Application"
        A --> C[App.tsx]
        C --> D[Sidebar.tsx]
        C --> E[InteractiveMap.tsx]
        C --> F[WeatherWidget.tsx]
        C --> G[QuickFacts.tsx]

        D --> H[SearchBar.tsx]
        D --> I[CategoryFilter.tsx]
        D --> J[AttractionCard.tsx]

        E --> K[AttractionPopup.tsx]
    end

    subgraph "Data Layer"
        L[attractions.ts]
        M[helpers.ts]
    end

    subgraph "Styling"
        N[global.css]
        O[tailwind.config.mjs]
    end

    C --> L
    D --> L
    E --> L
    H --> M
    I --> M
    J --> M

    B --> N
    N --> O

    style A fill:#f9f,stroke:#333
    style C fill:#61dafb,stroke:#333
    style L fill:#3178c6,stroke:#333
    style N fill:#38bdf8,stroke:#333
```

## Data Flow Diagram

```mermaid
flowchart LR
    subgraph User["User Interactions"]
        U1[Click Marker]
        U2[Type Search]
        U3[Toggle Filter]
        U4[Click Card]
    end

    subgraph State["App State"]
        S1[selectedAttraction]
        S2[searchQuery]
        S3[activeCategories]
        S4[sidebarOpen]
    end

    subgraph Components["Components"]
        C1[InteractiveMap]
        C2[SearchBar]
        C3[CategoryFilter]
        C4[Sidebar]
        C5[AttractionCard]
    end

    U1 --> S1
    U2 --> S2
    U3 --> S3
    U4 --> S1

    S1 --> C1
    S1 --> C4
    S1 --> C5

    S2 --> C4
    S3 --> C1
    S3 --> C4
    S4 --> C4

    style S1 fill:#fbbf24
    style S2 fill:#fbbf24
    style S3 fill:#fbbf24
    style S4 fill:#fbbf24
```

## File Structure Visualization

```mermaid
graph TD
    ROOT[rio-attractions/]

    ROOT --> PUBLIC[public/]
    ROOT --> SRC[src/]
    ROOT --> CONFIG[Config Files]

    PUBLIC --> FAV[favicon.svg]
    PUBLIC --> ROB[robots.txt]

    SRC --> COMP[components/]
    SRC --> DATA[data/]
    SRC --> LAYOUTS[layouts/]
    SRC --> PAGES[pages/]
    SRC --> STYLES[styles/]
    SRC --> UTILS[utils/]

    COMP --> APP[App.tsx]
    COMP --> MAP[InteractiveMap.tsx]
    COMP --> SIDE[Sidebar.tsx]
    COMP --> CARD[AttractionCard.tsx]
    COMP --> POP[AttractionPopup.tsx]
    COMP --> CAT[CategoryFilter.tsx]
    COMP --> SEARCH[SearchBar.tsx]
    COMP --> WEATHER[WeatherWidget.tsx]
    COMP --> FACTS[QuickFacts.tsx]

    DATA --> ATTR[attractions.ts]

    LAYOUTS --> LAYOUT[Layout.astro]

    PAGES --> INDEX[index.astro]

    STYLES --> CSS[global.css]

    UTILS --> HELP[helpers.ts]

    CONFIG --> ASTRO[astro.config.mjs]
    CONFIG --> TAIL[tailwind.config.mjs]
    CONFIG --> TS[tsconfig.json]
    CONFIG --> PKG[package.json]

    style ROOT fill:#009739
    style SRC fill:#FEDD00
    style COMP fill:#61dafb
```

## Module Import Relationships

```mermaid
graph LR
    subgraph "Entry Point"
        INDEX[index.astro]
    end

    subgraph "Layout"
        LAYOUT[Layout.astro]
        CSS[global.css]
    end

    subgraph "Main App"
        APP[App.tsx]
    end

    subgraph "Components"
        MAP[InteractiveMap]
        SIDE[Sidebar]
        WEATHER[WeatherWidget]
        FACTS[QuickFacts]
        SEARCH[SearchBar]
        FILTER[CategoryFilter]
        CARD[AttractionCard]
        POPUP[AttractionPopup]
    end

    subgraph "Data"
        ATTR[attractions.ts]
        HELP[helpers.ts]
    end

    INDEX --> LAYOUT
    INDEX --> APP
    LAYOUT --> CSS

    APP --> MAP
    APP --> SIDE
    APP --> WEATHER
    APP --> FACTS

    SIDE --> SEARCH
    SIDE --> FILTER
    SIDE --> CARD

    MAP --> POPUP

    APP --> ATTR
    SIDE --> ATTR
    MAP --> ATTR
    CARD --> ATTR
    POPUP --> ATTR
    FILTER --> ATTR

    SEARCH --> HELP
    CARD --> HELP
    POPUP --> HELP
    WEATHER --> HELP

    style INDEX fill:#f9f
    style APP fill:#61dafb
    style ATTR fill:#3178c6
```

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> SearchActive: User types
    SearchActive --> Filtering: Debounce complete
    Filtering --> Idle: Results displayed

    Idle --> CategoryToggle: Click filter
    CategoryToggle --> Filtering: Category changed
    Filtering --> Idle: Map updated

    Idle --> MarkerClick: Click marker
    MarkerClick --> Selected: Attraction selected
    Selected --> PopupOpen: Show popup
    PopupOpen --> Idle: Close popup

    Idle --> CardClick: Click card
    CardClick --> Selected: Attraction selected
    Selected --> MapPan: Pan to location
    MapPan --> Idle: Animation complete
```

## User Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as SearchBar
    participant F as CategoryFilter
    participant App as App State
    participant Side as Sidebar
    participant Map as InteractiveMap

    U->>S: Types "beach"
    S->>S: Debounce (300ms)
    S->>App: onSearchChange("beach")
    App->>App: setSearchQuery("beach")
    App->>Side: searchQuery="beach"
    App->>Map: (no change needed)
    Side->>Side: Filter attractions
    Side-->>U: Show filtered list

    U->>F: Click "Beaches" filter
    F->>App: onCategoryChange(["beach"])
    App->>App: setActiveCategories(["beach"])
    App->>Side: activeCategories=["beach"]
    App->>Map: activeCategories=["beach"]
    Side->>Side: Filter by category
    Map->>Map: Filter markers
    Side-->>U: Show beach cards
    Map-->>U: Show beach markers

    U->>Map: Click beach marker
    Map->>App: onSelectAttraction(copacabana)
    App->>App: setSelectedAttraction(copacabana)
    App->>Side: selectedAttraction=copacabana
    App->>Map: selectedAttraction=copacabana
    Side->>Side: Highlight card
    Map->>Map: Show popup, zoom
    Map-->>U: Display popup
```

## Performance Optimization Strategy

```mermaid
graph TB
    subgraph "Build Time"
        B1[Tailwind Purge CSS]
        B2[Code Splitting]
        B3[Asset Optimization]
        B4[Sitemap Generation]
    end

    subgraph "Load Time"
        L1[Critical CSS Inlining]
        L2[Lazy Load Map]
        L3[Preconnect Fonts]
        L4[Async Scripts]
    end

    subgraph "Runtime"
        R1[Debounced Search]
        R2[Memoized Components]
        R3[Memoized Computations]
        R4[GPU Animations]
    end

    B1 --> PERF[Performance]
    B2 --> PERF
    B3 --> PERF
    B4 --> SEO[SEO]

    L1 --> FCP[First Contentful Paint]
    L2 --> TTI[Time to Interactive]
    L3 --> FCP
    L4 --> TTI

    R1 --> INP[Interaction to Next Paint]
    R2 --> INP
    R3 --> INP
    R4 --> FPS[60 FPS Animations]

    style PERF fill:#10B981
    style SEO fill:#3B82F6
    style FCP fill:#F59E0B
    style TTI fill:#F59E0B
    style INP fill:#EF4444
    style FPS fill:#8B5CF6
```

## SEO Structure

```mermaid
graph TD
    subgraph "Meta Tags"
        M1[Title]
        M2[Description]
        M3[Canonical]
        M4[Open Graph]
        M5[Twitter Cards]
    end

    subgraph "Structured Data"
        SD1[WebSite Schema]
        SD2[TouristDestination Schema]
    end

    subgraph "Technical SEO"
        T1[robots.txt]
        T2[sitemap.xml]
        T3[Semantic HTML]
        T4[Alt Text]
    end

    subgraph "Performance SEO"
        P1[Core Web Vitals]
        P2[Mobile Friendly]
        P3[HTTPS]
    end

    M1 --> SERP[Search Results]
    M2 --> SERP
    M3 --> RANK[Page Ranking]

    M4 --> SOCIAL[Social Sharing]
    M5 --> SOCIAL

    SD1 --> RICH[Rich Snippets]
    SD2 --> RICH

    T1 --> CRAWL[Crawlability]
    T2 --> CRAWL
    T3 --> ACCESS[Accessibility]
    T4 --> ACCESS

    P1 --> RANK
    P2 --> RANK
    P3 --> RANK

    style SERP fill:#4285F4
    style SOCIAL fill:#1DA1F2
    style RICH fill:#FBBC05
    style CRAWL fill:#34A853
```

## Deployment Pipeline

```mermaid
graph LR
    subgraph "Development"
        DEV[npm run dev]
        DEV --> HOT[Hot Reload]
    end

    subgraph "Build"
        BUILD[npm run build]
        BUILD --> TS[TypeScript Compile]
        TS --> ASTRO[Astro Build]
        ASTRO --> VITE[Vite Bundle]
        VITE --> DIST[./dist/]
    end

    subgraph "Preview"
        PREV[npm run preview]
        DIST --> PREV
    end

    subgraph "Deploy"
        DIST --> VERCEL[Vercel]
        DIST --> NETLIFY[Netlify]
        DIST --> STATIC[Static Host]
    end

    style DEV fill:#10B981
    style BUILD fill:#F59E0B
    style DIST fill:#3B82F6
    style VERCEL fill:#000000,color:#ffffff
    style NETLIFY fill:#00C7B7
```

---

## How to View These Diagrams

These diagrams are written in [Mermaid](https://mermaid.js.org/) syntax. You can view them:

1. **GitHub** - Renders Mermaid diagrams automatically in markdown
2. **VS Code** - Use the "Markdown Preview Mermaid Support" extension
3. **Online** - Paste code at [mermaid.live](https://mermaid.live)
4. **Notion** - Supports Mermaid in code blocks

---

*Architecture diagrams last updated: February 2026*
