import { useCallback, useEffect, useRef, useState } from 'react';

import './PageTransition.css';

interface PageTransitionProps {
  children: React.ReactNode;
  routeKey: string;
}

const SHUTDOWN_MS = 420;
const BLACKOUT_MS = 160;
const BOOT_MS = 520;
const REVEAL_MS = 620;

export const PageTransition = ({ children, routeKey }: PageTransitionProps) => {
  const prevPathRef = useRef(routeKey);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pendingChildrenRef = useRef(children);
  const timeoutRefs = useRef<number[]>([]);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  const clearTimers = useCallback(() => {
    timeoutRefs.current.forEach((timer) => window.clearTimeout(timer));
    timeoutRefs.current = [];
  }, []);

  useEffect(() => {
    pendingChildrenRef.current = children;
  }, [children]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!overlay || !content) {
      return;
    }

    if (routeKey === prevPathRef.current) {
      return;
    }

    prevPathRef.current = routeKey;
    clearTimers();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setDisplayedChildren(pendingChildrenRef.current);
      content.classList.remove('is-hidden', 'is-reveal');
      overlay.classList.remove('is-active', 'is-shutdown', 'is-blackout', 'is-boot');
      return;
    }

    overlay.classList.remove('is-active', 'is-shutdown', 'is-blackout', 'is-boot');
    content.classList.remove('is-reveal');
    void overlay.offsetWidth;

    overlay.classList.add('is-active', 'is-shutdown');
    content.classList.add('is-hidden');

    timeoutRefs.current.push(
      window.setTimeout(() => {
        overlay.classList.remove('is-shutdown');
        overlay.classList.add('is-blackout');
      }, SHUTDOWN_MS),
    );

    timeoutRefs.current.push(
      window.setTimeout(() => {
        setDisplayedChildren(pendingChildrenRef.current);
        overlay.classList.remove('is-blackout');
        overlay.classList.add('is-boot');
      }, SHUTDOWN_MS + BLACKOUT_MS),
    );

    timeoutRefs.current.push(
      window.setTimeout(() => {
        overlay.classList.remove('is-boot');
        overlay.classList.remove('is-active');
        content.classList.remove('is-hidden');
        content.classList.remove('is-reveal');
        void content.offsetWidth;
        content.classList.add('is-reveal');
      }, SHUTDOWN_MS + BLACKOUT_MS + BOOT_MS),
    );

    timeoutRefs.current.push(
      window.setTimeout(() => {
        content.classList.remove('is-reveal');
      }, SHUTDOWN_MS + BLACKOUT_MS + BOOT_MS + REVEAL_MS),
    );

    return () => {
      clearTimers();
    };
  }, [clearTimers, routeKey]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <div className="ptrans">
      <div ref={overlayRef} className="ptrans__overlay" aria-hidden="true">
        <div className="ptrans__beam" />
        <div className="ptrans__scanlines" />
        <div className="ptrans__noise" />
        <div className="ptrans__fringe" />
      </div>
      <div ref={contentRef} className="ptrans__content">
        {displayedChildren}
      </div>
    </div>
  );
};
