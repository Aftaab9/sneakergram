'use client';

import { motion } from 'framer-motion';
import { Grid, FileText, Heart, ShoppingBag, Star } from 'lucide-react';

export type ProfileTab = 'collection' | 'posts' | 'wishlist' | 'listings' | 'reviews';

export interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  counts?: {
    collection?: number;
    posts?: number;
    wishlist?: number;
    listings?: number;
    reviews?: number;
  };
}

const tabs: Array<{
  id: ProfileTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'collection', label: 'Collection', icon: Grid },
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'listings', label: 'Listings', icon: ShoppingBag },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

/**
 * ProfileTabs component for navigating between profile sections
 * 
 * @example
 * ```tsx
 * <ProfileTabs 
 *   activeTab="collection"
 *   onTabChange={setActiveTab}
 *   counts={{ collection: 10, posts: 25 }}
 * />
 * ```
 */
export function ProfileTabs({ activeTab, onTabChange, counts = {} }: ProfileTabsProps) {
  return (
    <div className="bg-card border border-border rounded-lg mb-4 overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 min-w-[100px] px-4 py-3 flex flex-col items-center gap-1 relative
                transition-colors
                ${isActive ? 'text-primary' : 'text-gray-400 hover:text-foreground'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
              {count !== undefined && (
                <span className="text-[10px] text-gray-500">({count})</span>
              )}
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
