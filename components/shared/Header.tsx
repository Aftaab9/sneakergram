/**
 * Header Component
 * Displays page header with notification bell icon and unread count
 * Supports triple-tap on logo to reset demo data
 * Validates: Requirements 10.1, 15.1
 */

'use client';

import { useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/stores/notificationStore';
import { createTripleTapDetector, resetDemoData } from '@/lib/demoUtils';
import toast from 'react-hot-toast';

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
  showLogo?: boolean;
}

/**
 * Header Component
 * Reusable header with notification bell icon and triple-tap reset
 */
export function Header({ title, showNotifications = true, showLogo = false }: HeaderProps) {
  const router = useRouter();
  const { unreadCount, loadNotifications } = useNotificationStore();
  const tripleTapDetectorRef = useRef<ReturnType<typeof createTripleTapDetector> | null>(null);

  // Initialize triple-tap detector
  useEffect(() => {
    tripleTapDetectorRef.current = createTripleTapDetector(() => {
      toast.success('Demo data reset! Reloading...', {
        icon: '🔄',
        duration: 2000,
      });
      
      // Reset after a short delay to show the toast
      setTimeout(() => {
        resetDemoData();
      }, 500);
    });
    
    return () => {
      tripleTapDetectorRef.current?.reset();
    };
  }, []);

  // Load notifications on mount to get unread count
  useEffect(() => {
    if (showNotifications) {
      loadNotifications();
    }
  }, [showNotifications, loadNotifications]);

  const handleNotificationClick = () => {
    router.push('/notifications');
  };
  
  const handleLogoClick = () => {
    tripleTapDetectorRef.current?.handleTap();
  };

  return (
    <header className="sticky top-0 bg-card/50 backdrop-blur-sm border-b border-border p-3 sm:p-4 z-10 safe-area-top">
      <div className="flex items-center justify-between max-w-[480px] mx-auto">
        {/* Logo or Title */}
        {showLogo ? (
          <button
            onClick={handleLogoClick}
            className="text-xl sm:text-2xl font-bold text-primary hover:text-primary/80 transition-colors select-none"
            aria-label="SneakerGram Logo (Triple-tap to reset demo)"
          >
            SNEAKERGRAM
          </button>
        ) : title ? (
          <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
        ) : (
          <div />
        )}
        
        {showNotifications && (
          <button
            onClick={handleNotificationClick}
            className="relative p-2 hover:bg-card/50 rounded-full transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            
            {/* Unread count badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
