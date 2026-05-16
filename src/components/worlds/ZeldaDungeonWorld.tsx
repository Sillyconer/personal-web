import { useEffect, useRef, useState } from 'react';

import hyruleCastleMap from '../../../zeldasprite/SNESMAP - The Legend of Zelda_ A Link to the Past - Dungeons - Hyrule Castle.PNG?url';
import hylianKnightSheet from '../../../zeldasprite/SNES - The Legend of Zelda_ A Link to the Past - Enemies - Hylian Knights.png';
import linkSheet from '../../../zeldasprite/SNES - The Legend of Zelda_ A Link to the Past - Playable Characters - Link.png';
import './ZeldaDungeonWorld.css';

type Direction = 'down' | 'left' | 'right' | 'up';
type ActorKind = 'link' | 'blueKnight' | 'greenKnight' | 'redKnight';

interface SpriteFrame {
  x: number;
  y: number;
  w: number;
  h: number;
  flipX?: boolean;
}

interface MapPoint {
  x: number;
  y: number;
}

interface DungeonActor {
  kind: ActorKind;
  route: MapPoint[];
  routeIndex: number;
  x: number;
  y: number;
  speed: number;
  scale: number;
  direction: Direction;
  phase: number;
  attackTimer: number;
  retreatTimer: number;
  cooldownTimer: number;
  retreatVector: MapPoint;
}

interface CursorBurst {
  id: number;
  x: number;
  y: number;
}

interface StageTransform {
  x: number;
  y: number;
  scale: number;
}

const MAP_W = 546;
const MAP_H = 665;
const LINK_FRAME_MS = 150;
const KNIGHT_FRAME_MS = 180;
const CLASH_DISTANCE = 62;
const ATTACK_MS = 560;
const RETREAT_MS = 760;
const COMBAT_COOLDOWN_MS = 1700;
const RETREAT_SPEED = 0.045;

const linkFrame = (x: number, y: number, w = 16, h = 24): SpriteFrame => ({ x, y, w, h });
const knightFrame = (x: number, y: number, w = 22, h = 28): SpriteFrame => ({ x, y, w, h });

const LINK_FRAMES: Record<Direction, SpriteFrame[]> = {
  down: [linkFrame(1, 3), linkFrame(19, 3), linkFrame(36, 2), linkFrame(53, 1)],
  up: [linkFrame(1, 58, 17), linkFrame(20, 57, 17, 25), linkFrame(38, 57), linkFrame(55, 58, 17)],
  right: [linkFrame(1, 85, 17, 23), linkFrame(19, 85, 17, 23), linkFrame(38, 84, 17, 24), linkFrame(55, 84, 17, 24)],
  left: [
    { ...linkFrame(1, 85, 17, 23), flipX: true },
    { ...linkFrame(19, 85, 17, 23), flipX: true },
    { ...linkFrame(38, 84, 17, 24), flipX: true },
    { ...linkFrame(55, 84, 17, 24), flipX: true },
  ],
};

const LINK_ATTACK_FRAMES: Record<Direction, SpriteFrame[]> = {
  down: [linkFrame(208, 141), linkFrame(226, 140, 16, 25), linkFrame(244, 141), linkFrame(261, 141)],
  up: [linkFrame(313, 140, 16, 25), linkFrame(330, 140, 16, 25), linkFrame(348, 141), linkFrame(365, 141)],
  right: [linkFrame(1, 141), linkFrame(18, 140, 16, 25), linkFrame(35, 139, 16, 26), linkFrame(52, 136, 16, 29)],
  left: [
    { ...linkFrame(1, 141), flipX: true },
    { ...linkFrame(18, 140, 16, 25), flipX: true },
    { ...linkFrame(35, 139, 16, 26), flipX: true },
    { ...linkFrame(52, 136, 16, 29), flipX: true },
  ],
};

