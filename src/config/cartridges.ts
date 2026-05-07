export type CartridgeId =
  | 'home'
  | 'work'
  | 'story'
  | 'arcade'
  | 'about'
  | 'contact'
  | 'login'
  | 'studio'
  | 'mapper'
  | 'personalweb'
  | 'quest';

export type BoidPresetId =
  | 'starbirds'
  | 'zeldaFairies'
  | 'chronoWisps'
  | 'minecraftBits'
  | 'pokeOrbs'
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
  badges: Array<{ label: string; tone: 'teal' | 'yellow' | 'red' | 'blue' | 'green' }>;
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
    shellTitle: 'Dungeon Cartridge',
    heroEyebrow: 'dungeon archive / torchlit chambers',
    heroTitle: 'A Zelda-style archive of relics, doors, and project chambers',
    heroDescription: 'Stone interfaces, lantern light, treasure-room pacing, and project pages treated like hidden rooms.',
    badges: [
      { label: 'fairies', tone: 'teal' },
      { label: 'keys + maps', tone: 'yellow' },
    ],
    footer: 'Dungeon cartridge active // project chambers unlocked',
    boidPreset: 'zeldaFairies',
    vars: {
      shellTintA: 'rgba(255, 213, 65, 0.12)',
      shellTintB: 'rgba(32, 214, 199, 0.1)',
      shellTintC: 'rgba(113, 65, 59, 0.14)',
      panelStart: 'rgba(255, 213, 65, 0.08)',
      panelEnd: 'rgba(20, 16, 19, 0.96)',
      accent: 'var(--signal-yellow)',
      accentSoft: 'rgba(255, 213, 65, 0.18)',
      accentAlt: 'var(--signal-teal)',
      transitionPrimary: 'var(--signal-yellow)',
      transitionSecondary: 'var(--signal-teal)',
    },
  },
  story: {
    id: 'story',
    shellTitle: 'Time Gate Cartridge',
    heroEyebrow: 'chrono archive / personal timeline',
    heroTitle: 'A Chrono Trigger-inspired story world split across past, present, and future',
    heroDescription: 'Time gates, glowing eras, and a more narrative explanation of who you are and how the work evolved.',
    badges: [
      { label: 'time wisps', tone: 'blue' },
      { label: 'era gates', tone: 'teal' },
    ],
    footer: 'Time gate cartridge active // chronology aligned',
    boidPreset: 'chronoWisps',
    vars: {
      shellTintA: 'rgba(185, 191, 251, 0.16)',
      shellTintB: 'rgba(32, 214, 199, 0.12)',
      shellTintC: 'rgba(188, 74, 155, 0.12)',
      panelStart: 'rgba(185, 191, 251, 0.1)',
      panelEnd: 'rgba(27, 27, 47, 0.94)',
      accent: 'var(--aap-lavender)',
      accentSoft: 'rgba(185, 191, 251, 0.18)',
      accentAlt: 'var(--signal-teal)',
      transitionPrimary: 'var(--aap-lavender)',
      transitionSecondary: 'var(--signal-teal)',
    },
  },
  about: {
    id: 'about',
    shellTitle: 'Time Gate Cartridge',
    heroEyebrow: 'chrono archive / personal timeline',
    heroTitle: 'A Chrono Trigger-inspired story world split across past, present, and future',
    heroDescription: 'Legacy alias for the story cartridge.',
    badges: [
      { label: 'time wisps', tone: 'blue' },
      { label: 'era gates', tone: 'teal' },
    ],
    footer: 'Time gate cartridge active // chronology aligned',
    boidPreset: 'chronoWisps',
    vars: {
      shellTintA: 'rgba(185, 191, 251, 0.16)',
      shellTintB: 'rgba(32, 214, 199, 0.12)',
      shellTintC: 'rgba(188, 74, 155, 0.12)',
      panelStart: 'rgba(185, 191, 251, 0.1)',
      panelEnd: 'rgba(27, 27, 47, 0.94)',
      accent: 'var(--aap-lavender)',
      accentSoft: 'rgba(185, 191, 251, 0.18)',
      accentAlt: 'var(--signal-teal)',
      transitionPrimary: 'var(--aap-lavender)',
      transitionSecondary: 'var(--signal-teal)',
    },
  },
  arcade: {
    id: 'arcade',
    shellTitle: 'Block Craft Cartridge',
    heroEyebrow: 'minecraft homage / public build board',
    heroTitle: 'A playful little block world to build in and leave local messages',
    heroDescription: 'A technical toy cartridge: place blocks, leave signs, and show off interaction design and persistence.',
    badges: [
      { label: 'voxel sparks', tone: 'green' },
      { label: 'craft + build', tone: 'yellow' },
    ],
    footer: 'Block craft cartridge active // chunks loaded',
    boidPreset: 'minecraftBits',
    vars: {
      shellTintA: 'rgba(89, 193, 53, 0.18)',
      shellTintB: 'rgba(219, 164, 99, 0.12)',
      shellTintC: 'rgba(40, 92, 196, 0.08)',
      panelStart: 'rgba(89, 193, 53, 0.1)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-green)',
      accentSoft: 'rgba(89, 193, 53, 0.2)',
      accentAlt: 'var(--aap-tan)',
      transitionPrimary: 'var(--signal-green)',
      transitionSecondary: 'var(--aap-tan)',
    },
  },
  contact: {
    id: 'contact',
    shellTitle: 'Link Center Cartridge',
    heroEyebrow: 'pokemon homage / connect terminal',
    heroTitle: 'A playful communication world for reaching out and making contact',
    heroDescription: 'Trainer-card energy, link-center signals, and a brighter route for collaboration and outreach.',
    badges: [
      { label: 'party orbs', tone: 'yellow' },
      { label: 'link signals', tone: 'red' },
    ],
    footer: 'Link center active // communication channel open',
    boidPreset: 'pokeOrbs',
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
    shellTitle: 'Temple Map Cartridge',
    heroEyebrow: 'zelda homage / cartographic dungeon',
    heroTitle: 'A Zelda-inspired map world built around routes, relics, and hidden chambers',
    heroDescription: 'Dungeon cartography, puzzle-like navigation, and an adventure tone for the flagship map project.',
    badges: [
      { label: 'fairy guides', tone: 'teal' },
      { label: 'dungeon relics', tone: 'yellow' },
    ],
    footer: 'Temple map active // dungeon routes revealed',
    boidPreset: 'atlasBirds',
    vars: {
      shellTintA: 'rgba(255, 213, 65, 0.12)',
      shellTintB: 'rgba(32, 214, 199, 0.1)',
      shellTintC: 'rgba(113, 65, 59, 0.1)',
      panelStart: 'rgba(255, 213, 65, 0.08)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-yellow)',
      accentSoft: 'rgba(255, 213, 65, 0.18)',
      accentAlt: 'var(--signal-teal)',
      transitionPrimary: 'var(--signal-yellow)',
      transitionSecondary: 'var(--signal-teal)',
    },
  },
  personalweb: {
    id: 'personalweb',
    shellTitle: 'Versus Cabinet Cartridge',
    heroEyebrow: 'street fighter homage / versus shell',
    heroTitle: 'An arcade cabinet tribute for the project building the whole system',
    heroDescription: 'Bold framing, versus energy, and showmanship for the portfolio shell itself.',
    badges: [
      { label: 'versus sparks', tone: 'red' },
      { label: 'arcade shell', tone: 'yellow' },
    ],
    footer: 'Versus cabinet active // round one',
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
  if (pathname === '/story') return 'story';
  if (pathname === '/arcade') return 'arcade';
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
