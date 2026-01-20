'use client';

import { Sneaker } from '@/types';
import { VerificationBadge } from './VerificationBadge';
import { useVerificationStore } from '@/stores/verificationStore';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface SneakerCollectionProps {
  sneakers: Sneaker[];
  userId: string;
  onSneakerClick?: (sneakerId: string) => void;
  onVerifyClick?: (sneaker: Sneaker) => void;
}

/**
 * SneakerCollection component displays a grid of owned sneakers
 * 
 * @example
 * ```tsx
 * <SneakerCollection 
 *   sneakers={userSneakers}
 *   userId={currentUser.id}
 *   onSneakerClick={handleClick}
 *   onVerifyClick={handleVerify}
 * />
 * ```
 */
export function SneakerCollection({ 
  sneakers, 
  userId,
  onSneakerClick,
  onVerifyClick
}: SneakerCollectionProps) {
  const { getVerificationStatus } = useVerificationStore();

  if (sneakers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No sneakers in collection yet</p>
        <p className="text-gray-500 text-sm mt-2">Start adding sneakers to build your collection</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {sneakers.map((sneaker, index) => {
        const verification = getVerificationStatus(sneaker.id, userId);
        const isVerified = verification?.status === 'success';
        
        return (
          <motion.div
            key={sneaker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-lg overflow-hidden group"
          >
            {/* Sneaker Image */}
            <div 
              className="relative aspect-square bg-background cursor-pointer"
              onClick={() => onSneakerClick?.(sneaker.id)}
            >
              <Image
                src={sneaker.images[0]}
                alt={`${sneaker.brand} ${sneaker.model}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              
              {/* Verification Badge */}
              {isVerified && (
                <div className="absolute top-2 right-2">
                  <VerificationBadge 
                    verified={true} 
                    verificationDate={verification.verificationDate}
                    size="md" 
                  />
                </div>
              )}
            </div>
            
            {/* Sneaker Info */}
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-1">{sneaker.brand}</p>
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
                {sneaker.model}
              </h3>
              <p className="text-xs text-gray-500">{sneaker.colorway}</p>
              
              {/* Market Value */}
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-xs text-gray-400">Market Value</p>
                <p className="text-sm font-bold text-primary">
                  ${sneaker.marketValue.toLocaleString()}
                </p>
              </div>

              {/* Verify Button */}
              {!isVerified && onVerifyClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerifyClick(sneaker);
                  }}
                  className="w-full mt-2 px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-md hover:bg-primary/10 transition-colors"
                >
                  Verify Authenticity
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
