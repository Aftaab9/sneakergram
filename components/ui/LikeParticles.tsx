/**
 * LikeParticles Component
 * Particle effect for like animation
 * Property 12.1: Like animation with particles
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { particleVariants } from '@/lib/animations';

interface LikeParticlesProps {
  show: boolean;
}

/**
 * Renders floating heart particles in a circular pattern
 * Used for double-tap like animation
 */
export function LikeParticles({ show }: LikeParticlesProps) {
  const particleCount = 8;
  
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Main heart */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotate: 0,
              transition: {
                type: 'spring',
                stiffness: 200,
                damping: 10
              }
            }}
            exit={{ 
              scale: 1.5, 
              opacity: 0,
              transition: { duration: 0.5 }
            }}
          >
            <Heart className="w-24 h-24 fill-primary text-primary drop-shadow-glow" />
          </motion.div>
          
          {/* Particle hearts */}
          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute"
              variants={particleVariants(index)}
              initial="initial"
              animate="animate"
            >
              <Heart className="w-4 h-4 fill-primary text-primary" />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
