import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import './PageTransition.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const wipeRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const triggerWipe = useCallback(() => {
    const el = wipeRef.current;

    if (!el) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      return;
    }

    /* Remove class to reset animation, then re-add */
    el.classList.remove('is-active');
    void el.offsetWidth;
    el.classList.add('is-active');

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      el.classList.remove('is-active');
      timeoutRef.current = null;
    }, 500);
  }, []);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) {
      return;
    }

    prevPathRef.current = location.pathname;
    triggerWipe();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, triggerWipe]);

  return (
    <div className="page-transition">
      <div ref={wipeRef} className="page-transition__wipe" aria-hidden="true" />
      {children}
    </div>
  );
};
