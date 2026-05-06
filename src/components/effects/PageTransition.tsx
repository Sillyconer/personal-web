import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import './PageTransition.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const triggerTransition = useCallback(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!overlay || !content) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    /* Clear any pending timeouts */
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    /* Phase 1: CRT shutdown — full blackout */
    overlay.classList.remove('is-shutdown', 'is-boot');
    content.classList.remove('is-decipher');
    void overlay.offsetWidth;

    overlay.classList.add('is-shutdown');

    /* Phase 2: Boot + decipher — after shutdown completes */
    timeoutRef.current = window.setTimeout(() => {
      overlay.classList.remove('is-shutdown');
      overlay.classList.add('is-boot');
      content.classList.add('is-decipher');

      /* Cleanup */
      timeoutRef.current = window.setTimeout(() => {
        overlay.classList.remove('is-boot');
        content.classList.remove('is-decipher');
        timeoutRef.current = null;
      }, 700);
    }, 350);
  }, []);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;

    prevPathRef.current = location.pathname;
    triggerTransition();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, triggerTransition]);

  return (
    <div className="ptrans">
      <div ref={overlayRef} className="ptrans__overlay" aria-hidden="true">
        <div className="ptrans__scanline" />
        <div className="ptrans__noise" />
      </div>
      <div ref={contentRef} className="ptrans__content">
        {children}
      </div>
    </div>
  );
};
