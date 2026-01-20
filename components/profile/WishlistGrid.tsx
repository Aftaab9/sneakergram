'use client';

import { Sneaker } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, TrendingUp, TrendingDown } from 'lucide-react';

export interface WishlistGridProps {
  sneakers: Sneaker[];
  onSneakerClick?: (sneakerId: string) => void;
  onRemove?: (sneakerId: string) => void;
}

/**
 * WishlistGrid component displays desired sneakers with market data
 * 
 * @example
 * ```tsx
 * <WishlistGrid 
 *   sneakers={wishlistSneakers}
 *   onSneakerClick={handleClick}
 *   onRemove={handleRemove}
 * />
 * ```
 */
export function WishlistGrid({ 
  sneakers, 
  onSneakerClick,
  onRemove 
}: WishlistGridProps) {
  if (sneakers.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No sneakers in wishlist yet</p>
        <p className="text-gray-500 text-sm mt-2">Add sneakers you want to track</p>
      </div>
    );
  }

  // Mock availability indicator (in real app, this would come from API)
  const getAvailability = () => {
    const random = Math.random();
    if (random > 0.7) return { available: true, count: Math.floor(Math.random() * 10) + 1 };
    return { available: false, count: 0 };
  };

  // Mock price trend (in real app, this would come from historical data)
  const getPriceTrend = () => {
    const random = Math.random();
    if (random > 0.5) return 'up';
    return 'down';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sneakers.map((sneaker, index) => {
        const availability = getAvailability();
        const priceTrend = getPriceTrend();
        
        return (
          <motion.div
            key={sneaker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
          >
            <div className="flex gap-4 p-4">
              {/* Sneaker Image */}
              <div 
                className="relative w-24 h-24 flex-shrink-0 bg-background rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onSneakerClick?.(sneaker.id)}
              >
                <Image
                  src={sneaker.images[0]}
                  alt={`${sneaker.brand} ${sneaker.model}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              
              {/* Sneaker Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">{sneaker.brand}</p>
                    <h3 
                      className="text-sm font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-primary"
                      onClick={() => onSneakerClick?.(sneaker.id)}
                    >
                      {sneaker.model}
                    </h3>
                    <p className="text-xs text-gray-500">{sneaker.colorway}</p>
                  </div>
                  
                  {/* Remove Button */}
                  {onRemove && (
                    <button
                      onClick={() => onRemove(sneaker.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  )}
                </div>
                
                {/* Market Data */}
                <div className="space-y-2">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Market Price</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-foreground">
                        ${sneaker.marketValue.toLocaleString()}
                      </span>
                      {priceTrend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-red-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Availability</span>
                    {availability.available ? (
                      <span className="text-xs text-green-500 font-medium">
                        {availability.count} listings
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Out of stock</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
