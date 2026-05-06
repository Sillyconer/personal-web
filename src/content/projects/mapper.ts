import type { ProjectDefinition } from '../../types/site';

const mapperBaseUrl = 'http://localhost:5173';

export const mapperProject: ProjectDefinition = {
  slug: 'mapper',
  name: 'Mapper',
  tagline: 'A travel and media platform shaped around cartography instead of generic dashboards.',
  summary:
    'Mapper is the flagship ecosystem product: a map-first surface for places, trips, albums, and owner-only media experiences.',
  description:
    'The product explores how maps, memory, and content can live inside one interface without collapsing into an admin tool or a slideshow. It is both a useful application and the visual reference point for the wider ecosystem.',
  status: 'live',
  year: '2026',
  type: 'platform',
  roles: ['Product direction', 'Frontend architecture', 'Visual system'],
  services: ['UX structure', 'React implementation', 'Theme system'],
  idealFor: ['Map-heavy products', 'Media libraries', 'Member-only tools'],
  stack: ['React', 'TypeScript', 'Vite', 'Zustand', 'Leaflet'],
  tags: ['mapping', 'media', 'travel', 'ecosystem'],
  links: [
    { label: 'Launch live surface', href: mapperBaseUrl, external: true, kind: 'live' },
    { label: 'Source repository', href: 'https://github.com/', external: true, kind: 'repo' },
    {
      label: 'Open private photos',
      href: `${mapperBaseUrl}/photos?embed=1`,
      external: true,
      ownerOnly: true,
      kind: 'demo',
    },
  ],
  themeHint: 'voyager',
  outcome: 'A credible anchor product that proves the ecosystem can host real interfaces, not just static portfolio pages.',
  metrics: [
    { label: 'Primary mode', value: 'Map-first', detail: 'Navigation and storytelling are anchored around geography.' },
    { label: 'UI character', value: 'Theme-aware', detail: 'Cartographic moods guide color, contrast, and interaction tone.' },
    { label: 'Expansion path', value: 'Owner-ready', detail: 'Prepared for protected media and admin-only surfaces.' },
  ],
  featured: true,
  sections: [
    {
      id: 'context',
      type: 'narrative',
      title: 'Why the project matters',
      description: 'Mapper is the clearest expression of the ecosystem direction.',
      paragraphs: [
        'Instead of treating travel memories, location data, and media as separate experiences, Mapper pulls them into one map-led interface. The product direction is to make browsing feel spatial and authored rather than file-system driven.',
        'For the portfolio, it functions as a flagship case study: it shows how design language, technical structure, and future private tooling can all grow from one core concept.',
      ],
    },
    {
      id: 'decisions',
      type: 'bullets',
      title: 'Key product decisions',
      description: 'The project is optimized around a few strong choices instead of trying to be everything at once.',
      items: [
        'Use the map as the primary orientation layer, not a decorative side panel.',
        'Keep the visual language atmospheric so the product feels closer to an authored tool than a default SaaS dashboard.',
        'Treat owner-only views as a first-class future requirement rather than bolting them on later.',
      ],
    },
    {
      id: 'signals',
      type: 'metrics',
      title: 'Signals worth showing in the case study',
      description: 'The project demonstrates a balance of product thinking, frontend architecture, and visual consistency.',
      metrics: [
        { label: 'Experience model', value: 'Trips + places + albums', detail: 'Related information stays connected instead of fragmented.' },
        { label: 'Embed readiness', value: 'Designed for it', detail: 'Prepared for dedicated embed routes inside PersonalWeb.' },
        { label: 'Private surface path', value: 'Planned early', detail: 'Owner-only content is part of the architecture direction.' },
      ],
    },
    {
      id: 'slices',
      type: 'gallery',
      title: 'System slices',
      description: 'These are the moments the portfolio should eventually illustrate with screenshots or short videos.',
      items: [
        {
          eyebrow: 'Exploration',
          title: 'Map-led discovery',
          description: 'A surface where browsing places and stories feels spatial first, not folder first.',
        },
        {
          eyebrow: 'Atmosphere',
          title: 'Cartographic theme system',
          description: 'Modes shift the mood of the interface while keeping layout and usability stable.',
        },
        {
          eyebrow: 'Future path',
          title: 'Owner media workflows',
          description: 'Private galleries and protected content can slot into the same system without breaking the public shell.',
        },
      ],
    },
    {
      id: 'embed',
      type: 'embed',
      title: 'Embedded live surface',
      description: 'The current embed proves the integration path while a production-safe route is still pending.',
      embedUrl: `${mapperBaseUrl}?embed=1`,
      embedHeight: 720,
      ctaLabel: 'Open Mapper full screen',
    },
    {
      id: 'private-photos',
      type: 'embed',
      title: 'Private owner media surface',
      description: 'This section is reserved for the authenticated studio flow and future protected content.',
      embedUrl: `${mapperBaseUrl}/photos?embed=1`,
      embedHeight: 720,
      ownerOnly: true,
      ctaLabel: 'Open private photos',
    },
  ],
};
