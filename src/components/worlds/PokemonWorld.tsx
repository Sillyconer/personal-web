import { useEffect, useRef, useState } from 'react';

import overworldSheet from '../../assets/pokemon/overworld_sprites.png';
import './PokemonWorld.css';

const SEASON_NAMES = ['spring', 'summer', 'autumn', 'winter'] as const;
const SOURCE_IMAGE_LOADERS = import.meta.glob('../../../sourceimages/{spring,summer,autumn,winter}/**/*.png', {
  import: 'default',
  query: '?url',
}) as Record<string, () => Promise<string>>;
const ROOT_IMAGE_LOADERS = import.meta.glob(
  [
    '../../../sourceimages/{michi02a,michi03a,michi02b,michi03b}.png',
    '../../../sourceimages/r01_{sp,su,au,wi}_{01,02,04}.png',
    '../../../sourceimages/{h04_pole_1,h04_hikari_1,in66_light02,light_1}.png',
    '../../../sourceimages/{bench,nagaisu,saku01a,saku_001,fence_01,c01saku,out07saku,c13_saku01,c13_saku02}.png',
    '../../../sourceimages/{rock01,rock02,in30_rock01}.png',
  ],
  {
    import: 'default',
    query: '?url',
  },
) as Record<string, () => Promise<string>>;

type SeasonName = (typeof SEASON_NAMES)[number];

const SEASON_TREE_TEXTURES: Record<SeasonName, string[]> = {
  autumn: ['ki02ax1.png', 'ki02ax.png', 'ki03ax.png'],
  spring: ['ki02ax.png', 'ki02ax1.png', 'ki03ax.png'],
  summer: ['54ki02ax.png', 'ki02ax.png', 'ki03ax.png'],
  winter: ['snow/ki02ax.png', 'snow/ki03ax.png'],
};

const SEASON_TALL_GRASS_TEXTURES: Record<SeasonName, string[]> = {
  autumn: ['ki02bx.png', 'ki02bx1.png'],
  spring: ['ue_grass00.png', 'ki02bx1.png'],
  summer: ['ue_grass00.png', '54ki02bx.png'],
  winter: ['snow/ki02bx.png', 'snow/ki03dx.png'],
};

const SEASON_BASE_GRASS_TEXTURES: Record<SeasonName, string[]> = {
  autumn: ['grass01ax.png'],
  spring: ['grass01ax.png'],
  summer: ['grass01ax.png'],
  winter: ['snow/grass01ax.png'],
};

const SEASON_EDGE_DETAIL_TEXTURES: Record<SeasonName, string[]> = {
  autumn: ['hana01.2.png', 'hana01.1.png', 'ki02dx1.png', 'ue_grass00.png', 'ue_grass01.png', 'kisetu_hana.png'],
  spring: ['hana01_1.png', 'hana01_2.png', 'hana.png', 'ue_grass00.png', 'ue_grass01.png'],
  summer: ['ue_grass00.png', 'ue_grass01.png', 'kisetu_hana.png', 'hana01.2.png', 'hana01.1.png'],
  winter: ['hana01_2.png', 'hana01_1.png', 'ue_grass00.png', 'ue_grass01.png'],
};

type Direction = 'down' | 'left' | 'right' | 'up';
type TileKind = 'grass' | 'path' | 'road' | 'forest';
type DecorKind =
  | 'empty'
  | 'tuft'
  | 'tallGrass'
  | 'flowers'
  | 'smallTree'
  | 'tree'
  | 'grassBlend'
  | 'lantern'
  | 'bench'
  | 'fence'
  | 'rock';
type RoadStyle = 'none' | 'lane' | 'street';
type AssetLoader = () => Promise<string>;

interface SpriteFrame {
  x: number;
  y: number;
}

interface PokemonSprite {
  name: string;
  w: number;
  h: number;
  frames: Record<Direction, SpriteFrame[]>;
}

interface GridPoint {
  x: number;
  y: number;
}

interface SeasonalAssetUrls {
  grass: AssetLoader;
  path: AssetLoader;
  pathAlt: AssetLoader;
  pathStone: AssetLoader;
  pathCrack: AssetLoader;
  ledge: AssetLoader;
  grassTuft: AssetLoader;
  tallGrass: AssetLoader;
  tallGrassPatches: AssetLoader[];
  tallGrassAccents: AssetLoader[];
  flowers: AssetLoader[];
  edgeDetails: AssetLoader[];
  trees: AssetLoader[];
  smallTrees: AssetLoader[];
  forestTiles: AssetLoader[];
  roads: AssetLoader[];
  lanternPoles: AssetLoader[];
  lanternGlows: AssetLoader[];
  benches: AssetLoader[];
  fences: AssetLoader[];
  rocks: AssetLoader[];
}

interface SeasonalMapAssets {
  grass: HTMLImageElement;
  path: HTMLImageElement;
  pathAlt: HTMLImageElement;
  pathStone: HTMLImageElement;
  pathCrack: HTMLImageElement;
  ledge: HTMLImageElement;
  grassTuft: HTMLImageElement;
  tallGrass: HTMLImageElement;
  tallGrassPatches: HTMLImageElement[];
  tallGrassAccents: HTMLImageElement[];
  flowers: HTMLImageElement[];
  edgeDetails: HTMLImageElement[];
  trees: HTMLImageElement[];
  smallTrees: HTMLImageElement[];
  forestTiles: HTMLImageElement[];
  roads: HTMLImageElement[];
  lanternPoles: HTMLImageElement[];
  lanternGlows: HTMLImageElement[];
  benches: HTMLImageElement[];
  fences: HTMLImageElement[];
  rocks: HTMLImageElement[];
}

interface GeneratedMap {
  canvas: HTMLCanvasElement;
  terrain: TileKind[][];
  decor: DecorKind[][];
  walkable: boolean[][];
  spawnCells: GridPoint[];
}

type TallGrassPatchGrid = Array<Array<number | null>>;

interface MapProfile {
  hasPathNetwork: boolean;
  roadStyle: RoadStyle;
  streetAxis: 'horizontal' | 'vertical' | 'cross';
  hasRoadDistrict: boolean;
  hasBuildings: boolean;
  hasLanterns: boolean;
  meadowBiasX: number;
  meadowBiasY: number;
  meadowScale: number;
  propDensity: number;
}

interface BuildingPlacement {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: 'red' | 'blue' | 'green';
  hasSign: boolean;
}

interface WalkingPokemon {
  sprite: PokemonSprite;
  x: number;
  y: number;
  vx: number;
  vy: number;
  frameIndex: number;
  frameTimer: number;
  direction: Direction;
  stateTimer: number;
  walkDuration: number;
  idleDuration: number;
  isIdle: boolean;
}

const TILE = 32;
const MAP_COLS = 32;
const MAP_ROWS = 20;
const MAP_W = MAP_COLS * TILE;
const MAP_H = MAP_ROWS * TILE;
const WALK_SPEED = 0.5;
const FRAME_INTERVAL = 220;
const MIN_WALK = 1600;
const MAX_WALK = 4200;
const MIN_IDLE = 900;
const MAX_IDLE = 2800;
const POKEMON_COUNT = 8;
const DIRECTIONS: Direction[] = ['down', 'left', 'right', 'up'];
const CENTER_PLAZA = { x: 11, y: 7, w: 10, h: 6 };
const ENABLE_SCENIC_BANDS = false;
const ENABLE_PATH_NETWORK = false;
const ENABLE_LOOP_PATHS = false;
const ENABLE_SIDE_POCKETS = false;
const ENABLE_ROAD_EVENT = false;
const ENABLE_BUILDING_EVENT = false;
const ENABLE_DECOR_EVENT = false;
const ENABLE_TALL_GRASS_PATCHES = true;

