# 🇧🇷 Rio Attractions

An interactive web application showcasing Rio de Janeiro's best attractions. Built with Astro, React, and Leaflet.js.

![Rio Attractions](https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&h=400&fit=crop)

## Features

- **Interactive Map** - Explore 30+ attractions on a Leaflet-powered map
- **Category Filtering** - Filter by monuments, beaches, carnival spots, food, and more
- **Real-time Search** - Find attractions by name, description, or tags
- **Detailed Info Cards** - Cost breakdowns, transport options, and local tips
- **Weather Widget** - Current weather conditions in Rio
- **Quick Facts** - Cultural tips and travel advice
- **Responsive Design** - Works on mobile, tablet, and desktop
- **SEO Optimized** - Meta tags, structured data, and sitemap

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd rio-attractions

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Astro](https://astro.build) | Static site generator with partial hydration |
| [React](https://react.dev) | Interactive UI components |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Leaflet.js](https://leafletjs.com) | Interactive maps |
| [Lucide React](https://lucide.dev) | Beautiful icons |

## Project Structure

```
rio-attractions/
├── public/              # Static assets
│   ├── favicon.svg      # Site favicon
│   └── robots.txt       # Search engine instructions
├── src/
│   ├── components/      # React components
│   │   ├── App.tsx              # Main application
│   │   ├── InteractiveMap.tsx   # Leaflet map
│   │   ├── Sidebar.tsx          # Attraction list
│   │   ├── AttractionCard.tsx   # Card component
│   │   ├── CategoryFilter.tsx   # Filter buttons
│   │   ├── SearchBar.tsx        # Search input
│   │   ├── WeatherWidget.tsx    # Weather display
│   │   └── QuickFacts.tsx       # Rio information
│   ├── data/
│   │   └── attractions.ts       # Attraction data & types
│   ├── layouts/
│   │   └── Layout.astro         # Base HTML layout
│   ├── pages/
│   │   └── index.astro          # Home page
│   ├── styles/
│   │   └── global.css           # Global styles
│   └── utils/
│       └── helpers.ts           # Utility functions
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

## Configuration

### Environment Variables

No environment variables are required for basic functionality. For production:

```env
# Optional: Weather API key for real weather data
WEATHER_API_KEY=your_api_key_here
```

### Customization

- **Colors**: Edit `tailwind.config.mjs` for custom color palette
- **Attractions**: Modify `src/data/attractions.ts` to add/edit locations
- **Map Settings**: Adjust defaults in `InteractiveMap.tsx`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

Target Lighthouse scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Map tiles by [OpenStreetMap](https://www.openstreetmap.org/)
- Images from [Unsplash](https://unsplash.com/)
- Icons by [Lucide](https://lucide.dev/)

---

Built with ❤️ for travelers exploring Rio de Janeiro
