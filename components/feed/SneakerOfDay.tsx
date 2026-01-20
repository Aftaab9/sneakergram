/**
 * SneakerOfDay Component
 * Featured sneaker card displayed at the top of the feed
 */

'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign } from 'lucide-react';
import { Sneaker } from '@/types';
import { cn } from '@/lib/utils';

interface SneakerOfDayProps {
  sneaker: Sneaker;
  className?: string;
}

/**
 * SneakerOfDay component with featured sneaker details and market value
 * Validates: Requirements 3.1
 */
export function SneakerOfDay({ sneaker, className }: SneakerOfDayProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/sneaker/${sneaker.id}`);
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card',
        'border border-primary/30 shadow-glow cursor-pointer',
        className
      )}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full">
          <TrendingUp className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            Sneaker of the Day
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-[16/9] bg-black/20">
        <Image
          src={sneaker.images[0]}
          alt={`${sneaker.brand} ${sneaker.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 480px"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            {sneaker.brand} {sneaker.model}
          </h2>
          <p className="text-sm text-gray-300 mb-4">{sneaker.colorway}</p>
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-white">
                ${sneaker.marketValue.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">
                {sneaker.ownedByUsers.toLocaleString()} owners
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