const DIRECTION_VELOCITY: Record<Direction, { vx: number; vy: number }> = {
  down: { vx: 0, vy: WALK_SPEED },
  left: { vx: -WALK_SPEED, vy: 0 },
  right: { vx: WALK_SPEED, vy: 0 },
  up: { vx: 0, vy: -WALK_SPEED },
};

const frame = (x: number, y: number): SpriteFrame => ({ x, y });

/* Explicit two-frame directional coordinates from the overworld sheet.
   Row order on this sheet is up, down, left, right. Keeping every direction
   listed manually prevents a walker from ever striding into another Pokemon. */
const POKEMON_SPRITES: PokemonSprite[] = [
  {
    name: 'bulbasaur',
    w: 32,
    h: 32,
    frames: {
      up: [frame(0, 0), frame(32, 0)],
      down: [frame(0, 32), frame(32, 32)],
      left: [frame(0, 64), frame(32, 64)],
      right: [frame(0, 96), frame(32, 96)],
    },
  },
  {
    name: 'charmander',
    w: 32,
    h: 32,
    frames: {
      up: [frame(256, 0), frame(288, 0)],
      down: [frame(256, 32), frame(288, 32)],
      left: [frame(256, 64), frame(288, 64)],
      right: [frame(256, 96), frame(288, 96)],
    },
  },
  {
    name: 'charizard',
    w: 32,
    h: 32,
    frames: {
      up: [frame(384, 0), frame(416, 0)],
      down: [frame(384, 32), frame(416, 32)],
      left: [frame(384, 64), frame(416, 64)],
      right: [frame(384, 96), frame(416, 96)],
    },
  },
  {
    name: 'squirtle',
    w: 32,
    h: 32,
    frames: {
      up: [frame(448, 0), frame(480, 0)],
      down: [frame(448, 32), frame(480, 32)],
      left: [frame(448, 64), frame(480, 64)],
      right: [frame(448, 96), frame(480, 96)],
    },
  },
  {
    name: 'pikachu',
    w: 32,
    h: 32,
    frames: {
      up: [frame(576, 128), frame(608, 128)],
      down: [frame(576, 160), frame(608, 160)],
      left: [frame(576, 192), frame(608, 192)],
      right: [frame(576, 224), frame(608, 224)],
    },
  },
  {
    name: 'jigglypuff',
    w: 32,
    h: 32,
    frames: {
      up: [frame(512, 256), frame(544, 256)],
      down: [frame(512, 288), frame(544, 288)],
      left: [frame(512, 320), frame(544, 320)],
      right: [frame(512, 352), frame(544, 352)],
    },
  },
  {
    name: 'clefairy',
    w: 32,
    h: 32,
    frames: {
      up: [frame(576, 256), frame(608, 256)],
      down: [frame(576, 288), frame(608, 288)],
      left: [frame(576, 320), frame(608, 320)],
      right: [frame(576, 352), frame(608, 352)],
    },
  },
  {
    name: 'oddish',
    w: 32,
    h: 32,
    frames: {
      up: [frame(768, 256), frame(800, 256)],
      down: [frame(768, 288), frame(800, 288)],
      left: [frame(768, 320), frame(800, 320)],
      right: [frame(768, 352), frame(800, 352)],
    },
  },
  {
    name: 'meowth',
    w: 32,
    h: 32,
    frames: {
      up: [frame(384, 384), frame(416, 384)],
      down: [frame(384, 416), frame(416, 416)],
      left: [frame(384, 448), frame(416, 448)],
      right: [frame(384, 480), frame(416, 480)],
    },
  },
];

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomInt = (min: number, max: number) => Math.floor(randomRange(min, max + 1));
const randomDirection = () => DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const createGrid = <T,>(value: T) => Array.from({ length: MAP_ROWS }, () => Array.from({ length: MAP_COLS }, () => value));

const weightedPick = <T,>(weightedItems: Array<{ item: T; weight: number }>) => {
  const total = weightedItems.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);
  let roll = Math.random() * total;

  for (const entry of weightedItems) {
    roll -= Math.max(0, entry.weight);
    if (roll <= 0) return entry.item;
  }

  return weightedItems[weightedItems.length - 1].item;
};

const countNeighbors = <T,>(grid: T[][], cellX: number, cellY: number, kind: T) => {
  let count = 0;

  for (let y = cellY - 1; y <= cellY + 1; y += 1) {
    for (let x = cellX - 1; x <= cellX + 1; x += 1) {
      if (x === cellX && y === cellY) continue;
      if (grid[y]?.[x] === kind) count += 1;
    }
  }

  return count;
};

const countTerrainNeighbors = (terrain: TileKind[][], cellX: number, cellY: number, kinds: TileKind[]) => {
  let count = 0;

  for (let y = cellY - 1; y <= cellY + 1; y += 1) {
    for (let x = cellX - 1; x <= cellX + 1; x += 1) {
      if (x === cellX && y === cellY) continue;
      if (terrain[y]?.[x] && kinds.includes(terrain[y][x])) count += 1;
    }
  }

  return count;
};

const seasonEntries = (season: SeasonName) =>
  Object.entries(SOURCE_IMAGE_LOADERS).filter(([path]) => path.includes(`sourceimages/${season}/`));

const rootEntries = () => Object.entries(ROOT_IMAGE_LOADERS);

const findSeasonAssetLoader = (season: SeasonName, candidates: string[]) => {
  const entries = seasonEntries(season);

  for (const candidate of candidates) {
    const rootMatch = entries.find(([path]) => path.endsWith(`/${candidate}`) && !path.includes('/snow/'));
    const anyMatch = entries.find(([path]) => path.endsWith(`/${candidate}`));
    const match = rootMatch ?? anyMatch;

    if (match) {
      return match[1];
    }
  }

  throw new Error(`Missing ${season} asset. Tried: ${candidates.join(', ')}`);
};

const findOptionalSeasonAssetLoaders = (season: SeasonName, candidates: string[]) => {
  const entries = seasonEntries(season);
  const loaders: AssetLoader[] = [];

  for (const candidate of candidates) {
    const rootMatch = entries.find(([path]) => path.endsWith(`/${candidate}`) && !path.includes('/snow/'));
    const anyMatch = entries.find(([path]) => path.endsWith(`/${candidate}`));
    const match = rootMatch ?? anyMatch;

    if (match && !loaders.includes(match[1])) {
      loaders.push(match[1]);
    }
  }

  return loaders;
};

const findOptionalRootAssetLoaders = (candidates: string[]) => {
  const entries = rootEntries();
  const loaders: AssetLoader[] = [];

  for (const candidate of candidates) {
    const match = entries.find(([path]) => path.endsWith(`/${candidate}`));

    if (match && !loaders.includes(match[1])) {
      loaders.push(match[1]);
    }
  }

  return loaders;
};

