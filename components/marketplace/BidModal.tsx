/**
 * BidModal Component
 * Modal for placing bids on auction listings
 */

'use client';

import { useState } from 'react';
import { Listing, Sneaker } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface BidModalProps {
  listing: Listing;
  sneaker: Sneaker;
  onClose: () => void;
  onBid: (amount: number) => void;
}

export function BidModal({ listing, sneaker, onClose, onBid }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState<string>(
    listing.currentBid ? (listing.currentBid + 10).toString() : '0'
  );
  const [error, setError] = useState<string>('');

  const minBid = (listing.currentBid || 0) + 10;

  const handleBidChange = (value: string) => {
    setBidAmount(value);
    setError('');
  };

  const handleSubmit = () => {
    const amount = parseFloat(bidAmount);

    if (isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount < minBid) {
      setError(`Bid must be at least $${minBid}`);
      return;
    }

    onBid(amount);
  };

  const getTimeRemaining = (): string => {
    if (!listing.bidEndTime) return 'N/A';
    
    const now = new Date();
    const diff = listing.bidEndTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Modal isOpen onClose={onClose} title="Place Your Bid">
      <div className="space-y-6">
        {/* Sneaker Info */}
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={listing.images[0]}
              alt={sneaker.model}
              fill
              className="object-cover rounded-lg"
              sizes="96px"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">
              {sneaker.brand} {sneaker.model}
            </h3>
            <p className="text-sm text-gray-400">{sneaker.colorway}</p>
            <p className="text-sm text-gray-400">Size {listing.size}</p>
          </div>
        </div>

        {/* Current Bid Info */}
        <div className="p-4 bg-background/50 rounded-lg border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Bid</span>
            <span className="text-xl font-bold text-primary">
              ${listing.currentBid || 0}
            </span>
          </div>

          {listing.bidEndTime && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Time Remaining</span>
              </div>
              <span className="text-foreground font-medium">
                {getTimeRemaining()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Bids</span>
            <span className="text-foreground">
              {listing.bidHistory?.length || 0}
            </span>
          </div>
        </div>

        {/* Bid Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Your Bid Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => handleBidChange(e.target.value)}
              placeholder={minBid.toString()}
              className="pl-8"
              min={minBid}
              step="10"
            />
          </div>
          <p className="text-xs text-gray-400">
            Minimum bid: ${minBid}
          </p>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Bid History */}
        {listing.bidHistory && listing.bidHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Recent Bids
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {listing.bidHistory
                .slice()
                .reverse()
                .slice(0, 5)
                .map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between text-sm p-2 bg-background/30 rounded"
                  >
                    <span className="text-gray-400">
                      {format(bid.createdAt, 'MMM d, h:mm a')}
                    </span>
                    <span className="font-medium text-foreground">
                      ${bid.amount}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Place Bid
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center">
          By placing a bid, you agree to purchase if you win the auction
        </p>
      </div>
    </Modal>
  );
}
