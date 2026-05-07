import { useEffect, useRef, useState } from 'react';

import overworldSheet from '../../assets/pokemon/overworld_sprites.png';
import mapSpring from '../../assets/pokemon/Accumula_Town_Spring_BW.png';
import mapSummer from '../../assets/pokemon/Accumula_Town_Summer_BW.png';
import mapAutumn from '../../assets/pokemon/Accumula_Town_Autumn_BW.png';
import mapWinter from '../../assets/pokemon/Accumula_Town_Winter_BW.png';
import './PokemonWorld.css';

/* ── Seasonal map pool ── */
const SEASON_MAPS = [mapSpring, mapSummer, mapAutumn, mapWinter];
const SEASON_NAMES = ['spring', 'summer', 'autumn', 'winter'] as const;

/* ── Curated Pokémon sprite locations ──
   Each entry: [srcX, srcY, width, height, name]
   These are pixel coordinates in the 1024×5792 overworld sprite sheet.
   Each frame is roughly 32×32. We pick the front-facing idle frame. */
interface PokemonSprite {
  name: string;
  srcX: number;
  srcY: number;
  w: number;
  h: number;
  frames: number; /* number of animation frames in the row */
  frameStride: number; /* pixels between frames */
}

/* Hand-mapped from the sprite sheet — first gen starters + fan favorites.
   These are the front-facing (down) sprites. Each has 4 frames across. */
const POKEMON_SPRITES: PokemonSprite[] = [
  /* Row 1 area — Gen 1 starters region (top of sheet) */
  { name: 'bulbasaur',  srcX: 0,   srcY: 0,   w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'charmander', srcX: 128, srcY: 0,   w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'squirtle',   srcX: 256, srcY: 0,   w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'pikachu',    srcX: 384, srcY: 0,   w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'eevee',      srcX: 512, srcY: 0,   w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'jigglypuff', srcX: 640, srcY: 0,   w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'meowth',     srcX: 768, srcY: 0,   w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'pidgey',     srcX: 0,   srcY: 32,  w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'rattata',    srcX: 128, srcY: 32,  w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'oddish',     srcX: 256, srcY: 32,  w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'psyduck',    srcX: 384, srcY: 32,  w: 32, h: 32, frames: 4, frameStride: 32 },
  { name: 'growlithe',  srcX: 512, srcY: 32,  w: 32, h: 32, frames: 4, frameStride: 32 },
];

/* ── Walking Pokémon entity ── */
interface WalkingPokemon {
  sprite: PokemonSprite;
  x: number;
  y: number;
  vx: number;
  vy: number;
  frame: number;
  frameTimer: number;
  direction: 0 | 1 | 2 | 3; /* down, left, right, up */
  walkTimer: number;
  walkDuration: number;
  idleDuration: number;
  isIdle: boolean;
}

const WALK_SPEED = 0.5;
const FRAME_INTERVAL = 200; /* ms between animation frames */
const MIN_WALK = 2000;
const MAX_WALK = 5000;
const MIN_IDLE = 1000;
const MAX_IDLE = 3500;
const POKEMON_COUNT = 8;

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

const createWalker = (sprite: PokemonSprite, mapW: number, mapH: number): WalkingPokemon => {
  const direction = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;
  return {
    sprite,
    x: 40 + Math.random() * (mapW - 80),
    y: 40 + Math.random() * (mapH - 80),
    vx: 0,
    vy: 0,
    frame: 0,
    frameTimer: 0,
    direction,
    walkTimer: 0,
    walkDuration: randomRange(MIN_WALK, MAX_WALK),
    idleDuration: randomRange(MIN_IDLE, MAX_IDLE),
    isIdle: Math.random() > 0.5,
  };
};

const pickDirection = (p: WalkingPokemon) => {
  p.direction = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;
  switch (p.direction) {
    case 0: p.vx = 0;           p.vy = WALK_SPEED;  break; /* down */
    case 1: p.vx = -WALK_SPEED; p.vy = 0;           break; /* left */
    case 2: p.vx = WALK_SPEED;  p.vy = 0;           break; /* right */
    case 3: p.vx = 0;           p.vy = -WALK_SPEED;  break; /* up */
  }
};

