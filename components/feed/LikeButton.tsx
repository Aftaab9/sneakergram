/**
 * LikeButton Component
 * Animated like button with heart icon
 */

'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
  className?: string;
}

/**
 * LikeButton with animation
 * Property 6: Like button toggles state
 * Validates: Requirements 3.4
 */
export function LikeButton({ isLiked, onLike, className }: LikeButtonProps) {
  return (
    <motion.button
      onClick={onLike}
      className={cn(
        'flex items-center justify-center p-2 rounded-full transition-colors',
        'hover:bg-white/10',
        className
      )}
      whileTap={{ scale: 0.9 }}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn(
            'w-6 h-6 transition-colors',
            isLiked ? 'fill-primary text-primary' : 'text-gray-400'
          )}
        />
      </motion.div>
    </motion.button>
  );
}