const createSeasonalAssetUrls = (season: SeasonName): SeasonalAssetUrls => {
  const trees = findOptionalSeasonAssetLoaders(season, SEASON_TREE_TEXTURES[season]);
  const tallGrassTextures = findOptionalSeasonAssetLoaders(season, SEASON_TALL_GRASS_TEXTURES[season]);
  const grassTuft = tallGrassTextures[0] ?? findSeasonAssetLoader(season, ['ue_grass00.png', 'yamagrs01.png']);
  const tallGrass = tallGrassTextures[1] ?? tallGrassTextures[0] ?? findSeasonAssetLoader(season, ['ue_grass01.png', 'yamagrs01.png']);
  const edgeDetails = findOptionalSeasonAssetLoaders(season, SEASON_EDGE_DETAIL_TEXTURES[season]);

  return {
    grass: findSeasonAssetLoader(season, SEASON_BASE_GRASS_TEXTURES[season]),
    path: findSeasonAssetLoader(season, ['michi_hage.png', 'michi01a.png']),
    pathAlt: findSeasonAssetLoader(season, ['michi_hage02.png', 'michi_hage.png']),
    pathStone: findSeasonAssetLoader(season, ['michi_isi.png', 'michi01b.png']),
    pathCrack: findSeasonAssetLoader(season, ['michi_hibi.png', 'michi01b.png']),
    ledge: findSeasonAssetLoader(season, ['gake1_1.png']),
    grassTuft,
    tallGrass,
    tallGrassPatches: tallGrassTextures,
    tallGrassAccents: [],
    flowers: edgeDetails,
    edgeDetails,
    trees,
    smallTrees: trees,
    forestTiles: [],
    roads: findOptionalRootAssetLoaders(['michi02a.png', 'michi03a.png', 'michi02b.png', 'michi03b.png']),
    lanternPoles: findOptionalRootAssetLoaders(['h04_pole_1.png']),
    lanternGlows: findOptionalRootAssetLoaders(['h04_hikari_1.png', 'in66_light02.png', 'light_1.png']),
    benches: findOptionalRootAssetLoaders(['bench.png', 'nagaisu.png']),
    fences: findOptionalRootAssetLoaders([
      'saku01a.png',
      'saku_001.png',
      'fence_01.png',
      'c01saku.png',
      'out07saku.png',
      'c13_saku01.png',
      'c13_saku02.png',
    ]),
    rocks: findOptionalRootAssetLoaders(['rock01.png', 'rock02.png', 'in30_rock01.png', 'searocksmall.png']),
  };
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });

const loadAssetImage = async (loader: AssetLoader) => loadImage(await loader());

const loadSeasonalMapAssets = async (season: SeasonName): Promise<SeasonalMapAssets> => {
  const urls = createSeasonalAssetUrls(season);
  const [
    grass,
    path,
    pathAlt,
    pathStone,
    pathCrack,
    ledge,
    grassTuft,
    tallGrass,
    tallGrassPatches,
    tallGrassAccents,
    flowers,
    edgeDetails,
    trees,
    smallTrees,
    forestTiles,
    roads,
    lanternPoles,
    lanternGlows,
    benches,
    fences,
    rocks,
  ] = await Promise.all([
    loadAssetImage(urls.grass),
    loadAssetImage(urls.path),
    loadAssetImage(urls.pathAlt),
    loadAssetImage(urls.pathStone),
    loadAssetImage(urls.pathCrack),
    loadAssetImage(urls.ledge),
    loadAssetImage(urls.grassTuft),
    loadAssetImage(urls.tallGrass),
    Promise.all(urls.tallGrassPatches.map(loadAssetImage)),
    Promise.all(urls.tallGrassAccents.map(loadAssetImage)),
    Promise.all(urls.flowers.map(loadAssetImage)),
    Promise.all(urls.edgeDetails.map(loadAssetImage)),
    Promise.all(urls.trees.map(loadAssetImage)),
    Promise.all(urls.smallTrees.map(loadAssetImage)),
    Promise.all(urls.forestTiles.map(loadAssetImage)),
    Promise.all(urls.roads.map(loadAssetImage)),
    Promise.all(urls.lanternPoles.map(loadAssetImage)),
    Promise.all(urls.lanternGlows.map(loadAssetImage)),
    Promise.all(urls.benches.map(loadAssetImage)),
    Promise.all(urls.fences.map(loadAssetImage)),
    Promise.all(urls.rocks.map(loadAssetImage)),
  ]);

  return {
    grass,
    path,
    pathAlt,
    pathStone,
    pathCrack,
    ledge,
    grassTuft,
    tallGrass,
    tallGrassPatches,
    tallGrassAccents,
    flowers,
    edgeDetails,
    trees,
    smallTrees,
    forestTiles,
    roads,
    lanternPoles,
    lanternGlows,
    benches,
    fences,
    rocks,
  };
};

const isPlayableCell = (x: number, y: number) => x >= 2 && x <= MAP_COLS - 3 && y >= 3 && y <= MAP_ROWS - 4;

const carveCell = (terrain: TileKind[][], walkable: boolean[][], cx: number, cy: number, radius = 1) => {
  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      if (!isPlayableCell(x, y)) continue;
      terrain[y][x] = 'path';
      walkable[y][x] = true;
    }
  }
};

const carveRect = (terrain: TileKind[][], walkable: boolean[][], x: number, y: number, w: number, h: number) => {
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) {
      carveCell(terrain, walkable, col, row, 0);
    }
  }
};

const carveRoute = (terrain: TileKind[][], walkable: boolean[][], start: GridPoint, end: GridPoint) => {
  let x = start.x;
  let y = start.y;
  let guard = 0;

  while ((x !== end.x || y !== end.y) && guard < 120) {
    carveCell(terrain, walkable, x, y, 1);

    const moveHorizontally = x !== end.x && (y === end.y || Math.random() > 0.44);

    if (moveHorizontally) {
      x += Math.sign(end.x - x);
    } else if (y !== end.y) {
      y += Math.sign(end.y - y);
    }

    if (Math.random() > 0.82 && x > 4 && x < MAP_COLS - 5) {
      x += Math.random() > 0.5 ? 1 : -1;
    }

    if (Math.random() > 0.86 && y > 5 && y < MAP_ROWS - 6) {
      y += Math.random() > 0.5 ? 1 : -1;
    }

    x = clamp(x, 3, MAP_COLS - 4);
    y = clamp(y, 4, MAP_ROWS - 5);
    guard += 1;
  }

  carveCell(terrain, walkable, end.x, end.y, 1);
};

const carveRoadCell = (terrain: TileKind[][], walkable: boolean[][], cx: number, cy: number, radius = 0) => {
  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      if (!isPlayableCell(x, y)) continue;
      terrain[y][x] = 'road';
      walkable[y][x] = true;
    }
  }
};

const carveRoadLine = (
  terrain: TileKind[][],
  walkable: boolean[][],
  start: GridPoint,
  end: GridPoint,
  radius = 0,
) => {
  const dx = Math.sign(end.x - start.x);
  const dy = Math.sign(end.y - start.y);
  const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));

  for (let i = 0; i <= steps; i += 1) {
    carveRoadCell(terrain, walkable, start.x + dx * i, start.y + dy * i, radius);
  }
};

const addRoadNetwork = (terrain: TileKind[][], walkable: boolean[][], profile: MapProfile, center: GridPoint) => {
  if (profile.roadStyle === 'none') return;

  const radius = profile.roadStyle === 'street' ? 1 : 0;
  const horizontalY = clamp(center.y + randomInt(-2, 2), 5, MAP_ROWS - 6);
  const verticalX = clamp(center.x + randomInt(-4, 4), 5, MAP_COLS - 6);

  if (profile.streetAxis === 'horizontal' || profile.streetAxis === 'cross') {
    carveRoadLine(terrain, walkable, { x: 3, y: horizontalY }, { x: MAP_COLS - 4, y: horizontalY }, radius);
  }

  if (profile.streetAxis === 'vertical' || profile.streetAxis === 'cross') {
    carveRoadLine(terrain, walkable, { x: verticalX, y: 4 }, { x: verticalX, y: MAP_ROWS - 5 }, radius);
  }

  const connector = profile.streetAxis === 'vertical'
    ? { x: verticalX, y: center.y }
    : { x: center.x, y: horizontalY };
  carveRoute(terrain, walkable, center, connector);

  if (profile.roadStyle === 'street' && Math.random() > 0.55) {
    const sideStreetY = clamp(horizontalY + pick([-4, 4]), 5, MAP_ROWS - 6);
    const sideStart = randomInt(5, 8);
    const sideEnd = randomInt(MAP_COLS - 9, MAP_COLS - 5);
    carveRoadLine(terrain, walkable, { x: sideStart, y: sideStreetY }, { x: sideEnd, y: sideStreetY }, 0);
  }
};

