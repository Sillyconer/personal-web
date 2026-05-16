import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { createPortal } from 'react-dom';

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

export type Direction = 'down' | 'left' | 'right' | 'up';
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
const FOREST_MOVEMENT_MARGIN = 1;

export interface SpriteFrame {
  x: number;
  y: number;
  flipX?: boolean;
}

export interface PokemonSprite {
  name: string;
  generation: PokemonGeneration;
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
  id: string;
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

interface SelectedPokemon {
  id: string;
  sprite: PokemonSprite;
  status: 'caught' | 'wild';
  x: number;
  y: number;
  direction: Direction;
  frameIndex: number;
  caughtAt?: GridPoint;
}

interface CaughtPokemon {
  id: string;
  sprite: PokemonSprite;
  x: number;
  y: number;
  direction: Direction;
  frameIndex: number;
  caughtAt: GridPoint;
}

interface ReleaseAnimation {
  x: number;
  y: number;
  startedAt: number;
}

interface SpriteSheetPixels {
  data: Uint8ClampedArray;
  width: number;
}

interface PixelColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface CollisionBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
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
const POKEMON_COUNT = 16;
const RANDOM_PATH_TILE_COUNT = 48;
const RANDOM_GROUND_DETAIL_CHANCE = 0.18;
const RELEASE_ANIMATION_DURATION = 820;
export const SPRITE_SHEET_WIDTH = 1024;
export const SPRITE_SHEET_HEIGHT = 5792;
const FRAME_PREVIEW_SCALE = 2;
const DIRECTIONS: Direction[] = ['down', 'left', 'right', 'up'];
const DISPLAY_DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];
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

export type PokemonGeneration = 1 | 2 | 3 | 4 | 5;
type PokemonSpawnMode = 'clear' | 'random' | PokemonGeneration;
type PokemonType =
  | 'bug'
  | 'dark'
  | 'electric'
  | 'fairy'
  | 'fighting'
  | 'fire'
  | 'flying'
  | 'ghost'
  | 'grass'
  | 'ground'
  | 'normal'
  | 'poison'
  | 'psychic'
  | 'rock'
  | 'water';
type PokemonStatName = 'attack' | 'defense' | 'hp' | 'spAttack' | 'spDefense' | 'speed';

interface PokemonMetadata {
  ability: string;
  category: string;
  types: PokemonType[];
}

const frame = (x: number, y: number, flipX = false): SpriteFrame => ({ x, y, ...(flipX ? { flipX } : {}) });

// eslint-disable-next-line react-refresh/only-export-components
export const POKEMON_GENERATIONS: PokemonGeneration[] = [1, 2, 3, 4, 5];
const POKEMON_STAT_LABELS: Record<PokemonStatName, string> = {
  attack: 'ATK',
  defense: 'DEF',
  hp: 'HP',
  spAttack: 'SP.ATK',
  spDefense: 'SP.DEF',
  speed: 'SPD',
};

