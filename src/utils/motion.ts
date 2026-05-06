/* Pixel-stepped motion variants — no blur, no skew, no smooth easing */

import type { Easing } from 'framer-motion';

const stepped: Easing = 'linear';

export const viewport = {
  once: true,
  amount: 0.15,
} as const;

export const pixelReveal = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  show: {
    opacity: [0, 0.5, 0.8, 1],
    y: [8, 4, 0, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.3, 0.6, 1],
      ease: stepped,
    },
  },
};

export const staggerGroup = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.06,
    },
  },
};

export const cardReveal = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  show: {
    opacity: [0, 0.6, 1],
    y: [8, 0, 0],
    transition: {
      duration: 0.35,
      times: [0, 0.5, 1],
      ease: stepped,
    },
  },
};

/* Re-export with old names for compat during migration */
export const sectionReveal = pixelReveal;
export const motionEase = [0, 0, 1, 1] as const;
