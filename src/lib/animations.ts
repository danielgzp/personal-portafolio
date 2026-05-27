import { Variants, Transition } from "framer-motion"

// Starts gentle, surges mid-curve, lands softly — feels intentional, not robotic.
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as [number, number, number, number]
// Spring physics for organic, weighted feel
export const SPRING_BOUNCY: Transition = { type: "spring", stiffness: 400, damping: 10 }
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 400, damping: 12 }
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 280, damping: 22 }
// Super smooth response for cursor hover/interactions without endless wobble
export const SPRING_INTERACTIVE: Transition = { type: "spring", stiffness: 300, damping: 20 }
// Ultra fast and damp physical feedback for taps
export const SPRING_TAP: Transition = { type: "spring", stiffness: 500, damping: 26 }


// Level 1: top-level page stagger
export const pageVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
}

// Level 2: each section fades + rises with a stately, elegant movement
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_PREMIUM },
  },
}
