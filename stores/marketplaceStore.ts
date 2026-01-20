/**
 * Marketplace Store
 * Manages marketplace listings, filters, and bidding logic
 */

import { create } from 'zustand';
import { 
  MarketplaceState, 
  MarketplaceFilters, 
  CreateListingInput
} from '@/types';
import { listingsAPI } from '@/lib/api/listings';
import { useAuthStore } from './authStore';

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  listings: [],
  filters: {},
  loading: false,
  error: null,

  loadListings: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const listings = await listingsAPI.getListings(filters.type);
      set({ listings, loading: false });
    } catch (error) {
      console.error('Failed to load listings:', error);
      set({ 
        error: 'Failed to load listings. Please try again.', 
        loading: false 
      });
    }
  },

  setFilter: (filters: MarketplaceFilters) => {
    set({ filters });
    // Reload listings with new filters
    get().loadListings();
  },

  createListing: async (listing: CreateListingInput) => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const newListing = await listingsAPI.createListing(listing, user.id);
      set(state => ({
        listings: [newListing, ...state.listings],
        loading: false
      }));
    } catch (error) {
      console.error('Failed to create listing:', error);
      set({ 
        error: 'Failed to create listing. Please try again.', 
        loading: false 
      });
      throw error;
    }
  },

  placeBid: async (listingId: string, amount: number) => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const bid = await listingsAPI.placeBid(listingId, user.id, amount);
      
      // Update the listing in the store
      set(state => ({
        listings: state.listings.map(listing =>
          listing.id === listingId
            ? {
                ...listing,
                currentBid: amount,
                bidHistory: [...(listing.bidHistory || []), bid],
                updatedAt: new Date()
              }
            : listing
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Failed to place bid:', error);
      set({ 
        error: 'Failed to place bid. Please try again.', 
        loading: false 
      });
      throw error;
    }
  },
}));
