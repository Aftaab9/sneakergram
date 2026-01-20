/**
 * Notifications Page
 * Displays user notifications grouped by time
 * Implements swipe to dismiss and mark as read functionality
 * Validates: Requirements 10.1
 */

'use client';

import { NotificationList } from '@/components/notifications/NotificationList';
import { useNotificationStore } from '@/stores/notificationStore';
import { Button } from '@/components/ui/Button';
import { CheckCheck, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const router = useRouter();
  const { unreadCount, markAllAsRead } = useNotificationStore();

  return (
    <div className="min-h-screen">
      {/* Header with back button */}
      <div className="sticky top-0 bg-card/50 backdrop-blur-sm border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-card/50 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <NotificationList />
    </div>
  );
}
