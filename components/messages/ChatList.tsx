/**
 * ChatList Component - Instagram-like conversation list
 */

'use client';

import Image from 'next/image';
import { Conversation } from '@/types';
import { getUserById } from '@/lib/mockData';
import { getCurrentUser } from '@/stores/authStore';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
  conversations: Conversation[];
}

export function ChatList({ onSelectConversation, selectedConversationId, conversations }: ChatListProps) {
  const currentUser = getCurrentUser();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-muted text-sm text-center">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {conversations.map((conversation) => {
        const otherParticipantId = conversation.participants.find(id => id !== currentUser?.id);
        const otherParticipant = otherParticipantId ? getUserById(otherParticipantId) : null;

        if (!otherParticipant) return null;

        const isSelected = selectedConversationId === conversation.id;
        const hasUnread = conversation.unreadCount > 0;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-card/50 transition-colors ${
              isSelected ? 'bg-card/50' : ''
            }`}
          >
            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={otherParticipant.avatar}
                  alt={otherParticipant.displayName}
                  width={56}
                  height={56}
                  className="object-cover"
                  unoptimized
                />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1">
                <span className={`text-sm ${hasUnread ? 'font-bold' : 'font-normal'}`}>
                  {otherParticipant.displayName}
                </span>
                {otherParticipant.verified && (
                  <svg className="w-3 h-3 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-1">
                <p className={`text-sm truncate ${hasUnread ? 'text-foreground font-semibold' : 'text-muted'}`}>
                  {conversation.lastMessage}
                </p>
                <span className="text-muted text-sm flex-shrink-0">
                  · {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: false })}
                </span>
              </div>
            </div>

            {/* Unread indicator */}
            {hasUnread && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
