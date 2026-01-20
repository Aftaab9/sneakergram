/**
 * Messages Page - Instagram-like DM interface
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatList } from '@/components/messages/ChatList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { Send, Edit } from 'lucide-react';
import { useMessageStore } from '@/stores/messageStore';
import { getUserById } from '@/lib/mockData';
import { getCurrentUser } from '@/stores/authStore';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get('conversation');
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { conversations, loadConversations } = useMessageStore();
  const currentUser = getCurrentUser();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle conversation from URL parameter
  useEffect(() => {
    if (conversationParam && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === conversationParam);
      if (conversation) {
        setSelectedConversationId(conversationParam);
        setIsMobileView(true);
      }
    }
  }, [conversationParam, conversations]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsMobileView(true);
  };

  const handleBack = () => {
    setIsMobileView(false);
    setSelectedConversationId(null);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const otherParticipantId = conv.participants.find(id => id !== currentUser?.id);
    const otherParticipant = otherParticipantId ? getUserById(otherParticipantId) : null;
    if (!otherParticipant) return false;
    const query = searchQuery.toLowerCase();
    return (
      otherParticipant.displayName.toLowerCase().includes(query) ||
      otherParticipant.username.toLowerCase().includes(query)
    );
  });


  return (
    <div className="h-[calc(100vh-48px)] lg:h-screen flex bg-black">
      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        {/* Conversations list */}
        <div className="w-[400px] border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">{currentUser?.username || 'Messages'}</h1>
              <button className="hover:opacity-70 transition-opacity">
                <Edit className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex gap-4 text-sm font-semibold">
              <button className="text-foreground">Primary</button>
              <button className="text-muted">General</button>
            </div>
          </div>
          
          {/* Search */}
          <div className="p-3">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card rounded-lg px-4 py-2 text-sm outline-none placeholder:text-muted"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ChatList
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId || undefined}
              conversations={filteredConversations}
            />
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1">
          {selectedConversationId ? (
            <ChatWindow conversationId={selectedConversationId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-24 h-24 rounded-full border-2 border-foreground flex items-center justify-center mb-4">
                <Send className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-semibold mb-1">Your messages</h2>
              <p className="text-muted text-sm mb-4">Send private photos and messages to a friend</p>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Send message
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Mobile Layout */}
      <div className="lg:hidden w-full">
        {!isMobileView || !selectedConversationId ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">{currentUser?.username || 'Messages'}</h1>
                <button className="hover:opacity-70 transition-opacity">
                  <Edit className="w-6 h-6" />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card rounded-lg px-4 py-2 text-sm outline-none placeholder:text-muted"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <ChatList
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversationId || undefined}
                conversations={filteredConversations}
              />
            </div>
          </div>
        ) : (
          <ChatWindow
            conversationId={selectedConversationId}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
