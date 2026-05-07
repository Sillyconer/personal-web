import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { getCartridgeByPath } from '../../config/cartridges';
import type { BoidPresetId } from '../../config/cartridges';
import './PixelBoids.css';

const BOID_COLORS = ['#20D6C7', '#285CC4', '#BC4A9B', '#FFD541', '#59C135', '#B9BFFB', '#FA6A0A'];
const STAR_COLORS = ['rgba(254, 243, 192, 0.55)', 'rgba(254, 243, 192, 0.32)', 'rgba(32, 214, 199, 0.26)', 'rgba(185, 191, 251, 0.22)'];

type SpriteKind =
  | 'starbird'
  | 'airship'
  | 'moth'
  | 'lantern'
  | 'crystal'
  | 'debug'
  | 'atlas'
  | 'comet'
  | 'quest';

interface Flocker {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  flapOffset: number;
  trail: Array<{ x: number; y: number }>;
}

interface Drifter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  pulse: number;
  size: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface VisualProfile {
  scale: number;
  starCount: number;
  flockCount: number;
  driftCount: number;
  flockerKind: SpriteKind;
  drifterKind: SpriteKind;
}

const PROFILE_MAP: Record<BoidPresetId, VisualProfile> = {
  starbirds: { scale: 0.48, starCount: 180, flockCount: 20, driftCount: 180, flockerKind: 'starbird', drifterKind: 'quest' },
  airships: { scale: 0.46, starCount: 120, flockCount: 16, driftCount: 140, flockerKind: 'airship', drifterKind: 'comet' },
  moths: { scale: 0.44, starCount: 110, flockCount: 14, driftCount: 130, flockerKind: 'moth', drifterKind: 'quest' },
  lanterns: { scale: 0.44, starCount: 100, flockCount: 14, driftCount: 120, flockerKind: 'lantern', drifterKind: 'lantern' },
  saveRoom: { scale: 0.4, starCount: 80, flockCount: 8, driftCount: 70, flockerKind: 'crystal', drifterKind: 'quest' },
  debugSprites: { scale: 0.4, starCount: 88, flockCount: 10, driftCount: 90, flockerKind: 'debug', drifterKind: 'debug' },
  atlasBirds: { scale: 0.45, starCount: 130, flockCount: 18, driftCount: 130, flockerKind: 'atlas', drifterKind: 'quest' },
  cartridgeComets: { scale: 0.44, starCount: 122, flockCount: 16, driftCount: 126, flockerKind: 'comet', drifterKind: 'comet' },
  questMotes: { scale: 0.43, starCount: 102, flockCount: 12, driftCount: 110, flockerKind: 'quest', drifterKind: 'quest' },
};

const MAX_SPEED = 1.06;
const PIXEL_SNAP = 2;
const TRAIL_LENGTH = 3;
const SEPARATION_DIST = 18 * 18;
const ALIGNMENT_DIST = 42 * 42;
const COHESION_DIST = 60 * 60;
const TARGET_FRAME_MS = 1000 / 30;

const snap = (value: number) => Math.round(value / PIXEL_SNAP) * PIXEL_SNAP;

const wrap = (item: { x: number; y: number }, width: number, height: number) => {
  if (item.x < -18) item.x = width + 12;
  if (item.x > width + 18) item.x = -12;
  if (item.y < -18) item.y = height + 12;
  if (item.y > height + 18) item.y = -12;
};