const POKEMON_METADATA: Record<string, PokemonMetadata> = {
  audino: { ability: 'Healer', category: 'Hearing', types: ['normal'] },
  azurill: { ability: 'Huge Power', category: 'Polka Dot', types: ['normal', 'fairy'] },
  basculin: { ability: 'Adaptability', category: 'Hostile', types: ['water'] },
  bidoof: { ability: 'Simple', category: 'Plump Mouse', types: ['normal'] },
  budew: { ability: 'Natural Cure', category: 'Bud', types: ['grass', 'poison'] },
  buizel: { ability: 'Swift Swim', category: 'Sea Weasel', types: ['water'] },
  bulbasaur: { ability: 'Overgrow', category: 'Seed', types: ['grass', 'poison'] },
  buneary: { ability: 'Run Away', category: 'Rabbit', types: ['normal'] },
  caterpie: { ability: 'Shield Dust', category: 'Worm', types: ['bug'] },
  charmander: { ability: 'Blaze', category: 'Lizard', types: ['fire'] },
  charmeleon: { ability: 'Blaze', category: 'Flame', types: ['fire'] },
  cherubi: { ability: 'Chlorophyll', category: 'Cherry', types: ['grass'] },
  chinchou: { ability: 'Volt Absorb', category: 'Angler', types: ['water', 'electric'] },
  clefairy: { ability: 'Cute Charm', category: 'Fairy', types: ['fairy'] },
  cleffa: { ability: 'Cute Charm', category: 'Star Shape', types: ['fairy'] },
  drifloon: { ability: 'Aftermath', category: 'Balloon', types: ['ghost', 'flying'] },
  eevee: { ability: 'Run Away', category: 'Evolution', types: ['normal'] },
  hoothoot: { ability: 'Insomnia', category: 'Owl', types: ['normal', 'flying'] },
  igglybuff: { ability: 'Cute Charm', category: 'Balloon', types: ['normal', 'fairy'] },
  ivysaur: { ability: 'Overgrow', category: 'Seed', types: ['grass', 'poison'] },
  jigglypuff: { ability: 'Cute Charm', category: 'Balloon', types: ['normal', 'fairy'] },
  kricketot: { ability: 'Shed Skin', category: 'Cricket', types: ['bug'] },
  ledyba: { ability: 'Swarm', category: 'Five Star', types: ['bug', 'flying'] },
  lotad: { ability: 'Swift Swim', category: 'Water Weed', types: ['water', 'grass'] },
  machop: { ability: 'Guts', category: 'Superpower', types: ['fighting'] },
  mareep: { ability: 'Static', category: 'Wool', types: ['electric'] },
  marill: { ability: 'Huge Power', category: 'Aqua Mouse', types: ['water', 'fairy'] },
  meowth: { ability: 'Pickup', category: 'Scratch Cat', types: ['normal'] },
  minun: { ability: 'Minus', category: 'Cheering', types: ['electric'] },
  mudkip: { ability: 'Torrent', category: 'Mud Fish', types: ['water'] },
  natu: { ability: 'Synchronize', category: 'Tiny Bird', types: ['psychic', 'flying'] },
  oddish: { ability: 'Chlorophyll', category: 'Weed', types: ['grass', 'poison'] },
  pachirisu: { ability: 'Run Away', category: 'EleSquirrel', types: ['electric'] },
  panpour: { ability: 'Gluttony', category: 'Spray', types: ['water'] },
  pansage: { ability: 'Gluttony', category: 'Grass Monkey', types: ['grass'] },
  pansear: { ability: 'Gluttony', category: 'High Temp', types: ['fire'] },
  patrat: { ability: 'Keen Eye', category: 'Scout', types: ['normal'] },
  petilil: { ability: 'Chlorophyll', category: 'Bulb', types: ['grass'] },
  pichu: { ability: 'Static', category: 'Tiny Mouse', types: ['electric'] },
  pikachu: { ability: 'Static', category: 'Mouse', types: ['electric'] },
  piplup: { ability: 'Torrent', category: 'Penguin', types: ['water'] },
  plusle: { ability: 'Plus', category: 'Cheering', types: ['electric'] },
  poochyena: { ability: 'Run Away', category: 'Bite', types: ['dark'] },
  purrloin: { ability: 'Limber', category: 'Devious', types: ['dark'] },
  psyduck: { ability: 'Damp', category: 'Duck', types: ['water'] },
  ralts: { ability: 'Synchronize', category: 'Feeling', types: ['psychic', 'fairy'] },
  roggenrola: { ability: 'Sturdy', category: 'Mantle', types: ['rock'] },
  sableye: { ability: 'Keen Eye', category: 'Darkness', types: ['dark', 'ghost'] },
  sandile: { ability: 'Intimidate', category: 'Desert Croc', types: ['ground', 'dark'] },
  seedot: { ability: 'Chlorophyll', category: 'Acorn', types: ['grass'] },
  sentret: { ability: 'Run Away', category: 'Scout', types: ['normal'] },
  sewaddle: { ability: 'Swarm', category: 'Sewing', types: ['bug', 'grass'] },
  shinx: { ability: 'Rivalry', category: 'Flash', types: ['electric'] },
  skitty: { ability: 'Cute Charm', category: 'Kitten', types: ['normal'] },
  slakoth: { ability: 'Truant', category: 'Slacker', types: ['normal'] },
  spinarak: { ability: 'Swarm', category: 'String Spit', types: ['bug', 'poison'] },
  squirtle: { ability: 'Torrent', category: 'Tiny Turtle', types: ['water'] },
  taillow: { ability: 'Guts', category: 'Tiny Swallow', types: ['normal', 'flying'] },
  timburr: { ability: 'Guts', category: 'Muscular', types: ['fighting'] },
  torchic: { ability: 'Blaze', category: 'Chick', types: ['fire'] },
  togepi: { ability: 'Hustle', category: 'Spike Ball', types: ['fairy'] },
  treecko: { ability: 'Overgrow', category: 'Wood Gecko', types: ['grass'] },
  turtwig: { ability: 'Overgrow', category: 'Tiny Leaf', types: ['grass'] },
  tympole: { ability: 'Swift Swim', category: 'Tadpole', types: ['water'] },
  venipede: { ability: 'Poison Point', category: 'Centipede', types: ['bug', 'poison'] },
  wartortle: { ability: 'Torrent', category: 'Turtle', types: ['water'] },
  weedle: { ability: 'Shield Dust', category: 'Hairy Bug', types: ['bug', 'poison'] },
  wingull: { ability: 'Keen Eye', category: 'Seagull', types: ['water', 'flying'] },
  wooper: { ability: 'Damp', category: 'Water Fish', types: ['water', 'ground'] },
  zigzagoon: { ability: 'Pickup', category: 'Zigzag', types: ['normal'] },
};
// eslint-disable-next-line react-refresh/only-export-components
export const POKEMON_SPRITES: PokemonSprite[] = [
  { name: 'bulbasaur', generation: 1, w: 32, h: 32, frames: { up: [frame(0, 0), frame(32, 0)], down: [frame(0, 32), frame(32, 32)], left: [frame(0, 64), frame(32, 64)], right: [frame(0, 96), frame(32, 96)] } },
  { name: 'ivysaur', generation: 1, w: 32, h: 32, frames: { up: [frame(64, 0), frame(96, 0)], down: [frame(64, 32), frame(96, 32)], left: [frame(64, 64), frame(96, 64)], right: [frame(64, 96), frame(96, 96)] } },
  { name: 'charmander', generation: 1, w: 32, h: 32, frames: { up: [frame(192, 0), frame(224, 0)], down: [frame(192, 32), frame(224, 32)], left: [frame(192, 64), frame(224, 64)], right: [frame(192, 96), frame(224, 96)] } },
  { name: 'charmeleon', generation: 1, w: 32, h: 32, frames: { up: [frame(256, 0), frame(288, 0)], down: [frame(256, 32), frame(288, 32)], left: [frame(256, 64), frame(288, 64)], right: [frame(256, 96), frame(288, 96)] } },
  { name: 'squirtle', generation: 1, w: 32, h: 32, frames: { up: [frame(384, 0), frame(416, 0)], down: [frame(384, 32), frame(416, 32)], left: [frame(384, 64), frame(416, 64)], right: [frame(384, 96), frame(416, 96)] } },
  { name: 'wartortle', generation: 1, w: 32, h: 32, frames: { up: [frame(448, 0), frame(480, 0)], down: [frame(448, 32), frame(480, 32)], left: [frame(448, 64), frame(480, 64)], right: [frame(448, 96), frame(480, 96)] } },
  { name: 'caterpie', generation: 1, w: 32, h: 32, frames: { up: [frame(576, 0), frame(608, 0)], down: [frame(576, 32), frame(608, 32)], left: [frame(576, 64), frame(608, 64)], right: [frame(576, 96), frame(608, 96)] } },
  { name: 'weedle', generation: 1, w: 32, h: 32, frames: { up: [frame(768, 0), frame(800, 0)], down: [frame(768, 32), frame(800, 32)], left: [frame(768, 64), frame(800, 64)], right: [frame(768, 96), frame(800, 96)] } },
  { name: 'pikachu', generation: 1, w: 32, h: 32, frames: { up: [frame(512, 128), frame(544, 128)], down: [frame(512, 160), frame(544, 160)], left: [frame(512, 192), frame(544, 192)], right: [frame(512, 224), frame(544, 224)] } },
  { name: 'clefairy', generation: 1, w: 32, h: 32, frames: { up: [frame(128, 256), frame(160, 256)], down: [frame(128, 288), frame(160, 288)], left: [frame(128, 320), frame(160, 320)], right: [frame(128, 352), frame(160, 352)] } },
  { name: 'jigglypuff', generation: 1, w: 32, h: 32, frames: { up: [frame(384, 256), frame(416, 256)], down: [frame(384, 288), frame(416, 288)], left: [frame(384, 320), frame(416, 320)], right: [frame(384, 352), frame(416, 352)] } },
  { name: 'oddish', generation: 1, w: 32, h: 32, frames: { up: [frame(640, 256), frame(672, 256)], down: [frame(640, 288), frame(672, 288)], left: [frame(640, 320), frame(672, 320)], right: [frame(640, 352), frame(672, 352)] } },
  { name: 'meowth', generation: 1, w: 32, h: 32, frames: { up: [frame(192, 384), frame(224, 384)], down: [frame(192, 416), frame(224, 416)], left: [frame(192, 448), frame(224, 448)], right: [frame(192, 480), frame(224, 480)] } },
  { name: 'psyduck', generation: 1, w: 32, h: 32, frames: { up: [frame(320, 384), frame(352, 384)], down: [frame(320, 416), frame(352, 416)], left: [frame(320, 448), frame(352, 448)], right: [frame(320, 480), frame(352, 480)] } },
  { name: 'machop', generation: 1, w: 32, h: 32, frames: { up: [frame(64, 512), frame(96, 512)], down: [frame(64, 544), frame(96, 544)], left: [frame(64, 576), frame(96, 576)], right: [frame(64, 608), frame(96, 608)] } },
  { name: 'eevee', generation: 1, w: 32, h: 32, frames: { up: [frame(256, 1024), frame(288, 1024)], down: [frame(256, 1056), frame(288, 1056)], left: [frame(256, 1088), frame(288, 1088)], right: [frame(256, 1120), frame(288, 1120)] } },
  { name: 'sentret', generation: 2, w: 32, h: 32, frames: { up: [frame(0, 1280), frame(32, 1280)], down: [frame(0, 1312), frame(32, 1312)], left: [frame(0, 1344), frame(32, 1344)], right: [frame(0, 1376), frame(32, 1376)] } },
  { name: 'hoothoot', generation: 2, w: 32, h: 32, frames: { up: [frame(128, 1280), frame(160, 1280)], down: [frame(128, 1312), frame(160, 1312)], left: [frame(128, 1344), frame(160, 1344)], right: [frame(128, 1376), frame(160, 1376)] } },
  { name: 'ledyba', generation: 2, w: 32, h: 32, frames: { up: [frame(256, 1280), frame(288, 1280)], down: [frame(256, 1312), frame(288, 1312)], left: [frame(256, 1344), frame(288, 1344)], right: [frame(256, 1376), frame(288, 1376)] } },
  { name: 'spinarak', generation: 2, w: 32, h: 32, frames: { up: [frame(384, 1280), frame(416, 1280)], down: [frame(384, 1312), frame(416, 1312)], left: [frame(384, 1344), frame(416, 1344)], right: [frame(384, 1376), frame(416, 1376)] } },
  { name: 'chinchou', generation: 2, w: 32, h: 32, frames: { up: [frame(576, 1280), frame(608, 1280)], down: [frame(576, 1312), frame(608, 1312)], left: [frame(576, 1344), frame(608, 1344)], right: [frame(576, 1376), frame(608, 1376)] } },
  { name: 'pichu', generation: 2, w: 32, h: 32, frames: { up: [frame(704, 1280), frame(736, 1280)], down: [frame(704, 1312), frame(736, 1312)], left: [frame(704, 1344), frame(736, 1344)], right: [frame(704, 1376), frame(736, 1376)] } },
  { name: 'cleffa', generation: 2, w: 32, h: 32, frames: { up: [frame(768, 1280), frame(800, 1280)], down: [frame(768, 1312), frame(800, 1312)], left: [frame(768, 1344), frame(800, 1344)], right: [frame(768, 1376), frame(800, 1376)] } },
  { name: 'igglybuff', generation: 2, w: 32, h: 32, frames: { up: [frame(832, 1280), frame(864, 1280)], down: [frame(832, 1312), frame(864, 1312)], left: [frame(832, 1344), frame(864, 1344)], right: [frame(832, 1376), frame(864, 1376)] } },
  { name: 'togepi', generation: 2, w: 32, h: 32, frames: { up: [frame(896, 1280), frame(928, 1280)], down: [frame(896, 1312), frame(928, 1312)], left: [frame(896, 1344), frame(928, 1344)], right: [frame(896, 1376), frame(928, 1376)] } },
  { name: 'natu', generation: 2, w: 32, h: 32, frames: { up: [frame(0, 1408), frame(32, 1408)], down: [frame(0, 1440), frame(32, 1440)], left: [frame(0, 1472), frame(32, 1472)], right: [frame(0, 1504), frame(32, 1504)] } },
  { name: 'mareep', generation: 2, w: 32, h: 32, frames: { up: [frame(128, 1408), frame(160, 1408)], down: [frame(128, 1440), frame(160, 1440)], left: [frame(128, 1472), frame(160, 1472)], right: [frame(128, 1504), frame(160, 1504)] } },
  { name: 'marill', generation: 2, w: 32, h: 32, frames: { up: [frame(384, 1408), frame(416, 1408)], down: [frame(384, 1440), frame(416, 1440)], left: [frame(384, 1472), frame(416, 1472)], right: [frame(384, 1504), frame(416, 1504)] } },
  { name: 'wooper', generation: 2, w: 32, h: 32, frames: { up: [frame(64, 1536), frame(96, 1536)], down: [frame(64, 1568), frame(96, 1568)], left: [frame(64, 1600), frame(96, 1600)], right: [frame(64, 1632), frame(96, 1632)] } },
  { name: 'treecko', generation: 3, w: 32, h: 32, frames: { up: [frame(128, 2304), frame(160, 2304)], down: [frame(128, 2336), frame(160, 2336)], left: [frame(128, 2368), frame(160, 2368)], right: [frame(128, 2400), frame(160, 2400)] } },
  { name: 'torchic', generation: 3, w: 32, h: 32, frames: { up: [frame(320, 2304), frame(352, 2304)], down: [frame(320, 2336), frame(352, 2336)], left: [frame(320, 2368), frame(352, 2368)], right: [frame(320, 2400), frame(352, 2400)] } },
  { name: 'mudkip', generation: 3, w: 32, h: 32, frames: { up: [frame(512, 2304), frame(544, 2304)], down: [frame(512, 2336), frame(544, 2336)], left: [frame(512, 2368), frame(544, 2368)], right: [frame(512, 2400), frame(544, 2400)] } },
  { name: 'poochyena', generation: 3, w: 32, h: 32, frames: { up: [frame(704, 2304), frame(736, 2304)], down: [frame(704, 2336), frame(736, 2336)], left: [frame(704, 2368), frame(736, 2368)], right: [frame(704, 2400), frame(736, 2400)] } },
  { name: 'zigzagoon', generation: 3, w: 32, h: 32, frames: { up: [frame(832, 2304), frame(864, 2304)], down: [frame(832, 2336), frame(864, 2336)], left: [frame(832, 2368), frame(864, 2368)], right: [frame(832, 2400), frame(864, 2400)] } },
  { name: 'lotad', generation: 3, w: 32, h: 32, frames: { up: [frame(256, 2432), frame(288, 2432)], down: [frame(256, 2464), frame(288, 2464)], left: [frame(256, 2496), frame(288, 2496)], right: [frame(256, 2528), frame(288, 2528)] } },
  { name: 'seedot', generation: 3, w: 32, h: 32, frames: { up: [frame(448, 2432), frame(480, 2432)], down: [frame(448, 2464), frame(480, 2464)], left: [frame(448, 2496), frame(480, 2496)], right: [frame(448, 2528), frame(480, 2528)] } },
  { name: 'taillow', generation: 3, w: 32, h: 32, frames: { up: [frame(640, 2432), frame(672, 2432)], down: [frame(640, 2464), frame(672, 2464)], left: [frame(640, 2496), frame(672, 2496)], right: [frame(640, 2528), frame(672, 2528)] } },
  { name: 'wingull', generation: 3, w: 32, h: 32, frames: { up: [frame(768, 2432), frame(800, 2432)], down: [frame(768, 2464), frame(800, 2464)], left: [frame(768, 2496), frame(800, 2496)], right: [frame(768, 2528), frame(800, 2528)] } },
  { name: 'ralts', generation: 3, w: 32, h: 32, frames: { up: [frame(896, 2432), frame(928, 2432)], down: [frame(896, 2464), frame(928, 2464)], left: [frame(896, 2496), frame(928, 2496)], right: [frame(896, 2528), frame(928, 2528)] } },
  { name: 'slakoth', generation: 3, w: 32, h: 32, frames: { up: [frame(320, 2560), frame(352, 2560)], down: [frame(320, 2592), frame(352, 2592)], left: [frame(320, 2624), frame(352, 2624)], right: [frame(320, 2656), frame(352, 2656)] } },
  { name: 'azurill', generation: 3, w: 32, h: 32, frames: { up: [frame(0, 2688), frame(32, 2688)], down: [frame(0, 2720), frame(32, 2720)], left: [frame(0, 2752), frame(32, 2752)], right: [frame(0, 2784), frame(32, 2784)] } },
  { name: 'skitty', generation: 3, w: 32, h: 32, frames: { up: [frame(128, 2688), frame(160, 2688)], down: [frame(128, 2720), frame(160, 2720)], left: [frame(128, 2752), frame(160, 2752)], right: [frame(128, 2784), frame(160, 2784)] } },
  { name: 'sableye', generation: 3, w: 32, h: 32, frames: { up: [frame(256, 2688), frame(288, 2688)], down: [frame(256, 2720), frame(288, 2720)], left: [frame(256, 2752), frame(288, 2752)], right: [frame(256, 2784), frame(288, 2784)] } },
  { name: 'plusle', generation: 3, w: 32, h: 32, frames: { up: [frame(832, 2688), frame(864, 2688)], down: [frame(832, 2720), frame(864, 2720)], left: [frame(832, 2752), frame(864, 2752)], right: [frame(832, 2784), frame(864, 2784)] } },
  { name: 'minun', generation: 3, w: 32, h: 32, frames: { up: [frame(896, 2688), frame(928, 2688)], down: [frame(896, 2720), frame(928, 2720)], left: [frame(896, 2752), frame(928, 2752)], right: [frame(896, 2784), frame(928, 2784)] } },
  { name: 'turtwig', generation: 4, w: 32, h: 32, frames: { up: [frame(512, 3712), frame(544, 3712)], down: [frame(512, 3744), frame(544, 3744)], left: [frame(512, 3776), frame(544, 3776)], right: [frame(512, 3808), frame(544, 3808)] } },
  { name: 'chimchar', generation: 4, w: 32, h: 32, frames: { up: [frame(768, 3712), frame(800, 3712)], down: [frame(768, 3744), frame(800, 3744)], left: [frame(768, 3776), frame(800, 3776)], right: [frame(768, 3808), frame(800, 3808)] } },
  { name: 'piplup', generation: 4, w: 32, h: 32, frames: { up: [frame(960, 3712), frame(992, 3712)], down: [frame(960, 3744), frame(992, 3744)], left: [frame(960, 3776), frame(992, 3776)], right: [frame(960, 3808), frame(992, 3808)] } },
  { name: 'bidoof', generation: 4, w: 32, h: 32, frames: { up: [frame(320, 3840), frame(352, 3840)], down: [frame(320, 3872), frame(352, 3872)], left: [frame(320, 3904), frame(352, 3904)], right: [frame(320, 3936), frame(352, 3936)] } },
  { name: 'kricketot', generation: 4, w: 32, h: 32, frames: { up: [frame(448, 3840), frame(480, 3840)], down: [frame(448, 3872), frame(480, 3872)], left: [frame(448, 3904), frame(480, 3904)], right: [frame(448, 3936), frame(480, 3936)] } },
  { name: 'shinx', generation: 4, w: 32, h: 32, frames: { up: [frame(512, 3840), frame(544, 3840)], down: [frame(512, 3872), frame(544, 3872)], left: [frame(512, 3904), frame(544, 3904)], right: [frame(512, 3936), frame(544, 3936)] } },
  { name: 'budew', generation: 4, w: 32, h: 32, frames: { up: [frame(768, 3840), frame(800, 3840)], down: [frame(768, 3872), frame(800, 3872)], left: [frame(768, 3904), frame(800, 3904)], right: [frame(768, 3936), frame(800, 3936)] } },
  { name: 'pachirisu', generation: 4, w: 32, h: 32, frames: { up: [frame(384, 3968), frame(416, 3968)], down: [frame(384, 4000), frame(416, 4000)], left: [frame(384, 4032), frame(416, 4032)], right: [frame(384, 4064), frame(416, 4064)] } },
  { name: 'buizel', generation: 4, w: 32, h: 32, frames: { up: [frame(512, 3968), frame(544, 3968)], down: [frame(512, 4000), frame(544, 4000)], left: [frame(512, 4032), frame(544, 4032)], right: [frame(512, 4064), frame(544, 4064)] } },
  { name: 'cherubi', generation: 4, w: 32, h: 32, frames: { up: [frame(640, 3968), frame(672, 3968)], down: [frame(640, 4000), frame(672, 4000)], left: [frame(640, 4032), frame(672, 4032)], right: [frame(640, 4064), frame(672, 4064)] } },
  { name: 'drifloon', generation: 4, w: 32, h: 32, frames: { up: [frame(896, 3968), frame(928, 3968)], down: [frame(896, 4000), frame(928, 4000)], left: [frame(896, 4032), frame(928, 4032)], right: [frame(896, 4064), frame(928, 4064)] } },
  { name: 'buneary', generation: 4, w: 32, h: 32, frames: { up: [frame(0, 4096), frame(32, 4096)], down: [frame(0, 4128), frame(32, 4128)], left: [frame(0, 4160), frame(32, 4160)], right: [frame(0, 4192), frame(32, 4192)] } },
  { name: 'patrat', generation: 5, w: 32, h: 32, frames: { up: [frame(64, 5248), frame(96, 5248)], down: [frame(64, 5280), frame(96, 5280)], left: [frame(64, 5312), frame(96, 5312)], right: [frame(64, 5344), frame(96, 5344)] } },
  { name: 'purrloin', generation: 5, w: 32, h: 32, frames: { up: [frame(128, 5248), frame(160, 5248)], down: [frame(128, 5280), frame(160, 5280)], left: [frame(128, 5312), frame(160, 5312)], right: [frame(128, 5344), frame(160, 5344)] } },
  { name: 'pansage', generation: 5, w: 32, h: 32, frames: { up: [frame(192, 5248), frame(224, 5248)], down: [frame(192, 5280), frame(224, 5280)], left: [frame(192, 5312), frame(224, 5312)], right: [frame(192, 5344), frame(224, 5344)] } },
  { name: 'pansear', generation: 5, w: 32, h: 32, frames: { up: [frame(256, 5248), frame(288, 5248)], down: [frame(256, 5280), frame(288, 5280)], left: [frame(256, 5312), frame(288, 5312)], right: [frame(256, 5344), frame(288, 5344)] } },
  { name: 'panpour', generation: 5, w: 32, h: 32, frames: { up: [frame(320, 5248), frame(352, 5248)], down: [frame(320, 5280), frame(352, 5280)], left: [frame(320, 5312), frame(352, 5312)], right: [frame(320, 5344), frame(352, 5344)] } },
  { name: 'roggenrola', generation: 5, w: 32, h: 32, frames: { up: [frame(576, 5376), frame(608, 5376)], down: [frame(576, 5408), frame(608, 5408)], left: [frame(576, 5440), frame(608, 5440)], right: [frame(576, 5472), frame(608, 5472)] } },
  { name: 'audino', generation: 5, w: 32, h: 32, frames: { up: [frame(640, 5376), frame(672, 5376)], down: [frame(640, 5408), frame(672, 5408)], left: [frame(640, 5440), frame(672, 5440)], right: [frame(640, 5472), frame(672, 5472)] } },
  { name: 'timburr', generation: 5, w: 32, h: 32, frames: { up: [frame(704, 5376), frame(736, 5376)], down: [frame(704, 5408), frame(736, 5408)], left: [frame(704, 5440), frame(736, 5440)], right: [frame(704, 5472), frame(736, 5472)] } },
  { name: 'tympole', generation: 5, w: 32, h: 32, frames: { up: [frame(768, 5376), frame(800, 5376)], down: [frame(768, 5408), frame(800, 5408)], left: [frame(768, 5440), frame(800, 5440)], right: [frame(768, 5472), frame(800, 5472)] } },
  { name: 'sewaddle', generation: 5, w: 32, h: 32, frames: { up: [frame(960, 5376), frame(992, 5376)], down: [frame(960, 5408), frame(992, 5408)], left: [frame(960, 5440), frame(992, 5440)], right: [frame(960, 5472), frame(992, 5472)] } },
  { name: 'venipede', generation: 5, w: 32, h: 32, frames: { up: [frame(0, 5504), frame(32, 5504)], down: [frame(0, 5536), frame(32, 5536)], left: [frame(0, 5568), frame(32, 5568)], right: [frame(0, 5600), frame(32, 5600)] } },
  { name: 'petilil', generation: 5, w: 32, h: 32, frames: { up: [frame(192, 5504), frame(224, 5504)], down: [frame(192, 5536), frame(224, 5536)], left: [frame(192, 5568), frame(224, 5568)], right: [frame(192, 5600), frame(224, 5600)] } },
  { name: 'basculin', generation: 5, w: 32, h: 32, frames: { up: [frame(256, 5504), frame(288, 5504)], down: [frame(256, 5536), frame(288, 5536)], left: [frame(256, 5568), frame(288, 5568)], right: [frame(256, 5600), frame(288, 5600)] } },
  { name: 'sandile', generation: 5, w: 32, h: 32, frames: { up: [frame(512, 5504), frame(544, 5504)], down: [frame(512, 5536), frame(544, 5536)], left: [frame(512, 5568), frame(544, 5568)], right: [frame(512, 5600), frame(544, 5600)] } },
];

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
const randomInt = (min: number, max: number) => Math.floor(randomRange(min, max + 1));
const randomDirection = () => DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const shuffle = <T,>(items: T[]) => {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};
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

