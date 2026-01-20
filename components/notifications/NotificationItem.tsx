/**
 * NotificationItem Component
 * Displays individual notification with icon and navigation
 * Implements swipe to dismiss functionality
 * Property 34: Unread notifications show indicator
 * Property 35: Notification taps navigate correctly
 * Validates: Requirements 10.3, 10.4
 */

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Notification, NotificationType } from '@/types';
import { useNotificationStore } from '@/stores/notificationStore';
import { getUserById } from '@/lib/mockData';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, DollarSign, Bookmark, CheckCircle, TrendingDown, UserPlus, X } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
}

/**
 * Get icon for notification type
 */
function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.LIKE:
      return <Heart className="w-5 h-5 text-red-500" />;
    case NotificationType.COMMENT:
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case NotificationType.BID:
      return <DollarSign className="w-5 h-5 text-green-500" />;
    case NotificationType.SAVE:
      return <Bookmark className="w-5 h-5 text-yellow-500" />;
    case NotificationType.VERIFICATION:
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case NotificationType.PRICEDROP:
      return <TrendingDown className="w-5 h-5 text-primary" />;
    case NotificationType.FOLLOW:
      return <UserPlus className="w-5 h-5 text-purple-500" />;
    default:
      return <Heart className="w-5 h-5 text-gray-400" />;
  }
}

/**
 * Get navigation path for notification
 */
function getNavigationPath(notification: Notification): string {
  if (notification.postId) {
    return `/post/${notification.postId}`;
  }
  if (notification.listingId) {
    return `/marketplace`;
  }
  if (notification.actorId) {
    const actor = getUserById(notification.actorId);
    if (actor) {
      return `/profile/${actor.username}`;
    }
  }
  return '/notifications';
}

/**
 * NotificationItem Component
 * Renders a single notification with appropriate icon and styling
 * Supports swipe to dismiss (visual only)
 */
export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { markAsRead } = useNotificationStore();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  
  const actor = notification.actorId ? getUserById(notification.actorId) : null;

  const handleClick = () => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate to relevant content
    const path = getNavigationPath(notification);
    router.push(path);
  };

  // Touch handlers for swipe to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Only allow left swipe (negative offset)
    if (diff < 0) {
      setSwipeOffset(Math.max(diff, -100));
    }
  };

  const handleTouchEnd = () => {
    // If swiped more than 60px, dismiss
    if (swipeOffset < -60) {
      setSwipeOffset(-100);
      setTimeout(() => {
        setIsDismissed(true);
      }, 200);
    } else {
      // Reset position
      setSwipeOffset(0);
    }
  };

  // Mouse handlers for desktop swipe simulation
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    currentX.current = e.clientX;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      currentX.current = moveEvent.clientX;
      const diff = currentX.current - startX.current;
      
      if (diff < 0) {
        setSwipeOffset(Math.max(diff, -100));
      }
    };
    
    const handleMouseUp = () => {
      if (swipeOffset < -60) {
        setSwipeOffset(-100);
        setTimeout(() => {
          setIsDismissed(true);
        }, 200);
      } else {
        setSwipeOffset(0);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Delete indicator background */}
      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-end pr-6">
        <X className="w-5 h-5 text-red-500" />
      </div>
      
      {/* Notification content */}
      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none',
        }}
        className={`w-full p-4 flex items-start gap-3 hover:bg-card/50 transition-colors bg-background ${
          !notification.read ? 'bg-card/30' : ''
        }`}
      >
        {/* Actor avatar or icon */}
        {actor ? (
          <Avatar
            src={actor.avatar}
            alt={actor.displayName}
            size="md"
            verified={actor.verified}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
            {getNotificationIcon(notification.type)}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 text-left">
          <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </p>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
        )}
      </button>
    </div>
  );
}
