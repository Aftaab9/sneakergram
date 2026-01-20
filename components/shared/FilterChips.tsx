'use client';

import { motion } from 'framer-motion';

export type FilterOption = 'all' | 'users' | 'sneakers' | 'posts';

interface FilterChipsProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'users', label: 'Users' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'posts', label: 'Posts' },
];

/**
 * FilterChips component for category filtering
 * Displays tappable chips to filter search results
 */
export function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        
        return (
          <motion.button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            whileTap={{ scale: 0.95 }}
            className={`
              px-4 py-2 rounded-full whitespace-nowrap
              font-medium text-sm transition-all
              ${isActive 
                ? 'bg-primary text-white shadow-glow' 
                : 'bg-card text-gray-400 border border-border hover:border-primary'
              }
            `}
          >
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  );
}
