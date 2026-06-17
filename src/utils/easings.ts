export const easings = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  decel: [0.0, 0.0, 0.2, 1] as const,
  accel: [0.4, 0.0, 1, 1] as const,
  spring: [0.43, 0.195, 0.22, 1.275] as const,
  bounceOut: [0.34, 1.56, 0.64, 1] as const,
  softBounce: [0.68, -0.55, 0.265, 1.55] as const,
};

export const springTransition = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 14,
  mass: 0.8,
};

export const smoothTransition = {
  duration: 0.6,
  ease: easings.smooth,
};

export const staggerChildren = (stagger = 0.08) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
    },
  },
});

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easings.decel },
  },
};