const drawSprite = (
  ctx: CanvasRenderingContext2D,
  kind: SpriteKind,
  x: number,
  y: number,
  color: string,
  frame: number,
  vx = 0,
) => {
  const sx = snap(x);
  const sy = snap(y);
  const facingRight = vx >= 0;
  const flap = Math.sin(frame * 0.014) > 0;

  ctx.fillStyle = color;

  switch (kind) {
    case 'starbird':
      ctx.fillRect(sx, sy, 4, 2);
      ctx.fillRect(facingRight ? sx + 4 : sx - 2, sy + 2, 2, 2);
      ctx.fillRect(facingRight ? sx - 2 : sx + 4, sy + (flap ? -2 : 2), 2, 2);
      break;
    case 'airship':
      ctx.fillRect(sx, sy, 6, 2);
      ctx.fillRect(sx + 1, sy - 2, 4, 2);
      ctx.fillRect(sx + 2, sy + 2, 2, 2);
      break;
    case 'moth':
      ctx.fillRect(sx, sy, 2, 2);
      ctx.fillRect(sx - 2, sy + (flap ? -2 : 2), 2, 2);
      ctx.fillRect(sx + 2, sy + (flap ? 2 : -2), 2, 2);
      break;
    case 'lantern':
      ctx.fillRect(sx, sy, 3, 3);
      ctx.fillRect(sx + 1, sy - 2, 1, 2);
      ctx.fillRect(sx - 1, sy + 3, 5, 1);
      break;
    case 'crystal':
      ctx.fillRect(sx + 1, sy, 2, 2);
      ctx.fillRect(sx, sy + 2, 4, 2);
      ctx.fillRect(sx + 1, sy + 4, 2, 2);
      break;
    case 'debug':
      ctx.fillRect(sx, sy, 2, 2);
      ctx.fillRect(sx + 3, sy, 2, 2);
      ctx.fillRect(sx, sy + 3, 2, 2);
      ctx.fillRect(sx + 3, sy + 3, 2, 2);
      break;
    case 'atlas':
      ctx.fillRect(sx, sy, 4, 2);
      ctx.fillRect(sx + 4, sy + 2, 2, 1);
      ctx.fillRect(sx - 2, sy + (flap ? -1 : 2), 2, 2);
      break;
    case 'comet':
      ctx.fillRect(sx, sy, 3, 3);
      ctx.globalAlpha *= 0.34;
      ctx.fillRect(facingRight ? sx - 4 : sx + 3, sy + 1, 4, 1);
      ctx.globalAlpha = 1;
      break;
    case 'quest':
    default:
      ctx.fillRect(sx, sy, 2, 2);
      ctx.fillRect(sx - 2, sy, 1, 1);
      ctx.fillRect(sx + 3, sy + 1, 1, 1);
      break;
  }
};

