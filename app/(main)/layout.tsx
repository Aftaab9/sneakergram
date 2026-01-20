'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { BottomNav } from '@/components/ui/BottomNav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Home, Search, ShoppingBag, Send, User, Sparkles, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

/**
 * Main layout for authenticated pages
 * Instagram-like responsive layout with sidebar on desktop
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initializeAuth, loading, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { name: 'Home', icon: Home, href: '/feed' },
    { name: 'Search', icon: Search, href: '/explore' },
    { name: 'Community', icon: Users, href: '/community' },
    { name: 'Events', icon: Calendar, href: '/events' },
    { name: 'Marketplace', icon: ShoppingBag, href: '/marketplace' },
    { name: 'Services', icon: Sparkles, href: '/services' },
    { name: 'Messages', icon: Send, href: '/messages' },
    { name: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[245px] xl:w-[335px] border-r border-border flex-col py-6 px-3 z-50 bg-black">
        {/* Logo */}
        <Link href="/feed" className="px-3 pt-6 pb-4 mb-4">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Sneakergram
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all hover:bg-card group ${
                  isActive ? 'font-bold' : 'font-normal'
                }`}
              >
                <Icon 
                  className="w-6 h-6" 
                  strokeWidth={isActive ? 2.5 : 1.5}
                  fill={isActive ? 'currentColor' : 'none'}
                />
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile at bottom */}
        {user && (
          <Link 
            href="/profile" 
            className="flex items-center gap-3 px-3 py-3 mt-auto hover:bg-card rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-card">
              <Image
                src={user.avatar || '/data/nike_air_jordan_1_high/0001.jpg'}
                alt={user.displayName}
                width={32}
                height={32}
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
            </div>
          </Link>
        )}
      </aside>

      {/* Main content area */}
      <main className="lg:ml-[245px] xl:ml-[335px] min-h-screen pb-14 lg:pb-0">
        <div className="w-full max-w-[935px] mx-auto">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation - Mobile only */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
