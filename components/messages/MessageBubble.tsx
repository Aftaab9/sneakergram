/**
 * MessageBubble Component
 * Displays individual message with sent/received styling
 * Property 28: Messages have distinct styling by sender
 * Validates: Requirements 9.2
 */

'use client';

import { Message, MessageType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/ui/Avatar';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { getListingById, getSneakerById, getUserById } from '@/lib/mockData';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showAvatar?: boolean;
}

/**
 * MessageBubble Component
 * Renders a message bubble with appropriate styling based on sender
 */
export function MessageBubble({ message, isSent, showAvatar = true }: MessageBubbleProps) {
  const sender = getUserById(message.senderId);

  // Render listing card for listing messages
  if (message.type === MessageType.LISTING && message.listingId) {
    const listing = getListingById(message.listingId);
    if (listing) {
      const seller = getUserById(listing.sellerId);
      const sneaker = getSneakerById(listing.sneakerId);
      
      if (seller && sneaker) {
        return (
          <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[80%] ${isSent ? 'order-2' : 'order-1'}`}>
              <div className="bg-card border border-border rounded-lg p-2">
                <ListingCard
                  listing={listing}
                  seller={seller}
                  sneaker={sneaker}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 px-2">
                {formatDistanceToNow(message.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      }
    }
  }

  // Render offer message
  if (message.type === MessageType.OFFER && message.offerAmount) {
    return (
      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
        {!isSent && showAvatar && sender && (
          <Avatar
            src={sender.avatar}
            alt={sender.displayName}
            size="sm"
            className="mr-2"
          />
        )}
        <div className={`max-w-[70%] ${isSent ? 'order-2' : 'order-1'}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isSent
                ? 'bg-primary text-white rounded-br-sm'
                : 'bg-card border border-border rounded-bl-sm'
            }`}
          >
            <p className="text-sm font-medium mb-1">Offer</p>
            <p className="text-2xl font-bold">${message.offerAmount}</p>
            <p className="text-sm mt-1">{message.text}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1 px-2">
            {formatDistanceToNow(message.createdAt, { addSuffix: true })}
          </p>
        </div>
        {isSent && showAvatar && sender && (
          <Avatar
            src={sender.avatar}
            alt={sender.displayName}
            size="sm"
            className="ml-2"
          />
        )}
      </div>
    );
  }

  // Render system message
  if (message.type === MessageType.SYSTEM) {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-card/50 border border-border rounded-full px-4 py-2">
          <p className="text-xs text-gray-400">{message.text}</p>
        </div>
      </div>
    );
  }

  // Render text message
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isSent && showAvatar && sender && (
        <Avatar
          src={sender.avatar}
          alt={sender.displayName}
          size="sm"
          className="mr-2"
        />
      )}
      <div className={`max-w-[70%] ${isSent ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isSent
              ? 'bg-primary text-white rounded-br-sm'
              : 'bg-card border border-border rounded-bl-sm'
          }`}
        >
          <p className={`text-sm ${isSent ? 'text-white' : 'text-foreground'}`}>
            {message.text}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-1 px-2">
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </p>
      </div>
      {isSent && showAvatar && sender && (
        <Avatar
          src={sender.avatar}
          alt={sender.displayName}
          size="sm"
          className="ml-2"
        />
      )}
    </div>
  );
}
