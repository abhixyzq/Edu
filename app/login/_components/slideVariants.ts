// Shared Framer Motion slide animation variants for auth forms
export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 140 : -140,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 340, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 140 : -140,
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring', stiffness: 340, damping: 30 },
      opacity: { duration: 0.15 },
    },
  }),
};
