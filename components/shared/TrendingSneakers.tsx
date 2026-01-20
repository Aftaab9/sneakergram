'use client';

import { Sneaker } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TrendingSneakersProps {
  sneakers: Sneaker[];
}

/**
 * TrendingSneakers component with horizontal scroll
 * Displays trending sneakers with ownership count
 */
export function TrendingSneakers({ sneakers }: TrendingSneakersProps) {
  const router = useRouter();

  if (sneakers.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Trending Now</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {sneakers.map((sneaker, index) => (
          <motion.div
            key={sneaker.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(`/sneaker/${sneaker.id}`)}
            className="
              flex-shrink-0 w-48 cursor-pointer
              bg-card border border-border rounded-lg
              overflow-hidden hover:border-primary
              transition-all duration-200
            "
          >
            <div className="relative aspect-square bg-gray-900">
              <Image
                src={sneaker.images[0]}
                alt={sneaker.model}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-1">{sneaker.brand}</p>
              <p className="text-sm font-semibold text-white mb-2 line-clamp-2">
                {sneaker.model}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Users className="w-3 h-3" />
                <span>{sneaker.ownedByUsers} owners</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