const drawImageRandomInTile = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cellX: number,
  cellY: number,
) => {
  const maxOffsetX = Math.max(0, TILE - image.width);
  const maxOffsetY = Math.max(0, TILE - image.height);
  const offsetX = maxOffsetX > 0 ? randomInt(0, maxOffsetX) : Math.floor(maxOffsetX / 2);
  const offsetY = maxOffsetY > 0 ? randomInt(0, maxOffsetY) : Math.floor(maxOffsetY / 2);

  ctx.drawImage(image, cellX * TILE + offsetX, cellY * TILE + offsetY);
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

const scatterPathTiles = (terrain: TileKind[][], walkable: boolean[][]) => {
  let placed = 0;
  let attempts = 0;

  while (placed < RANDOM_PATH_TILE_COUNT && attempts < RANDOM_PATH_TILE_COUNT * 12) {
    attempts += 1;
    const x = randomInt(3, MAP_COLS - 4);
    const y = randomInt(4, MAP_ROWS - 5);

    if (terrain[y][x] !== 'grass' || isForestNear(terrain, x, y)) continue;

    terrain[y][x] = 'path';
    walkable[y][x] = true;
    placed += 1;

    if (Math.random() > 0.62) {
      continue;
    }

    const direction = pick([
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ]);
    const nx = x + direction.x;
    const ny = y + direction.y;

    if (terrain[ny]?.[nx] === 'grass' && !isForestNear(terrain, nx, ny)) {
      terrain[ny][nx] = 'path';
      walkable[ny][nx] = true;
      placed += 1;
    }
  }
};

const applyForestMovementBuffer = (terrain: TileKind[][], walkable: boolean[][]) => {
  const blocked = createGrid(false);

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (terrain[y][x] !== 'forest') continue;

      for (let by = y - FOREST_MOVEMENT_MARGIN; by <= y + FOREST_MOVEMENT_MARGIN; by += 1) {
        for (let bx = x - FOREST_MOVEMENT_MARGIN; bx <= x + FOREST_MOVEMENT_MARGIN; bx += 1) {
          if (blocked[by]?.[bx] !== undefined) blocked[by][bx] = true;
        }
      }
    }
  }

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (blocked[y][x]) walkable[y][x] = false;
    }
  }
};

