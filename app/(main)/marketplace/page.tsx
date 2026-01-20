/**
 * Marketplace Page - Buy, sell, rent sneakers
 * Displays listings with filter tabs and grid layout
 * Requirements: 6.1
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMarketplaceStore } from '@/stores/marketplaceStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { ListingCard, CreateListing } from '@/components/marketplace';
import { Button, ScrollReveal } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';
import { ListingType, Listing } from '@/types';
import { getUserById, getSneakerById } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

/**
 * Filter tab type
 */
type FilterTab = 'all' | ListingType;

/**
 * Skeleton loader for listings
 */
function ListingSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
        <div className="h-6 bg-gray-700 rounded w-1/3" />
        <div className="flex gap-2">
          <div className="h-10 bg-gray-700 rounded flex-1" />
          <div className="h-10 bg-gray-700 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Listing Detail Modal
 */
interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

function ListingDetailModal({ listing, onClose }: ListingDetailModalProps) {
  const seller = getUserById(listing.sellerId);
  const sneaker = getSneakerById(listing.sneakerId);
  const { placeBid } = useMarketplaceStore();

  if (!seller || !sneaker) {
    return null;
  }

  const handleBid = async (listingId: string, amount: number) => {
    try {
      await placeBid(listingId, amount);
      toast.success('Bid placed successfully!');
    } catch {
      toast.error('Failed to place bid');
    }
  };

  const handleContact = () => {
    toast.success('Message feature coming soon!');
    // TODO: Navigate to messages with seller
  };

  return (
    <Modal isOpen onClose={onClose} title="Listing Details">
      <div className="max-h-[70vh] overflow-y-auto">
        <ListingCard
          listing={listing}
          seller={seller}
          sneaker={sneaker}
          onBid={handleBid}
          onContact={handleContact}
        />
      </div>
    </Modal>
  );
}

/**
 * Main Marketplace Page Component
 */
export default function MarketplacePage() {
  const router = useRouter();
  const { listings, loading, loadListings, setFilter, placeBid } = useMarketplaceStore();
  const { unreadCount, loadNotifications } = useNotificationStore();
  
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);

  // Filter tabs configuration
  const filterTabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: listings.length },
    { 
      id: ListingType.SALE, 
      label: 'For Sale',
      count: listings.filter(l => l.type === ListingType.SALE).length
    },
    { 
      id: ListingType.RENT, 
      label: 'For Rent',
      count: listings.filter(l => l.type === ListingType.RENT).length
    },
    { 
      id: ListingType.AUCTION, 
      label: 'Bidding',
      count: listings.filter(l => l.type === ListingType.AUCTION).length
    },
  ];

  // Load listings and notifications on mount
  useEffect(() => {
    if (listings.length === 0) {
      loadListings();
    }
    loadNotifications();
  }, [listings.length, loadListings, loadNotifications]);

  // Apply filters when active filter or listings change
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter(l => l.type === activeFilter));
    }
  }, [activeFilter, listings]);

  /**
   * Handle filter tab change
   */
  const handleFilterChange = (filter: FilterTab) => {
    setActiveFilter(filter);
    
    // Update store filter
    if (filter === 'all') {
      setFilter({});
    } else {
      setFilter({ type: filter as ListingType });
    }
  };

  /**
   * Handle bid placement
   */
  const handleBid = async (listingId: string, amount: number) => {
    try {
      await placeBid(listingId, amount);
      toast.success('Bid placed successfully!');
    } catch {
      toast.error('Failed to place bid');
    }
  };

  /**
   * Handle contact seller
   */
  const handleContact = () => {
    toast.success('Message feature coming soon!');
    // TODO: Navigate to messages with seller
  };

  /**
   * Handle listing card click to show detail
   */
  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black border-b border-border">
        <div className="px-4 py-4 max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Marketplace</h1>
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Search listings"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => router.push('/notifications')}
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all',
                  activeFilter === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-card border border-border text-gray-300 hover:bg-card/80'
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 opacity-80">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Loading skeleton */}
        {loading && filteredListings.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && filteredListings.length > 0 && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredListings.map((listing, index) => {
                const seller = getUserById(listing.sellerId);
                const sneaker = getSneakerById(listing.sneakerId);

                if (!seller || !sneaker) return null;

                return (
                  <ScrollReveal key={listing.id} delay={index * 0.03}>
                    <div
                      onClick={() => handleListingClick(listing)}
                      className="cursor-pointer transform hover:scale-[1.02] transition-transform"
                    >
                      <ListingCard
                        listing={listing}
                        seller={seller}
                        sneaker={sneaker}
                        onBid={handleBid}
                        onContact={handleContact}
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && filteredListings.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Filter className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No listings found</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {activeFilter === 'all' 
                ? 'Be the first to list a sneaker!'
                : `No ${filterTabs.find(t => t.id === activeFilter)?.label.toLowerCase()} listings available`
              }
            </p>
            <Button variant="primary" onClick={() => setIsCreateListingOpen(true)}>
              Create Listing
            </Button>
          </motion.div>
        )}

        {/* Results count */}
        {!loading && filteredListings.length > 0 && (
          <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-gray-500 text-sm">
              Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg flex items-center justify-center z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCreateListingOpen(true)}
        aria-label="Create listing"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Modals */}
      {selectedListing && (
        <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
      )}
      <CreateListing isOpen={isCreateListingOpen} onClose={() => setIsCreateListingOpen(false)} />
    </div>
  );
}
