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

// Level 1: top-level page stagger — each section enters with deliberate cadence
export const pageVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

// Level 2: each section fades + rises with a slow, cinematic reveal (Blur bridge)
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
}
