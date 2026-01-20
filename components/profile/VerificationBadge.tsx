'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { VerificationLevel } from '@/types';

export interface VerificationBadgeProps {
  verified: boolean;
  verificationDate?: Date;
  verificationLevel?: VerificationLevel;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * VerificationBadge component displays verification status with level-based colors
 * 
 * @example
 * ```tsx
 * <VerificationBadge 
 *   verified={true}
 *   verificationDate={new Date()}
 *   verificationLevel="gold"
 *   size="md"
 * />
 * ```
 */
export function VerificationBadge({ 
  verified, 
  verificationDate,
  verificationLevel = VerificationLevel.EMAIL,
  size = 'md' 
}: VerificationBadgeProps) {
  if (!verified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
  };

  // Map verification level to badge color
  const getBadgeColor = () => {
    switch (verificationLevel) {
      case VerificationLevel.EMAIL:
        return 'bg-blue-500';
      case VerificationLevel.ID:
        return 'bg-green-500';
      case VerificationLevel.GOLD:
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getLevelLabel = () => {
    switch (verificationLevel) {
      case VerificationLevel.EMAIL:
        return 'Email Verified';
      case VerificationLevel.ID:
        return 'ID Verified';
      case VerificationLevel.GOLD:
        return 'Trusted Seller';
      default:
        return 'Verified';
    }
  };

  const title = verificationDate 
    ? `${getLevelLabel()} on ${verificationDate.toLocaleDateString()}`
    : getLevelLabel();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative inline-flex items-center justify-center"
      title={title}
    >
      <div className={`${sizeClasses[size]} ${getBadgeColor()} rounded-full flex items-center justify-center`}>
        <Check size={iconSizes[size]} className="text-white" strokeWidth={3} />
      </div>
    </motion.div>
  );
}
