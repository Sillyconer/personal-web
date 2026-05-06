import { useEffect, useState } from 'react';

import './CrtOverlay.css';

export const CrtOverlay = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setEnabled(!reducedMotionQuery.matches);
    };

    update();
    reducedMotionQuery.addEventListener('change', update);

    return () => {
      reducedMotionQuery.removeEventListener('change', update);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div className="crt-overlay" aria-hidden="true">
      <div className="crt-overlay__scanlines" />
      <div className="crt-overlay__vignette" />
      <div className="crt-overlay__fringe" />
    </div>
  );
};
