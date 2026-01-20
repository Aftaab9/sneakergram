/**
 * PostBidModal Component
 * Modal for placing bids on sneakers featured in posts
 * Connects to marketplace listings for the sneaker
 */

'use client';

import { useState, useEffect } from 'react';
import { Listing } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Clock, TrendingUp, AlertCircle, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { getSneakerById } from '@/lib/mockData';
import { useMarketplaceStore } from '@/stores/marketplaceStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PostBidModalProps {
  sneakerId: string;
  onClose: () => void;
}

/**
 * PostBidModal - Bidding modal for post sneakers
 * Requirement 3.6: BID button functionality
 */
export function PostBidModal({ sneakerId, onClose }: PostBidModalProps) {
  const router = useRouter();
  const { listings, loadListings, placeBid } = useMarketplaceStore();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const sneaker = getSneakerById(sneakerId);

  // Load listings for this sneaker
  useEffect(() => {
    loadListings();
  }, [loadListings]);

  // Filter auction listings for this sneaker
  const auctionListings = listings.filter(
    listing => listing.sneakerId === sneakerId && listing.type === 'auction' && listing.status === 'active'
  );

  // Auto-select first listing if available
  useEffect(() => {
    if (auctionListings.length > 0 && !selectedListing) {
      setSelectedListing(auctionListings[0]);
      const minBid = (auctionListings[0].currentBid || 0) + 10;
      setBidAmount(minBid.toString());
    }
  }, [auctionListings, selectedListing]);

  if (!sneaker) {
    return (
      <Modal isOpen onClose={onClose} title="Sneaker Not Found">
        <div className="text-center py-8">
          <p className="text-gray-400">This sneaker could not be found.</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </Modal>
    );
  }

  const handleBidChange = (value: string) => {
    setBidAmount(value);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedListing) {
      setError('Please select a listing');
      return;
    }

    const amount = parseFloat(bidAmount);
    const minBid = (selectedListing.currentBid || 0) + 10;

    if (isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount < minBid) {
      setError(`Bid must be at least $${minBid}`);
      return;
    }

    setLoading(true);
    try {
      await placeBid(selectedListing.id, amount);
      toast.success(`Bid placed successfully! $${amount}`);
      onClose();
    } catch {
      setError('Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (endTime: Date): string => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleViewMarketplace = () => {
    onClose();
    router.push('/marketplace');
  };

  // No auction listings available
  if (auctionListings.length === 0) {
    return (
      <Modal isOpen onClose={onClose} title="No Auctions Available">
        <div className="space-y-6">
          {/* Sneaker Info */}
          <div className="flex gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={sneaker.images[0]}
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
              <p className="text-sm text-primary font-semibold mt-1">
                ${sneaker.marketValue}
              </p>
            </div>
          </div>

          <div className="text-center py-6">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">
              No active auctions for this sneaker
            </p>
            <p className="text-sm text-gray-500">
              Check the marketplace for other listings
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button variant="primary" onClick={handleViewMarketplace} className="flex-1">
              View Marketplace
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  const minBid = selectedListing ? (selectedListing.currentBid || 0) + 10 : 0;

  return (
    <Modal isOpen onClose={onClose} title="Place Your Bid">
      <div className="space-y-6">
        {/* Sneaker Info */}
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={sneaker.images[0]}
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
            <p className="text-sm text-gray-400">
              Market Value: ${sneaker.marketValue}
            </p>
          </div>
        </div>

        {/* Available Listings */}
        {auctionListings.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Select Listing
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {auctionListings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => {
                    setSelectedListing(listing);
                    const newMinBid = (listing.currentBid || 0) + 10;
                    setBidAmount(newMinBid.toString());
                  }}
                  className={`w-full p-3 rounded-lg border transition-colors text-left ${
                    selectedListing?.id === listing.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background/50 hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Size {listing.size}
                      </p>
                      <p className="text-xs text-gray-400">
                        Condition: {listing.condition}/10
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        ${listing.currentBid || 0}
                      </p>
                      <p className="text-xs text-gray-400">
                        {listing.bidHistory?.length || 0} bids
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Listing Info */}
        {selectedListing && (
          <div className="p-4 bg-background/50 rounded-lg border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Current Bid</span>
              <span className="text-xl font-bold text-primary">
                ${selectedListing.currentBid || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Size</span>
              <span className="text-sm font-medium text-foreground">
                {selectedListing.size}
              </span>
            </div>

            {selectedListing.bidEndTime && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Time Remaining</span>
                </div>
                <span className="text-foreground font-medium">
                  {getTimeRemaining(selectedListing.bidEndTime)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Total Bids</span>
              <span className="text-foreground">
                {selectedListing.bidHistory?.length || 0}
              </span>
            </div>
          </div>
        )}

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
              disabled={loading}
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
        {selectedListing && selectedListing.bidHistory && selectedListing.bidHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Recent Bids
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {selectedListing.bidHistory
                .slice()
                .reverse()
                .slice(0, 5)
                .map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between text-sm p-2 bg-background/30 rounded"
                  >
                    <span className="text-gray-400">
                      {formatDistanceToNow(bid.createdAt, { addSuffix: true })}
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1"
            disabled={loading || !selectedListing}
          >
            {loading ? (
              'Placing Bid...'
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Place Bid
              </>
            )}
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
