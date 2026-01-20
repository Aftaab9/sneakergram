/**
 * ScrollReveal Component
 * Reveals content as it enters the viewport
 * Property 12.5: Scroll-triggered card animations
 */

'use client';

import { motion } from 'framer-motion';
import { cardEntrance, viewportConfig } from '@/lib/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Animates children when they scroll into view
 * Usage: <ScrollReveal><YourComponent /></ScrollReveal>
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      variants={cardEntrance}
      initial="initial"
      whileInView="animate"
      viewport={viewportConfig}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
