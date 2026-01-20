/**
 * Message Store
 * Manages conversations and messages state
 */

import { create } from 'zustand';
import { Message, Conversation, MessageType } from '@/types';
import { mockUsers } from '@/lib/mockData';
import { getCurrentUser } from './authStore';

interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string, type?: MessageType, listingId?: string, offerAmount?: number) => void;
  markAsRead: (conversationId: string) => void;
  createConversation: (participantId: string, listingContext?: string) => string;
}

/**
 * Generate a unique message ID
 */
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique conversation ID
 */
function generateConversationId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getRandomMinutesAgo(minutes: number): Date {
  return new Date(Date.now() - Math.floor(Math.random() * minutes) * 60 * 1000);
}

/**
 * Generate dynamic conversations for the current user
 */
function generateConversationsForUser(userId: string): Conversation[] {
  // Get other users to chat with (exclude current user)
  const otherUsers = mockUsers.filter(u => u.id !== userId).slice(0, 8);
  
  const messages = [
    'Thanks! Let me know if you want to trade',
    'Is this still available?',
    'Great collection! 🔥',
    'Can you do $200?',
    'Shipped! Tracking sent 📦',
    'Those Travis Scotts are 🔥',
    'Deal! PayPal or Venmo?',
    'I have size 10.5 in stock',
  ];

  return otherUsers.map((user, index) => ({
    id: `conv-${index + 1}`,
    participants: [userId, user.id],
    lastMessage: messages[index] || 'Hey!',
    lastMessageTime: getRandomMinutesAgo((index + 1) * 30),
    unreadCount: index < 3 ? Math.floor(Math.random() * 3) + 1 : 0,
  }));
}

/**
 * Generate dynamic messages for conversations
 */
function generateMessagesForConversations(userId: string, conversations: Conversation[]): Record<string, Message[]> {
  const messagesMap: Record<string, Message[]> = {};
  
  conversations.forEach((conv, convIndex) => {
    const otherUserId = conv.participants.find(id => id !== userId) || '';
    const msgs: Message[] = [];
    
    // Generate 2-4 messages per conversation
    const messageCount = 2 + Math.floor(Math.random() * 3);
    
    const sampleMessages = [
      ['Hey! Interested in your sneakers', 'Thanks! Which ones?'],
      ['Is this still available?', 'Yes it is! DM me'],
      ['Great collection! 🔥', 'Thanks! Been collecting for years'],
      ['Can you do $200?', 'Best I can do is $220'],
      ['Shipped! Tracking sent 📦', 'Got it, thanks!'],
      ['Those Travis Scotts are 🔥', 'Right? Took forever to get'],
      ['Deal! PayPal or Venmo?', 'PayPal works for me'],
      ['I have size 10.5 in stock', 'Perfect, that\'s my size!'],
    ];
    
    const convMessages = sampleMessages[convIndex % sampleMessages.length];
    
    for (let i = 0; i < Math.min(messageCount, convMessages.length); i++) {
      const isSentByOther = i % 2 === 0;
      msgs.push({
        id: `msg-${conv.id}-${i}`,
        conversationId: conv.id,
        senderId: isSentByOther ? otherUserId : userId,
        receiverId: isSentByOther ? userId : otherUserId,
        text: convMessages[i],
        type: MessageType.TEXT,
        createdAt: getRandomMinutesAgo((messageCount - i) * 10 + convIndex * 30),
        read: i < messageCount - 1,
      });
    }
    
    messagesMap[conv.id] = msgs;
  });
  
  return messagesMap;
}

/**
 * Message Store
 * Manages conversations and direct messages
 */
export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  messages: {},
  loading: false,
  error: null,

  /**
   * Load conversations for current user
   */
  loadConversations: async () => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Generate conversations dynamically for the current user
      const userConversations = generateConversationsForUser(currentUser.id);
      const userMessages = generateMessagesForConversations(currentUser.id, userConversations);
      
      set({ 
        conversations: userConversations,
        messages: userMessages,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load conversations',
        loading: false 
      });
    }
  },

  /**
   * Load messages for a specific conversation
   */
  loadMessages: async (conversationId: string) => {
    const currentMessages = get().messages[conversationId];
    if (currentMessages && currentMessages.length > 0) {
      return; // Already loaded
    }
    
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load messages',
        loading: false 
      });
    }
  },

  /**
   * Send a message in a conversation
   */
  sendMessage: (conversationId: string, text: string, type: MessageType = MessageType.TEXT, listingId?: string, offerAmount?: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('Cannot send message: User not authenticated');
      return;
    }

    const conversation = get().conversations.find(c => c.id === conversationId);
    if (!conversation) {
      console.error('Cannot send message: Conversation not found');
      return;
    }

    const receiverId = conversation.participants.find(id => id !== currentUser.id);
    if (!receiverId) {
      console.error('Cannot send message: Receiver not found');
      return;
    }

    const newMessage: Message = {
      id: generateMessageId(),
      conversationId,
      senderId: currentUser.id,
      receiverId,
      text,
      type,
      listingId,
      offerAmount,
      createdAt: new Date(),
      read: false,
    };

    // Update state with new message
    set(state => {
      const currentMessages = state.messages[conversationId] || [];
      
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...currentMessages, newMessage],
        },
        conversations: state.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: text,
              lastMessageTime: new Date(),
            };
          }
          return conv;
        }),
      };
    });
  },

  /**
   * Mark all messages in a conversation as read
   */
  markAsRead: (conversationId: string) => {
    set(state => ({
      conversations: state.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      }),
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map(msg => ({
          ...msg,
          read: true,
        })),
      },
    }));
  },

  /**
   * Create a new conversation
   */
  createConversation: (participantId: string, listingContext?: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return '';

    const existingConv = get().conversations.find(conv =>
      conv.participants.includes(currentUser.id) &&
      conv.participants.includes(participantId)
    );

    if (existingConv) {
      return existingConv.id;
    }

    const newConversation: Conversation = {
      id: generateConversationId(),
      participants: [currentUser.id, participantId],
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0,
      listingContext,
    };

    set(state => ({
      conversations: [newConversation, ...state.conversations],
      messages: {
        ...state.messages,
        [newConversation.id]: [],
      },
    }));

    return newConversation.id;
  },
}));

/**
 * Utility function to get conversation by ID
 */
export function getConversationById(conversationId: string): Conversation | null {
  return useMessageStore.getState().conversations.find(c => c.id === conversationId) || null;
}

/**
 * Utility function to get messages for a conversation
 */
export function getMessagesByConversationId(conversationId: string): Message[] {
  return useMessageStore.getState().messages[conversationId] || [];
}

/**
 * Utility function to get total unread count
 */
export function getTotalUnreadCount(): number {
  return useMessageStore.getState().conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
}