export const PokemonWorld = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [season] = useState(() => Math.floor(Math.random() * 4));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Load assets */
    const mapImg = new Image();
    const spriteImg = new Image();
    let loaded = 0;
    let animId = 0;
    let lastTime = 0;
    let processedSpriteCanvas: HTMLCanvasElement | null = null;

    const MAP_W = 700;
    const MAP_H = 620;

    const processSprites = (img: HTMLImageElement) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = img.width;
      offscreen.height = img.height;
      const octx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!octx) return offscreen;
      octx.drawImage(img, 0, 0);
      const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imgData.data;

      for (const sprite of POKEMON_SPRITES) {
        // Sample top-left pixel of this sprite's row
        const bgIndex = (sprite.srcY * offscreen.width + sprite.srcX) * 4;
        const bgR = data[bgIndex];
        const bgG = data[bgIndex + 1];
        const bgB = data[bgIndex + 2];

        const startY = sprite.srcY;
        const endY = sprite.srcY + sprite.h;
        const startX = sprite.srcX;
        const endX = sprite.srcX + sprite.frames * sprite.frameStride;

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const i = (y * offscreen.width + x) * 4;
            // Key out exact background match
            if (data[i] === bgR && data[i + 1] === bgG && data[i + 2] === bgB) {
              data[i + 3] = 0;
            }
          }
        }
      }
      octx.putImageData(imgData, 0, 0);
      return offscreen;
    };

    canvas.width = MAP_W;
    canvas.height = MAP_H;

    /* Shuffle and pick N Pokémon */
    const shuffled = [...POKEMON_SPRITES].sort(() => Math.random() - 0.5);
    const walkers: WalkingPokemon[] = shuffled
      .slice(0, POKEMON_COUNT)
      .map((s) => createWalker(s, MAP_W, MAP_H));

    const onLoad = () => {
      loaded++;
      if (loaded < 2) return;

      processedSpriteCanvas = processSprites(spriteImg);

      const tick = (time: number) => {
        const dt = lastTime ? time - lastTime : 16;
        lastTime = time;

        ctx.clearRect(0, 0, MAP_W, MAP_H);

        /* Draw map */
        ctx.drawImage(mapImg, 0, 0, MAP_W, MAP_H);

        if (reducedMotion && processedSpriteCanvas) {
          /* Just draw static Pokémon */
          for (const p of walkers) {
            ctx.drawImage(
              processedSpriteCanvas,
              p.sprite.srcX, p.sprite.srcY,
              p.sprite.w, p.sprite.h,
              Math.round(p.x), Math.round(p.y),
              p.sprite.w, p.sprite.h,
            );
          }
          return;
        }

        /* Update walkers */
        for (const p of walkers) {
          p.walkTimer += dt;

          if (p.isIdle) {
            p.vx = 0;
            p.vy = 0;
            p.frame = 0;
            if (p.walkTimer >= p.idleDuration) {
              p.isIdle = false;
              p.walkTimer = 0;
              p.walkDuration = randomRange(MIN_WALK, MAX_WALK);
              pickDirection(p);
            }
          } else {
            /* Animate walking */
            p.frameTimer += dt;
            if (p.frameTimer >= FRAME_INTERVAL) {
              p.frameTimer = 0;
              p.frame = (p.frame + 1) % Math.max(1, p.sprite.frames);
            }

            p.x += p.vx;
            p.y += p.vy;

            /* Boundary bounce */
            if (p.x < 16 || p.x > MAP_W - 48) {
              p.vx = -p.vx;
              p.direction = p.vx > 0 ? 2 : 1;
              p.x = Math.max(16, Math.min(MAP_W - 48, p.x));
            }
            if (p.y < 16 || p.y > MAP_H - 48) {
              p.vy = -p.vy;
              p.direction = p.vy > 0 ? 0 : 3;
              p.y = Math.max(16, Math.min(MAP_H - 48, p.y));
            }

            if (p.walkTimer >= p.walkDuration) {
              p.isIdle = true;
              p.walkTimer = 0;
              p.idleDuration = randomRange(MIN_IDLE, MAX_IDLE);
            }
          }

          /* Draw Pokémon — use frame offset for animation */
          const srcX = p.sprite.srcX + p.frame * p.sprite.frameStride;
          const srcY = p.sprite.srcY;

          /* Shadow */
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.ellipse(
            Math.round(p.x) + p.sprite.w / 2,
            Math.round(p.y) + p.sprite.h - 2,
            p.sprite.w / 3,
            4,
            0, 0, Math.PI * 2,
          );
          ctx.fill();
          ctx.globalAlpha = 1;

          /* Sprite */
          if (processedSpriteCanvas) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
              processedSpriteCanvas,
              srcX, srcY,
              p.sprite.w, p.sprite.h,
              Math.round(p.x), Math.round(p.y),
              p.sprite.w, p.sprite.h,
            );
          }
        }

        animId = requestAnimationFrame(tick);
      };

      animId = requestAnimationFrame(tick);
    };

    mapImg.onload = onLoad;
    spriteImg.onload = onLoad;
    mapImg.src = SEASON_MAPS[season];
    spriteImg.src = overworldSheet;

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [season]);

  return (
    <div className="pokemon-world" data-season={SEASON_NAMES[season]}>
      <canvas
        ref={canvasRef}
        className="pokemon-world__canvas"
        aria-hidden="true"
      />
      <div className="pokemon-world__season-badge">
        <span>{SEASON_NAMES[season]}</span>
      </div>
    </div>
  );
};
