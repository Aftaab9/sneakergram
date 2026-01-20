/**
 * PageTransition Component
 * Wrapper for page-level animations
 * Property 12.2: Page transition animations
 */

'use client';

import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps page content with smooth transition animations
 * Usage: Wrap page content in this component for automatic transitions
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
