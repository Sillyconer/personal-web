import { useEffect, useMemo, useRef, useState } from 'react';

import './InteractionFx.css';

interface Burst {
  id: number;
  x: number;
  y: number;
}

const TRAIL_COUNT = 10;

export const InteractionFx = () => {
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
      document.documentElement.dataset.pointerFx = nextEnabled ? 'active' : 'inactive';
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

      setBursts((current) => [...current, { id, x: event.clientX, y: event.clientY }]);

      window.setTimeout(() => {
        setBursts((current) => current.filter((burst) => burst.id !== id));
      }, 780);
    };

    const animateTrail = () => {
      if (!isActive) {
        return;
      }

      const points = pointsRef.current;

      points[0].x += (mouseRef.current.x - points[0].x) * 0.28;
      points[0].y += (mouseRef.current.y - points[0].y) * 0.28;

      for (let index = 1; index < points.length; index += 1) {
        points[index].x += (points[index - 1].x - points[index].x) * 0.24;
        points[index].y += (points[index - 1].y - points[index].y) * 0.24;
      }

      trailRefs.current.forEach((node, index) => {
        if (!node) {
          return;
        }

        const point = points[index];
        const scale = 1 - index * 0.07;
        const rotation = index % 2 === 0 ? index * 6 : -index * 5;

        node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        node.style.opacity = `${0.88 - index * 0.07}`;
      });

      frameRef.current = window.requestAnimationFrame(animateTrail);
    };

    if (isActive) {
      frameRef.current = window.requestAnimationFrame(animateTrail);
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);

    const handleMediaChange = () => {
      const nextEnabled = updateEnabledState();
      isActive = nextEnabled;

      if (!nextEnabled && frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (nextEnabled && !frameRef.current) {
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
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`interaction-fx ${interactive ? 'is-interactive' : ''}`} aria-hidden="true">
      {trailIndexes.map((index) => (
        <span
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
          className={`interaction-fx__trail interaction-fx__trail--${index % 3}`}
        />
      ))}

      {bursts.map((burst) => (
        <div key={burst.id} className="interaction-fx__burst" style={{ left: burst.x, top: burst.y }}>
          <span className="interaction-fx__burst-ring" />
          {Array.from({ length: 10 }, (_, index) => (
            <span
              key={index}
              className="interaction-fx__burst-pixel"
              style={{
                ['--burst-angle' as string]: `${index * 36}deg`,
                ['--burst-distance' as string]: `${18 + (index % 3) * 10}px`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
