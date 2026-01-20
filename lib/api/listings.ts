/**
 * Listings API Adapter
 * Provides abstraction layer for marketplace listings data access
 */

import { Listing, CreateListingInput, Bid, ListingType, ListingStatus } from '@/types';
import { mockListings } from '../mockData';

// API Interface
export interface ListingsAPI {
  getListings(filter?: ListingType): Promise<Listing[]>;
  getListingById(listingId: string): Promise<Listing | null>;
  getListingsBySeller(sellerId: string): Promise<Listing[]>;
  createListing(listing: CreateListingInput, sellerId: string): Promise<Listing>;
  updateListing(listingId: string, updates: Partial<Listing>): Promise<Listing>;
  deleteListing(listingId: string): Promise<void>;
  placeBid(listingId: string, userId: string, amount: number): Promise<Bid>;
  getBidHistory(listingId: string): Promise<Bid[]>;
}

// Mock Implementation
class MockListingsAPI implements ListingsAPI {
  private listings: Listing[] = [...mockListings];

  async getListings(filter?: ListingType): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...this.listings].filter(l => l.status === ListingStatus.ACTIVE);
    
    if (filter) {
      filtered = filtered.filter(l => l.type === filter);
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getListingById(listingId: string): Promise<Listing | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.listings.find(l => l.id === listingId) || null;
  }

  async getListingsBySeller(sellerId: string): Promise<Listing[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.listings.filter(l => l.sellerId === sellerId);
  }

  async createListing(input: CreateListingInput, sellerId: string): Promise<Listing> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      sellerId,
      sneakerId: input.sneakerId,
      images: input.images,
      size: input.size,
      condition: input.condition,
      price: input.price,
      type: input.type,
      rentPrice: input.rentPrice,
      rentDeposit: input.rentDeposit,
      rentAvailableFrom: input.rentAvailableFrom,
      rentAvailableTo: input.rentAvailableTo,
      currentBid: input.currentBid,
      bidHistory: [],
      bidEndTime: input.bidEndTime,
      verified: false,
      status: ListingStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.listings.unshift(newListing);
    return newListing;
  }

  async updateListing(listingId: string, updates: Partial<Listing>): Promise<Listing> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const listing = this.listings.find(l => l.id === listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    Object.assign(listing, updates, { updatedAt: new Date() });
    return listing;
  }

  async deleteListing(listingId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.listings = this.listings.filter(l => l.id !== listingId);
  }

  async placeBid(listingId: string, userId: string, amount: number): Promise<Bid> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const listing = this.listings.find(l => l.id === listingId);
    if (!listing || listing.type !== ListingType.AUCTION) {
      throw new Error('Invalid listing for bidding');
    }

    const bid: Bid = {
      id: `bid-${Date.now()}`,
      listingId,
      userId,
      amount,
      createdAt: new Date(),
    };

    if (!listing.bidHistory) {
      listing.bidHistory = [];
    }
    
    listing.bidHistory.push(bid);
    listing.currentBid = amount;
    listing.updatedAt = new Date();

    return bid;
  }

  async getBidHistory(listingId: string): Promise<Bid[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const listing = this.listings.find(l => l.id === listingId);
    return listing?.bidHistory || [];
  }
}

// Export current implementation
export const listingsAPI: ListingsAPI = new MockListingsAPI();
