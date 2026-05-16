export type CartridgeId =
  | 'home'
  | 'cv'
  | 'work'
  | 'playground'
  | 'pokemon'
  | 'zelda'
  | 'chrono'
  | 'minecraft'
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
    shellTitle: 'Work Terminal',
    heroEyebrow: 'portfolio / proof surfaces',
    heroTitle: 'A calm project index with embeds, code views, and system evidence',
    heroDescription: 'Professional portfolio pages keep the CRT texture while prioritising case studies, live surfaces, and implementation detail.',
    badges: [
      { label: 'embeds', tone: 'teal' },
      { label: 'case studies', tone: 'yellow' },
    ],
    footer: 'Work terminal active // project evidence loaded',
    boidPreset: 'questMotes',
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
  cv: {
    id: 'cv',
    shellTitle: 'CV Terminal',
    heroEyebrow: 'cv / professional signal',
    heroTitle: 'A cleaner CV surface with light CRT texture',
    heroDescription: 'Readable background, capability, and collaboration fit without the heavier homage framing.',
    badges: [
      { label: 'profile', tone: 'teal' },
      { label: 'capability', tone: 'yellow' },
    ],
    footer: 'CV terminal active // professional profile loaded',
    boidPreset: 'saveRoom',
    vars: {
      shellTintA: 'rgba(32, 214, 199, 0.08)',
      shellTintB: 'rgba(185, 191, 251, 0.08)',
      shellTintC: 'rgba(255, 213, 65, 0.06)',
      panelStart: 'rgba(32, 214, 199, 0.06)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-teal)',
      accentSoft: 'rgba(32, 214, 199, 0.14)',
      accentAlt: 'var(--signal-yellow)',
      transitionPrimary: 'var(--signal-teal)',
      transitionSecondary: 'var(--signal-yellow)',
    },
  },
  playground: {
    id: 'playground',
    shellTitle: 'Playground Select',
    heroEyebrow: 'world select / homages',
    heroTitle: 'A dedicated space for the custom worlds and visual experiments',
    heroDescription: 'Pokemon, Zelda, Chrono, Minecraft, and future homages live away from the professional portfolio.',
    badges: [
      { label: 'world select', tone: 'yellow' },
      { label: 'experiments', tone: 'teal' },
    ],
    footer: 'Playground active // world select open',
    boidPreset: 'cartridgeComets',
    vars: {
      shellTintA: 'rgba(188, 74, 155, 0.16)',
      shellTintB: 'rgba(32, 214, 199, 0.12)',
      shellTintC: 'rgba(255, 213, 65, 0.12)',
      panelStart: 'rgba(188, 74, 155, 0.1)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--aap-magenta)',
      accentSoft: 'rgba(188, 74, 155, 0.2)',
      accentAlt: 'var(--signal-yellow)',
      transitionPrimary: 'var(--aap-magenta)',
      transitionSecondary: 'var(--signal-yellow)',
    },
  },
  pokemon: {
    id: 'pokemon',
    shellTitle: 'Pokemon Meadow',
    heroEyebrow: 'pokemon homage / sprite meadow',
    heroTitle: 'A sprite meadow and tooling playground',
    heroDescription: 'Interactive Pokemon world, sprite metadata, and editor flow.',
    badges: [
      { label: 'party orbs', tone: 'yellow' },
      { label: 'sprites', tone: 'red' },
    ],
    footer: 'Pokemon meadow active // sprites roaming',
    boidPreset: 'pokeOrbs',
    vars: {
      shellTintA: 'rgba(223, 62, 35, 0.14)',
      shellTintB: 'rgba(255, 213, 65, 0.12)',
      shellTintC: 'rgba(40, 92, 196, 0.1)',
      panelStart: 'rgba(255, 213, 65, 0.08)',
      panelEnd: 'rgba(27, 27, 47, 0.94)',
      accent: 'var(--signal-red)',
      accentSoft: 'rgba(223, 62, 35, 0.18)',
      accentAlt: 'var(--signal-yellow)',
      transitionPrimary: 'var(--signal-red)',
      transitionSecondary: 'var(--signal-yellow)',
    },
  },
  zelda: {
    id: 'zelda',
    shellTitle: 'Dungeon Playground',
    heroEyebrow: 'zelda homage / dungeon scene',
    heroTitle: 'A dedicated dungeon animation and map experiment',
    heroDescription: 'Patrol routes, sprite actors, and click effects live in Playground.',
    badges: [
      { label: 'fairies', tone: 'teal' },
      { label: 'dungeon', tone: 'yellow' },
    ],
    footer: 'Dungeon playground active // homage loaded',
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
  chrono: {
    id: 'chrono',
    shellTitle: 'Time Gate Playground',
    heroEyebrow: 'chrono homage / time gate',
    heroTitle: 'A separated timeline visual concept',
    heroDescription: 'The Chrono-style idea stays as an experiment, while CV content stays calm.',
    badges: [
      { label: 'time wisps', tone: 'blue' },
      { label: 'era gates', tone: 'teal' },
    ],
    footer: 'Time gate playground active // eras aligned',
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
  minecraft: {
    id: 'minecraft',
    shellTitle: 'Block Craft Playground',
    heroEyebrow: 'minecraft homage / public build board',
    heroTitle: 'A playful little block world to build in',
    heroDescription: 'A technical toy cartridge: place blocks, leave signs, and show interaction persistence.',
    badges: [
      { label: 'voxel sparks', tone: 'green' },
      { label: 'craft + build', tone: 'yellow' },
    ],
    footer: 'Block craft playground active // chunks loaded',
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
    shellTitle: 'Contact Terminal',
    heroEyebrow: 'contact / collaboration channel',
    heroTitle: 'A clean route for starting a focused conversation',
    heroDescription: 'Professional contact details with a little CRT texture and no full-screen homage layer.',
    badges: [
      { label: 'email', tone: 'teal' },
      { label: 'availability', tone: 'yellow' },
    ],
    footer: 'Contact terminal active // communication channel open',
    boidPreset: 'saveRoom',
    vars: {
      shellTintA: 'rgba(32, 214, 199, 0.1)',
      shellTintB: 'rgba(255, 213, 65, 0.08)',
      shellTintC: 'rgba(185, 191, 251, 0.08)',
      panelStart: 'rgba(32, 214, 199, 0.06)',
      panelEnd: 'rgba(20, 16, 19, 0.94)',
      accent: 'var(--signal-teal)',
      accentSoft: 'rgba(32, 214, 199, 0.16)',
      accentAlt: 'var(--signal-yellow)',
      transitionPrimary: 'var(--signal-teal)',
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
  if (pathname === '/cv' || pathname === '/about' || pathname === '/story') return 'cv';
  if (pathname === '/work') return 'work';
  if (pathname === '/playground') return 'playground';
  if (pathname.startsWith('/playground/pokemon') || pathname === '/editor') return 'pokemon';
  if (pathname.startsWith('/playground/zelda')) return 'zelda';
  if (pathname.startsWith('/playground/chrono')) return 'chrono';
  if (pathname.startsWith('/playground/minecraft') || pathname === '/arcade') return 'minecraft';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/login') return 'login';
  if (pathname === '/studio' || pathname === '/admin') return 'studio';
  if (pathname.startsWith('/work/') || pathname.startsWith('/projects/')) return 'quest';

  return 'home';
};

export const getCartridgeByPath = (pathname: string) => cartridges[getCartridgeIdFromPath(pathname)];
