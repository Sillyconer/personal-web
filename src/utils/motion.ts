export const motionEase = [0.22, 1, 0.36, 1] as const;

export const viewport = {
  once: true,
  amount: 0.18,
} as const;

export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.965,
    skewX: -6,
    filter: 'blur(12px) saturate(1.35)',
    clipPath: 'inset(0 100% 0 0 round 28px)',
  },
  show: {
    opacity: [0, 0.72, 1],
    y: [48, -8, 0],
    scale: [0.965, 1.015, 1],
    skewX: [-6, 2, 0],
    filter: ['blur(12px) saturate(1.35)', 'blur(2px) saturate(1.12)', 'blur(0px) saturate(1)'],
    clipPath: ['inset(0 100% 0 0 round 28px)', 'inset(0 18% 0 0 round 28px)', 'inset(0 0 0 0 round 28px)'],
    transition: {
      duration: 0.98,
      times: [0, 0.58, 1],
      ease: motionEase,
    },
  },
};

export const staggerGroup = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.11,
    },
  },
};

export const cardReveal = {
  hidden: {
    opacity: 0,
    y: 32,
    rotate: -2,
    scale: 0.97,
    skewX: -4,
    filter: 'blur(10px) saturate(1.4)',
    clipPath: 'inset(0 100% 0 0 round 24px)',
  },
  show: {
    opacity: [0, 0.78, 1],
    y: [32, -6, 0],
    rotate: [-2, 1.2, 0],
    scale: [0.97, 1.012, 1],
    skewX: [-4, 1, 0],
    filter: ['blur(10px) saturate(1.4)', 'blur(2px) saturate(1.1)', 'blur(0px) saturate(1)'],
    clipPath: ['inset(0 100% 0 0 round 24px)', 'inset(0 20% 0 0 round 24px)', 'inset(0 0 0 0 round 24px)'],
    transition: {
      duration: 0.82,
      times: [0, 0.58, 1],
      ease: motionEase,
    },
  },
};