const KNIGHT_FRAMES: Record<ActorKind, Record<Direction, SpriteFrame[]>> = {
  link: {
    down: [],
    left: [],
    right: [],
    up: [],
  },
  blueKnight: {
    down: [knightFrame(11, 355, 22, 33), knightFrame(39, 354, 22, 38), knightFrame(68, 355, 22, 34), knightFrame(97, 354, 22, 35)],
    up: [knightFrame(11, 400, 22, 24), knightFrame(38, 399, 22, 25), knightFrame(66, 400, 22, 24), knightFrame(93, 399, 22, 25)],
    right: [knightFrame(13, 462, 29, 27), knightFrame(47, 463, 29, 26), knightFrame(81, 462, 32, 27)],
    left: [
      { ...knightFrame(13, 462, 29, 27), flipX: true },
      { ...knightFrame(47, 463, 29, 26), flipX: true },
      { ...knightFrame(81, 462, 32, 27), flipX: true },
    ],
  },
  greenKnight: {
    down: [knightFrame(9, 558, 22, 27), knightFrame(36, 559, 22, 26), knightFrame(63, 559, 22, 26), knightFrame(90, 552, 22, 33)],
    up: [knightFrame(7, 596, 22, 24), knightFrame(33, 595, 22, 25), knightFrame(60, 596, 22, 24), knightFrame(89, 595, 22, 25)],
    right: [knightFrame(177, 517, 28, 27), knightFrame(212, 518, 28, 26), knightFrame(248, 517, 31, 27)],
    left: [
      { ...knightFrame(177, 517, 28, 27), flipX: true },
      { ...knightFrame(212, 518, 28, 26), flipX: true },
      { ...knightFrame(248, 517, 31, 27), flipX: true },
    ],
  },
  redKnight: {
    down: [knightFrame(674, 483, 22, 28), knightFrame(702, 483, 22, 28), knightFrame(731, 483, 22, 28), knightFrame(760, 483, 22, 28)],
    up: [knightFrame(673, 516, 26, 28), knightFrame(706, 516, 25, 28), knightFrame(738, 516, 23, 28), knightFrame(767, 516, 16, 28)],
    right: [knightFrame(674, 550, 22, 34), knightFrame(702, 548, 22, 36), knightFrame(730, 550, 23, 34)],
    left: [
      { ...knightFrame(674, 550, 22, 34), flipX: true },
      { ...knightFrame(702, 548, 22, 36), flipX: true },
      { ...knightFrame(730, 550, 23, 34), flipX: true },
    ],
  },
};

const ACTOR_BLUEPRINTS: Array<
  Omit<DungeonActor, 'x' | 'y' | 'routeIndex' | 'direction' | 'attackTimer' | 'retreatTimer' | 'cooldownTimer' | 'retreatVector'>
> = [
  {
    kind: 'link',
    route: [
      { x: 274, y: 598 },
      { x: 274, y: 514 },
      { x: 226, y: 458 },
      { x: 274, y: 402 },
      { x: 322, y: 458 },
      { x: 274, y: 514 },
    ],
    speed: 0.034,
    scale: 1.42,
    phase: 0,
  },
  {
    kind: 'blueKnight',
    route: [
      { x: 168, y: 420 },
      { x: 236, y: 420 },
      { x: 236, y: 344 },
      { x: 168, y: 344 },
    ],
    speed: 0.026,
    scale: 1.18,
    phase: 180,
  },
  {
    kind: 'greenKnight',
    route: [
      { x: 378, y: 420 },
      { x: 310, y: 420 },
      { x: 310, y: 344 },
      { x: 378, y: 344 },
    ],
    speed: 0.026,
    scale: 1.18,
    phase: 380,
  },
  {
    kind: 'redKnight',
    route: [
      { x: 196, y: 520 },
      { x: 196, y: 595 },
      { x: 350, y: 595 },
      { x: 350, y: 520 },
    ],
    speed: 0.022,
    scale: 1.12,
    phase: 680,
  },
];

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const createTransparentSheet = (
  image: HTMLImageElement,
  shouldClearPixel: (r: number, g: number, b: number, a: number) => boolean,
) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0);

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const r = pixels.data[index];
    const g = pixels.data[index + 1];
    const b = pixels.data[index + 2];
    const a = pixels.data[index + 3];

    if (shouldClearPixel(r, g, b, a)) {
      pixels.data[index + 3] = 0;
    }
  }

  ctx.putImageData(pixels, 0, 0);
  return canvas;
};

const createActors = (): DungeonActor[] =>
  ACTOR_BLUEPRINTS.map((actor) => ({
    ...actor,
    routeIndex: 1,
    x: actor.route[0].x,
    y: actor.route[0].y,
    direction: 'down',
    attackTimer: 0,
    retreatTimer: 0,
    cooldownTimer: 0,
    retreatVector: { x: 0, y: 0 },
  }));

const directionFromDelta = (dx: number, dy: number): Direction => {
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0 ? 'right' : 'left';
  }

  return dy >= 0 ? 'down' : 'up';
};

