/**
 * Dynamic Component Imports
 * Lazy-loaded components for code splitting and better performance
 */

'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Loading component for dynamic imports
 */
const DynamicLoading = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" />
  </div>
);

/**
 * Dynamically imported 3D Landing Experience
 * Heavy Three.js components are code-split
 */
export const DynamicLandingExperience = dynamic(
  () => import('@/components/3d/LandingExperience').then(mod => ({ default: mod.LandingExperience })),
  {
    loading: () => <DynamicLoading />,
    ssr: false, // Disable SSR for Three.js components
  }
);

/**
 * Dynamically imported Create Post Modal
 * Only loaded when user wants to create a post
 */
export const DynamicCreatePost = dynamic(
  () => import('@/components/feed/CreatePost').then(mod => ({ default: mod.CreatePost })),
  {
    loading: () => <DynamicLoading />,
  }
);

/**
 * Dynamically imported Create Listing Modal
 * Only loaded when user wants to create a listing
 */
export const DynamicCreateListing = dynamic(
  () => import('@/components/marketplace/CreateListing').then(mod => ({ default: mod.CreateListing })),
  {
    loading: () => <DynamicLoading />,
  }
);

/**
 * Dynamically imported Verification Modal
 * Only loaded when user initiates verification
 */
export const DynamicVerificationModal = dynamic(
  () => import('@/components/profile/VerificationModal').then(mod => ({ default: mod.VerificationModal })),
  {
    loading: () => <DynamicLoading />,
  }
);

/**
 * Dynamically imported Bid Modal
 * Only loaded when user wants to place a bid
 */
export const DynamicBidModal = dynamic(
  () => import('@/components/marketplace/BidModal').then(mod => ({ default: mod.BidModal })),
  {
    loading: () => <DynamicLoading />,
  }
);

/**
 * Dynamically imported Post Bid Modal
 * Only loaded when user wants to bid from a post
 */
export const DynamicPostBidModal = dynamic(
  () => import('@/components/feed/PostBidModal').then(mod => ({ default: mod.PostBidModal })),
  {
    loading: () => <DynamicLoading />,
  }
);

/**
 * Dynamically imported Booking Modal
 * Only loaded when user wants to book a service
 */
export const DynamicBookingModal = dynamic(
  () => import('@/components/services/BookingModal').then(mod => ({ default: mod.BookingModal })),
  {
    loading: () => <DynamicLoading />,
  }
);
