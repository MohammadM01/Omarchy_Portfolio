import { useReducedMotion } from 'framer-motion'

/** Shared motion tokens — subtle, OS-like, 60fps-friendly */

export const easings = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.4, 0, 0.2, 1],
  soft: [0.33, 1, 0.68, 1],
}

export const springs = {
  window: { type: 'spring', stiffness: 340, damping: 28, mass: 0.85 },
  menu: { type: 'spring', stiffness: 400, damping: 32, mass: 0.7 },
  tap: { type: 'spring', stiffness: 500, damping: 28 },
  snappy: { type: 'spring', stiffness: 450, damping: 30 },
}

export const durations = {
  hover: 0.15,
  micro: 0.18,
  close: 0.22,
  theme: 0.4,
  menu: 0.28,
}

export function useMotionPrefs() {
  const reduced = useReducedMotion()
  return {
    reduced: Boolean(reduced),
    windowTransition: reduced
      ? { duration: 0.01 }
      : springs.window,
    menuTransition: reduced
      ? { duration: 0.01 }
      : springs.menu,
    fade: reduced
      ? { duration: 0.01 }
      : { duration: durations.micro, ease: easings.out },
  }
}

export const windowOpen = {
  initial: { opacity: 0, scale: 0.94, y: 14 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 10 },
}

export const windowOpenReduced = {
  initial: { opacity: 1, scale: 1, y: 0 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 1 },
}

export const startMenuVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  panel: {
    initial: { opacity: 0, y: 28, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.97 },
  },
}

export const staggerGrid = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.035, delayChildren: 0.04 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 8, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
}

export const toastMotion = {
  initial: { opacity: 0, x: 28, y: 8, scale: 0.96 },
  animate: { opacity: 1, x: 0, y: 0, scale: 1 },
  exit: { opacity: 0, x: 20, scale: 0.96 },
}
