/**
 * PullToRefresh Component
 * Enhanced pull-to-refresh with smooth animations
 * Property 12.2: Pull-to-refresh animation
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { pullToRefresh } from '@/lib/animations';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  maxPullDistance?: number;
}

/**
 * Wrapper component that adds pull-to-refresh functionality
 * Usage: <PullToRefresh onRefresh={handleRefresh}>{content}</PullToRefresh>
 */
export function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 60,
  maxPullDistance = 100 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      pullStartY.current = e.touches[0].clientY;
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (pullStartY.current === 0 || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStartY.current;
    
    if (distance > 0 && window.scrollY === 0) {
      const dampedDistance = Math.min(distance * 0.5, maxPullDistance);
      setPullDistance(dampedDistance);
      setIsPulling(true);
      
      // Prevent default scroll behavior when pulling
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [isRefreshing, maxPullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    pullStartY.current = 0;
    setPullDistance(0);
    setIsPulling(false);
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const shouldShowRefreshIcon = isPulling || isRefreshing;
  const iconRotation = Math.min((pullDistance / threshold) * 360, 360);
  const iconOpacity = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {shouldShowRefreshIcon && (
          <motion.div
            variants={pullToRefresh}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-0 left-0 right-0 flex justify-center pt-4 z-10"
            style={{ 
              transform: `translateY(${Math.min(pullDistance - 40, 20)}px)` 
            }}
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-full p-3 shadow-lg border border-border">
              <RefreshCw 
                className="w-6 h-6 text-primary"
                style={{ 
                  transform: isRefreshing 
                    ? 'rotate(0deg)' 
                    : `rotate(${iconRotation}deg)`,
                  opacity: iconOpacity,
                  transition: isRefreshing ? 'none' : 'transform 0.1s ease-out'
                }}
                {...(isRefreshing && {
                  className: 'w-6 h-6 text-primary animate-spin'
                })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div style={{ 
        transform: isPulling ? `translateY(${pullDistance * 0.3}px)` : 'translateY(0)',
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}>
        {children}
      </div>
    </div>
  );
}