const applyTallGrassMovementBlock = (walkable: boolean[][], tallGrassPatches: TallGrassPatchGrid) => {
  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (tallGrassPatches[y][x] !== null) walkable[y][x] = false;
    }
  }
};

const collectSpawnCells = (walkable: boolean[][]) => {
  const spawnCells: GridPoint[] = [];

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (walkable[y][x] && x > 2 && x < MAP_COLS - 3 && y > 3 && y < MAP_ROWS - 4) {
        spawnCells.push({ x, y });
      }
    }
  }

  return spawnCells;
};

const generateTerrain = (profile: MapProfile) => {
  const terrain = createGrid<TileKind>('grass');
  const walkable = createGrid(false);
  const center = {
    x: CENTER_PLAZA.x + Math.floor(CENTER_PLAZA.w / 2),
    y: CENTER_PLAZA.y + Math.floor(CENTER_PLAZA.h / 2),
  };

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      walkable[y][x] = isPlayableCell(x, y);
    }
  }

  applyForestBoundary(terrain, walkable);
  scatterPathTiles(terrain, walkable);

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

  applyForestMovementBuffer(terrain, walkable);

  return { terrain, walkable };
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
  const targetTiles = randomInt(54, 86);
  let patchTiles = 0;
  let attempts = 0;
  const typeCount = Math.max(1, patchTypeCount);

  while (patchTiles < targetTiles && attempts < 90) {
    attempts += 1;
    const patchType = randomInt(0, typeCount - 1);
    const center = {
      x: randomInt(4, MAP_COLS - 5),
      y: randomInt(4, MAP_ROWS - 5),
    };
    const radiusX = randomInt(0, 2);
    const radiusY = randomInt(0, 2);

    for (let y = center.y - radiusY; y <= center.y + radiusY; y += 1) {
      for (let x = center.x - radiusX; x <= center.x + radiusX; x += 1) {
        if (
          terrain[y]?.[x] !== 'grass' ||
          reserved[y]?.[x] ||
          isForestNear(terrain, x, y)
        ) {
          continue;
        }

        const nx = radiusX === 0 ? 0 : (x - center.x) / radiusX;
        const ny = radiusY === 0 ? 0 : (y - center.y) / radiusY;
        const distance = nx * nx + ny * ny;
        const raggedEdge = Math.sin(x * 1.7 + y * 0.9) * 0.1 + Math.random() * 0.18;

        if ((radiusX === 0 && radiusY === 0 ? true : distance < 0.9 + raggedEdge) && patches[y][x] === null) {
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

const drawGroundDetails = (
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
        tallGrassPatches[y][x] !== null
      ) {
        continue;
      }

      const forestNeighbors = countTerrainNeighbors(terrain, x, y, ['forest']);
      const detailChance = forestNeighbors > 0
        ? Math.min(0.76, 0.28 + forestNeighbors * 0.12)
        : RANDOM_GROUND_DETAIL_CHANCE;

      if (Math.random() > detailChance) continue;

      ctx.globalAlpha = forestNeighbors >= 3 ? 0.84 : 0.68;
      drawImageRandomInTile(ctx, pick(assets.edgeDetails), x, y);
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
  const { terrain, walkable } = generateTerrain(profile);
  const { buildings, reserved } = createBuildingPlacements(terrain, profile);
  const tallGrassPatches = ENABLE_TALL_GRASS_PATCHES
    ? createTallGrassPatches(terrain, reserved, assets.tallGrassPatches.length)
    : createGrid<number | null>(null);
  applyTallGrassMovementBlock(walkable, tallGrassPatches);
  const spawnCells = collectSpawnCells(walkable);
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
        if (Math.random() > 0.72) {
          drawImageCenteredInTile(ctx, Math.random() > 0.5 ? assets.pathStone : assets.pathCrack, x, y);
        }
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
  drawGroundDetails(ctx, assets, terrain, tallGrassPatches);
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

const formatPokemonName = (name: string) => name.replace(/-/g, ' ');

const getPokemonMetadata = (sprite: PokemonSprite): PokemonMetadata =>
  POKEMON_METADATA[sprite.name] ?? {
    ability: 'Unknown',
    category: 'Field',
    types: ['normal'],
  };

const getPokemonStats = (sprite: PokemonSprite): Record<PokemonStatName, number> => {
  const seed = [...sprite.name].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), sprite.generation * 41);

  return {
    attack: 35 + ((seed * 5) % 82),
    defense: 35 + ((seed * 7) % 82),
    hp: 38 + ((seed * 3) % 84),
    spAttack: 35 + ((seed * 11) % 82),
    spDefense: 35 + ((seed * 13) % 82),
    speed: 35 + ((seed * 17) % 82),
  };
};

const toSelectedPokemon = (pokemon: WalkingPokemon, status: 'caught' | 'wild', caughtAt?: GridPoint): SelectedPokemon => ({
  id: pokemon.id,
  sprite: pokemon.sprite,
  status,
  x: pokemon.x,
  y: pokemon.y,
  direction: pokemon.direction,
  frameIndex: pokemon.frameIndex,
  caughtAt,
});

const toSelectedCaughtPokemon = (pokemon: CaughtPokemon): SelectedPokemon => ({
  id: pokemon.id,
  sprite: pokemon.sprite,
  status: 'caught',
  x: pokemon.x,
  y: pokemon.y,
  direction: pokemon.direction,
  frameIndex: pokemon.frameIndex,
  caughtAt: pokemon.caughtAt,
});

const setDirection = (pokemon: WalkingPokemon, direction: Direction) => {
  pokemon.direction = direction;
  pokemon.vx = DIRECTION_VELOCITY[direction].vx;
  pokemon.vy = DIRECTION_VELOCITY[direction].vy;
};

const pickDirection = (pokemon: WalkingPokemon, map: GeneratedMap, walkers: WalkingPokemon[]) => {
  const allowedDirections = DIRECTIONS.filter((direction) => {
    const velocity = DIRECTION_VELOCITY[direction];
    return canOccupyPosition(
      map,
      pokemon.sprite,
      pokemon.x + velocity.vx * TILE * 0.5,
      pokemon.y + velocity.vy * TILE * 0.5,
      walkers,
      pokemon,
    );
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

const getSpriteSheetPixels = (img: HTMLImageElement): SpriteSheetPixels | null => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const spriteCtx = canvas.getContext('2d', { willReadFrequently: true });
  if (!spriteCtx) return null;

  spriteCtx.drawImage(img, 0, 0);
  return {
    data: spriteCtx.getImageData(0, 0, img.width, img.height).data,
    width: img.width,
  };
};

const getPixelColor = (pixels: SpriteSheetPixels, x: number, y: number): PixelColor => {
  const index = (y * pixels.width + x) * 4;
  return {
    r: pixels.data[index],
    g: pixels.data[index + 1],
    b: pixels.data[index + 2],
    a: pixels.data[index + 3],
  };
};

const colorKey = (color: PixelColor) => `${color.r}:${color.g}:${color.b}:${color.a}`;

const getFrameBackgroundColor = (
  pixels: SpriteSheetPixels,
  sprite: PokemonSprite,
  spriteFrame: SpriteFrame,
) => {
  const counts = new Map<string, { color: PixelColor; count: number }>();

  for (let y = 0; y < sprite.h; y += 1) {
    for (let x = 0; x < sprite.w; x += 1) {
      const color = getPixelColor(pixels, spriteFrame.x + x, spriteFrame.y + y);
      const key = colorKey(color);
      const existing = counts.get(key);
      counts.set(key, { color, count: existing ? existing.count + 1 : 1 });
    }
  }

  const best = [...counts.values()].sort((a, b) => b.count - a.count)[0];
  return best && best.count > sprite.w * sprite.h * 0.24 ? best.color : null;
};

const isBasicSpriteFrame = (
  pixels: SpriteSheetPixels,
  sprite: PokemonSprite,
  spriteFrame: SpriteFrame,
) => {
  const background = getFrameBackgroundColor(pixels, sprite, spriteFrame);
  if (!background) return false;

  let paintedPixels = 0;
  const backgroundKey = colorKey(background);

  for (let y = 0; y < sprite.h; y += 1) {
    for (let x = 0; x < sprite.w; x += 1) {
      const color = getPixelColor(pixels, spriteFrame.x + x, spriteFrame.y + y);
      if (colorKey(color) === backgroundKey) continue;

      paintedPixels += 1;
    }
  }

  return paintedPixels >= 24 && paintedPixels <= 760;
};

const isBasicSprite = (sprite: PokemonSprite, pixels: SpriteSheetPixels) =>
  DIRECTIONS.every((direction) =>
    sprite.frames[direction].every((spriteFrame) => isBasicSpriteFrame(pixels, sprite, spriteFrame)),
  );

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

        const background = getFrameBackgroundColor({ data, width: offscreen.width }, sprite, spriteFrame);
        if (!background) continue;

        for (let y = spriteFrame.y; y < spriteFrame.y + sprite.h; y += 1) {
          for (let x = spriteFrame.x; x < spriteFrame.x + sprite.w; x += 1) {
            const i = (y * offscreen.width + x) * 4;
            if (
              data[i] === background.r &&
              data[i + 1] === background.g &&
              data[i + 2] === background.b &&
              data[i + 3] === background.a
            ) {
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

const getPokemonCollisionBox = (sprite: PokemonSprite, x: number, y: number): CollisionBox => ({
  left: x + 4,
  top: y + 6,
  right: x + sprite.w - 4,
  bottom: y + sprite.h - 2,
});

const boxesOverlap = (a: CollisionBox, b: CollisionBox, margin = 2) =>
  a.left < b.right + margin &&
  a.right + margin > b.left &&
  a.top < b.bottom + margin &&
  a.bottom + margin > b.top;

const canOccupyPosition = (
  map: GeneratedMap,
  sprite: PokemonSprite,
  x: number,
  y: number,
  walkers: WalkingPokemon[],
  self?: WalkingPokemon,
) => {
  if (!canOccupy(map, sprite, x, y)) return false;

  const nextBox = getPokemonCollisionBox(sprite, x, y);
  return walkers.every((walker) => {
    if (walker === self) return true;
    return !boxesOverlap(nextBox, getPokemonCollisionBox(walker.sprite, walker.x, walker.y));
  });
};

const getPokemonHitBox = (pokemon: WalkingPokemon): CollisionBox => ({
  left: pokemon.x,
  top: pokemon.y,
  right: pokemon.x + pokemon.sprite.w,
  bottom: pokemon.y + pokemon.sprite.h,
});

const isPointInBox = (x: number, y: number, box: CollisionBox) =>
  x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;

const findPokemonAtPoint = (walkers: WalkingPokemon[], x: number, y: number) =>
  [...walkers]
    .sort((a, b) => b.y - a.y)
    .find((pokemon) => isPointInBox(x, y, getPokemonHitBox(pokemon))) ?? null;

const createWalkerId = (sprite: PokemonSprite) => `${sprite.name}-${Math.random().toString(36).slice(2, 9)}`;

const createWalkerFromSprite = (
  sprite: PokemonSprite,
  x: number,
  y: number,
  id = createWalkerId(sprite),
): WalkingPokemon => {
  const direction = randomDirection();
  const walker: WalkingPokemon = {
    id,
    sprite,
    x,
    y,
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
  return walker;
};

const pickWalkerSprites = (sprites: PokemonSprite[], count: number) => {
  if (sprites.length === 0 || count <= 0) return [];

  const selected: PokemonSprite[] = [];
  const selectedNames = new Set<string>();
  const addSprite = (sprite: PokemonSprite) => {
    if (selected.length >= count || selectedNames.has(sprite.name)) return;
    selected.push(sprite);
    selectedNames.add(sprite.name);
  };

  POKEMON_GENERATIONS.forEach((generation) => {
    const generationSprites = sprites.filter((sprite) => sprite.generation === generation);
    if (generationSprites.length > 0) addSprite(pick(generationSprites));
  });

  for (const sprite of shuffle(sprites)) {
    addSprite(sprite);
    if (selected.length >= count) break;
  }

  return shuffle(selected);
};

const getSpawnSprites = (
  sprites: PokemonSprite[],
  spawnMode: PokemonSpawnMode,
  spawnCellCount: number,
) => {
  if (spawnMode === 'clear') return [];

  if (spawnMode === 'random') {
    return pickWalkerSprites(sprites, Math.min(POKEMON_COUNT, sprites.length, spawnCellCount));
  }

  return shuffle(sprites.filter((sprite) => sprite.generation === spawnMode));
};

const createWalker = (
  sprite: PokemonSprite,
  map: GeneratedMap,
  existingWalkers: WalkingPokemon[],
): WalkingPokemon | null => {
  const spawn = shuffle(map.spawnCells).find((cell) =>
    canOccupyPosition(map, sprite, cell.x * TILE, cell.y * TILE, existingWalkers),
  );
  if (!spawn) return null;

  const walker = createWalkerFromSprite(sprite, spawn.x * TILE, spawn.y * TILE);
  pickDirection(walker, map, existingWalkers);

  return walker;
};

const findReleaseSpot = (
  map: GeneratedMap,
  sprite: PokemonSprite,
  x: number,
  y: number,
  walkers: WalkingPokemon[],
) => {
  const targetCell = {
    x: clamp(Math.floor(x / TILE), 0, MAP_COLS - 1),
    y: clamp(Math.floor(y / TILE), 0, MAP_ROWS - 1),
  };
  const candidates = [...map.spawnCells].sort((a, b) => {
    const distanceA = Math.abs(a.x - targetCell.x) + Math.abs(a.y - targetCell.y);
    const distanceB = Math.abs(b.x - targetCell.x) + Math.abs(b.y - targetCell.y);
    return distanceA - distanceB;
  });

  return candidates.find((cell) => canOccupyPosition(map, sprite, cell.x * TILE, cell.y * TILE, walkers)) ?? null;
};

export const PokemonWorld = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const walkersRef = useRef<WalkingPokemon[]>([]);
  const generatedMapRef = useRef<GeneratedMap | null>(null);
  const processedSpriteCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const caughtPokemonRef = useRef<CaughtPokemon[]>([]);
  const selectedPokemonRef = useRef<SelectedPokemon | null>(null);
  const releaseAnimationsRef = useRef<ReleaseAnimation[]>([]);
  const [season] = useState<SeasonName>(() => pick([...SEASON_NAMES]));
  const [spawnMode, setSpawnMode] = useState<PokemonSpawnMode>('random');
  const [selectedPokemon, setSelectedPokemon] = useState<SelectedPokemon | null>(null);
  const [caughtPokemon, setCaughtPokemon] = useState<CaughtPokemon[]>([]);

  const selectPokemon = (pokemon: SelectedPokemon | null) => {
    selectedPokemonRef.current = pokemon;
    setSelectedPokemon(pokemon);
  };

  const setCaughtRoster = (pokemon: CaughtPokemon[]) => {
    caughtPokemonRef.current = pokemon;
    setCaughtPokemon(pokemon);
  };

  const catchSelectedPokemon = () => {
    const selected = selectedPokemonRef.current;
    if (!selected || selected.status !== 'wild') return;

    const walker = walkersRef.current.find((pokemon) => pokemon.id === selected.id);
    if (!walker) return;

    walkersRef.current = walkersRef.current.filter((pokemon) => pokemon.id !== walker.id);
    const caught: CaughtPokemon = {
      id: walker.id,
      sprite: walker.sprite,
      x: walker.x,
      y: walker.y,
      direction: walker.direction,
      frameIndex: walker.frameIndex,
      caughtAt: {
        x: Math.floor(walker.x / TILE),
        y: Math.floor(walker.y / TILE),
      },
    };

    setCaughtRoster([...caughtPokemonRef.current, caught]);
    selectPokemon(toSelectedCaughtPokemon(caught));
  };

  const releaseCaughtPokemon = (id: string, x?: number, y?: number) => {
    const map = generatedMapRef.current;
    const caught = caughtPokemonRef.current.find((pokemon) => pokemon.id === id);
    if (!map || !caught) return false;

    const releasePoint = {
      x: x ?? caught.caughtAt.x * TILE + TILE / 2,
      y: y ?? caught.caughtAt.y * TILE + TILE / 2,
    };
    const releaseCell = findReleaseSpot(map, caught.sprite, releasePoint.x, releasePoint.y, walkersRef.current);
    if (!releaseCell) return false;

    const walker = createWalkerFromSprite(caught.sprite, releaseCell.x * TILE, releaseCell.y * TILE, caught.id);
    walker.direction = caught.direction;
    walker.frameIndex = caught.frameIndex;
    setDirection(walker, caught.direction);
    pickDirection(walker, map, walkersRef.current);
    walkersRef.current = [...walkersRef.current, walker];
    setCaughtRoster(caughtPokemonRef.current.filter((pokemon) => pokemon.id !== id));
    releaseAnimationsRef.current.push({
      x: walker.x + walker.sprite.w / 2,
      y: walker.y + walker.sprite.h / 2,
      startedAt: performance.now(),
    });
    selectPokemon(toSelectedPokemon(walker, 'wild'));
    return true;
  };

  const handleCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    const clickedPokemon = findPokemonAtPoint(walkersRef.current, x, y);

    if (clickedPokemon) {
      selectPokemon(toSelectedPokemon(clickedPokemon, 'wild'));
      return;
    }

    const selected = selectedPokemonRef.current;
    if (selected?.status === 'caught') {
      releaseCaughtPokemon(selected.id, x, y);
    }
  };

  const getFramePreviewStyle = (spriteFrame: SpriteFrame, sprite: PokemonSprite) => ({
    width: `${sprite.w * FRAME_PREVIEW_SCALE}px`,
    height: `${sprite.h * FRAME_PREVIEW_SCALE}px`,
    backgroundImage: `url(${overworldSheet})`,
    backgroundPosition: `-${spriteFrame.x * FRAME_PREVIEW_SCALE}px -${spriteFrame.y * FRAME_PREVIEW_SCALE}px`,
    backgroundSize: `${SPRITE_SHEET_WIDTH * FRAME_PREVIEW_SCALE}px ${SPRITE_SHEET_HEIGHT * FRAME_PREVIEW_SCALE}px`,
    transform: spriteFrame.flipX ? 'scaleX(-1)' : undefined,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId = 0;
    let lastTime = 0;
    let cancelled = false;

    canvas.width = MAP_W;
    canvas.height = MAP_H;
    ctx.imageSmoothingEnabled = false;

    const drawWalker = (pokemon: WalkingPokemon) => {
      if (!processedSpriteCanvasRef.current) return;

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

      if (spriteFrame.flipX) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          processedSpriteCanvasRef.current,
          spriteFrame.x,
          spriteFrame.y,
          pokemon.sprite.w,
          pokemon.sprite.h,
          -drawX - pokemon.sprite.w,
          drawY,
          pokemon.sprite.w,
          pokemon.sprite.h,
        );
        ctx.restore();
      } else {
        ctx.drawImage(
          processedSpriteCanvasRef.current,
          spriteFrame.x,
          spriteFrame.y,
          pokemon.sprite.w,
          pokemon.sprite.h,
          drawX,
          drawY,
          pokemon.sprite.w,
          pokemon.sprite.h,
        );
      }
    };

    const drawReleaseAnimations = () => {
      const now = performance.now();
      releaseAnimationsRef.current = releaseAnimationsRef.current.filter((animation) => {
        const progress = (now - animation.startedAt) / RELEASE_ANIMATION_DURATION;
        if (progress >= 1) return false;

        const eased = 1 - (1 - progress) * (1 - progress);
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = '#e53935';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(animation.x, animation.y, 7 + eased * 34, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = Math.max(0, 0.52 - progress * 0.42);
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(animation.x, animation.y, 12 + eased * 24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        return true;
      });
    };

    const drawScene = () => {
      if (!generatedMapRef.current) return;

      ctx.clearRect(0, 0, MAP_W, MAP_H);
      ctx.drawImage(generatedMapRef.current.canvas, 0, 0);
      drawReleaseAnimations();

      for (const pokemon of [...walkersRef.current].sort((a, b) => a.y - b.y)) {
        drawWalker(pokemon);
      }
    };

    const updateWalker = (pokemon: WalkingPokemon, dt: number) => {
      if (!generatedMapRef.current) return;

      pokemon.stateTimer += dt;

      if (pokemon.isIdle) {
        pokemon.vx = 0;
        pokemon.vy = 0;
        pokemon.frameIndex = 0;

        if (pokemon.stateTimer >= pokemon.idleDuration) {
          pokemon.isIdle = false;
          pokemon.stateTimer = 0;
          pokemon.walkDuration = randomRange(MIN_WALK, MAX_WALK);
          pickDirection(pokemon, generatedMapRef.current, walkersRef.current);
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

      if (canOccupyPosition(generatedMapRef.current, pokemon.sprite, nextX, nextY, walkersRef.current, pokemon)) {
        pokemon.x = nextX;
        pokemon.y = nextY;
      } else {
        pokemon.stateTimer = 0;
        pickDirection(pokemon, generatedMapRef.current, walkersRef.current);
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

        const spritePixels = getSpriteSheetPixels(spriteImg);
        const usableSprites = POKEMON_SPRITES.filter((sprite) => {
          const isUsable = isSpriteInBounds(sprite, spriteImg) && (!spritePixels || isBasicSprite(sprite, spritePixels));
          if (!isUsable) {
            console.warn(`Skipping ${sprite.name}: sprite frame is not a safe 32x32 overworld sprite.`);
          }
          return isUsable;
        });

        const map = generateProceduralMap(mapAssets);
        generatedMapRef.current = map;
        processedSpriteCanvasRef.current = processSprites(spriteImg, usableSprites);
        walkersRef.current = [];
        releaseAnimationsRef.current = [];
        setCaughtRoster([]);
        selectPokemon(null);
        for (const sprite of getSpawnSprites(usableSprites, spawnMode, map.spawnCells.length)) {
          const walker = createWalker(sprite, map, walkersRef.current);
          if (walker) walkersRef.current.push(walker);
        }

        const tick = (time: number) => {
          const dt = lastTime ? time - lastTime : 16;
          lastTime = time;

          if (!reducedMotion) {
            for (const pokemon of walkersRef.current) {
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
  }, [season, spawnMode]);

  const selectedMetadata = selectedPokemon ? getPokemonMetadata(selectedPokemon.sprite) : null;
  const selectedStats = selectedPokemon ? getPokemonStats(selectedPokemon.sprite) : null;

  return (
    <div className="pokemon-world" data-season={season}>
      <canvas
        ref={canvasRef}
        className="pokemon-world__canvas"
        aria-label="Interactive Pokemon map"
        onClick={handleCanvasClick}
      />
      <div className="pokemon-world__season-badge">
        <span>{season}</span>
      </div>
      {selectedPokemon && selectedMetadata && selectedStats
        ? createPortal(
          <div
            className="pokemon-world__modal-backdrop"
            role="presentation"
            onClick={() => selectPokemon(null)}
          >
            <section
              className="pokemon-world__modal"
              aria-label={`${selectedPokemon.sprite.name} details`}
              aria-modal="true"
              role="dialog"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pokemon-world__modal-topbar">
                <span>Pokemon data</span>
                <button type="button" onClick={() => selectPokemon(null)} aria-label="Close Pokemon details">
                  x
                </button>
              </div>
              <div className="pokemon-world__modal-screen">
                <div className="pokemon-world__identity">
                  <div>
                    <span className="pokemon-world__info-kicker">No. {selectedPokemon.sprite.generation}-{selectedPokemon.sprite.name.length}</span>
                    <h2>{formatPokemonName(selectedPokemon.sprite.name)}</h2>
                    <p>{selectedMetadata.category} Pokemon</p>
                  </div>
                  <div className="pokemon-world__modal-sprite">
                    <div
                      className="pokemon-world__frame-preview"
                      style={getFramePreviewStyle(
                        selectedPokemon.sprite.frames[selectedPokemon.direction][selectedPokemon.frameIndex % 2],
                        selectedPokemon.sprite,
                      )}
                    />
                  </div>
                </div>
                <div className="pokemon-world__type-list">
                  {selectedMetadata.types.map((type) => (
                    <span key={type} data-type={type}>{type}</span>
                  ))}
                </div>
                <div className="pokemon-world__info-stats">
                  <span>{selectedPokemon.status}</span>
                  <span>{selectedMetadata.ability}</span>
                  <span>{selectedPokemon.direction}</span>
                  <span>{Math.floor(selectedPokemon.x / TILE)}, {Math.floor(selectedPokemon.y / TILE)}</span>
                </div>
                <div className="pokemon-world__stat-list">
                  {(Object.keys(POKEMON_STAT_LABELS) as PokemonStatName[]).map((stat) => (
                    <div key={stat} className="pokemon-world__stat-row">
                      <span>{POKEMON_STAT_LABELS[stat]}</span>
                      <div>
                        <i style={{ width: `${Math.min(100, selectedStats[stat])}%` }} />
                      </div>
                      <strong>{selectedStats[stat]}</strong>
                    </div>
                  ))}
                </div>
                <div className="pokemon-world__frame-list">
                  {DISPLAY_DIRECTIONS.map((direction) => (
                    <div key={direction} className="pokemon-world__frame-row">
                      <span>{direction}</span>
                      <div className="pokemon-world__frame-pair">
                        {selectedPokemon.sprite.frames[direction].map((spriteFrame, index) => (
                          <figure key={`${direction}-${spriteFrame.x}-${spriteFrame.y}`}>
                            <div
                              className="pokemon-world__frame-preview"
                              style={getFramePreviewStyle(spriteFrame, selectedPokemon.sprite)}
                            />
                            <figcaption>{index + 1}: {spriteFrame.x},{spriteFrame.y}</figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pokemon-world__info-actions">
                {selectedPokemon.status === 'wild' ? (
                  <button type="button" onClick={catchSelectedPokemon}>Catch</button>
                ) : (
                  <button type="button" onClick={() => releaseCaughtPokemon(selectedPokemon.id)}>Release</button>
                )}
              </div>
            </section>
          </div>,
          document.body,
        )
        : null}
      {caughtPokemon.length > 0 ? (
        <div className="pokemon-world__caught-tray" aria-label="Caught Pokemon">
          {caughtPokemon.map((pokemon) => (
            <button
              key={pokemon.id}
              type="button"
              className={selectedPokemon?.id === pokemon.id ? 'is-active' : ''}
              onClick={() => selectPokemon(toSelectedCaughtPokemon(pokemon))}
            >
              {formatPokemonName(pokemon.sprite.name)}
            </button>
          ))}
        </div>
      ) : null}
      <div className="pokemon-world__test-controls" aria-label="Pokemon test controls">
        <button
          type="button"
          className={spawnMode === 'clear' ? 'is-active' : ''}
          onClick={() => setSpawnMode('clear')}
        >
          Clear
        </button>
        <button
          type="button"
          className={spawnMode === 'random' ? 'is-active' : ''}
          onClick={() => setSpawnMode('random')}
        >
          Random
        </button>
        {POKEMON_GENERATIONS.map((generation) => (
          <button
            key={generation}
            type="button"
            className={spawnMode === generation ? 'is-active' : ''}
            onClick={() => setSpawnMode(generation)}
          >
            Gen {generation}
          </button>
        ))}
      </div>
    </div>
  );
};
