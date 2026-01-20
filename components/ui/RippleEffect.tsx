/**
 * RippleEffect Component
 * Material Design ripple effect for buttons
 * Property 12.4: Button press animations (ripple)
 */

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * Wrapper component that adds ripple effect to its children
 * Usage: <RippleEffect><button>Click me</button></RippleEffect>
 */
export function RippleEffect({ children, className, disabled }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  
  const addRipple = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  }, [disabled]);
  
  return (
    <div
      className={`relative overflow-hidden ${className || ''}`}
      onMouseDown={addRipple}
    >
      {children}
      
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ 
              scale: 4, 
              opacity: 0,
              width: 100,
              height: 100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