const updateActor = (actor: DungeonActor, dt: number) => {
  actor.cooldownTimer = Math.max(0, actor.cooldownTimer - dt);

  if (actor.attackTimer > 0) {
    actor.attackTimer = Math.max(0, actor.attackTimer - dt);

    if (actor.attackTimer === 0) {
      actor.retreatTimer = RETREAT_MS;
    }

    return;
  }

  if (actor.retreatTimer > 0) {
    actor.retreatTimer = Math.max(0, actor.retreatTimer - dt);
    actor.x += actor.retreatVector.x * RETREAT_SPEED * dt;
    actor.y += actor.retreatVector.y * RETREAT_SPEED * dt;
    return;
  }

  const target = actor.route[actor.routeIndex];
  const dx = target.x - actor.x;
  const dy = target.y - actor.y;
  const distance = Math.hypot(dx, dy);

  if (distance < 1.4) {
    actor.x = target.x;
    actor.y = target.y;
    actor.routeIndex = (actor.routeIndex + 1) % actor.route.length;
    return;
  }

  actor.direction = directionFromDelta(dx, dy);
  const step = Math.min(distance, actor.speed * dt);
  actor.x += (dx / distance) * step;
  actor.y += (dy / distance) * step;
};

const beginClash = (link: DungeonActor, knight: DungeonActor) => {
  const dx = link.x - knight.x;
  const dy = link.y - knight.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const linkRetreat = { x: dx / distance, y: dy / distance };
  const knightRetreat = { x: -linkRetreat.x, y: -linkRetreat.y };

  link.direction = directionFromDelta(knight.x - link.x, knight.y - link.y);
  knight.direction = directionFromDelta(link.x - knight.x, link.y - knight.y);

  link.attackTimer = ATTACK_MS;
  knight.attackTimer = ATTACK_MS;
  link.retreatTimer = 0;
  knight.retreatTimer = 0;
  link.cooldownTimer = COMBAT_COOLDOWN_MS;
  knight.cooldownTimer = COMBAT_COOLDOWN_MS;
  link.retreatVector = linkRetreat;
  knight.retreatVector = knightRetreat;
};

const updateCombat = (actors: DungeonActor[]) => {
  const link = actors.find((actor) => actor.kind === 'link');
  if (!link || link.attackTimer > 0 || link.retreatTimer > 0 || link.cooldownTimer > 0) return;

  const knight = actors.find((actor) => {
    if (actor.kind === 'link' || actor.attackTimer > 0 || actor.retreatTimer > 0 || actor.cooldownTimer > 0) {
      return false;
    }

    return Math.hypot(actor.x - link.x, actor.y - link.y) <= CLASH_DISTANCE;
  });

  if (knight) {
    beginClash(link, knight);
  }
};

const drawSpriteFrame = (
  ctx: CanvasRenderingContext2D,
  sheet: HTMLCanvasElement,
  frame: SpriteFrame,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  ctx.save();

  if (frame.flipX) {
    ctx.translate(x + width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, 0, 0, width, height);
  } else {
    ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, x, y, width, height);
  }

  ctx.restore();
};

const getStageTransform = (width: number, height: number): StageTransform => {
  const scale = width / MAP_W;
  const mapHeight = MAP_H * scale;

  return {
    x: 0,
    y: Math.round(height - mapHeight),
    scale,
  };
};

const drawPixelBlade = (
  ctx: CanvasRenderingContext2D,
  length: number,
  thickness: number,
  hilt: number,
) => {
  ctx.fillStyle = '#fef3c0';
  ctx.fillRect(0, -thickness / 2, length, thickness);
  ctx.fillStyle = '#b9bffb';
  ctx.fillRect(length - thickness, -thickness, thickness * 1.4, thickness * 2);
  ctx.fillStyle = '#20d6c7';
  ctx.fillRect(-hilt / 2, -thickness * 1.5, hilt, thickness * 3);
  ctx.fillStyle = '#71413b';
  ctx.fillRect(-hilt, -thickness / 2, hilt, thickness);
};