export const PixelBoids = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const lastFrameRef = useRef(0);
  const cartridge = getCartridgeByPath(location.pathname);
  const profile = PROFILE_MAP[cartridge.boidPreset];

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      return undefined;
    }

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

    if (!ctx) {
      return undefined;
    }

    const flockers: Flocker[] = [];
    const drifters: Drifter[] = [];
    const stars: Star[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      width = Math.max(220, Math.floor(window.innerWidth * profile.scale));
      height = Math.max(160, Math.floor(window.innerHeight * profile.scale));

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      flockers.length = 0;
      drifters.length = 0;
      stars.length = 0;

      for (let index = 0; index < profile.starCount; index += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() > 0.82 ? 2 : 1,
          color: STAR_COLORS[index % STAR_COLORS.length],
          twinkleSpeed: 0.8 + Math.random() * 2,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      for (let index = 0; index < profile.flockCount; index += 1) {
        flockers.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * MAX_SPEED,
          vy: (Math.random() - 0.5) * MAX_SPEED,
          color: BOID_COLORS[index % BOID_COLORS.length],
          flapOffset: Math.random() * Math.PI * 2,
          trail: [],
        });
      }

      for (let index = 0; index < profile.driftCount; index += 1) {
        drifters.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.4,
          color: BOID_COLORS[(index + 2) % BOID_COLORS.length],
          pulse: Math.random() * Math.PI * 2,
          size: Math.random() > 0.72 ? 2 : 1,
        });
      }
    };

    const updateFlockers = () => {
      for (let index = 0; index < flockers.length; index += 1) {
        const boid = flockers[index];
        let sepX = 0;
        let sepY = 0;
        let alignX = 0;
        let alignY = 0;
        let alignCount = 0;
        let cohX = 0;
        let cohY = 0;
        let cohCount = 0;

        for (let otherIndex = 0; otherIndex < flockers.length; otherIndex += 1) {
          if (index === otherIndex) continue;

          const other = flockers[otherIndex];
          const dx = boid.x - other.x;
          const dy = boid.y - other.y;
          const distSq = dx * dx + dy * dy;

          if (distSq > 0 && distSq < SEPARATION_DIST) {
            sepX += dx;
            sepY += dy;
          }

          if (distSq < ALIGNMENT_DIST) {
            alignX += other.vx;
            alignY += other.vy;
            alignCount += 1;
          }

          if (distSq < COHESION_DIST) {
            cohX += other.x;
            cohY += other.y;
            cohCount += 1;
          }
        }

        boid.vx += sepX * 0.0005;
        boid.vy += sepY * 0.0005;

        if (alignCount > 0) {
          boid.vx += ((alignX / alignCount) - boid.vx) * 0.035;
          boid.vy += ((alignY / alignCount) - boid.vy) * 0.035;
        }

        if (cohCount > 0) {
          boid.vx += ((cohX / cohCount) - boid.x) * 0.0007;
          boid.vy += ((cohY / cohCount) - boid.y) * 0.0007;
        }

        const speedSq = boid.vx * boid.vx + boid.vy * boid.vy;
        const maxSpeedSq = MAX_SPEED * MAX_SPEED;

        if (speedSq > maxSpeedSq) {
          const speed = Math.sqrt(speedSq);
          boid.vx = (boid.vx / speed) * MAX_SPEED;
          boid.vy = (boid.vy / speed) * MAX_SPEED;
        }

        boid.trail.push({ x: snap(boid.x), y: snap(boid.y) });

        if (boid.trail.length > TRAIL_LENGTH) {
          boid.trail.shift();
        }

        boid.x += boid.vx;
        boid.y += boid.vy;
        wrap(boid, width, height);
      }
    };

    const updateDrifters = (time: number) => {
      for (let index = 0; index < drifters.length; index += 1) {
        const drifter = drifters[index];
        const wobble = Math.sin(time * 0.0011 + drifter.pulse) * 0.12;

        drifter.x += drifter.vx + wobble;
        drifter.y += drifter.vy + Math.cos(time * 0.001 + drifter.pulse) * 0.08;
        wrap(drifter, width, height);
      }
    };

    const drawScene = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let index = 0; index < stars.length; index += 1) {
        const star = stars[index];
        const twinkle = 0.28 + 0.72 * ((Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset) + 1) * 0.5);

        ctx.globalAlpha = twinkle;
        ctx.fillStyle = star.color;
        ctx.fillRect(snap(star.x), snap(star.y), star.size, star.size);
      }

      ctx.globalAlpha = 1;

      for (let index = 0; index < drifters.length; index += 1) {
        const drifter = drifters[index];
        const pulse = 0.45 + 0.55 * ((Math.sin(time * 0.002 + drifter.pulse) + 1) * 0.5);

        ctx.globalAlpha = pulse * 0.78;
        drawSprite(ctx, profile.drifterKind, drifter.x, drifter.y, drifter.color, time + drifter.pulse * 10);

        if (drifter.size > 1) {
          ctx.globalAlpha = pulse * 0.2;
          ctx.fillStyle = drifter.color;
          ctx.fillRect(snap(drifter.x) - 2, snap(drifter.y) - 2, 6, 6);
        }
      }

      for (let index = 0; index < flockers.length; index += 1) {
        const boid = flockers[index];

        for (let trailIndex = 0; trailIndex < boid.trail.length; trailIndex += 1) {
          const trail = boid.trail[trailIndex];
          const alpha = ((trailIndex + 1) / (boid.trail.length + 1)) * 0.22;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = boid.color;
          ctx.fillRect(trail.x, trail.y, 2, 2);
        }

        ctx.globalAlpha = 0.84;
        drawSprite(ctx, profile.flockerKind, boid.x, boid.y, boid.color, time + boid.flapOffset * 20, boid.vx);
      }

      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener('resize', resize);

    const tick = (time: number) => {
      if (document.hidden) {
        lastFrameRef.current = time;
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      if (time - lastFrameRef.current < TARGET_FRAME_MS) {
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      lastFrameRef.current = time;
      updateFlockers();
      updateDrifters(time);
      drawScene(time);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [profile]);

  return <canvas ref={canvasRef} className="pixel-boids" data-preset={cartridge.boidPreset} aria-hidden="true" />;
};
