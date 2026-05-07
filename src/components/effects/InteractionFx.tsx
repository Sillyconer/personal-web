import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';

import { getCartridgeByPath } from '../../config/cartridges';
import './InteractionFx.css';

interface Burst {
  id: number;
  x: number;
  y: number;
  variant: 'default' | 'pokemon';
}

const TRAIL_COUNT = 14;
const BURST_PARTICLE_COUNT = 16;

const PIXEL_COLORS = [
  'var(--signal-teal)',
  'var(--aap-magenta)',
  'var(--aap-lime)',
  'var(--signal-yellow)',
  'var(--aap-orange)',
  'var(--signal-red)',
  'var(--aap-lavender)',
];

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

const RED_BURST_PARTICLES: CssVars[] = [
  { '--particle-angle': '0deg', '--particle-distance': '38px', '--particle-delay': '0ms', '--particle-size': '7px' },
  { '--particle-angle': '30deg', '--particle-distance': '30px', '--particle-delay': '35ms', '--particle-size': '5px' },
  { '--particle-angle': '62deg', '--particle-distance': '42px', '--particle-delay': '15ms', '--particle-size': '6px' },
  { '--particle-angle': '96deg', '--particle-distance': '34px', '--particle-delay': '55ms', '--particle-size': '5px' },
  { '--particle-angle': '132deg', '--particle-distance': '40px', '--particle-delay': '25ms', '--particle-size': '7px' },
  { '--particle-angle': '168deg', '--particle-distance': '32px', '--particle-delay': '65ms', '--particle-size': '4px' },
  { '--particle-angle': '204deg', '--particle-distance': '44px', '--particle-delay': '10ms', '--particle-size': '6px' },
  { '--particle-angle': '238deg', '--particle-distance': '36px', '--particle-delay': '50ms', '--particle-size': '5px' },
  { '--particle-angle': '274deg', '--particle-distance': '41px', '--particle-delay': '20ms', '--particle-size': '7px' },
  { '--particle-angle': '312deg', '--particle-distance': '33px', '--particle-delay': '45ms', '--particle-size': '4px' },
];

export const InteractionFx = () => {
  const location = useLocation();
  const cartridge = getCartridgeByPath(location.pathname);
  const isContact = cartridge.id === 'contact';
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const interactiveRef = useRef(false);
  const pointsRef = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })),
  );
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const frameRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const trailIndexes = useMemo(() => Array.from({ length: TRAIL_COUNT }, (_, index) => index), []);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateEnabledState = () => {
      const nextEnabled = finePointerQuery.matches && !reducedMotionQuery.matches;
      setEnabled(nextEnabled);
      document.documentElement.dataset.pointerFx = nextEnabled && !isContact ? 'active' : 'inactive';
      return nextEnabled;
    };

    let isActive = updateEnabledState();

    const handlePointerMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };

      const nextInteractive = !!(event.target instanceof HTMLElement && event.target.closest('a, button, input, textarea, [data-interactive]'));

      if (interactiveRef.current !== nextInteractive) {
        interactiveRef.current = nextInteractive;
        setInteractive(nextInteractive);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (!isActive) {
        return;
      }

      const id = Date.now() + Math.random();

      setBursts((current) => [
        ...current,
        {
          id,
          x: event.clientX,
          y: event.clientY,
          variant: isContact ? 'pokemon' : 'default',
        },
      ]);

      window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id));
      }, 900);
    };

    const animateTrail = () => {
      if (!isActive || isContact) {
        return;
      }

      const points = pointsRef.current;

      /* Lead pixel snaps faster */
      points[0].x += (mouseRef.current.x - points[0].x) * 0.38;
      points[0].y += (mouseRef.current.y - points[0].y) * 0.38;

      for (let index = 1; index < points.length; index += 1) {
        const ease = index < 4 ? 0.22 : 0.14;
        points[index].x += (points[index - 1].x - points[index].x) * ease;
        points[index].y += (points[index - 1].y - points[index].y) * ease;
      }

      trailRefs.current.forEach((node, index) => {
        if (!node) {
          return;
        }

        const point = points[index];
        /* Snap to 2px grid for pixel feel */
        const sx = Math.round(point.x / 2) * 2;
        const sy = Math.round(point.y / 2) * 2;
        const scale = 1 - index * 0.04;
        const rotation = index % 2 === 0 ? index * 8 : -index * 7;

        node.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        node.style.opacity = `${0.92 - index * 0.055}`;
      });

      frameRef.current = window.requestAnimationFrame(animateTrail);
    };

    if (isActive && !isContact) {
      frameRef.current = window.requestAnimationFrame(animateTrail);
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);

    const handleMediaChange = () => {
      const nextEnabled = updateEnabledState();
      isActive = nextEnabled;

      if ((!nextEnabled || isContact) && frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (nextEnabled && !isContact && !frameRef.current) {
        frameRef.current = window.requestAnimationFrame(animateTrail);
      }
    };

    finePointerQuery.addEventListener('change', handleMediaChange);
    reducedMotionQuery.addEventListener('change', handleMediaChange);

    return () => {
      finePointerQuery.removeEventListener('change', handleMediaChange);
      reducedMotionQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      delete document.documentElement.dataset.pointerFx;
    };
  }, [isContact]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className={`interaction-fx interaction-fx--${cartridge.id} ${interactive ? 'is-interactive' : ''}`}
      aria-hidden="true"
    >
      {!isContact && (
        <>
          {trailIndexes.map((index) => (
            <span
              key={index}
              className="interaction-fx__trail"
              ref={(element) => {
                trailRefs.current[index] = element;
              }}
              style={{
                backgroundColor: PIXEL_COLORS[index % PIXEL_COLORS.length],
              }}
            />
          ))}
        </>
      )}

      {bursts.map((burst) => (
        <div
          key={burst.id}
          className={`interaction-fx__burst ${burst.variant === 'pokemon' ? 'interaction-fx__burst--pokemon' : ''}`}
          style={{ left: burst.x, top: burst.y }}
        >
          {burst.variant === 'pokemon' ? (
            <div className="pokemon-click-burst">
              <span className="pokemon-click-burst__core" />
              <span className="pokemon-click-burst__ring" />
              <div className="pokemon-click-burst__particles">
                {RED_BURST_PARTICLES.map((style, index) => (
                  <span key={index} style={style} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <span className="interaction-fx__burst-flash" />
              <span className="interaction-fx__burst-ring interaction-fx__burst-ring--inner" />
              <span className="interaction-fx__burst-ring interaction-fx__burst-ring--outer" />
              <span className="interaction-fx__burst-cross" />
              <span className="interaction-fx__burst-star" />
              {Array.from({ length: BURST_PARTICLE_COUNT }).map((_, index) => {
                const color = PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)];

                return (
                  <span
                    key={index}
                    className="interaction-fx__burst-pixel"
                    style={
                      {
                        '--burst-angle': `${index * (360 / BURST_PARTICLE_COUNT)}deg`,
                        '--burst-distance': `${22 + (index % 4) * 12}px`,
                        '--burst-delay': `${(index % 3) * 30}ms`,
                        '--burst-color': color,
                      } as CssVars
                    }
                  />
                );
              })}
            </>
          )}
        </div>
      ))}
    </div>
  );
};
