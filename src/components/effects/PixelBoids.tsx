import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import './PixelBoids.css';

const BOID_COLORS = ['#20D6C7', '#285CC4', '#BC4A9B', '#FFD541', '#59C135', '#B9BFFB', '#FA6A0A'];
const STAR_COLORS = ['rgba(254, 243, 192, 0.55)', 'rgba(254, 243, 192, 0.32)', 'rgba(32, 214, 199, 0.28)', 'rgba(185, 191, 251, 0.22)'];

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

const MAX_SPEED = 1.1;
const PIXEL_SNAP = 2;
const TRAIL_LENGTH = 3;
const SEPARATION_DIST = 18 * 18;
const ALIGNMENT_DIST = 42 * 42;
const COHESION_DIST = 60 * 60;
const TARGET_FRAME_MS = 1000 / 30;

const snap = (value: number) => Math.round(value / PIXEL_SNAP) * PIXEL_SNAP;

const wrap = (item: { x: number; y: number }, width: number, height: number) => {
  if (item.x < -12) item.x = width + 8;
  if (item.x > width + 12) item.x = -8;
  if (item.y < -12) item.y = height + 8;
  if (item.y > height + 12) item.y = -8;
};

const drawBird = (
  ctx: CanvasRenderingContext2D,
  boid: Flocker,
  time: number,
) => {
  const x = snap(boid.x);
  const y = snap(boid.y);
  const flap = Math.sin(time * 0.012 + boid.flapOffset) > 0;
  const facingRight = boid.vx >= 0;

  ctx.fillStyle = boid.color;
  ctx.globalAlpha = 0.8;

  if (facingRight) {
    ctx.fillRect(x, y, 4, 2);
    ctx.fillRect(x + 4, y + 2, 2, 2);
    ctx.fillRect(x - 2, y + (flap ? -2 : 2), 2, 2);
  } else {
    ctx.fillRect(x, y, 4, 2);
    ctx.fillRect(x - 2, y + 2, 2, 2);
    ctx.fillRect(x + 4, y + (flap ? -2 : 2), 2, 2);
  }

  ctx.globalAlpha = 0.25;
  ctx.fillRect(x - 2, y - 2, 8, 6);
  ctx.globalAlpha = 1;
};

export const PixelBoids = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const lastFrameRef = useRef(0);

  const profile = useMemo(() => {
    if (location.pathname === '/login' || location.pathname.startsWith('/studio')) {
      return null;
    }

    if (location.pathname === '/') {
      return { starCount: 140, flockCount: 20, driftCount: 120, scale: 0.48 };
    }

    if (location.pathname.startsWith('/work') || location.pathname === '/about' || location.pathname === '/contact') {
      return { starCount: 96, flockCount: 14, driftCount: 72, scale: 0.42 };
    }

    return { starCount: 88, flockCount: 12, driftCount: 56, scale: 0.4 };
  }, [location.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !profile) {
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
          if (index === otherIndex) {
            continue;
          }

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
        const wobble = Math.sin(time * 0.0012 + drifter.pulse) * 0.12;

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

        ctx.globalAlpha = pulse * 0.75;
        ctx.fillStyle = drifter.color;
        ctx.fillRect(snap(drifter.x), snap(drifter.y), drifter.size, drifter.size);

        if (drifter.size > 1) {
          ctx.globalAlpha = pulse * 0.3;
          ctx.fillRect(snap(drifter.x) - 1, snap(drifter.y) - 1, drifter.size + 2, drifter.size + 2);
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

        drawBird(ctx, boid, time);
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

  if (!profile) {
    return null;
  }

  return <canvas ref={canvasRef} className="pixel-boids" aria-hidden="true" />;
};
