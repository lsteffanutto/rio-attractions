/**
 * Rio de Janeiro Attractions Data
 *
 * This file contains all the attraction data for our application.
 * We use TypeScript interfaces to ensure type safety and provide
 * excellent developer experience with autocomplete and error checking.
 *
 * Data Structure Explanation:
 * - Each attraction has location coordinates for the map
 * - Categories allow filtering and color-coding on the map
 * - Transport info helps tourists plan their visits
 * - Costs include both BRL and USD for international visitors
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Category Type
 *
 * Each category has a specific color and icon on the map.
 * This union type ensures only valid categories can be used.
 */
export type AttractionCategory =
  | 'monument'
  | 'beach'
  | 'carnival'
  | 'historical'
  | 'food'
  | 'favela'
  | 'bloco';

/**
 * Transport Option Interface
 *
 * Describes how to get to a location from a starting point.
 * Multiple transport options give tourists flexibility.
 */
export interface TransportOption {
  /** Type of transportation (metro, bus, uber, walking, etc.) */
  mode: string;
  /** Estimated travel duration */
  duration: string;
  /** Approximate cost in BRL */
  costBRL: number;
  /** Additional helpful notes */
  notes?: string;
}

/**
 * Transport Info Interface
 *
 * Contains transport options from two main tourist areas:
 * - Copacabana: Most popular tourist beach neighborhood
 * - Centro: Downtown Rio, business and historical district
 */
export interface TransportInfo {
  fromCopacabana: TransportOption[];
  fromCentro: TransportOption[];
}

/**
 * Main Attraction Interface
 *
 * This is the core data structure for each attraction.
 * All fields are carefully chosen to provide tourists
 * with the information they need to plan their visit.
 */
export interface Attraction {
  /** Unique identifier for React keys and URL routing */
  id: string;
  /** Display name of the attraction */
  name: string;
  /** Detailed description for the info card */
  description: string;
  /** Category for filtering and map marker styling */
  category: AttractionCategory;
  /** Geographic coordinates for map placement */
  coordinates: {
    lat: number;
    lng: number;
  };
  /** URL to the attraction's image */
  image: string;
  /** Cost information */
  cost: {
    /** Price in Brazilian Reais */
    brl: number;
    /** Price in US Dollars (approximate) */
    usd: number;
    /** Description of what the cost covers */
    description: string;
  };
  /** Best time to visit for optimal experience */
  bestTime: {
    /** Specific hours or time of day */
    hours: string;
    /** Why this time is recommended */
    reason: string;
  };
  /** How to get there from major tourist areas */
  transport: TransportInfo;
  /** Additional tags for search functionality */
  tags: string[];
  /** Safety information (especially important for favelas) */
  safetyNotes?: string;
  /** Special tips from locals */
  localTips?: string;
  /** Average visit duration */
  visitDuration?: string;
}

/**
 * Category Metadata Interface
 *
 * Stores display information for each category.
 * Used for the legend, filters, and map markers.
 */
export interface CategoryInfo {
  /** Display name for UI */
  label: string;
  /** Tailwind color class for the category */
  color: string;
  /** Hex color for map markers */
  markerColor: string;
  /** Icon name from Lucide React */
  icon: string;
  /** Brief description of the category */
  description: string;
}

// ============================================================================
// CATEGORY METADATA
// ============================================================================

/**
 * Category Information Map
 *
 * This object stores metadata for each category, including:
 * - Display labels for the UI
 * - Colors for consistent theming
 * - Icons for visual recognition
 *
 * Why a Map object? It provides O(1) lookup time and ensures
 * all categories have consistent metadata.
 */
export const categoryInfo: Record<AttractionCategory, CategoryInfo> = {
  monument: {
    label: 'Monuments',
    color: 'bg-category-monument',
    markerColor: '#E11D48',
    icon: 'landmark',
    description: 'Iconic landmarks and must-see monuments',
  },
  beach: {
    label: 'Beaches',
    color: 'bg-category-beach',
    markerColor: '#0EA5E9',
    icon: 'umbrella',
    description: 'Beautiful beaches for relaxation and water sports',
  },
  carnival: {
    label: 'Carnival Spots',
    color: 'bg-category-carnival',
    markerColor: '#F59E0B',
    icon: 'party-popper',
    description: 'Best locations to experience Rio Carnival',
  },
  historical: {
    label: 'Historical',
    color: 'bg-category-historical',
    markerColor: '#8B5CF6',
    icon: 'scroll-text',
    description: 'Rich history and cultural heritage sites',
  },
  food: {
    label: 'Local Food',
    color: 'bg-category-food',
    markerColor: '#10B981',
    icon: 'utensils',
    description: 'Authentic Brazilian cuisine and local favorites',
  },
  favela: {
    label: 'Favelas',
    color: 'bg-category-favela',
    markerColor: '#6366F1',
    icon: 'home',
    description: 'Community tours with safety context',
  },
  bloco: {
    label: 'Blocos',
    color: 'bg-category-bloco',
    markerColor: '#EC4899',
    icon: 'music',
    description: 'Street party gathering points during Carnival',
  },
};

// ============================================================================
// ATTRACTIONS DATA
// ============================================================================

/**
 * Complete Attractions Database
 *
 * This array contains all attractions organized by category.
 * Each entry follows the Attraction interface strictly.
 *
 * Data sources:
 * - Official tourism websites
 * - Local recommendations
 * - Travel guides
 *
 * Cost conversion rate used: 1 USD ≈ 5 BRL (approximate)
 */