const isWalkableNear = (walkable: boolean[][], cellX: number, cellY: number, radius = 1) => {
  for (let y = cellY - radius; y <= cellY + radius; y += 1) {
    for (let x = cellX - radius; x <= cellX + radius; x += 1) {
      if (walkable[y]?.[x]) return true;
    }
  }

  return false;
};

const isInCenterPlaza = (cellX: number, cellY: number, margin = 0) =>
  cellX >= CENTER_PLAZA.x - margin &&
  cellX < CENTER_PLAZA.x + CENTER_PLAZA.w + margin &&
  cellY >= CENTER_PLAZA.y - margin &&
  cellY < CENTER_PLAZA.y + CENTER_PLAZA.h + margin;

const createMapProfile = (): MapProfile => {
  const hasPathNetwork = ENABLE_PATH_NETWORK;
  const hasRoadDistrict = ENABLE_ROAD_EVENT && Math.random() > 0.58;
  const roadStyle = hasRoadDistrict
    ? weightedPick<RoadStyle>([
      { item: 'lane', weight: 4 },
      { item: 'street', weight: 2 },
    ])
    : 'none';

  return {
    hasPathNetwork,
    roadStyle,
    streetAxis: weightedPick<'horizontal' | 'vertical' | 'cross'>([
      { item: 'horizontal', weight: 4 },
      { item: 'vertical', weight: 4 },
      { item: 'cross', weight: roadStyle === 'street' ? 4 : 1 },
    ]),
    hasRoadDistrict: roadStyle !== 'none',
    hasBuildings: ENABLE_BUILDING_EVENT && roadStyle !== 'none' && Math.random() > 0.32,
    hasLanterns: roadStyle !== 'none' && Math.random() > 0.08,
    meadowBiasX: randomRange(-0.65, 0.65),
    meadowBiasY: randomRange(-0.45, 0.45),
    meadowScale: randomRange(0.8, 1.32),
    propDensity: randomRange(0.72, 1.22),
  };
};

const getMeadowInfluence = (profile: MapProfile, cellX: number, cellY: number) => {
  const nx = cellX / (MAP_COLS - 1);
  const ny = cellY / (MAP_ROWS - 1);
  const broadSlope = (nx - 0.5) * profile.meadowBiasX + (ny - 0.5) * profile.meadowBiasY;
  const broadWave = Math.sin((nx * 3.1 + profile.meadowBiasX) * Math.PI) * 0.18;
  const crossWave = Math.cos((ny * 2.7 + profile.meadowBiasY) * Math.PI) * 0.16;
  const smallRipple = Math.sin((cellX * 0.55 + cellY * 0.28) * profile.meadowScale) * 0.08;

  return clamp(0.46 + broadSlope + broadWave + crossWave + smallRipple, 0, 1);
};

const isRoadSide = (terrain: TileKind[][], cellX: number, cellY: number) =>
  terrain[cellY][cellX] === 'grass' && countTerrainNeighbors(terrain, cellX, cellY, ['road']) > 0;

const createReservedGrid = () => createGrid(false);

const markReserved = (reserved: boolean[][], x: number, y: number, w: number, h: number, margin = 0) => {
  for (let row = y - margin; row < y + h + margin; row += 1) {
    for (let col = x - margin; col < x + w + margin; col += 1) {
      if (reserved[row]?.[col] !== undefined) reserved[row][col] = true;
    }
  }
};

const isAreaClear = (
  terrain: TileKind[][],
  reserved: boolean[][],
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  if (x < 2 || x + w > MAP_COLS - 2 || y < 3 || y + h > MAP_ROWS - 3) return false;
  if (isInCenterPlaza(x, y, 3) || isInCenterPlaza(x + w - 1, y + h - 1, 3)) return false;

  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) {
      if (terrain[row]?.[col] === 'path' || terrain[row]?.[col] === 'road' || reserved[row][col]) return false;
    }
  }

  const frontY = y + h;
  for (let col = x; col < x + w; col += 1) {
    if (terrain[frontY]?.[col] === 'road' || terrain[frontY]?.[col] === 'path') return true;
  }

  return false;
};

const createBuildingPlacements = (terrain: TileKind[][], profile: MapProfile) => {
  const reserved = createReservedGrid();
  const buildings: BuildingPlacement[] = [];

  if (!profile.hasBuildings) {
    return { buildings, reserved };
  }

  const roadCandidates: GridPoint[] = [];
  for (let y = 4; y < MAP_ROWS - 5; y += 1) {
    for (let x = 3; x < MAP_COLS - 5; x += 1) {
      if (terrain[y + 3]?.[x] === 'road' || terrain[y + 3]?.[x + 1] === 'road' || terrain[y + 3]?.[x + 2] === 'road') {
        roadCandidates.push({ x, y });
      }
    }
  }

  for (const candidate of roadCandidates.sort(() => Math.random() - 0.5)) {
    if (buildings.length >= (profile.roadStyle === 'street' ? 3 : 2)) break;

    const w = randomInt(2, 4);
    const h = randomInt(2, 3);
    const firstBuilding = buildings[0];

    if (firstBuilding) {
      const distance = Math.abs(candidate.x - firstBuilding.x) + Math.abs(candidate.y - firstBuilding.y);
      const clusterRequired = buildings.length === 1 || profile.roadStyle === 'street';
      if (clusterRequired && distance > 10) continue;
    }

    if (!isAreaClear(terrain, reserved, candidate.x, candidate.y, w, h)) continue;

    for (let row = candidate.y; row < candidate.y + h; row += 1) {
      for (let col = candidate.x; col < candidate.x + w; col += 1) {
        terrain[row][col] = 'grass';
      }
    }

    buildings.push({
      x: candidate.x,
      y: candidate.y,
      w,
      h,
      tone: pick(['red', 'blue', 'green']),
      hasSign: buildings.length === 0 || Math.random() > 0.58,
    });
    markReserved(reserved, candidate.x, candidate.y, w, h, 1);
  }

  return { buildings, reserved };
};

const drawImageCenteredInTile = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cellX: number,
  cellY: number,
) => {
  ctx.drawImage(
    image,
    cellX * TILE + Math.floor((TILE - image.width) / 2),
    cellY * TILE + Math.floor((TILE - image.height) / 2),
  );
};

const drawImageTiledInTile = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, cellX: number, cellY: number) => {
  const tileX = cellX * TILE;
  const tileY = cellY * TILE;

  for (let y = 0; y < TILE; y += image.height) {
    for (let x = 0; x < TILE; x += image.width) {
      const drawW = Math.min(image.width, TILE - x);
      const drawH = Math.min(image.height, TILE - y);
      ctx.drawImage(image, 0, 0, drawW, drawH, tileX + x, tileY + y, drawW, drawH);
    }
  }
};

const drawOptionalTile = (
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  fallback: HTMLImageElement,
  cellX: number,
  cellY: number,
) => {
  drawImageTiledInTile(ctx, images.length > 0 ? pick(images) : fallback, cellX, cellY);
};

const drawTreeAt = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, cellX: number, bottomCellY: number) => {
  ctx.drawImage(image, cellX * TILE, (bottomCellY + 1) * TILE - image.height);
};

const drawScenicBands = (ctx: CanvasRenderingContext2D, assets: SeasonalMapAssets) => {
  for (let x = 0; x < MAP_W; x += assets.ledge.width) {
    ctx.drawImage(assets.ledge, x, TILE * 2 - assets.ledge.height);
    ctx.drawImage(assets.ledge, x, MAP_H - TILE * 2);
  }

  for (let x = TILE; x < MAP_W - TILE; x += TILE) {
    if (Math.random() > 0.58) {
      drawImageCenteredInTile(ctx, Math.random() > 0.5 ? assets.grassTuft : assets.tallGrass, x / TILE, 2);
    }

    if (Math.random() > 0.62) {
      drawImageCenteredInTile(ctx, Math.random() > 0.5 ? assets.grassTuft : assets.tallGrass, x / TILE, MAP_ROWS - 3);
    }
  }
};