const drawActorSword = (
  ctx: CanvasRenderingContext2D,
  actor: DungeonActor,
  screenX: number,
  screenY: number,
  width: number,
  height: number,
  transform: StageTransform,
) => {
  const isLink = actor.kind === 'link';
  const isAttacking = actor.attackTimer > 0;
  const bladeLength = Math.max(12, transform.scale * (isLink ? 12 : 10) * (isAttacking ? 1.45 : 1));
  const thickness = Math.max(2, Math.round(transform.scale * 1.2));
  const hilt = Math.max(4, Math.round(transform.scale * 3));
  const swingProgress = isAttacking ? 1 - actor.attackTimer / ATTACK_MS : 0;
  const swing = isAttacking ? -0.85 + swingProgress * 1.7 : 0;
  const centerX = screenX + width / 2;
  const centerY = screenY + height * (isLink ? 0.48 : 0.56);

  ctx.save();
  ctx.globalAlpha = isLink ? 1 : 0.92;
  ctx.shadowColor = isLink ? 'rgba(254, 243, 192, 0.5)' : 'rgba(185, 191, 251, 0.36)';
  ctx.shadowBlur = isAttacking ? Math.max(8, transform.scale * 4) : Math.max(3, transform.scale * 1.4);

  if (actor.direction === 'right') {
    ctx.translate(centerX + width * 0.22, centerY);
    ctx.rotate(swing);
  } else if (actor.direction === 'left') {
    ctx.translate(centerX - width * 0.22, centerY);
    ctx.scale(-1, 1);
    ctx.rotate(swing);
  } else if (actor.direction === 'up') {
    ctx.translate(centerX + width * 0.04, centerY - height * 0.16);
    ctx.rotate(-Math.PI / 2 + swing * 0.62);
  } else {
    ctx.translate(centerX + width * 0.18, centerY + height * 0.08);
    ctx.rotate(Math.PI / 2 + swing * 0.62);
  }

  drawPixelBlade(ctx, bladeLength, thickness, hilt);
  ctx.restore();
};

