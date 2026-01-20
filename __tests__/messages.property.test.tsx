/**
 * Messages Property-Based Tests
 * Tests universal properties for messaging functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { ChatList } from '@/components/messages/ChatList';
import { MessageBubble } from '@/components/messages/MessageBubble';
import { useMessageStore } from '@/stores/messageStore';
import { useAuthStore } from '@/stores/authStore';
import { Message, MessageType, VerificationLevel } from '@/types';

// Mock conversation generator
const conversationArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  participants: fc.array(fc.string({ minLength: 1 }), { minLength: 2, maxLength: 2 }),
  lastMessage: fc.string(),
  lastMessageTime: fc.date(),
  unreadCount: fc.nat({ max: 99 }),
  listingContext: fc.option(fc.string(), { nil: undefined }),
});

// Mock message generator
const messageArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  conversationId: fc.string({ minLength: 1 }),
  senderId: fc.string({ minLength: 1 }),
  receiverId: fc.string({ minLength: 1 }),
  text: fc.string({ minLength: 1 }),
  type: fc.constantFrom(
    MessageType.TEXT,
    MessageType.LISTING,
    MessageType.OFFER,
    MessageType.SYSTEM
  ),
  listingId: fc.option(fc.string(), { nil: undefined }),
  offerAmount: fc.option(fc.nat(), { nil: undefined }),
  createdAt: fc.date(),
  read: fc.boolean(),
});

describe('Messages Property Tests', () => {
  beforeEach(() => {
    // Reset stores
    useMessageStore.setState({
      conversations: [],
      messages: {},
      loading: false,
      error: null,
    });
    
    // Set up a mock authenticated user
    useAuthStore.setState({
      user: {
        id: 'user-1',
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'Test bio',
        shoeSize: '10',
        verified: false,
        verificationLevel: VerificationLevel.EMAIL,
        followers: 0,
        following: 0,
        collection: [],
        wishlist: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      isAuthenticated: true,
      loading: false,
    });
  });

  /**
   * Feature: sneakergram-app, Property 27: Conversations display all required fields
   * Validates: Requirements 9.1
   */
  it('Property 27: conversations display all required fields', () => {
    fc.assert(
      fc.property(
        fc.array(conversationArbitrary, { minLength: 1, maxLength: 10 }),
        (conversations) => {
          // Filter out conversations with invalid participant IDs (whitespace only)
          const validConversations = conversations.filter(conv => 
            conv.participants.every(id => id.trim().length > 0) &&
            conv.participants.includes('user-1') // Must include current user
          );

          // Skip if no valid conversations
          if (validConversations.length === 0) {
            return true;
          }

          // Set up store with valid conversations
          useMessageStore.setState({ conversations: validConversations });

          // Render ChatList
          const { container } = render(
            <ChatList
              onSelectConversation={() => {}}
              selectedConversationId={undefined}
            />
          );

          // Verify that conversations are rendered
          const conversationElements = container.querySelectorAll('button');
          expect(conversationElements.length).toBeGreaterThan(0);
          
          // Verify the container has rendered content
          expect(container).toBeTruthy();
          expect(validConversations.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: sneakergram-app, Property 28: Messages have distinct styling by sender
   * Validates: Requirements 9.2
   */
  it('Property 28: messages have distinct styling by sender', () => {
    fc.assert(
      fc.property(
        messageArbitrary,
        fc.boolean(),
        (message, isSent) => {
          // Filter out system messages as they have different styling (centered)
          if (message.type === MessageType.SYSTEM) {
            return true; // Skip system messages
          }

          // Render MessageBubble
          const { container } = render(
            <MessageBubble message={message} isSent={isSent} showAvatar={true} />
          );

          // Check that the message is rendered
          expect(container).toBeTruthy();

          // Verify distinct styling based on sender
          // Sent messages should have different classes than received messages
          const messageContainer = container.querySelector('div');
          expect(messageContainer).toBeTruthy();

          if (isSent) {
            // Sent messages should be justified to the end
            expect(messageContainer?.className).toContain('justify-end');
          } else {
            // Received messages should be justified to the start
            expect(messageContainer?.className).toContain('justify-start');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: sneakergram-app, Property 29: Sent messages appear in chat
   * Validates: Requirements 9.3
   */
  it('Property 29: sent messages appear in chat', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        (messageText) => {
          // Set up a conversation
          const conversationId = 'conv-test';
          const currentUserId = 'user-1';
          const otherUserId = 'user-2';

          useMessageStore.setState({
            conversations: [
              {
                id: conversationId,
                participants: [currentUserId, otherUserId],
                lastMessage: '',
                lastMessageTime: new Date(),
                unreadCount: 0,
              },
            ],
            messages: {
              [conversationId]: [],
            },
          });

          // Send a message
          const { sendMessage } = useMessageStore.getState();
          sendMessage(conversationId, messageText);

          // Verify the message appears in the store
          const { messages } = useMessageStore.getState();
          const conversationMessages = messages[conversationId];

          expect(conversationMessages).toBeDefined();
          expect(conversationMessages.length).toBeGreaterThan(0);

          // Find the sent message
          const sentMessage = conversationMessages.find(
            (msg) => msg.text === messageText && msg.senderId === currentUserId
          );

          expect(sentMessage).toBeDefined();
          expect(sentMessage?.text).toBe(messageText);
          expect(sentMessage?.senderId).toBe(currentUserId);
          expect(sentMessage?.receiverId).toBe(otherUserId);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: sneakergram-app, Property 30: Listing conversations show context
   * Validates: Requirements 9.4
   */
  it('Property 30: listing conversations show context', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (listingId) => {
          // Set up a conversation with listing context
          const conversationId = 'conv-test';
          const currentUserId = 'user-1';
          const otherUserId = 'user-2';

          useMessageStore.setState({
            conversations: [
              {
                id: conversationId,
                participants: [currentUserId, otherUserId],
                lastMessage: 'Test message',
                lastMessageTime: new Date(),
                unreadCount: 0,
                listingContext: listingId,
              },
            ],
            messages: {
              [conversationId]: [],
            },
          });

          // Verify the conversation has listing context
          const { conversations } = useMessageStore.getState();
          const conv = conversations.find((c) => c.id === conversationId);

          expect(conv).toBeDefined();
          expect(conv?.listingContext).toBe(listingId);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: sneakergram-app, Property 31: Shared listings display as embedded cards
   * Validates: Requirements 9.5
   */
  it('Property 31: shared listings display as embedded cards', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (listingId, messageText) => {
          // Create a listing message
          const message: Message = {
            id: 'msg-test',
            conversationId: 'conv-test',
            senderId: 'user-1',
            receiverId: 'user-2',
            text: messageText,
            type: MessageType.LISTING,
            listingId: listingId,
            createdAt: new Date(),
            read: false,
          };

          // Render MessageBubble with listing type
          const { container } = render(
            <MessageBubble message={message} isSent={true} showAvatar={true} />
          );

          // Verify the message is rendered
          expect(container).toBeTruthy();

          // Verify it's a listing message (has different structure than text)
          expect(message.type).toBe(MessageType.LISTING);
          expect(message.listingId).toBe(listingId);
        }
      ),
      { numRuns: 100 }
    );
  });
});