const applyForestBoundary = (terrain: TileKind[][], walkable: boolean[][]) => {
  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      const edgeDistance = Math.min(x, y, MAP_COLS - 1 - x, MAP_ROWS - 1 - y);
      const cornerPressure = (x < 4 || x > MAP_COLS - 5) && (y < 4 || y > MAP_ROWS - 5);

      if (
        edgeDistance === 0 ||
        edgeDistance === 1 ||
        (edgeDistance === 2 && Math.random() > 0.34) ||
        (edgeDistance === 3 && (cornerPressure || Math.random() > 0.72))
      ) {
        terrain[y][x] = 'forest';
        walkable[y][x] = false;
      }
    }
  }
};

const generateTerrain = (profile: MapProfile) => {
  const terrain = createGrid<TileKind>('grass');
  const walkable = createGrid(false);
  const center = {
    x: CENTER_PLAZA.x + Math.floor(CENTER_PLAZA.w / 2),
    y: CENTER_PLAZA.y + Math.floor(CENTER_PLAZA.h / 2),
  };

  applyForestBoundary(terrain, walkable);
  carveRect(terrain, walkable, CENTER_PLAZA.x, CENTER_PLAZA.y, CENTER_PLAZA.w, CENTER_PLAZA.h);

  const endpoints: GridPoint[] = profile.hasPathNetwork
    ? [
      { x: clamp(center.x + randomInt(-5, 5), 6, MAP_COLS - 7), y: 4 },
      { x: clamp(center.x + randomInt(-5, 5), 6, MAP_COLS - 7), y: MAP_ROWS - 5 },
      { x: 4, y: clamp(center.y + randomInt(-2, 2), 6, MAP_ROWS - 7) },
      { x: MAP_COLS - 5, y: clamp(center.y + randomInt(-2, 2), 6, MAP_ROWS - 7) },
      { x: randomInt(6, 9), y: randomInt(5, 7) },
      { x: randomInt(MAP_COLS - 10, MAP_COLS - 7), y: randomInt(MAP_ROWS - 8, MAP_ROWS - 6) },
    ]
    : [];

  for (const endpoint of endpoints) {
    carveRoute(terrain, walkable, center, endpoint);
  }

  const loopTop = randomInt(5, 6);
  const loopBottom = randomInt(MAP_ROWS - 7, MAP_ROWS - 6);
  const loopLeft = randomInt(4, 5);
  const loopRight = randomInt(MAP_COLS - 6, MAP_COLS - 5);

  if (ENABLE_LOOP_PATHS && Math.random() > 0.45) {
    carveRoute(terrain, walkable, { x: loopLeft, y: loopTop }, { x: loopRight, y: loopTop });
    carveRoute(terrain, walkable, { x: loopRight, y: loopTop }, { x: loopRight, y: loopBottom });
    carveRoute(terrain, walkable, { x: loopRight, y: loopBottom }, { x: loopLeft, y: loopBottom });
    carveRoute(terrain, walkable, { x: loopLeft, y: loopBottom }, { x: loopLeft, y: loopTop });
  }

  for (let i = 0; ENABLE_SIDE_POCKETS && i < 4; i += 1) {
    const pocket = {
      x: randomInt(5, MAP_COLS - 8),
      y: randomInt(4, MAP_ROWS - 6),
      w: randomInt(2, 4),
      h: randomInt(2, 3),
    };

    if (isInCenterPlaza(pocket.x, pocket.y, 3)) continue;

    carveRect(terrain, walkable, pocket.x, pocket.y, pocket.w, pocket.h);
    carveRoute(terrain, walkable, center, {
      x: pocket.x + Math.floor(pocket.w / 2),
      y: pocket.y + Math.floor(pocket.h / 2),
    });
  }

  if (ENABLE_ROAD_EVENT) {
    addRoadNetwork(terrain, walkable, profile, center);
  }

  const spawnCells: GridPoint[] = [];

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (walkable[y][x] && x > 2 && x < MAP_COLS - 3 && y > 3 && y < MAP_ROWS - 4) {
        spawnCells.push({ x, y });
      }
    }
  }

  return { terrain, walkable, spawnCells };
};

const createDecorGrid = (
  terrain: TileKind[][],
  walkable: boolean[][],
  profile: MapProfile,
  reserved: boolean[][],
) => {
  const decor = createGrid<DecorKind>('empty');

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (
        reserved[y][x] ||
        terrain[y][x] === 'forest' ||
        terrain[y][x] === 'path' ||
        terrain[y][x] === 'road' ||
        isInCenterPlaza(x, y, 2)
      ) {
        continue;
      }

      const pathSide = isWalkableNear(walkable, x, y, 1);
      const roadSide = isRoadSide(terrain, x, y);
      const meadowInfluence = getMeadowInfluence(profile, x, y);

      if (roadSide) {
        decor[y][x] = weightedPick<DecorKind>([
          { item: 'empty', weight: 64 / profile.propDensity },
          { item: 'grassBlend', weight: 7 },
          { item: 'bench', weight: 7 * profile.propDensity },
          { item: 'fence', weight: 6 * profile.propDensity },
          { item: 'lantern', weight: profile.hasLanterns && (x + y) % 4 === 0 ? 22 * profile.propDensity : 0 },
          { item: 'rock', weight: 1 },
        ]);
        continue;
      }

      if (pathSide) {
        decor[y][x] = weightedPick<DecorKind>([
          { item: 'empty', weight: 54 },
          { item: 'grassBlend', weight: 12 + meadowInfluence * 8 },
          { item: 'tuft', weight: 8 + meadowInfluence * 12 },
          { item: 'flowers', weight: 4 + meadowInfluence * 6 },
          { item: 'fence', weight: profile.hasRoadDistrict ? 0 : 2 },
          { item: 'rock', weight: 1 },
        ]);
        continue;
      }

      const edgePressure =
        (x <= 2 || x >= MAP_COLS - 3 ? 1 : 0) +
        (y <= 3 || y >= MAP_ROWS - 4 ? 1 : 0);
      const scenicBand = y <= 4 || y >= MAP_ROWS - 5;
      const treeNeighbors = countNeighbors(decor, x, y, 'tree');
      const flowerNeighbors = countNeighbors(decor, x, y, 'flowers');
      const tallGrassNeighbors = countNeighbors(decor, x, y, 'tallGrass');
      const smallTreeNeighbors = countNeighbors(decor, x, y, 'smallTree');

      decor[y][x] = weightedPick<DecorKind>([
        { item: 'empty', weight: scenicBand ? 8 : 46 - meadowInfluence * 18 },
        { item: 'grassBlend', weight: 12 + meadowInfluence * 24 },
        { item: 'tuft', weight: 8 + meadowInfluence * 18 + tallGrassNeighbors * 4 },
        { item: 'tallGrass', weight: 4 + meadowInfluence * 15 + tallGrassNeighbors * 12 + (scenicBand ? 12 : 0) },
        { item: 'flowers', weight: 2 + meadowInfluence * 9 + flowerNeighbors * 12 + (scenicBand ? 4 : 0) },
        { item: 'smallTree', weight: 2 + smallTreeNeighbors * 8 + edgePressure * 7 },
        { item: 'tree', weight: edgePressure * 22 + treeNeighbors * 18 + (scenicBand ? 12 : 0) },
        { item: 'rock', weight: 1 + countNeighbors(decor, x, y, 'rock') * 2 },
      ]);
    }
  }

  return decor;
};

const drawForestShade = (ctx: CanvasRenderingContext2D, terrain: TileKind[][]) => {
  ctx.fillStyle = 'rgba(6, 6, 8, 0.12)';

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (terrain[y][x] !== 'forest') continue;
      if (countTerrainNeighbors(terrain, x, y, ['grass', 'path', 'road']) > 0) {
        ctx.fillRect(x * TILE, y * TILE + TILE - 4, TILE, 4);
      }
    }
  }
};

