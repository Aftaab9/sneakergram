/**
 * Animation Utilities
 * Centralized animation variants and utilities for Framer Motion
 * Requirements: 12.1, 12.2, 12.4, 12.5
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Fade In Animation
 * Used for general content appearing
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

/**
 * Slide Up Animation
 * Used for modals and bottom sheets
 */
export const slideUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

/**
 * Slide Down Animation
 * Used for dropdowns and notifications
 */
export const slideDown: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

/**
 * Scale In Animation
 * Used for modals and popups
 */
export const scaleIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};

/**
 * Scale Out Animation
 * Used for dismissing elements
 */
export const scaleOut: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: 0.8, opacity: 0 },
  exit: { scale: 0, opacity: 0 }
};

/**
 * Like Animation with Particles
 * Property 12.1: Like animation with particles
 */
export const likeAnimation = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.3, ease: 'easeInOut' }
};

/**
 * Heart Burst Animation
 * Used for double-tap like effect
 */
export const heartBurst: Variants = {
  initial: { scale: 0, opacity: 0, rotate: -45 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10
    }
  },
  exit: { 
    scale: 1.5, 
    opacity: 0,
    transition: { duration: 0.5 }
  }
};

/**
 * Button Press Animation
 * Property 12.4: Button press animations (scale, ripple)
 */
export const buttonPress = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

/**
 * Button Hover Animation
 */
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

/**
 * Ripple Effect Animation
 * Used for button press feedback
 */
export const ripple: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: { 
    scale: 2, 
    opacity: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

/**
 * Card Entrance Animation
 * Property 12.5: Scroll-triggered card animations
 */
export const cardEntrance: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

/**
 * Staggered Children Animation
 * Used for lists and grids
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Staggered Child Item
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

/**
 * Page Transition Animations
 * Property 12.2: Page transition animations
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Modal Backdrop Animation
 */
export const backdropFade: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

/**
 * Modal Content Animation
 */
export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

/**
 * Pull to Refresh Animation
 */
export const pullToRefresh: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

/**
 * Floating Action Button Animation
 */
export const fabAnimation = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 }
};

/**
 * Skeleton Shimmer Animation
 * Used for loading states
 */
export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

/**
 * Notification Slide In
 */
export const notificationSlide: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  },
  exit: { 
    x: 100, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

/**
 * Bounce Animation
 * Used for attention-grabbing elements
 */
export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2
    }
  }
};

/**
 * Pulse Animation
 * Used for loading indicators and attention
 */
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

/**
 * Rotate Animation
 * Used for loading spinners
 */
export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

/**
 * Swipe Gesture Variants
 */
export const swipeVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

/**
 * Spring Transition
 * Smooth spring physics
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30
};

/**
 * Smooth Transition
 * Ease out transition
 */
export const smoothTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut'
};

/**
 * Quick Transition
 * Fast transition for micro-interactions
 */
export const quickTransition: Transition = {
  duration: 0.15,
  ease: 'easeInOut'
};

/**
 * Particle Animation for Like Effect
 * Creates floating particles around the heart
 */
export const particleVariants = (index: number): Variants => {
  const angle = (index * 360) / 8; // 8 particles in a circle
  const distance = 50;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  
  return {
    initial: { 
      x: 0, 
      y: 0, 
      scale: 0, 
      opacity: 0 
    },
    animate: { 
      x, 
      y, 
      scale: [0, 1, 0], 
      opacity: [0, 1, 0],
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        times: [0, 0.3, 1]
      }
    }
  };
};

/**
 * Viewport Animation Config
 * Used with whileInView for scroll-triggered animations
 */
export const viewportConfig = {
  once: true,
  margin: '-50px',
  amount: 0.3
};

/**
 * Hover Scale Animation
 * Subtle scale on hover
 */
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

/**
 * Tap Scale Animation
 * Quick scale on tap
 */
export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 }
};
