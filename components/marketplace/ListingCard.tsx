/**
 * ListingCard Component - Clean, compact marketplace card
 */

'use client';

import { Listing, User, Sneaker, ListingType } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Clock, Shield } from 'lucide-react';
import { useState } from 'react';
import { BidModal } from '@/components/marketplace/BidModal';
import Image from 'next/image';

interface ListingCardProps {
  listing: Listing;
  seller: User;
  sneaker: Sneaker;
  onBid?: (listingId: string, amount: number) => void;
  onContact?: (sellerId: string) => void;
}

export function ListingCard({ 
  listing, 
  seller, 
  sneaker,
  onBid,
  onContact 
}: ListingCardProps) {
  const [showBidModal, setShowBidModal] = useState(false);

  const handleBid = (amount: number) => {
    onBid?.(listing.id, amount);
    setShowBidModal(false);
  };

  const getConditionLabel = (condition: number): string => {
    if (condition >= 9) return 'DS';
    if (condition >= 7) return 'VNDS';
    return 'Used';
  };

  const getTimeRemaining = (endTime: Date): string => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Ending soon';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-square bg-white">
          <Image
            src={listing.images[0]}
            alt={sneaker.model}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 right-2 flex justify-between">
            <Badge variant={
              listing.type === ListingType.SALE ? 'default' :
              listing.type === ListingType.RENT ? 'info' : 'warning'
            } className="text-xs">
              {listing.type === ListingType.SALE && 'Sale'}
              {listing.type === ListingType.RENT && 'Rent'}
              {listing.type === ListingType.AUCTION && 'Bid'}
            </Badge>
            {listing.verified && (
              <Badge variant="success" className="text-xs">
                <Shield className="w-3 h-3" />
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-sm text-foreground line-clamp-1">
            {sneaker.brand} {sneaker.model}
          </h3>
          <p className="text-xs text-muted mb-2">{sneaker.colorway}</p>

          {/* Size & Condition */}
          <div className="flex items-center gap-2 text-xs text-muted mb-2">
            <span>Size {listing.size}</span>
            <span>•</span>
            <span>{getConditionLabel(listing.condition)}</span>
          </div>

          {/* Price */}
          <div className="mt-auto">
            {listing.type === ListingType.SALE && (
              <p className="text-lg font-bold text-primary">${listing.price}</p>
            )}
            
            {listing.type === ListingType.RENT && (
              <p className="text-lg font-bold text-primary">${listing.rentPrice}/day</p>
            )}
            
            {listing.type === ListingType.AUCTION && (
              <div>
                <p className="text-lg font-bold text-primary">${listing.currentBid || listing.price}</p>
                {listing.bidEndTime && (
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Clock className="w-3 h-3" />
                    <span>{getTimeRemaining(listing.bidEndTime)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seller */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-card">
              <Image
                src={seller.avatar}
                alt={seller.displayName}
                width={24}
                height={24}
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="text-xs text-muted truncate">@{seller.username}</span>
          </div>

          {/* Action */}
          <Button
            variant="primary"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              if (listing.type === ListingType.AUCTION) {
                setShowBidModal(true);
              } else {
                onContact?.(seller.id);
              }
            }}
          >
            {listing.type === ListingType.AUCTION ? 'Place Bid' : 
             listing.type === ListingType.RENT ? 'Rent' : 'Buy'}
          </Button>
        </div>
      </motion.div>

      {/* Bid Modal */}
      {showBidModal && listing.type === ListingType.AUCTION && (
        <BidModal
          listing={listing}
          sneaker={sneaker}
          onClose={() => setShowBidModal(false)}
          onBid={handleBid}
        />
      )}
    </>
  );
}