export const attractions: Attraction[] = [
  // ==========================================================================
  // MONUMENTS (5 entries)
  // ==========================================================================

  {
    id: 'cristo-redentor',
    name: 'Cristo Redentor',
    description:
      'The iconic 30-meter Art Deco statue of Jesus Christ, standing atop Corcovado mountain at 710 meters. One of the New Seven Wonders of the World, offering breathtaking panoramic views of Rio. The statue was completed in 1931 and has become the symbol of Rio de Janeiro.',
    category: 'monument',
    coordinates: {
      lat: -22.9519,
      lng: -43.2105,
    },
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
    cost: {
      brl: 150,
      usd: 30,
      description: 'Train ticket + entrance fee (includes round-trip)',
    },
    bestTime: {
      hours: '8:00 AM - 10:00 AM',
      reason: 'Avoid crowds and enjoy clearer skies before afternoon clouds roll in',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Uber/Taxi',
          duration: '20-30 min',
          costBRL: 35,
          notes: 'Drop-off at Cosme Velho station, then take the train',
        },
        {
          mode: 'Metro + Train',
          duration: '45 min',
          costBRL: 12,
          notes: 'Take Metro to Largo do Machado, then taxi to Cosme Velho',
        },
      ],
      fromCentro: [
        {
          mode: 'Uber/Taxi',
          duration: '25-35 min',
          costBRL: 40,
          notes: 'Direct to Cosme Velho station',
        },
        {
          mode: 'Bus',
          duration: '40 min',
          costBRL: 5,
          notes: 'Bus 583 from Praça XV to Cosme Velho',
        },
      ],
    },
    tags: ['landmark', 'viewpoint', 'religious', 'photography', 'iconic'],
    localTips:
      'Buy tickets online in advance to skip the line. Bring a light jacket - it can be windy at the top!',
    visitDuration: '2-3 hours',
  },

  {
    id: 'pao-de-acucar',
    name: 'Pão de Açúcar (Sugarloaf Mountain)',
    description:
      'A 396-meter peak rising from the waters of Guanabara Bay. Take the famous two-stage cable car (bondinho) for spectacular views of the city, beaches, and surrounding mountains. The sunset from here is absolutely magical.',
    category: 'monument',
    coordinates: {
      lat: -22.9492,
      lng: -43.1545,
    },
    image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&q=80',
    cost: {
      brl: 200,
      usd: 40,
      description: 'Round-trip cable car ticket',
    },
    bestTime: {
      hours: '4:00 PM - 6:30 PM',
      reason: 'Watch the sunset over Rio - an unforgettable experience',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Walk + Bus',
          duration: '25 min',
          costBRL: 5,
          notes: 'Bus 511 or 512 from Copacabana to Urca',
        },
        {
          mode: 'Uber/Taxi',
          duration: '10-15 min',
          costBRL: 20,
          notes: 'Quick and comfortable option',
        },
      ],
      fromCentro: [
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Direct to cable car station',
        },
        {
          mode: 'Bus',
          duration: '30 min',
          costBRL: 5,
          notes: 'Bus 107 from Praça XV',
        },
      ],
    },
    tags: ['viewpoint', 'cable car', 'sunset', 'photography', 'iconic'],
    localTips:
      'The first cable car station (Morro da Urca) has a restaurant and often hosts concerts. Check the schedule!',
    visitDuration: '2-3 hours',
  },

  {
    id: 'escadaria-selaron',
    name: 'Escadaria Selarón',
    description:
      'A world-famous set of 215 steps covered in colorful tiles from over 60 countries. Created by Chilean artist Jorge Selarón, who worked on this masterpiece from 1990 until his death in 2013. Each tile tells a story.',
    category: 'monument',
    coordinates: {
      lat: -22.9153,
      lng: -43.1791,
    },
    image: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free - public art installation',
    },
    bestTime: {
      hours: '7:00 AM - 9:00 AM',
      reason: 'Best light for photos and fewer crowds',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '20 min',
          costBRL: 7,
          notes: 'Take Line 1 to Cinelândia, walk 10 min',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Direct to Lapa neighborhood',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '10-15 min',
          costBRL: 0,
          notes: 'Pleasant walk through Lapa',
        },
        {
          mode: 'VLT (Light Rail)',
          duration: '10 min',
          costBRL: 4,
          notes: 'Take VLT to Carioca station',
        },
      ],
    },
    tags: ['art', 'free', 'photography', 'colorful', 'unique'],
    localTips: 'Visit during weekdays to avoid weekend crowds. The area comes alive at night with bars and music!',
    visitDuration: '30 min - 1 hour',
  },

  {
    id: 'arcos-da-lapa',
    name: 'Arcos da Lapa (Carioca Aqueduct)',
    description:
      'An impressive 18th-century aqueduct with 42 arches spanning 270 meters. Originally built to bring water to the city, it now carries the famous Santa Teresa tram. The arches are beautifully illuminated at night.',
    category: 'monument',
    coordinates: {
      lat: -22.9139,
      lng: -43.1803,
    },
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free to view (tram ride costs R$20)',
    },
    bestTime: {
      hours: '6:00 PM - 10:00 PM',
      reason: 'The arches are beautifully lit and the nightlife begins',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Line 1 to Cinelândia station',
        },
        {
          mode: 'Uber/Taxi',
          duration: '12-18 min',
          costBRL: 22,
          notes: 'Direct to Lapa',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '8 min',
          costBRL: 0,
          notes: 'Easy walk from Centro',
        },
        {
          mode: 'VLT',
          duration: '5 min',
          costBRL: 4,
          notes: 'Stop at Carioca',
        },
      ],
    },
    tags: ['architecture', 'historical', 'nightlife', 'free', 'photography'],
    localTips:
      'Friday and Saturday nights feature live samba and forró music in the surrounding streets. Very lively!',
    visitDuration: '1-2 hours',
  },

  {
    id: 'maracana',
    name: 'Estádio Maracanã',
    description:
      'The legendary Maracanã Stadium, once the largest in the world, has witnessed countless historic football moments. Home to two FIFA World Cup finals (1950 and 2014) and the 2016 Olympics. A pilgrimage site for football fans.',
    category: 'monument',
    coordinates: {
      lat: -22.9121,
      lng: -43.2302,
    },
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80',
    cost: {
      brl: 75,
      usd: 15,
      description: 'Stadium tour (match tickets vary)',
    },
    bestTime: {
      hours: '9:00 AM - 12:00 PM',
      reason: 'Tours are less crowded in the morning',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '25 min',
          costBRL: 7,
          notes: 'Line 1 to Maracanã station',
        },
        {
          mode: 'Uber/Taxi',
          duration: '20-30 min',
          costBRL: 35,
          notes: 'Direct to stadium entrance',
        },
      ],
      fromCentro: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Line 2 direct to Maracanã',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Quick trip from Centro',
        },
      ],
    },
    tags: ['sports', 'football', 'history', 'stadium', 'iconic'],
    localTips:
      'If possible, attend a Flamengo or Fluminense match for the authentic experience. The atmosphere is electric!',
    visitDuration: '2-3 hours',
  },

  // ==========================================================================
  // BEACHES (3 entries)
  // ==========================================================================

  {
    id: 'copacabana',
    name: 'Praia de Copacabana',
    description:
      'The world-famous 4km crescent beach with its iconic Portuguese wave-pattern promenade. From luxurious hotels to beachside kiosks serving fresh coconut water, Copacabana embodies the carioca (Rio resident) lifestyle.',
    category: 'beach',
    coordinates: {
      lat: -22.9714,
      lng: -43.1823,
    },
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free (chair rental ~R$15, umbrella ~R$20)',
    },
    bestTime: {
      hours: '6:00 AM - 10:00 AM or 4:00 PM - 6:30 PM',
      reason: 'Avoid the strongest sun; early mornings see locals exercising',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Walk',
          duration: '0-10 min',
          costBRL: 0,
          notes: "You're already there!",
        },
      ],
      fromCentro: [
        {
          mode: 'Metro',
          duration: '20 min',
          costBRL: 7,
          notes: 'Line 1 to Cardeal Arcoverde or Siqueira Campos',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-25 min',
          costBRL: 28,
          notes: 'Direct to your preferred beach posto (station)',
        },
      ],
    },
    tags: ['beach', 'swimming', 'sports', 'nightlife', 'iconic'],
    localTips:
      'The beach is divided into "postos" (stations). Posto 6 near Arpoador is popular with surfers; Posto 2 has great LGBTQ+ scene.',
    visitDuration: 'Half day or full day',
  },

  {
    id: 'ipanema',
    name: 'Praia de Ipanema',
    description:
      'Made famous by the bossa nova song "The Girl from Ipanema," this trendy beach is surrounded by upscale boutiques, restaurants, and bars. Watch the sunset from Arpoador rock for a magical experience.',
    category: 'beach',
    coordinates: {
      lat: -22.9867,
      lng: -43.2051,
    },
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free (similar rental costs as Copacabana)',
    },
    bestTime: {
      hours: '4:00 PM - 7:00 PM',
      reason: 'Perfect for sunset watching at Arpoador',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Walk',
          duration: '25-30 min',
          costBRL: 0,
          notes: 'Beautiful coastal walk past Arpoador',
        },
        {
          mode: 'Metro',
          duration: '10 min',
          costBRL: 7,
          notes: 'Line 1 to General Osório',
        },
      ],
      fromCentro: [
        {
          mode: 'Metro',
          duration: '25 min',
          costBRL: 7,
          notes: 'Line 1 to General Osório',
        },
        {
          mode: 'Uber/Taxi',
          duration: '20-30 min',
          costBRL: 35,
          notes: 'Direct to Ipanema',
        },
      ],
    },
    tags: ['beach', 'sunset', 'trendy', 'shopping', 'music'],
    localTips:
      'On Sundays, the streets close for pedestrians and cyclists. Visit Feira Hippie de Ipanema (hippie market) for artisan goods.',
    visitDuration: 'Half day or full day',
  },

  {
    id: 'leblon',
    name: 'Praia do Leblon',
    description:
      'The most upscale beach in Rio, favored by families and celebrities. Calmer waters and a more relaxed atmosphere than its neighbors. The Baixo Bebê area has playgrounds and is perfect for families with children.',
    category: 'beach',
    coordinates: {
      lat: -22.9877,
      lng: -43.2262,
    },
    image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free (slightly higher prices at kiosks)',
    },
    bestTime: {
      hours: '8:00 AM - 11:00 AM',
      reason: 'Perfect for families; calmer morning atmosphere',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Bus',
          duration: '20 min',
          costBRL: 5,
          notes: 'Bus 584 along the coast',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15 min',
          costBRL: 22,
          notes: 'Quick and easy',
        },
      ],
      fromCentro: [
        {
          mode: 'Metro + Bus',
          duration: '35 min',
          costBRL: 12,
          notes: 'Metro to Antero de Quental, bus to Leblon',
        },
        {
          mode: 'Uber/Taxi',
          duration: '25-35 min',
          costBRL: 40,
          notes: 'Direct route',
        },
      ],
    },
    tags: ['beach', 'family', 'upscale', 'safe', 'relaxed'],
    localTips:
      'Try the delicious açaí at Bibi Sucos nearby. The Mirante do Leblon viewpoint offers great photos.',
    visitDuration: 'Half day or full day',
  },

  // ==========================================================================
  // CARNIVAL SPOTS (5 entries)
  // ==========================================================================

  {
    id: 'sambodromo',
    name: 'Sambódromo da Marquês de Sapucaí',
    description:
      'The purpose-built parade ground designed by Oscar Niemeyer, where the famous samba school competitions take place during Carnival. Over 70,000 spectators watch the spectacular parades featuring elaborate costumes and floats.',
    category: 'carnival',
    coordinates: {
      lat: -22.9117,
      lng: -43.1968,
    },
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&q=80',
    cost: {
      brl: 600,
      usd: 120,
      description: 'Parade tickets (prices vary by sector, R$200-R$3000)',
    },
    bestTime: {
      hours: '9:00 PM - 6:00 AM',
      reason: 'Main parades happen overnight during Carnival weekend',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '25 min',
          costBRL: 7,
          notes: 'Special Carnival metro service runs all night',
        },
        {
          mode: 'Uber/Taxi',
          duration: '20-30 min',
          costBRL: 40,
          notes: 'Traffic can be heavy during Carnival',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '15 min',
          costBRL: 0,
          notes: 'Easy walk from Central do Brasil',
        },
        {
          mode: 'Metro',
          duration: '10 min',
          costBRL: 7,
          notes: 'Praça Onze station',
        },
      ],
    },
    tags: ['carnival', 'samba', 'parade', 'music', 'dance', 'costume'],
    localTips:
      'Book tickets months in advance! Sector 9 offers the best view-to-price ratio. Bring earplugs and comfortable shoes.',
    visitDuration: '6-10 hours',
  },

  {
    id: 'lapa-carnival',
    name: 'Lapa (Carnival Hub)',
    description:
      'The bohemian neighborhood of Lapa transforms into a massive street party during Carnival. With live samba bands, street vendors, and thousands of revelers, this is where locals celebrate the true spirit of Carnival.',
    category: 'carnival',
    coordinates: {
      lat: -22.9144,
      lng: -43.1797,
    },
    image: 'https://images.unsplash.com/photo-1551972251-12070d63502a?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free street party (budget R$100+ for drinks and food)',
    },
    bestTime: {
      hours: '6:00 PM - 4:00 AM',
      reason: 'The party peaks late at night',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Cinelândia station, walk to Lapa',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'May be difficult to find rides during Carnival',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '10 min',
          costBRL: 0,
          notes: 'Short walk from Centro',
        },
      ],
    },
    tags: ['carnival', 'nightlife', 'street party', 'samba', 'free'],
    localTips:
      'Wear comfortable shoes and carry minimal valuables. Stay hydrated! The party goes on for hours.',
    visitDuration: '4-8 hours',
  },

  {
    id: 'terraco-samba',
    name: 'Pedra do Sal',
    description:
      'Known as the birthplace of samba, this historic site in the port area hosts authentic samba rodas (circles) every Monday and Friday. A deeply cultural experience where you can witness real carioca musical traditions.',
    category: 'carnival',
    coordinates: {
      lat: -22.8967,
      lng: -43.1851,
    },
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free (bring cash for drinks and food)',
    },
    bestTime: {
      hours: '7:00 PM - 11:00 PM',
      reason: 'Samba sessions on Mondays and Fridays',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Uber/Taxi',
          duration: '20-25 min',
          costBRL: 30,
          notes: 'Best option for evening visits',
        },
        {
          mode: 'VLT',
          duration: '30 min',
          costBRL: 4,
          notes: 'Take metro then VLT to Pequena África',
        },
      ],
      fromCentro: [
        {
          mode: 'VLT',
          duration: '10 min',
          costBRL: 4,
          notes: 'Pequena África stop',
        },
        {
          mode: 'Walk',
          duration: '15 min',
          costBRL: 0,
          notes: 'Through the revitalized port area',
        },
      ],
    },
    tags: ['samba', 'history', 'music', 'authentic', 'free', 'cultural'],
    localTips:
      'This is the real deal - not touristy at all. Locals gather to dance and socialize. Join in!',
    visitDuration: '2-4 hours',
  },

  {
    id: 'rio-scenarium',
    name: 'Rio Scenarium',
    description:
      'A three-story antique warehouse turned into one of Rio\'s most famous nightlife venues. Live samba, forró, and MPB music surrounded by vintage furniture and collectibles. A must-visit for music lovers.',
    category: 'carnival',
    coordinates: {
      lat: -22.9069,
      lng: -43.1808,
    },
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    cost: {
      brl: 60,
      usd: 12,
      description: 'Cover charge (varies by night, R$40-R$80)',
    },
    bestTime: {
      hours: '8:00 PM - 2:00 AM',
      reason: 'Live music starts around 9 PM',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '20 min',
          costBRL: 7,
          notes: 'Uruguaiana station, walk 5 min',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Direct to venue',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '5-10 min',
          costBRL: 0,
          notes: 'Located in Centro',
        },
      ],
    },
    tags: ['nightlife', 'samba', 'live music', 'dancing', 'unique'],
    localTips: 'Reserve a table online, especially for weekends. Dress code is smart casual.',
    visitDuration: '3-5 hours',
  },

  {
    id: 'circo-voador',
    name: 'Circo Voador',
    description:
      'Legendary open-air concert venue under the Lapa Arches. Since 1982, it has been a cornerstone of Rio\'s alternative music scene, hosting everything from samba to rock to electronic music.',
    category: 'carnival',
    coordinates: {
      lat: -22.9136,
      lng: -43.1806,
    },
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    cost: {
      brl: 80,
      usd: 16,
      description: 'Varies by event (R$50-R$150)',
    },
    bestTime: {
      hours: '9:00 PM - 3:00 AM',
      reason: 'Events typically start late',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Cinelândia or Carioca station',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Direct to Lapa',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '5-10 min',
          costBRL: 0,
          notes: 'Right under the arches',
        },
      ],
    },
    tags: ['music', 'concerts', 'alternative', 'nightlife', 'iconic'],
    localTips: 'Check their schedule online. Some of Brazil\'s biggest artists got their start here!',
    visitDuration: '3-5 hours',
  },

  // ==========================================================================
  // HISTORICAL SPOTS (4 entries)
  // ==========================================================================

  {
    id: 'museu-do-amanha',
    name: 'Museu do Amanhã (Museum of Tomorrow)',
    description:
      'A stunning futuristic science museum designed by Santiago Calatrava on the renovated waterfront. Interactive exhibits explore sustainability, human impact on Earth, and possibilities for the future. The building itself is a masterpiece.',
    category: 'historical',
    coordinates: {
      lat: -22.8944,
      lng: -43.1804,
    },
    image: 'https://images.unsplash.com/photo-1551972251-12070d63502a?w=800&q=80',
    cost: {
      brl: 30,
      usd: 6,
      description: 'Regular admission (free on Tuesdays)',
    },
    bestTime: {
      hours: '10:00 AM - 3:00 PM',
      reason: 'Weekday afternoons have shorter queues',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'VLT',
          duration: '25 min',
          costBRL: 4,
          notes: 'Metro to Uruguaiana, then VLT to Parada dos Museus',
        },
        {
          mode: 'Uber/Taxi',
          duration: '20 min',
          costBRL: 30,
          notes: 'Direct to Praça Mauá',
        },
      ],
      fromCentro: [
        {
          mode: 'VLT',
          duration: '10 min',
          costBRL: 4,
          notes: 'Parada dos Museus stop',
        },
        {
          mode: 'Walk',
          duration: '15 min',
          costBRL: 0,
          notes: 'Pleasant walk along the waterfront',
        },
      ],
    },
    tags: ['museum', 'architecture', 'science', 'modern', 'waterfront'],
    localTips:
      'Combine with a visit to MAR (Museum of Art of Rio) next door. The reflecting pools are perfect for photos.',
    visitDuration: '2-3 hours',
  },

  {
    id: 'biblioteca-nacional',
    name: 'Biblioteca Nacional',
    description:
      'The largest library in Latin America and the 8th largest in the world, housing over 9 million items. The stunning neoclassical building features beautiful reading rooms and regular exhibitions.',
    category: 'historical',
    coordinates: {
      lat: -22.9099,
      lng: -43.1753,
    },
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free (guided tours R$10)',
    },
    bestTime: {
      hours: '9:00 AM - 5:00 PM',
      reason: 'Weekday mornings for fewer crowds',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Cinelândia station, exit directly to the library',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '5 min',
          costBRL: 0,
          notes: 'Located in the heart of Centro',
        },
      ],
    },
    tags: ['library', 'architecture', 'history', 'free', 'cultural'],
    localTips: 'The guided tour reveals hidden gems like the rare books section. Photography allowed in most areas.',
    visitDuration: '1-2 hours',
  },

  {
    id: 'palacio-imperial',
    name: 'Paço Imperial',
    description:
      'Colonial palace that served as the residence of Portuguese governors and later Brazilian emperors. Today it houses art galleries and cultural exhibitions in a beautiful historic setting.',
    category: 'historical',
    coordinates: {
      lat: -22.9025,
      lng: -43.1735,
    },
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free admission to most exhibitions',
    },
    bestTime: {
      hours: '12:00 PM - 5:00 PM',
      reason: 'Combine with lunch at one of the excellent restaurants inside',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '20 min',
          costBRL: 7,
          notes: 'Uruguaiana station, walk to Praça XV',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Direct to Praça XV',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '5 min',
          costBRL: 0,
          notes: 'At Praça XV de Novembro',
        },
        {
          mode: 'VLT',
          duration: '5 min',
          costBRL: 4,
          notes: 'Parada dos Museus stop',
        },
      ],
    },
    tags: ['history', 'art', 'architecture', 'free', 'colonial'],
    localTips:
      'The Café do Paço serves excellent Brazilian coffee. The bookshop has unique art books.',
    visitDuration: '1-2 hours',
  },

  {
    id: 'jardim-botanico',
    name: 'Jardim Botânico',
    description:
      'A 340-acre tropical botanical garden founded in 1808 by King John VI of Portugal. Home to around 6,500 species, including the famous Imperial Palms avenue, orchid gardens, and the Sensory Garden.',
    category: 'historical',
    coordinates: {
      lat: -22.9676,
      lng: -43.2248,
    },
    image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&q=80',
    cost: {
      brl: 40,
      usd: 8,
      description: 'Regular admission',
    },
    bestTime: {
      hours: '8:00 AM - 11:00 AM',
      reason: 'Cooler temperatures and birds are most active',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Bus',
          duration: '25 min',
          costBRL: 5,
          notes: 'Bus 584 or 583',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Direct to entrance',
        },
      ],
      fromCentro: [
        {
          mode: 'Metro + Bus',
          duration: '40 min',
          costBRL: 12,
          notes: 'Metro to Botafogo, then bus',
        },
        {
          mode: 'Uber/Taxi',
          duration: '25-30 min',
          costBRL: 35,
          notes: 'Through Lagoa neighborhood',
        },
      ],
    },
    tags: ['nature', 'gardens', 'photography', 'wildlife', 'peaceful'],
    localTips:
      'Look for toucans and monkeys! The Japanese Garden and the Bromeliad section are must-sees.',
    visitDuration: '2-4 hours',
  },

  // ==========================================================================
  // LOCAL FOOD SPOTS (5 entries)
  // ==========================================================================

  {
    id: 'confeitaria-colombo',
    name: 'Confeitaria Colombo',
    description:
      'Opened in 1894, this Belle Époque tearoom is a work of art featuring Belgian mirrors, Italian marble, and Portuguese tiles. Famous for its traditional pastries, especially the "mil-folhas" and afternoon tea service.',
    category: 'food',
    coordinates: {
      lat: -22.9042,
      lng: -43.1762,
    },
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    cost: {
      brl: 80,
      usd: 16,
      description: 'Afternoon tea per person (à la carte items R$15-50)',
    },
    bestTime: {
      hours: '3:00 PM - 5:00 PM',
      reason: 'Traditional afternoon tea time',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Uruguaiana station, walk 3 min',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '3 min',
          costBRL: 0,
          notes: 'Rua Gonçalves Dias, 32',
        },
      ],
    },
    tags: ['historic', 'pastries', 'tea', 'elegant', 'photography'],
    localTips:
      'Try the "pastel de nata" (Portuguese custard tart). The upstairs has a beautiful view of the main hall.',
    visitDuration: '1-2 hours',
  },

  {
    id: 'bar-do-mineiro',
    name: 'Bar do Mineiro',
    description:
      'Authentic "boteco" (Brazilian pub) in Santa Teresa serving traditional Minas Gerais cuisine. Famous for feijoada (bean stew), torresmo (crispy pork rinds), and ice-cold draft beer.',
    category: 'food',
    coordinates: {
      lat: -22.9214,
      lng: -43.1849,
    },
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    cost: {
      brl: 60,
      usd: 12,
      description: 'Meal for one with drinks',
    },
    bestTime: {
      hours: '12:00 PM - 3:00 PM',
      reason: 'Lunch rush means food is fresh; Saturday is best for feijoada',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Uber/Taxi',
          duration: '20-25 min',
          costBRL: 30,
          notes: 'Up the hill to Santa Teresa',
        },
        {
          mode: 'Metro + Tram',
          duration: '40 min',
          costBRL: 27,
          notes: 'Metro to Carioca, then Santa Teresa tram',
        },
      ],
      fromCentro: [
        {
          mode: 'Tram',
          duration: '20 min',
          costBRL: 20,
          notes: 'Historic bonde (tram) from Carioca',
        },
        {
          mode: 'Uber/Taxi',
          duration: '10-15 min',
          costBRL: 20,
          notes: 'Up the Lapa arches',
        },
      ],
    },
    tags: ['traditional', 'feijoada', 'bar', 'authentic', 'local'],
    localTips:
      'Get there early on Saturday for feijoada - it sells out! The coxinha de galinha is also excellent.',
    visitDuration: '1-2 hours',
  },

  {
    id: 'braseiro-da-gavea',
    name: 'Braseiro da Gávea',
    description:
      'Open since 1948, this classic churrascaria serves some of the best grilled meats in Rio. The picanha (top sirloin) is legendary. A favorite among locals and visitors who want authentic Brazilian BBQ.',
    category: 'food',
    coordinates: {
      lat: -22.9835,
      lng: -43.2321,
    },
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
    cost: {
      brl: 120,
      usd: 24,
      description: 'Per person for meat and sides',
    },
    bestTime: {
      hours: '7:00 PM - 10:00 PM',
      reason: 'Peak dinner hours; authentic atmosphere',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Bus',
          duration: '30 min',
          costBRL: 5,
          notes: 'Bus 584 towards Gávea',
        },
        {
          mode: 'Uber/Taxi',
          duration: '20 min',
          costBRL: 30,
          notes: 'Direct to Praça Santos Dumont',
        },
      ],
      fromCentro: [
        {
          mode: 'Uber/Taxi',
          duration: '30-40 min',
          costBRL: 45,
          notes: 'Via Lagoa or tunnel',
        },
      ],
    },
    tags: ['churrasco', 'meat', 'traditional', 'local', 'dinner'],
    localTips:
      'Order the picanha with farofa (toasted cassava flour). The garlic bread is complimentary and delicious!',
    visitDuration: '2 hours',
  },

  {
    id: 'feira-sao-cristovao',
    name: 'Feira de São Cristóvão',
    description:
      'The Northeast Market - a massive indoor market celebrating Brazilian Northeast culture. Over 700 stalls offer traditional food, forró music, handcrafts, and authentic regional cuisine. The atmosphere is electric!',
    category: 'food',
    coordinates: {
      lat: -22.8969,
      lng: -43.2208,
    },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    cost: {
      brl: 5,
      usd: 1,
      description: 'Entry fee (food R$20-60)',
    },
    bestTime: {
      hours: '6:00 PM - 11:00 PM (Fri-Sun)',
      reason: 'Live forró music and dancing; festive atmosphere',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '30 min',
          costBRL: 7,
          notes: 'Line 2 to São Cristóvão station',
        },
        {
          mode: 'Uber/Taxi',
          duration: '25-30 min',
          costBRL: 35,
          notes: 'Direct to the market',
        },
      ],
      fromCentro: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Line 2 to São Cristóvão',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Quick trip',
        },
      ],
    },
    tags: ['market', 'forró', 'northeast', 'authentic', 'music', 'cultural'],
    localTips:
      'Try carne de sol (sun-dried beef), acarajé, and tapioca. Come hungry and ready to dance!',
    visitDuration: '3-5 hours',
  },

  {
    id: 'zaza-bistro',
    name: 'Zaza Bistrô Tropical',
    description:
      'Whimsical restaurant in Ipanema known for creative fusion cuisine and eclectic decor. Bohemian atmosphere with chandeliers, colorful cushions, and inventive dishes that blend Brazilian and international flavors.',
    category: 'food',
    coordinates: {
      lat: -22.9833,
      lng: -43.2036,
    },
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    cost: {
      brl: 150,
      usd: 30,
      description: 'Dinner for one with drinks',
    },
    bestTime: {
      hours: '8:00 PM - 10:00 PM',
      reason: 'Romantic dinner atmosphere',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Walk',
          duration: '20 min',
          costBRL: 0,
          notes: 'Pleasant walk along the beach',
        },
        {
          mode: 'Metro',
          duration: '10 min',
          costBRL: 7,
          notes: 'General Osório station',
        },
      ],
      fromCentro: [
        {
          mode: 'Metro',
          duration: '25 min',
          costBRL: 7,
          notes: 'General Osório station',
        },
        {
          mode: 'Uber/Taxi',
          duration: '25 min',
          costBRL: 35,
          notes: 'Direct to Ipanema',
        },
      ],
    },
    tags: ['trendy', 'fusion', 'romantic', 'creative', 'dinner'],
    localTips:
      'Reserve ahead on weekends. The rooftop seating is magical. Try the bobó de camarão!',
    visitDuration: '2 hours',
  },

  // ==========================================================================
  // FAVELAS (3 entries)
  // ==========================================================================

  {
    id: 'rocinha',
    name: 'Rocinha',
    description:
      'Latin America\'s largest favela, home to an estimated 70,000-100,000 residents. Guided tours offer insight into community life, local businesses, and the resilience of residents. A humbling and eye-opening experience.',
    category: 'favela',
    coordinates: {
      lat: -22.9866,
      lng: -43.2481,
    },
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800&q=80',
    cost: {
      brl: 150,
      usd: 30,
      description: 'Guided tour (2-3 hours)',
    },
    bestTime: {
      hours: '9:00 AM - 12:00 PM',
      reason: 'Morning tours are safest and most active',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Tour pickup',
          duration: 'Included',
          costBRL: 0,
          notes: 'Most tours include hotel pickup',
        },
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'Only with a guide arranged',
        },
      ],
      fromCentro: [
        {
          mode: 'Tour pickup',
          duration: 'Included',
          costBRL: 0,
          notes: 'Tours can pick up from Centro',
        },
      ],
    },
    tags: ['community', 'culture', 'tour', 'perspective', 'urban'],
    safetyNotes:
      'ONLY visit with a reputable local guide. Never enter alone or without arrangement. Respect residents\' privacy and ask before photographing people.',
    localTips:
      'Book tours that give back to the community. Support local businesses by buying crafts or food.',
    visitDuration: '2-3 hours',
  },

  {
    id: 'santa-marta',
    name: 'Santa Marta',
    description:
      'A smaller, more accessible favela known for the famous Michael Jackson statue (he filmed "They Don\'t Care About Us" here). The UPP (police pacification) program has made it one of the safest favelas to visit.',
    category: 'favela',
    coordinates: {
      lat: -22.9432,
      lng: -43.1914,
    },
    image: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?w=800&q=80',
    cost: {
      brl: 100,
      usd: 20,
      description: 'Guided tour (1.5-2 hours)',
    },
    bestTime: {
      hours: '10:00 AM - 2:00 PM',
      reason: 'Best lighting for photos and active community',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Uber/Taxi',
          duration: '10-15 min',
          costBRL: 20,
          notes: 'To Botafogo, then walk up or take moto-taxi',
        },
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Botafogo station, walk 10 min to entrance',
        },
      ],
      fromCentro: [
        {
          mode: 'Metro',
          duration: '20 min',
          costBRL: 7,
          notes: 'Botafogo station',
        },
      ],
    },
    tags: ['community', 'art', 'michael jackson', 'viewpoint', 'accessible'],
    safetyNotes:
      'One of the safest favelas but still recommended to go with a guide. The funicular goes up the hill. Stunning city views from the top.',
    localTips:
      'Visit the Michael Jackson memorial plaza. Local guides offer more authentic perspectives than tour companies.',
    visitDuration: '1.5-2 hours',
  },

  {
    id: 'vidigal',
    name: 'Vidigal',
    description:
      'A favela nestled between Leblon and São Conrado with stunning views of the coastline. Known for its artistic community, vibrant nightlife at the top, and spectacular viewpoints. The most "trendy" favela.',
    category: 'favela',
    coordinates: {
      lat: -22.9922,
      lng: -43.2328,
    },
    image: 'https://images.unsplash.com/photo-1551972251-12070d63502a?w=800&q=80',
    cost: {
      brl: 120,
      usd: 24,
      description: 'Guided tour or moto-taxi to top (~R$20)',
    },
    bestTime: {
      hours: '4:00 PM - 7:00 PM',
      reason: 'Sunset views are spectacular; bars open in the evening',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Uber/Taxi',
          duration: '15-20 min',
          costBRL: 25,
          notes: 'To the entrance, then moto-taxi up',
        },
        {
          mode: 'Bus',
          duration: '25 min',
          costBRL: 5,
          notes: 'Bus 584 to Vidigal stop',
        },
      ],
      fromCentro: [
        {
          mode: 'Uber/Taxi',
          duration: '30-35 min',
          costBRL: 45,
          notes: 'Via tunnel to Leblon',
        },
      ],
    },
    tags: ['viewpoint', 'sunset', 'nightlife', 'art', 'trendy'],
    safetyNotes:
      'Generally safe during the day and early evening. The top has popular bars (Bar da Laje) that tourists frequent. Take moto-taxi or van up the steep roads.',
    localTips:
      'Bar da Laje offers incredible sunset views over the ocean. The hike to Dois Irmãos mountain starts here.',
    visitDuration: '2-4 hours',
  },

  // ==========================================================================
  // BLOCOS (Carnival Street Parties) (5 entries)
  // ==========================================================================

  {
    id: 'bloco-cordao-bola-preta',
    name: 'Cordão da Bola Preta',
    description:
      'The oldest and largest bloco in Rio, founded in 1918. Over 2 million people follow this black and white themed party through Centro. The ultimate Rio Carnival street party experience.',
    category: 'bloco',
    coordinates: {
      lat: -22.9069,
      lng: -43.1757,
    },
    image: 'https://images.unsplash.com/photo-1551972251-12070d63502a?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free (budget R$100+ for drinks and costume)',
    },
    bestTime: {
      hours: 'Saturday of Carnival, 9:00 AM onwards',
      reason: 'Official parade day',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Carioca or Uruguaiana station',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '5 min',
          costBRL: 0,
          notes: 'Starts at Primeiro de Março street',
        },
      ],
    },
    tags: ['bloco', 'carnival', 'massive', 'traditional', 'street party'],
    localTips:
      'Wear black and white! Arrive early to secure a good spot. Keep valuables minimal and hidden.',
    visitDuration: '4-8 hours',
  },

  {
    id: 'bloco-banda-ipanema',
    name: 'Banda de Ipanema',
    description:
      'Founded in 1965, this inclusive bloco is famous for its LGBTQ+ friendly atmosphere and creative costumes. Known as one of the most fun and colorful street parties in Rio.',
    category: 'bloco',
    coordinates: {
      lat: -22.984,
      lng: -43.2,
    },
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free street party',
    },
    bestTime: {
      hours: 'Saturday and Tuesday of Carnival, 4:00 PM',
      reason: 'Two official parade days',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Walk',
          duration: '25 min',
          costBRL: 0,
          notes: 'Along the beach to Ipanema',
        },
        {
          mode: 'Metro',
          duration: '10 min',
          costBRL: 7,
          notes: 'General Osório station',
        },
      ],
      fromCentro: [
        {
          mode: 'Metro',
          duration: '25 min',
          costBRL: 7,
          notes: 'General Osório station',
        },
      ],
    },
    tags: ['bloco', 'lgbtq', 'costumes', 'fun', 'inclusive'],
    localTips: 'The more outrageous your costume, the better! Very friendly and welcoming atmosphere.',
    visitDuration: '4-6 hours',
  },

  {
    id: 'bloco-carmelitas',
    name: 'Bloco das Carmelitas',
    description:
      'A beloved Santa Teresa bloco with a quirky origin story - named after nuns who allegedly escaped their convent to join Carnival! One of the most atmospheric street parties in the bohemian neighborhood.',
    category: 'bloco',
    coordinates: {
      lat: -22.9195,
      lng: -43.1889,
    },
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free street party',
    },
    bestTime: {
      hours: 'Friday of Carnival, 2:00 PM',
      reason: 'Opens the Carnival season',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Uber/Taxi',
          duration: '25 min',
          costBRL: 35,
          notes: 'Up to Santa Teresa',
        },
      ],
      fromCentro: [
        {
          mode: 'Tram',
          duration: '20 min',
          costBRL: 20,
          notes: 'Historic Santa Teresa tram',
        },
      ],
    },
    tags: ['bloco', 'bohemian', 'quirky', 'santa teresa', 'traditional'],
    localTips:
      'Many people dress as nuns! The narrow streets of Santa Teresa create an intimate atmosphere.',
    visitDuration: '4-6 hours',
  },

  {
    id: 'bloco-sargento-pimenta',
    name: 'Sargento Pimenta',
    description:
      'Beatles-themed bloco that plays samba versions of classic Beatles songs. A unique fusion of British rock and Brazilian rhythm that attracts music lovers from around the world.',
    category: 'bloco',
    coordinates: {
      lat: -22.9063,
      lng: -43.1789,
    },
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free street party',
    },
    bestTime: {
      hours: 'Sunday of Carnival, 4:00 PM',
      reason: 'Official parade time',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Metro',
          duration: '15 min',
          costBRL: 7,
          notes: 'Cinelândia station',
        },
      ],
      fromCentro: [
        {
          mode: 'Walk',
          duration: '5 min',
          costBRL: 0,
          notes: 'Near Cinelândia',
        },
      ],
    },
    tags: ['bloco', 'beatles', 'music', 'creative', 'unique'],
    localTips:
      'Wear Sgt. Pepper-inspired costumes! Learning the samba versions of Beatles songs adds to the fun.',
    visitDuration: '4-6 hours',
  },

  {
    id: 'bloco-ceu-na-terra',
    name: 'Céu na Terra',
    description:
      'One of Santa Teresa\'s most charming blocos, known for its family-friendly atmosphere during the day and romantic evening parties. Beautiful setting in the historic neighborhood.',
    category: 'bloco',
    coordinates: {
      lat: -22.9218,
      lng: -43.1846,
    },
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    cost: {
      brl: 0,
      usd: 0,
      description: 'Free street party',
    },
    bestTime: {
      hours: 'Saturday of Carnival, 3:00 PM',
      reason: 'Main parade day',
    },
    transport: {
      fromCopacabana: [
        {
          mode: 'Uber/Taxi',
          duration: '20-25 min',
          costBRL: 30,
          notes: 'To Santa Teresa',
        },
      ],
      fromCentro: [
        {
          mode: 'Tram',
          duration: '15 min',
          costBRL: 20,
          notes: 'Historic bonde to Santa Teresa',
        },
      ],
    },
    tags: ['bloco', 'family', 'romantic', 'santa teresa', 'charming'],
    localTips: 'Great for couples and families! The cobblestone streets and old mansions create a magical backdrop.',
    visitDuration: '3-5 hours',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get attractions by category
 *
 * Filters the attractions array by a specific category.
 * Useful for the category filter feature in the UI.
 *
 * @param category - The category to filter by
 * @returns Array of attractions in that category
 *
 * @example
 * const beaches = getAttractionsByCategory('beach');
 * // Returns all beach attractions
 */
export function getAttractionsByCategory(category: AttractionCategory): Attraction[] {
  return attractions.filter((attraction) => attraction.category === category);
}

/**
 * Get attraction by ID
 *
 * Finds a single attraction by its unique identifier.
 * Returns undefined if not found.
 *
 * @param id - The unique identifier of the attraction
 * @returns The attraction object or undefined
 *
 * @example
 * const cristo = getAttractionById('cristo-redentor');
 */
export function getAttractionById(id: string): Attraction | undefined {
  return attractions.find((attraction) => attraction.id === id);
}

/**
 * Search attractions
 *
 * Searches attractions by name, description, and tags.
 * Uses case-insensitive matching.
 *
 * @param query - The search term
 * @returns Array of matching attractions
 *
 * @example
 * const results = searchAttractions('beach');
 * // Returns attractions with 'beach' in name, description, or tags
 */
export function searchAttractions(query: string): Attraction[] {
  const lowerQuery = query.toLowerCase();
  return attractions.filter(
    (attraction) =>
      attraction.name.toLowerCase().includes(lowerQuery) ||
      attraction.description.toLowerCase().includes(lowerQuery) ||
      attraction.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get all categories with counts
 *
 * Returns category info with the count of attractions in each.
 * Useful for building the filter UI with counts.
 *
 * @returns Array of category info with counts
 */
export function getCategoriesWithCounts(): (CategoryInfo & { count: number; key: AttractionCategory })[] {
  return Object.entries(categoryInfo).map(([key, info]) => ({
    ...info,
    key: key as AttractionCategory,
    count: attractions.filter((a) => a.category === key).length,
  }));
}

/**
 * Calculate approximate distance between two coordinates
 *
 * Uses the Haversine formula to calculate distance between two points.
 * Returns distance in kilometers.
 *
 * @param lat1 - Latitude of point 1
 * @param lng1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lng2 - Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get nearby attractions
 *
 * Finds attractions within a specified radius of a point.
 *
 * @param lat - Center latitude
 * @param lng - Center longitude
 * @param radiusKm - Radius in kilometers (default: 2km)
 * @returns Array of nearby attractions with distance
 */
export function getNearbyAttractions(
  lat: number,
  lng: number,
  radiusKm: number = 2
): (Attraction & { distance: number })[] {
  return attractions
    .map((attraction) => ({
      ...attraction,
      distance: calculateDistance(
        lat,
        lng,
        attraction.coordinates.lat,
        attraction.coordinates.lng
      ),
    }))
    .filter((a) => a.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}
