import type { ProjectDefinition } from '../types/site';

const mapperBaseUrl = 'http://localhost:5173';

const mapperProject: ProjectDefinition = {
  slug: 'mapper',
  name: 'Mapper',
  tagline: 'Travel, memory, and media inside a themed map UI',
  summary:
    'A map-first personal platform for trips, places, albums, profiles, and media, with multiple cartographic themes and room for owner-only views.',
  description:
    'Mapper is the anchor project for this portfolio. It combines travel planning, photo organization, profile widgets, and themed cartography into one interface designed to feel deliberate rather than generic.',
  status: 'live',
  year: '2026',
  stack: ['React', 'TypeScript', 'Vite', 'Zustand', 'Leaflet'],
  tags: ['mapping', 'portfolio', 'media', 'travel'],
  repoUrl: 'https://github.com/',
  liveUrl: mapperBaseUrl,
  embedModeQuery: 'embed=1',
  themeHint: 'voyager',
  featured: true,
  tabs: [
    {
      id: 'overview',
      label: 'Overview',
      type: 'content',
      title: 'Why it exists',
      description: 'Mapper is both a utility and a showcase piece.',
      content: [
        'Map-driven travel storytelling with trips, places, and albums.',
        'A shared theme language that inspired this website.',
        'An architecture that can eventually expose owner-only media and admin controls.',
      ],
    },
    {
      id: 'live',
      label: 'Live Widget',
      type: 'embed',
      title: 'Embedded application',
      description: 'The first version is integrated as an iframe-driven widget container.',
      embedUrl: `${mapperBaseUrl}?embed=1`,
      embedHeight: 720,
      ctaLabel: 'Open Mapper full screen',
    },
    {
      id: 'photos',
      label: 'My Photos',
      type: 'embed',
      title: 'Owner-only media view',
      description: 'When logged in as owner, this tab can surface the Mapper photos experience.',
      embedUrl: `${mapperBaseUrl}/photos?embed=1`,
      embedHeight: 720,
      ownerOnly: true,
      ctaLabel: 'Open private photos',
    },
    {
      id: 'notes',
      label: 'Build Notes',
      type: 'content',
      title: 'Key traits',
      description: 'A few things the project is optimized for.',
      content: [
        'Theme-aware UI inspired by cartographic products.',
        'A portfolio-ready shell for embedding inside this website.',
        'Modular enough to keep adding pages, widgets, and private functionality.',
        'Prepared for a future dedicated embed route that hides Mapper navigation and chrome.',
      ],
    },
  ],
};

const portfolioProject: ProjectDefinition = {
  slug: 'personalweb',
  name: 'PersonalWeb',
  tagline: 'A CV, project launcher, and owner dashboard in one shell',
  summary:
    'The website you are building now: themeable, modular, and ready to host projects, embeds, GitHub browsing, and future admin workflows.',
  description:
    'PersonalWeb is intentionally structured around registries and reusable sections so it keeps scaling as new apps and content arrive. It acts as a public-facing CV while also becoming the private control surface for your own ecosystem.',
  status: 'building',
  year: '2026',
  stack: ['React', 'TypeScript', 'Vite', 'React Router', 'Zustand'],
  tags: ['portfolio', 'cv', 'admin', 'github'],
  themeHint: 'atlas-sand',
  featured: true,
  tabs: [
    {
      id: 'blueprint',
      label: 'Blueprint',
      type: 'content',
      title: 'System approach',
      description: 'Built to make new sections and projects cheap to add.',
      content: [
        'Config-driven navigation and project definitions.',
        'Shared theme options modeled after Mapper.',
        'Public CV pages plus owner-only admin affordances.',
        'Project pages designed to mix content tabs, embeds, and private sections.',
      ],
    },
  ],
};

export const projects: ProjectDefinition[] = [mapperProject, portfolioProject];

export const featuredProjects = projects.filter((project) => project.featured);
