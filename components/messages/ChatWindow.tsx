/**
 * ChatWindow Component
 * Instagram-like chat interface
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useMessageStore } from '@/stores/messageStore';
import { getCurrentUser } from '@/stores/authStore';
import { getUserById } from '@/lib/mockData';
import { MessageBubble } from './MessageBubble';
import { ArrowLeft, Phone, Video, Info, ImageIcon, Heart, Mic } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
  onBack?: () => void;
}

export function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, loadMessages, sendMessage, markAsRead, conversations } = useMessageStore();
  const currentUser = getCurrentUser();
  
  const conversation = conversations.find(c => c.id === conversationId);
  
  const conversationMessages = useMemo(() => {
    return messages[conversationId] || [];
  }, [messages, conversationId]);

  const otherParticipantId = conversation?.participants.find(id => id !== currentUser?.id);
  const otherParticipant = otherParticipantId ? getUserById(otherParticipantId) : null;

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
      markAsRead(conversationId);
    }
  }, [conversationId, loadMessages, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentUser) return;
    sendMessage(conversationId, messageText.trim());
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation || !otherParticipant) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <p className="text-muted">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 hover:opacity-70 transition-opacity lg:hidden"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={otherParticipant.avatar}
              alt={otherParticipant.displayName}
              width={32}
              height={32}
              className="object-cover"
              unoptimized
            />
          </div>
          
          <div>
            <h3 className="font-semibold text-sm">{otherParticipant.displayName}</h3>
            <p className="text-xs text-muted">Active now</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hover:opacity-70 transition-opacity" aria-label="Voice call">
            <Phone className="w-6 h-6" />
          </button>
          <button className="hover:opacity-70 transition-opacity" aria-label="Video call">
            <Video className="w-6 h-6" />
          </button>
          <button className="hover:opacity-70 transition-opacity" aria-label="Info">
            <Info className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Profile header in chat */}
        <div className="flex flex-col items-center py-8 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <Image
              src={otherParticipant.avatar}
              alt={otherParticipant.displayName}
              width={96}
              height={96}
              className="object-cover"
              unoptimized
            />
          </div>
          <h4 className="font-semibold text-lg">{otherParticipant.displayName}</h4>
          <p className="text-muted text-sm">@{otherParticipant.username} · Sneakergram</p>
          <p className="text-muted text-sm mt-1">{otherParticipant.followers?.toLocaleString()} followers</p>
          <button className="mt-4 px-4 py-1.5 bg-card hover:bg-border rounded-lg text-sm font-semibold transition-colors">
            View Profile
          </button>
        </div>

        {conversationMessages.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted text-sm">No messages yet</p>
          </div>
        ) : (
          conversationMessages.map((message, index) => {
            const isSent = message.senderId === currentUser?.id;
            const prevMessage = conversationMessages[index - 1];
            const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isSent={isSent}
                showAvatar={showAvatar}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2">
          <button className="hover:opacity-70 transition-opacity" aria-label="Add emoji">
            <span className="text-xl">😊</span>
          </button>
          
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Message..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted"
          />
          
          {messageText.trim() ? (
            <button
              onClick={handleSendMessage}
              className="text-primary font-semibold text-sm hover:opacity-70 transition-opacity"
            >
              Send
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button className="hover:opacity-70 transition-opacity" aria-label="Voice message">
                <Mic className="w-5 h-5" />
              </button>
              <button className="hover:opacity-70 transition-opacity" aria-label="Add image">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="hover:opacity-70 transition-opacity" aria-label="Like">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
