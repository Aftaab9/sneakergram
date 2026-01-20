/**
 * Notification Store
 * Manages notifications state and operations
 */

import { create } from 'zustand';
import { Notification } from '@/types';
import { mockNotifications } from '@/lib/mockData';
import { getCurrentUser } from './authStore';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
}

/**
 * Generate a unique notification ID
 */
function generateNotificationId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Notification Store
 * Manages user notifications
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  /**
   * Load notifications from mock data
   * Property 32: Notifications display all required fields
   * Validates: Requirements 10.1
   */
  loadNotifications: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Filter notifications for current user and sort by date (newest first)
      const userNotifications = mockNotifications
        .filter(notif => notif.userId === currentUser.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      const unreadCount = userNotifications.filter(n => !n.read).length;
      
      set({ 
        notifications: userNotifications, 
        unreadCount,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load notifications',
        loading: false 
      });
    }
  },

  /**
   * Mark a notification as read
   */
  markAsRead: (notificationId: string) => {
    set(state => {
      const notifications = state.notifications.map(notif => {
        if (notif.id === notificationId && !notif.read) {
          return { ...notif, read: true };
        }
        return notif;
      });
      
      const unreadCount = notifications.filter(n => !n.read).length;
      
      return { notifications, unreadCount };
    });
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: true })),
      unreadCount: 0,
    }));
  },

  /**
   * Add a new notification
   */
  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateNotificationId(),
      createdAt: new Date(),
    };

    set(state => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));

/**
 * Utility function to get notification by ID
 */
export function getNotificationById(notificationId: string): Notification | null {
  return useNotificationStore.getState().notifications.find(n => n.id === notificationId) || null;
}

/**
 * Utility function to get unread count
 */
export function getUnreadNotificationCount(): number {
  return useNotificationStore.getState().unreadCount;
}

/**
 * Utility function to group notifications by time
 * Property 33: Notifications are grouped by time
 * Validates: Requirements 10.2
 */
export function groupNotificationsByTime(notifications: Notification[]): {
  today: Notification[];
  yesterday: Notification[];
  thisWeek: Notification[];
  older: Notification[];
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return notifications.reduce(
    (groups, notification) => {
      const notifDate = new Date(notification.createdAt);
      
      if (notifDate >= today) {
        groups.today.push(notification);
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification);
      } else if (notifDate >= weekAgo) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
      
      return groups;
    },
    { today: [], yesterday: [], thisWeek: [], older: [] } as {
      today: Notification[];
      yesterday: Notification[];
      thisWeek: Notification[];
      older: Notification[];
    }
  );
}
