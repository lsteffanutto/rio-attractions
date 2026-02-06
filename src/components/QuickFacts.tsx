/**
 * Quick Facts Component
 *
 * Displays interesting facts about Rio de Janeiro.
 * This component is shown in a modal when users click "Quick Facts".
 *
 * Purpose:
 * - Provides cultural context for visitors
 * - Enhances the educational value of the app
 * - Adds engagement beyond just the map
 *
 * Content:
 * - General facts about Rio
 * - Tips for tourists
 * - Cultural information
 * - Practical travel advice
 */

import {
  Users,
  Mountain,
  Sun,
  Music,
  Globe,
  Coffee,
  Heart,
  Calendar,
  Banknote,
  Clock,
  Shield,
  Languages,
  Utensils,
  Palmtree,
} from 'lucide-react';
import { cn } from '../utils/helpers';

// ============================================================================
// DATA
// ============================================================================

/**
 * Facts about Rio de Janeiro
 *
 * Each fact has an icon, title, and description.
 * Organized into categories for easy scanning.
 */
const facts = [
  {
    icon: Users,
    title: 'Population',
    value: '6.7 million',
    description: 'Second largest city in Brazil, known as "Cidade Maravilhosa" (Marvelous City)',
  },
  {
    icon: Mountain,
    title: 'Geography',
    value: 'Sea level to 1,024m',
    description: 'Built between mountains and sea, creating stunning natural scenery',
  },
  {
    icon: Sun,
    title: 'Climate',
    value: '25-35°C year-round',
    description: 'Tropical climate with warm temperatures throughout the year',
  },
  {
    icon: Music,
    title: 'Carnival',
    value: '2 million/day',
    description: 'The world\'s biggest carnival, with over 2 million people celebrating daily',
  },
  {
    icon: Globe,
    title: 'UNESCO Sites',
    value: '2 World Heritage',
    description: 'The city landscape and Carioca Aqueduct are UNESCO protected',
  },
  {
    icon: Coffee,
    title: 'Coffee Culture',
    value: '2nd largest consumer',
    description: 'Brazilians drink about 5.8kg of coffee per person annually',
  },
];

const tips = [
  {
    icon: Clock,
    title: 'Best Time to Visit',
    description: 'December to March for summer, but September to November offers lower prices and fewer crowds.',
  },
  {
    icon: Banknote,
    title: 'Currency',
    description: 'Brazilian Real (BRL). Credit cards widely accepted, but carry cash for markets and small vendors.',
  },
  {
    icon: Languages,
    title: 'Language',
    description: 'Portuguese is the official language. English is spoken in tourist areas but learning basic Portuguese helps.',
  },
  {
    icon: Shield,
    title: 'Safety Tips',
    description: 'Stay in well-lit areas, avoid displaying expensive items, and use registered taxis or ride apps.',
  },
  {
    icon: Utensils,
    title: 'Must-Try Foods',
    description: 'Feijoada (bean stew), Açaí, Pão de Queijo, Coxinha, and fresh tropical fruits.',
  },
  {
    icon: Palmtree,
    title: 'Beach Culture',
    description: 'Beaches are divided into "postos" (stations). Each has its own vibe and crowd.',
  },
];

const culturalNotes = [
  'Cariocas (Rio locals) are known for their warm, friendly demeanor',
  'Personal space is smaller than in Western countries - close conversations are normal',
  'Tipping is not mandatory but 10% is appreciated at restaurants',
  'Sundays are for family - many shops close and beaches fill up',
  'Dress code is casual everywhere except upscale restaurants',
  '"Jeitinho" is the art of finding creative solutions - embrace flexibility!',
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function QuickFacts() {
  return (
    <div className="p-6">
      {/**
       * Header Section
       *
       * Title with decorative gradient text.
       */}
      <header className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold">
          <span className="gradient-text">Quick Facts</span> about Rio de Janeiro
        </h2>
        <p className="text-gray-600">
          Everything you need to know for your visit to the Marvelous City
        </p>
      </header>

      {/**
       * Facts Grid
       *
       * Key statistics about Rio displayed in a grid.
       */}
      <section className="mb-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Heart className="h-5 w-5 text-carnival-pink" />
          Rio at a Glance
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div
                key={index}
                className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rio-green/10">
                    <Icon className="h-5 w-5 text-rio-green" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{fact.title}</h4>
                    <p className="text-lg font-bold text-rio-green">{fact.value}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{fact.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/**
       * Travel Tips Section
       *
       * Practical advice for tourists.
       */}
      <section className="mb-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Shield className="h-5 w-5 text-beach-ocean" />
          Travel Tips
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className="flex gap-3 rounded-lg border border-gray-100 bg-white p-4"
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-beach-ocean" />
                <div>
                  <h4 className="font-medium text-gray-900">{tip.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/**
       * Cultural Notes Section
       *
       * Tips for understanding local culture.
       */}
      <section className="mb-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Calendar className="h-5 w-5 text-carnival-orange" />
          Cultural Notes
        </h3>
        <ul className="space-y-2">
          {culturalNotes.map((note, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm text-gray-700"
            >
              <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-carnival-orange/10 text-xs font-bold text-carnival-orange">
                {index + 1}
              </span>
              {note}
            </li>
          ))}
        </ul>
      </section>

      {/**
       * Emergency Contacts
       *
       * Important numbers for tourists.
       */}
      <section className="rounded-lg bg-red-50 p-4">
        <h3 className="mb-3 font-semibold text-red-800">Emergency Contacts</h3>
        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <span className="font-medium text-red-700">Police:</span>{' '}
            <span className="text-red-900">190</span>
          </div>
          <div>
            <span className="font-medium text-red-700">Ambulance:</span>{' '}
            <span className="text-red-900">192</span>
          </div>
          <div>
            <span className="font-medium text-red-700">Fire:</span>{' '}
            <span className="text-red-900">193</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-red-600">
          Tourist Police: +55 21 2332-2924 (English speakers available)
        </p>
      </section>
    </div>
  );
}
