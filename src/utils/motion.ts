export const motionEase = [0.22, 1, 0.36, 1] as const;

export const viewport = {
  once: true,
  amount: 0.18,
} as const;

export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 42,
    filter: 'blur(10px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.82,
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
    y: 26,
    rotate: -1.6,
    scale: 0.985,
    filter: 'blur(8px)',
  },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.72,
      ease: motionEase,
    },
  },
};
