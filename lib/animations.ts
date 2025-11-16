/**
 * Global animation variants and utilities for Framer Motion
 * Provides consistent animations across the application
 */

import { Variants } from 'framer-motion';

/**
 * Page transition animations (fade + slide)
 * Used for page-level transitions
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Container for staggered children animations
 * Used for lists and grids
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05, // 50ms delay between items
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Individual list item animation
 * Used with staggerContainer
 */
export const listItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Button hover and click animations
 * Applied via whileHover and whileTap props
 */
export const buttonAnimation = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1] as const, // easeOut cubic-bezier
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1] as const, // easeIn cubic-bezier
    },
  },
};

/**
 * Card hover animation
 * For interactive cards
 */
export const cardAnimation = {
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1] as const, // easeOut cubic-bezier
    },
  },
};

/**
 * Modal/Dialog animations (fade + scale)
 */
export const modalAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

/**
 * Backdrop animation for modals
 */
export const backdropAnimation: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

/**
 * Fade in animation
 * Simple opacity transition
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Slide in from bottom animation
 */
export const slideInFromBottom: Variants = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Slide in from top animation
 */
export const slideInFromTop: Variants = {
  initial: {
    y: -50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    y: -50,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Scale in animation
 */
export const scaleIn: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.175, 0.885, 0.32, 1.275], // Spring-like easing
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Utility function to create custom stagger delays
 */
export const createStaggerContainer = (delayMs: number = 50): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: delayMs / 1000,
    },
  },
  exit: {
    transition: {
      staggerChildren: delayMs / 1000,
      staggerDirection: -1,
    },
  },
});

/**
 * Spring animation configuration for smooth, natural motion
 */
export const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/**
 * Reduced motion configuration for accessibility
 * Use with prefers-reduced-motion media query
 */
export const reducedMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.01 },
};