const drawForestTerrain = (
  ctx: CanvasRenderingContext2D,
  assets: SeasonalMapAssets,
  terrain: TileKind[][],
) => {
  const forestTree = assets.trees.length > 0 ? pick(assets.trees) : null;

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (terrain[y][x] !== 'forest') continue;

      if (forestTree) {
        drawTreeAt(ctx, forestTree, x, y);
      } else {
        drawOptionalTile(ctx, assets.forestTiles, assets.grassTuft, x, y);
      }
    }
  }
};

const isForestNear = (terrain: TileKind[][], cellX: number, cellY: number) =>
  countTerrainNeighbors(terrain, cellX, cellY, ['forest']) > 0;

const createTallGrassPatches = (terrain: TileKind[][], reserved: boolean[][], patchTypeCount: number): TallGrassPatchGrid => {
  const patches = createGrid<number | null>(null);
  const targetTiles = randomInt(70, 120);
  let patchTiles = 0;
  let attempts = 0;
  const typeCount = Math.max(1, patchTypeCount);

  while (patchTiles < targetTiles && attempts < 18) {
    attempts += 1;
    const patchType = randomInt(0, typeCount - 1);
    const center = {
      x: randomInt(4, MAP_COLS - 5),
      y: randomInt(4, MAP_ROWS - 5),
    };
    const radiusX = randomInt(3, 6);
    const radiusY = randomInt(3, 5);

    if (isInCenterPlaza(center.x, center.y, 2)) continue;

    for (let y = center.y - radiusY; y <= center.y + radiusY; y += 1) {
      for (let x = center.x - radiusX; x <= center.x + radiusX; x += 1) {
        if (
          terrain[y]?.[x] !== 'grass' ||
          reserved[y]?.[x] ||
          isInCenterPlaza(x, y, 1) ||
          isForestNear(terrain, x, y)
        ) {
          continue;
        }

        const nx = (x - center.x) / radiusX;
        const ny = (y - center.y) / radiusY;
        const distance = nx * nx + ny * ny;
        const raggedEdge = Math.sin(x * 1.7 + y * 0.9) * 0.16 + Math.random() * 0.26;

        if (distance < 0.95 + raggedEdge && patches[y][x] === null) {
          patches[y][x] = patchType;
          patchTiles += 1;
        }
      }
    }
  }

  return patches;
};

const countTallGrassPatchNeighbors = (patches: TallGrassPatchGrid, cellX: number, cellY: number) => {
  let count = 0;

  for (let y = cellY - 1; y <= cellY + 1; y += 1) {
    for (let x = cellX - 1; x <= cellX + 1; x += 1) {
      if (x === cellX && y === cellY) continue;
      if (patches[y]?.[x] !== null && patches[y]?.[x] !== undefined) count += 1;
    }
  }

  return count;
};

const drawTallGrassTile = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, cellX: number, cellY: number) => {
  const tileX = cellX * TILE;
  const tileY = cellY * TILE;

  if (image.width <= TILE / 2 && image.height >= TILE) {
    ctx.drawImage(image, tileX, tileY + TILE - image.height);
    ctx.drawImage(image, tileX + TILE / 2, tileY + TILE - image.height);
    return;
  }

  drawImageTiledInTile(ctx, image, cellX, cellY);
};

const drawTallGrassPatches = (
  ctx: CanvasRenderingContext2D,
  assets: SeasonalMapAssets,
  patches: TallGrassPatchGrid,
) => {
  const patchImages = assets.tallGrassPatches.length > 0 ? assets.tallGrassPatches : [assets.tallGrass];
  const accentImages = assets.tallGrassAccents;

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      const patchType = patches[y][x];
      if (patchType === null) continue;

      const patchNeighborCount = countTallGrassPatchNeighbors(patches, x, y);
      const patchImage = patchImages[patchType % patchImages.length];
      if (patchImage.width === TILE && patchImage.height === TILE) {
        ctx.drawImage(patchImage, x * TILE, y * TILE);
      } else {
        drawTallGrassTile(ctx, patchImage, x, y);
      }

      if (accentImages.length > 0 && patchNeighborCount <= 4 && Math.random() > 0.66) {
        ctx.globalAlpha = 0.72;
        drawImageCenteredInTile(ctx, pick(accentImages), x, y);
        ctx.globalAlpha = 1;
      } else if (patchNeighborCount <= 3 && Math.random() > 0.52) {
        ctx.globalAlpha = 0.7;
        drawImageCenteredInTile(ctx, assets.grassTuft, x, y);
        ctx.globalAlpha = 1;
      }
    }
  }
};

const drawForestEdgeDetails = (
  ctx: CanvasRenderingContext2D,
  assets: SeasonalMapAssets,
  terrain: TileKind[][],
  tallGrassPatches: TallGrassPatchGrid,
) => {
  if (assets.edgeDetails.length === 0) return;

  for (let y = 1; y < MAP_ROWS - 1; y += 1) {
    for (let x = 1; x < MAP_COLS - 1; x += 1) {
      if (
        terrain[y][x] !== 'grass' ||
        tallGrassPatches[y][x] !== null ||
        isInCenterPlaza(x, y, 1)
      ) {
        continue;
      }

      const forestNeighbors = countTerrainNeighbors(terrain, x, y, ['forest']);
      if (forestNeighbors === 0) continue;

      const edgeChance = Math.min(0.76, 0.28 + forestNeighbors * 0.12);
      if (Math.random() > edgeChance) continue;

      ctx.globalAlpha = forestNeighbors >= 3 ? 0.84 : 0.68;
      drawImageCenteredInTile(ctx, pick(assets.edgeDetails), x, y);
      ctx.globalAlpha = 1;
    }
  }
};

const drawGroundTerrain = (
  ctx: CanvasRenderingContext2D,
  assets: SeasonalMapAssets,
  terrain: TileKind[][],
) => {
  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      switch (terrain[y][x]) {
        case 'forest':
          break;
        case 'road':
          drawOptionalTile(ctx, assets.roads, assets.pathAlt, x, y);
          break;
        case 'path':
        case 'grass':
        default:
          break;
      }
    }
  }
};

const drawLantern = (ctx: CanvasRenderingContext2D, assets: SeasonalMapAssets, cellX: number, cellY: number) => {
  const pole = assets.lanternPoles[0];
  const glow = assets.lanternGlows[0];

  if (glow) {
    ctx.globalAlpha = 0.78;
    drawImageCenteredInTile(ctx, glow, cellX, cellY);
    ctx.globalAlpha = 1;
  }

  if (pole) {
    drawImageCenteredInTile(ctx, pole, cellX, cellY);
    return;
  }

  ctx.fillStyle = '#4a3324';
  ctx.fillRect(cellX * TILE + 15, cellY * TILE + 8, 2, 20);
  ctx.fillStyle = '#ffe08a';
  ctx.fillRect(cellX * TILE + 12, cellY * TILE + 5, 8, 6);
};

