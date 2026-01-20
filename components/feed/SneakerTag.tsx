/**
 * SneakerTag Component
 * Tappable chip displaying sneaker information
 */

'use client';

import { useRouter } from 'next/navigation';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSneakerById } from '@/lib/mockData';

interface SneakerTagProps {
  sneakerId: string;
  className?: string;
}

/**
 * SneakerTag chip component
 * Property 9: Sneaker tags display as chips
 * Validates: Requirements 4.3
 */
export function SneakerTag({ sneakerId, className }: SneakerTagProps) {
  const router = useRouter();
  const sneaker = getSneakerById(sneakerId);

  if (!sneaker) return null;

  const handleClick = () => {
    router.push(`/sneaker/${sneakerId}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5',
        'bg-white/5 hover:bg-white/10',
        'border border-white/10',
        'rounded-full',
        'text-sm text-gray-300',
        'transition-colors',
        'cursor-pointer',
        className
      )}
      aria-label={`View ${sneaker.brand} ${sneaker.model}`}
    >
      <Tag className="w-3.5 h-3.5" />
      <span>{sneaker.brand} {sneaker.model}</span>
    </button>
  );
}
