export type CartridgeId =
  | 'home'
  | 'work'
  | 'about'
  | 'contact'
  | 'login'
  | 'studio'
  | 'mapper'
  | 'personalweb'
  | 'quest';

export type BoidPresetId =
  | 'starbirds'
  | 'airships'
  | 'moths'
  | 'lanterns'
  | 'saveRoom'
  | 'debugSprites'
  | 'atlasBirds'
  | 'cartridgeComets'
  | 'questMotes';

export interface CartridgeDefinition {
  id: CartridgeId;
  shellTitle: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  badges: Array<{ label: string; tone: 'teal' | 'yellow' | 'red' | 'blue' }>;
  footer: string;
  boidPreset: BoidPresetId;
  vars: {
    shellTintA: string;
    shellTintB: string;
    shellTintC: string;
    panelStart: string;
    panelEnd: string;
    accent: string;
    accentSoft: string;
    accentAlt: string;
    transitionPrimary: string;
    transitionSecondary: string;
  };
}

export const cartridges: Record<CartridgeId, CartridgeDefinition> = {
  home: {
    id: 'home',
    shellTitle: 'Dream Cartridge',
    heroEyebrow: 'start screen / dream meadow',
    heroTitle: 'A glowing start menu for the whole pixel universe',
    heroDescription: 'Soft stars, magical hills, and a welcoming cartridge shell for the wider project world.',
    badges: [
      { label: 'star-birds', tone: 'yellow' },
      { label: 'title screen', tone: 'teal' },
    ],
    footer: 'Dream cartridge loaded // start screen active',
    boidPreset: 'starbirds',
    vars: {
      shellTintA: 'rgba(188, 74, 155, 0.16)',
      shellTintB: 'rgba(32, 214, 199, 0.12)',
      shellTintC: 'rgba(255, 213, 65, 0.12)',
      panelStart: 'rgba(185, 191, 251, 0.1)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-yellow)',
      accentSoft: 'rgba(255, 213, 65, 0.18)',
      accentAlt: 'var(--signal-teal)',
      transitionPrimary: 'var(--signal-yellow)',
      transitionSecondary: 'var(--signal-teal)',
    },
  },
  work: {
    id: 'work',
    shellTitle: 'Quest Map Cartridge',
    heroEyebrow: 'world select / quest board',
    heroTitle: 'A stage select full of project worlds and hidden routes',
    heroDescription: 'Portal gates, level plaques, and a bigger overworld feeling for exploring the work.',
    badges: [
      { label: 'airships', tone: 'blue' },
      { label: 'world map', tone: 'yellow' },
    ],
    footer: 'Quest board active // choose a project world',
    boidPreset: 'airships',
    vars: {
      shellTintA: 'rgba(250, 106, 10, 0.14)',
      shellTintB: 'rgba(255, 213, 65, 0.12)',
      shellTintC: 'rgba(32, 214, 199, 0.1)',
      panelStart: 'rgba(255, 213, 65, 0.08)',
      panelEnd: 'rgba(27, 27, 47, 0.94)',
      accent: 'var(--aap-orange)',
      accentSoft: 'rgba(250, 106, 10, 0.2)',
      accentAlt: 'var(--signal-yellow)',
      transitionPrimary: 'var(--aap-orange)',
      transitionSecondary: 'var(--signal-yellow)',
    },
  },
  about: {
    id: 'about',
    shellTitle: 'Memory Garden Cartridge',
    heroEyebrow: 'player profile / observatory garden',
    heroTitle: 'A softer profile world full of signals, memories, and constellations',
    heroDescription: 'The introspective cartridge: slower, quieter, and more reflective than the rest of the site.',
    badges: [
      { label: 'moths', tone: 'blue' },
      { label: 'constellations', tone: 'teal' },
    ],
    footer: 'Memory garden active // profile signals online',
    boidPreset: 'moths',
    vars: {
      shellTintA: 'rgba(185, 191, 251, 0.16)',
      shellTintB: 'rgba(32, 214, 199, 0.1)',
      shellTintC: 'rgba(113, 65, 59, 0.12)',
      panelStart: 'rgba(185, 191, 251, 0.1)',
      panelEnd: 'rgba(27, 27, 47, 0.94)',
      accent: 'var(--aap-lavender)',
      accentSoft: 'rgba(185, 191, 251, 0.18)',
      accentAlt: 'var(--signal-teal)',
      transitionPrimary: 'var(--aap-lavender)',
      transitionSecondary: 'var(--signal-teal)',
    },
  },
  contact: {
    id: 'contact',
    shellTitle: 'Signal Tower Cartridge',
    heroEyebrow: 'co-op lobby / beacon tower',
    heroTitle: 'A warm summoning world for messages, invites, and collaboration',
    heroDescription: 'Lanterns, signal kites, and a brighter call-to-action driven cartridge.',
    badges: [
      { label: 'lantern wisps', tone: 'yellow' },
      { label: 'signal tower', tone: 'red' },
    ],
    footer: 'Signal tower active // co-op lobby open',
    boidPreset: 'lanterns',
    vars: {
      shellTintA: 'rgba(223, 62, 35, 0.14)',
      shellTintB: 'rgba(255, 213, 65, 0.12)',
      shellTintC: 'rgba(188, 74, 155, 0.08)',
      panelStart: 'rgba(255, 213, 65, 0.08)',
      panelEnd: 'rgba(27, 27, 47, 0.94)',
      accent: 'var(--signal-red)',
      accentSoft: 'rgba(223, 62, 35, 0.18)',
      accentAlt: 'var(--signal-yellow)',
      transitionPrimary: 'var(--signal-red)',
      transitionSecondary: 'var(--signal-yellow)',
    },
  },
  login: {
    id: 'login',
    shellTitle: 'Save Room Cartridge',
    heroEyebrow: 'hidden chamber / key gate',
    heroTitle: 'A quiet save room before the private workshop',
    heroDescription: 'Calm, secretive, and lower energy than the public worlds.',
    badges: [
      { label: 'save crystal', tone: 'blue' },
      { label: 'secret gate', tone: 'teal' },
    ],
    footer: 'Save room active // key gate waiting',
    boidPreset: 'saveRoom',
    vars: {
      shellTintA: 'rgba(40, 92, 196, 0.14)',
      shellTintB: 'rgba(185, 191, 251, 0.12)',
      shellTintC: 'rgba(32, 214, 199, 0.08)',
      panelStart: 'rgba(40, 92, 196, 0.1)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-blue)',
      accentSoft: 'rgba(40, 92, 196, 0.18)',
      accentAlt: 'var(--aap-lavender)',
      transitionPrimary: 'var(--signal-blue)',
      transitionSecondary: 'var(--aap-lavender)',
    },
  },
  studio: {
    id: 'studio',
    shellTitle: 'Debug Workshop Cartridge',
    heroEyebrow: 'maker room / dev workshop',
    heroTitle: 'Private tools, prototypes, and backstage controls',
    heroDescription: 'Still playful, but with a more technical workshop atmosphere.',
    badges: [
      { label: 'debug sprites', tone: 'teal' },
      { label: 'maker room', tone: 'yellow' },
    ],
    footer: 'Workshop active // backstage mode enabled',
    boidPreset: 'debugSprites',
    vars: {
      shellTintA: 'rgba(89, 193, 53, 0.12)',
      shellTintB: 'rgba(32, 214, 199, 0.12)',
      shellTintC: 'rgba(255, 213, 65, 0.08)',
      panelStart: 'rgba(89, 193, 53, 0.08)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-green)',
      accentSoft: 'rgba(89, 193, 53, 0.18)',
      accentAlt: 'var(--signal-teal)',
      transitionPrimary: 'var(--signal-green)',
      transitionSecondary: 'var(--signal-teal)',
    },
  },
  mapper: {
    id: 'mapper',
    shellTitle: 'Atlas Ruins Cartridge',
    heroEyebrow: 'map world / atlas ruins',
    heroTitle: 'A cartographic sky-world full of routes, memory, and media',
    heroDescription: 'An atmospheric mini-cartridge shaped around maps, travel, and spatial browsing.',
    badges: [
      { label: 'atlas gulls', tone: 'teal' },
      { label: 'map relics', tone: 'blue' },
    ],
    footer: 'Atlas ruins active // cartographic mode engaged',
    boidPreset: 'atlasBirds',
    vars: {
      shellTintA: 'rgba(32, 214, 199, 0.12)',
      shellTintB: 'rgba(40, 92, 196, 0.14)',
      shellTintC: 'rgba(219, 164, 99, 0.08)',
      panelStart: 'rgba(32, 214, 199, 0.1)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-teal)',
      accentSoft: 'rgba(32, 214, 199, 0.18)',
      accentAlt: 'var(--signal-blue)',
      transitionPrimary: 'var(--signal-teal)',
      transitionSecondary: 'var(--signal-blue)',
    },
  },
  personalweb: {
    id: 'personalweb',
    shellTitle: 'Meta Cartridge',
    heroEyebrow: 'signal temple / cartridge castle',
    heroTitle: 'A cartridge about building the cartridge itself',
    heroDescription: 'The most self-referential world in the set: UI systems, routing, and stylized shell design.',
    badges: [
      { label: 'cartridge comets', tone: 'red' },
      { label: 'signal temple', tone: 'yellow' },
    ],
    footer: 'Meta cartridge active // shell within shell detected',
    boidPreset: 'cartridgeComets',
    vars: {
      shellTintA: 'rgba(188, 74, 155, 0.16)',
      shellTintB: 'rgba(255, 213, 65, 0.12)',
      shellTintC: 'rgba(185, 191, 251, 0.08)',
      panelStart: 'rgba(188, 74, 155, 0.1)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--aap-magenta)',
      accentSoft: 'rgba(188, 74, 155, 0.2)',
      accentAlt: 'var(--signal-yellow)',
      transitionPrimary: 'var(--aap-magenta)',
      transitionSecondary: 'var(--signal-yellow)',
    },
  },
  quest: {
    id: 'quest',
    shellTitle: 'Quest World Cartridge',
    heroEyebrow: 'mystery world / dossier',
    heroTitle: 'A floating side-world inside the project archive',
    heroDescription: 'Default mini-cartridge styling for project pages without a dedicated custom theme.',
    badges: [
      { label: 'quest motes', tone: 'yellow' },
      { label: 'side world', tone: 'teal' },
    ],
    footer: 'Quest world active // dossier view loaded',
    boidPreset: 'questMotes',
    vars: {
      shellTintA: 'rgba(255, 213, 65, 0.12)',
      shellTintB: 'rgba(32, 214, 199, 0.1)',
      shellTintC: 'rgba(188, 74, 155, 0.08)',
      panelStart: 'rgba(255, 213, 65, 0.08)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-yellow)',
      accentSoft: 'rgba(255, 213, 65, 0.18)',
      accentAlt: 'var(--signal-teal)',
      transitionPrimary: 'var(--signal-yellow)',
      transitionSecondary: 'var(--signal-teal)',
    },
  },
};

export const getCartridgeIdFromPath = (pathname: string): CartridgeId => {
  if (pathname === '/') return 'home';
  if (pathname === '/work') return 'work';
  if (pathname === '/about') return 'about';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/login') return 'login';
  if (pathname === '/studio' || pathname === '/admin') return 'studio';
  if (pathname.startsWith('/work/mapper') || pathname.startsWith('/projects/mapper')) return 'mapper';
  if (pathname.startsWith('/work/personalweb') || pathname.startsWith('/projects/personalweb')) return 'personalweb';
  if (pathname.startsWith('/work/') || pathname.startsWith('/projects/')) return 'quest';

  return 'home';
};

export const getCartridgeByPath = (pathname: string) => cartridges[getCartridgeIdFromPath(pathname)];
