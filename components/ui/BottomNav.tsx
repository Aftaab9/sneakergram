'use client';

import { Home, Search, ShoppingBag, User, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { CreatePost } from '@/components/feed/CreatePost';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  icon: LucideIcon;
  href: string;
  action?: 'create';
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', icon: Home, href: '/feed' },
  { name: 'Search', icon: Search, href: '/explore' },
  { name: 'Community', icon: Users, href: '/community' },
  { name: 'Marketplace', icon: ShoppingBag, href: '/marketplace' },
  { name: 'Profile', icon: User, href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-border safe-area-bottom z-50">
        <div className="flex justify-around items-center h-12 max-w-screen-xl mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href !== '#' && (pathname === item.href || pathname.startsWith(item.href + '/'));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-center p-3"
                aria-label={item.name}
              >
                <Icon
                  className="w-6 h-6 text-foreground transition-all"
                  strokeWidth={isActive ? 2.5 : 1.5}
                  fill={isActive && item.name !== 'Search' ? 'currentColor' : 'none'}
                />
              </Link>
            );
          })}
        </div>
      </nav>
      
      <CreatePost isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
