/**
 * NotificationList Component
 * Displays grouped notifications with time-based sections
 * Property 32: Notifications display all required fields
 * Property 33: Notifications are grouped by time
 * Validates: Requirements 10.1, 10.2
 */

'use client';

import { useEffect } from 'react';
import { useNotificationStore, groupNotificationsByTime } from '@/stores/notificationStore';
import { NotificationItem } from './NotificationItem';
import { Bell } from 'lucide-react';

export function NotificationList() {
  const { notifications, loadNotifications, loading } = useNotificationStore();

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Group notifications by time
  const groupedNotifications = groupNotificationsByTime(notifications);

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 mb-1">No notifications yet</p>
          <p className="text-sm text-gray-500">
            You&apos;ll see notifications here when people interact with your posts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {/* Today */}
      {groupedNotifications.today.length > 0 && (
        <div>
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b border-border">
            <h3 className="text-sm font-semibold text-gray-400">Today</h3>
          </div>
          {groupedNotifications.today.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {/* Yesterday */}
      {groupedNotifications.yesterday.length > 0 && (
        <div>
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b border-border">
            <h3 className="text-sm font-semibold text-gray-400">Yesterday</h3>
          </div>
          {groupedNotifications.yesterday.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {/* This Week */}
      {groupedNotifications.thisWeek.length > 0 && (
        <div>
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b border-border">
            <h3 className="text-sm font-semibold text-gray-400">This Week</h3>
          </div>
          {groupedNotifications.thisWeek.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {/* Older */}
      {groupedNotifications.older.length > 0 && (
        <div>
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm px-4 py-2 border-b border-border">
            <h3 className="text-sm font-semibold text-gray-400">Older</h3>
          </div>
          {groupedNotifications.older.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}