const drawBuilding = (ctx: CanvasRenderingContext2D, building: BuildingPlacement) => {
  const x = building.x * TILE;
  const y = building.y * TILE;
  const w = building.w * TILE;
  const h = building.h * TILE;
  const roof = building.tone === 'red' ? '#b94b3a' : building.tone === 'blue' ? '#4668a8' : '#3f7f5b';
  const roofDark = building.tone === 'red' ? '#7c2f2a' : building.tone === 'blue' ? '#2d4274' : '#28523f';

  ctx.fillStyle = 'rgba(6, 6, 8, 0.18)';
  ctx.fillRect(x + 4, y + h - 4, w - 8, 7);
  ctx.fillStyle = roofDark;
  ctx.fillRect(x + 4, y + 2, w - 8, 8);
  ctx.fillStyle = roof;
  ctx.fillRect(x, y + 8, w, 18);
  ctx.fillStyle = '#f5dca7';
  ctx.fillRect(x + 6, y + 26, w - 12, h - 28);
  ctx.fillStyle = '#9f6f43';
  ctx.fillRect(x + Math.floor(w / 2) - 8, y + h - 24, 16, 24);
  ctx.fillStyle = '#473423';
  ctx.fillRect(x + Math.floor(w / 2) + 4, y + h - 12, 3, 3);

  for (let col = 12; col < w - 18; col += 28) {
    ctx.fillStyle = '#d9f1ff';
    ctx.fillRect(x + col, y + h - 36, 12, 10);
    ctx.fillStyle = '#42647a';
    ctx.fillRect(x + col, y + h - 27, 12, 2);
  }

  if (building.hasSign) {
    ctx.fillStyle = '#5b422c';
    ctx.fillRect(x + w - 14, y + h - 22, 3, 18);
    ctx.fillStyle = '#f4d374';
    ctx.fillRect(x + w - 22, y + h - 30, 18, 10);
  }
};

const drawBuildings = (ctx: CanvasRenderingContext2D, buildings: BuildingPlacement[]) => {
  for (const building of [...buildings].sort((a, b) => a.y + a.h - (b.y + b.h))) {
    drawBuilding(ctx, building);
  }
};

const drawMapDecorations = (
  ctx: CanvasRenderingContext2D,
  assets: SeasonalMapAssets,
  terrain: TileKind[][],
  decor: DecorKind[][],
) => {
  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (terrain[y][x] === 'road') {
        continue;
      }

      if (terrain[y][x] === 'path') {
        const pathNeighbors = countNeighbors(terrain, x, y, 'path');
        const pathOverlay = weightedPick<'none' | 'stone' | 'crack'>([
          { item: 'none', weight: 70 - pathNeighbors * 2 },
          { item: 'stone', weight: 8 + pathNeighbors },
          { item: 'crack', weight: 5 + Math.max(0, 5 - pathNeighbors) },
        ]);

        if (pathOverlay === 'stone') {
          drawImageCenteredInTile(ctx, assets.pathStone, x, y);
        } else if (pathOverlay === 'crack') {
          drawImageCenteredInTile(ctx, assets.pathCrack, x, y);
        }
        continue;
      }

      if (isInCenterPlaza(x, y, 2)) {
        continue;
      }

      switch (decor[y][x]) {
        case 'tuft':
          drawImageCenteredInTile(ctx, assets.grassTuft, x, y);
          break;
        case 'tallGrass':
          drawImageCenteredInTile(ctx, assets.tallGrass, x, y);
          break;
        case 'grassBlend':
          ctx.globalAlpha = 0.72;
          drawImageCenteredInTile(ctx, Math.random() > 0.55 ? assets.grassTuft : assets.tallGrass, x, y);
          ctx.globalAlpha = 1;
          break;
        case 'flowers':
          drawImageCenteredInTile(ctx, assets.flowers.length > 0 ? pick(assets.flowers) : assets.grassTuft, x, y);
          break;
        case 'smallTree':
          drawImageCenteredInTile(ctx, assets.smallTrees.length > 0 ? pick(assets.smallTrees) : assets.tallGrass, x, y);
          break;
        case 'tree':
          if (assets.trees.length > 0) {
            drawTreeAt(ctx, pick(assets.trees), x, y);
          }
          break;
        case 'lantern':
          drawLantern(ctx, assets, x, y);
          break;
        case 'bench':
          if (assets.benches.length > 0) {
            drawImageCenteredInTile(ctx, pick(assets.benches), x, y);
          }
          break;
        case 'fence':
          if (assets.fences.length > 0) {
            drawImageCenteredInTile(ctx, pick(assets.fences), x, y);
          }
          break;
        case 'rock':
          if (assets.rocks.length > 0) {
            drawImageCenteredInTile(ctx, pick(assets.rocks), x, y);
          }
          break;
        case 'empty':
        default:
          break;

      }
    }
  }
};

const generateProceduralMap = (assets: SeasonalMapAssets): GeneratedMap => {
  const profile = createMapProfile();
  const { terrain, walkable, spawnCells } = generateTerrain(profile);
  const { buildings, reserved } = createBuildingPlacements(terrain, profile);
  const tallGrassPatches = ENABLE_TALL_GRASS_PATCHES
    ? createTallGrassPatches(terrain, reserved, assets.tallGrassPatches.length)
    : createGrid<number | null>(null);
  const decor = createDecorGrid(terrain, walkable, profile, reserved);
  const canvas = document.createElement('canvas');
  canvas.width = MAP_W;
  canvas.height = MAP_H;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { canvas, terrain, decor, walkable, spawnCells };
  }

  ctx.imageSmoothingEnabled = false;

  const grassPattern = ctx.createPattern(assets.grass, 'repeat');
  if (grassPattern) {
    ctx.fillStyle = grassPattern;
    ctx.fillRect(0, 0, MAP_W, MAP_H);
  } else {
    ctx.fillStyle = '#93ad78';
    ctx.fillRect(0, 0, MAP_W, MAP_H);
  }

  if (ENABLE_SCENIC_BANDS) {
    drawScenicBands(ctx, assets);
  }
  drawGroundTerrain(ctx, assets, terrain);

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (terrain[y][x] === 'path') {
        ctx.drawImage(Math.random() > 0.32 ? assets.path : assets.pathAlt, x * TILE, y * TILE);
      } else if (terrain[y][x] === 'road') {
        drawOptionalTile(ctx, assets.roads, assets.pathAlt, x, y);
      }
    }
  }

  if (ENABLE_DECOR_EVENT) {
    drawMapDecorations(ctx, assets, terrain, decor);
  }
  if (ENABLE_BUILDING_EVENT) {
    drawBuildings(ctx, buildings);
  }
  drawTallGrassPatches(ctx, assets, tallGrassPatches);
  drawForestEdgeDetails(ctx, assets, terrain, tallGrassPatches);
  drawForestTerrain(ctx, assets, terrain);
  drawForestShade(ctx, terrain);

  ctx.fillStyle = 'rgba(6, 6, 8, 0.04)';
  ctx.fillRect(0, 0, MAP_W, TILE * 2);
  ctx.fillRect(0, MAP_H - TILE * 2, MAP_W, TILE * 2);
  ctx.fillRect(0, 0, TILE, MAP_H);
  ctx.fillRect(MAP_W - TILE, 0, TILE, MAP_H);

  return { canvas, terrain, decor, walkable, spawnCells };
};

const getCurrentFrame = (pokemon: WalkingPokemon) => {
  const frames = pokemon.sprite.frames[pokemon.direction];
  return frames[pokemon.frameIndex % frames.length];
};

const setDirection = (pokemon: WalkingPokemon, direction: Direction) => {
  pokemon.direction = direction;
  pokemon.vx = DIRECTION_VELOCITY[direction].vx;
  pokemon.vy = DIRECTION_VELOCITY[direction].vy;
};

const pickDirection = (pokemon: WalkingPokemon, map: GeneratedMap) => {
  const allowedDirections = DIRECTIONS.filter((direction) => {
    const velocity = DIRECTION_VELOCITY[direction];
    return canOccupy(map, pokemon.sprite, pokemon.x + velocity.vx * TILE * 0.5, pokemon.y + velocity.vy * TILE * 0.5);
  });

  if (allowedDirections.length === 0) {
    pokemon.isIdle = true;
    pokemon.vx = 0;
    pokemon.vy = 0;
    return;
  }

  setDirection(pokemon, pick(allowedDirections));
  pokemon.frameIndex = 0;
  pokemon.frameTimer = 0;
};