const drawActor = (
  ctx: CanvasRenderingContext2D,
  actor: DungeonActor,
  linkCanvas: HTMLCanvasElement,
  knightCanvas: HTMLCanvasElement,
  transform: StageTransform,
  time: number,
) => {
  const frames =
    actor.kind === 'link'
      ? actor.attackTimer > 0
        ? LINK_ATTACK_FRAMES[actor.direction]
        : LINK_FRAMES[actor.direction]
      : KNIGHT_FRAMES[actor.kind][actor.direction];
  const frameMs = actor.kind === 'link' ? LINK_FRAME_MS : KNIGHT_FRAME_MS;
  const frame = frames[Math.floor((time + actor.phase) / frameMs) % frames.length];
  const sheet = actor.kind === 'link' ? linkCanvas : knightCanvas;
  const spriteScale = transform.scale * actor.scale;
  const width = Math.round(frame.w * spriteScale);
  const height = Math.round(frame.h * spriteScale);
  const screenX = Math.round(transform.x + actor.x * transform.scale - width / 2);
  const screenY = Math.round(transform.y + actor.y * transform.scale - height);

  ctx.save();
  ctx.globalAlpha = actor.kind === 'link' ? 0.34 : 0.28;
  ctx.fillStyle = '#070604';
  ctx.beginPath();
  ctx.ellipse(
    screenX + width / 2,
    screenY + height - Math.max(2, transform.scale * 2),
    Math.max(8, width * 0.34),
    Math.max(3, height * 0.09),
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();

  if (actor.kind !== 'link' && actor.attackTimer > 0) {
    drawActorSword(ctx, actor, screenX, screenY, width, height, transform);
  }

  drawSpriteFrame(ctx, sheet, frame, screenX, screenY, width, height);

};

const drawTorchGlows = (ctx: CanvasRenderingContext2D, transform: StageTransform, time: number) => {
  const torches: MapPoint[] = [
    { x: 224, y: 476 },
    { x: 322, y: 476 },
    { x: 224, y: 548 },
    { x: 322, y: 548 },
  ];

  torches.forEach((torch, index) => {
    const pulse = 0.72 + Math.sin(time / 260 + index) * 0.16;
    const x = transform.x + torch.x * transform.scale;
    const y = transform.y + torch.y * transform.scale;
    const radius = 36 * transform.scale * pulse;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 213, 65, 0.28)');
    gradient.addColorStop(0.36, 'rgba(250, 106, 10, 0.12)');
    gradient.addColorStop(1, 'rgba(255, 213, 65, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  });
};

export const ZeldaDungeonWorld = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const burstTimersRef = useRef<number[]>([]);
  const clickEnabledRef = useRef(false);
  const [cursorBursts, setCursorBursts] = useState<CursorBurst[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    let actors = createActors();
    let lastTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    resize();
    window.addEventListener('resize', resize);

    void (async () => {
      try {
        const [mapImage, linkImage, knightImage] = await Promise.all([
          loadImage(hyruleCastleMap),
          loadImage(linkSheet),
          loadImage(hylianKnightSheet),
        ]);

        if (cancelled) return;

        const linkCanvas = createTransparentSheet(
          linkImage,
          (r, g, b, a) => a === 0 || (r <= 14 && g >= 92 && g <= 154 && b >= 92 && b <= 154 && Math.abs(g - b) <= 18),
        );
        const knightCanvas = createTransparentSheet(
          knightImage,
          (r, g, b, a) => a === 0 || (r >= 245 && g <= 18 && b >= 245),
        );

        const drawScene = (time: number) => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          const transform = getStageTransform(width, height);
          const dt = lastTime ? Math.min(48, time - lastTime) : 16;
          lastTime = time;

          if (!reducedMotion) {
            actors.forEach((actor) => updateActor(actor, dt));
            updateCombat(actors);
          }

          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = '#060608';
          ctx.fillRect(0, 0, width, height);

          const sideGradient = ctx.createLinearGradient(0, 0, width, height);
          sideGradient.addColorStop(0, '#14100b');
          sideGradient.addColorStop(0.45, '#211810');
          sideGradient.addColorStop(1, '#070605');
          ctx.fillStyle = sideGradient;
          ctx.fillRect(0, 0, width, height);

          ctx.save();
          ctx.globalAlpha = 0.94;
          ctx.filter = 'drop-shadow(0 18px 38px rgba(0, 0, 0, 0.52))';
          ctx.drawImage(mapImage, transform.x, transform.y, MAP_W * transform.scale, MAP_H * transform.scale);
          ctx.restore();

          drawTorchGlows(ctx, transform, time);

          [...actors]
            .sort((a, b) => a.y - b.y)
            .forEach((actor) => drawActor(ctx, actor, linkCanvas, knightCanvas, transform, time));

          const vignette = ctx.createRadialGradient(width / 2, height * 0.5, height * 0.2, width / 2, height * 0.5, height * 0.78);
          vignette.addColorStop(0, 'rgba(6, 6, 8, 0)');
          vignette.addColorStop(0.72, 'rgba(6, 6, 8, 0.18)');
          vignette.addColorStop(1, 'rgba(6, 6, 8, 0.78)');
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, width, height);

          if (!reducedMotion) {
            rafRef.current = window.requestAnimationFrame(drawScene);
          }
        };

        if (reducedMotion) {
          actors = createActors();
          drawScene(0);
        } else {
          rafRef.current = window.requestAnimationFrame(drawScene);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener('resize', resize);

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCursorState = () => {
      const enabled = finePointerQuery.matches && !reducedMotionQuery.matches;
      clickEnabledRef.current = enabled;
      return enabled;
    };

    updateCursorState();

    const handlePointerDown = (event: PointerEvent) => {
      if (!clickEnabledRef.current) return;

      const id = Date.now() + Math.random();
      setCursorBursts((current) => [...current, { id, x: event.clientX, y: event.clientY }]);

      const timer = window.setTimeout(() => {
        setCursorBursts((current) => current.filter((burst) => burst.id !== id));
      }, 760);
      burstTimersRef.current.push(timer);
    };

    const handleMediaChange = () => {
      updateCursorState();
    };

    window.addEventListener('pointerdown', handlePointerDown);
    finePointerQuery.addEventListener('change', handleMediaChange);
    reducedMotionQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      finePointerQuery.removeEventListener('change', handleMediaChange);
      reducedMotionQuery.removeEventListener('change', handleMediaChange);
      burstTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      burstTimersRef.current = [];
    };
  }, []);

  return (
    <div className="zelda-dungeon-world" aria-hidden="true">
      <canvas ref={canvasRef} className="zelda-dungeon-world__canvas" />
      {cursorBursts.map((burst) => (
        <div key={burst.id} className="zelda-dungeon-world__click-burst" style={{ left: burst.x, top: burst.y }}>
          <span className="zelda-dungeon-world__click-triforce">
            <span className="zelda-dungeon-world__click-triangle zelda-dungeon-world__click-triangle--top" />
            <span className="zelda-dungeon-world__click-triangle zelda-dungeon-world__click-triangle--left" />
            <span className="zelda-dungeon-world__click-triangle zelda-dungeon-world__click-triangle--right" />
          </span>
          <span className="zelda-dungeon-world__click-ring" />
          <span className="zelda-dungeon-world__click-ray zelda-dungeon-world__click-ray--1" />
          <span className="zelda-dungeon-world__click-ray zelda-dungeon-world__click-ray--2" />
          <span className="zelda-dungeon-world__click-ray zelda-dungeon-world__click-ray--3" />
          <span className="zelda-dungeon-world__click-ray zelda-dungeon-world__click-ray--4" />
          <span className="zelda-dungeon-world__click-ray zelda-dungeon-world__click-ray--5" />
          <span className="zelda-dungeon-world__click-ray zelda-dungeon-world__click-ray--6" />
        </div>
      ))}
    </div>
  );
};