const isSpriteInBounds = (sprite: PokemonSprite, img: HTMLImageElement) =>
  DIRECTIONS.every((direction) =>
    sprite.frames[direction].every((spriteFrame) =>
      spriteFrame.x >= 0 &&
      spriteFrame.y >= 0 &&
      spriteFrame.x + sprite.w <= img.width &&
      spriteFrame.y + sprite.h <= img.height,
    ),
  );

const processSprites = (img: HTMLImageElement, sprites: PokemonSprite[]) => {
  const offscreen = document.createElement('canvas');
  offscreen.width = img.width;
  offscreen.height = img.height;

  const octx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!octx) return offscreen;

  octx.drawImage(img, 0, 0);
  const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
  const data = imgData.data;
  const processedFrames = new Set<string>();

  for (const sprite of sprites) {
    for (const direction of DIRECTIONS) {
      for (const spriteFrame of sprite.frames[direction]) {
        const key = `${spriteFrame.x}:${spriteFrame.y}:${sprite.w}:${sprite.h}`;
        if (processedFrames.has(key)) continue;
        processedFrames.add(key);

        const bgIndex = (spriteFrame.y * offscreen.width + spriteFrame.x) * 4;
        const bgR = data[bgIndex];
        const bgG = data[bgIndex + 1];
        const bgB = data[bgIndex + 2];

        for (let y = spriteFrame.y; y < spriteFrame.y + sprite.h; y += 1) {
          for (let x = spriteFrame.x; x < spriteFrame.x + sprite.w; x += 1) {
            const i = (y * offscreen.width + x) * 4;
            if (data[i] === bgR && data[i + 1] === bgG && data[i + 2] === bgB) {
              data[i + 3] = 0;
            }
          }
        }
      }
    }
  }

  octx.putImageData(imgData, 0, 0);
  return offscreen;
};

const canOccupy = (map: GeneratedMap, sprite: PokemonSprite, x: number, y: number) => {
  const left = Math.floor((x + 6) / TILE);
  const right = Math.floor((x + sprite.w - 7) / TILE);
  const top = Math.floor((y + sprite.h - 16) / TILE);
  const bottom = Math.floor((y + sprite.h - 3) / TILE);

  for (let cellY = top; cellY <= bottom; cellY += 1) {
    for (let cellX = left; cellX <= right; cellX += 1) {
      if (!map.walkable[cellY]?.[cellX]) {
        return false;
      }
    }
  }

  return true;
};

const createWalker = (sprite: PokemonSprite, map: GeneratedMap): WalkingPokemon => {
  const spawn = pick(map.spawnCells);
  const direction = randomDirection();
  const walker: WalkingPokemon = {
    sprite,
    x: spawn.x * TILE,
    y: spawn.y * TILE,
    vx: 0,
    vy: 0,
    frameIndex: 0,
    frameTimer: 0,
    direction,
    stateTimer: 0,
    walkDuration: randomRange(MIN_WALK, MAX_WALK),
    idleDuration: randomRange(MIN_IDLE, MAX_IDLE),
    isIdle: Math.random() > 0.42,
  };

  setDirection(walker, direction);
  if (!canOccupy(map, sprite, walker.x, walker.y)) {
    const fallback = map.spawnCells.find((cell) => canOccupy(map, sprite, cell.x * TILE, cell.y * TILE)) ?? spawn;
    walker.x = fallback.x * TILE;
    walker.y = fallback.y * TILE;
  }

  return walker;
};

export const PokemonWorld = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [season] = useState<SeasonName>(() => pick([...SEASON_NAMES]));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId = 0;
    let lastTime = 0;
    let cancelled = false;
    let processedSpriteCanvas: HTMLCanvasElement | null = null;
    let generatedMap: GeneratedMap | null = null;
    let walkers: WalkingPokemon[] = [];

    canvas.width = MAP_W;
    canvas.height = MAP_H;
    ctx.imageSmoothingEnabled = false;

    const drawWalker = (pokemon: WalkingPokemon) => {
      if (!processedSpriteCanvas) return;

      const spriteFrame = getCurrentFrame(pokemon);
      const drawX = Math.round(pokemon.x);
      const drawY = Math.round(pokemon.y);

      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(
        drawX + pokemon.sprite.w / 2,
        drawY + pokemon.sprite.h - 2,
        Math.max(6, pokemon.sprite.w / 3),
        4,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.drawImage(
        processedSpriteCanvas,
        spriteFrame.x,
        spriteFrame.y,
        pokemon.sprite.w,
        pokemon.sprite.h,
        drawX,
        drawY,
        pokemon.sprite.w,
        pokemon.sprite.h,
      );
    };

    const drawScene = () => {
      if (!generatedMap) return;

      ctx.clearRect(0, 0, MAP_W, MAP_H);
      ctx.drawImage(generatedMap.canvas, 0, 0);

      for (const pokemon of [...walkers].sort((a, b) => a.y - b.y)) {
        drawWalker(pokemon);
      }
    };

    const updateWalker = (pokemon: WalkingPokemon, dt: number) => {
      if (!generatedMap) return;

      pokemon.stateTimer += dt;

      if (pokemon.isIdle) {
        pokemon.vx = 0;
        pokemon.vy = 0;
        pokemon.frameIndex = 0;

        if (pokemon.stateTimer >= pokemon.idleDuration) {
          pokemon.isIdle = false;
          pokemon.stateTimer = 0;
          pokemon.walkDuration = randomRange(MIN_WALK, MAX_WALK);
          pickDirection(pokemon, generatedMap);
        }

        return;
      }

      pokemon.frameTimer += dt;
      if (pokemon.frameTimer >= FRAME_INTERVAL) {
        pokemon.frameTimer = 0;
        pokemon.frameIndex = (pokemon.frameIndex + 1) % pokemon.sprite.frames[pokemon.direction].length;
      }

      const nextX = pokemon.x + pokemon.vx;
      const nextY = pokemon.y + pokemon.vy;

      if (canOccupy(generatedMap, pokemon.sprite, nextX, nextY)) {
        pokemon.x = nextX;
        pokemon.y = nextY;
      } else {
        pokemon.stateTimer = 0;
        pickDirection(pokemon, generatedMap);
      }

      if (pokemon.stateTimer >= pokemon.walkDuration) {
        pokemon.isIdle = true;
        pokemon.stateTimer = 0;
        pokemon.idleDuration = randomRange(MIN_IDLE, MAX_IDLE);
        pokemon.frameIndex = 0;
      }
    };

    void (async () => {
      try {
        const [spriteImg, mapAssets] = await Promise.all([
          loadImage(overworldSheet),
          loadSeasonalMapAssets(season),
        ]);

        if (cancelled) return;

        const usableSprites = POKEMON_SPRITES.filter((sprite) => {
          const isUsable = isSpriteInBounds(sprite, spriteImg);
          if (!isUsable) {
            console.warn(`Skipping ${sprite.name}: sprite frame is outside the sheet bounds.`);
          }
          return isUsable;
        });

        const map = generateProceduralMap(mapAssets);
        generatedMap = map;
        processedSpriteCanvas = processSprites(spriteImg, usableSprites);
        walkers = [...usableSprites]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(POKEMON_COUNT, map.spawnCells.length))
          .map((sprite) => createWalker(sprite, map));

        const tick = (time: number) => {
          const dt = lastTime ? time - lastTime : 16;
          lastTime = time;

          if (!reducedMotion) {
            for (const pokemon of walkers) {
              updateWalker(pokemon, dt);
            }
          }

          drawScene();

          if (!reducedMotion) {
            animId = requestAnimationFrame(tick);
          }
        };

        animId = requestAnimationFrame(tick);
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [season]);

  return (
    <div className="pokemon-world" data-season={season}>
      <canvas
        ref={canvasRef}
        className="pokemon-world__canvas"
        aria-hidden="true"
      />
      <div className="pokemon-world__season-badge">
        <span>{season}</span>
      </div>
    </div>
  );
};
