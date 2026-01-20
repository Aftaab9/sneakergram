'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs, ProfileTab } from '@/components/profile/ProfileTabs';
import { SneakerCollection } from '@/components/profile/SneakerCollection';
import { WishlistGrid } from '@/components/profile/WishlistGrid';
import { VerificationModal } from '@/components/profile/VerificationModal';
import { useState, useEffect, useMemo } from 'react';
import { mockUsers, mockSneakers, mockPosts, mockListings, getSneakerById } from '@/lib/mockData';
import { User, Sneaker } from '@/types';
import { motion } from 'framer-motion';
import { PostCard } from '@/components/feed/PostCard';
import { ListingCard } from '@/components/marketplace/ListingCard';
import toast from 'react-hot-toast';

/**
 * User Profile Page - View any user's profile by username
 * Displays user's collection, posts, wishlist, listings, reviews
 * Implements own profile vs other profile logic
 */
export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user: currentUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<ProfileTab>('collection');
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);

  // Find the profile user by username
  useEffect(() => {
    const foundUser = mockUsers.find(u => u.username === username);
    setProfileUser(foundUser || null);
    setLoading(false);
  }, [username]);

  // Check if this is the current user's own profile
  const isOwnProfile = currentUser?.username === username;

  // Get user's sneakers from collection
  const collectionSneakers = useMemo(() => {
    if (!profileUser) return [];
    return profileUser.collection
      .map(sneakerId => getSneakerById(sneakerId))
      .filter(Boolean) as typeof mockSneakers;
  }, [profileUser]);

  // Get user's wishlist sneakers
  const wishlistSneakers = useMemo(() => {
    if (!profileUser) return [];
    return profileUser.wishlist
      .map(sneakerId => getSneakerById(sneakerId))
      .filter(Boolean) as typeof mockSneakers;
  }, [profileUser]);

  // Get user's posts
  const userPosts = useMemo(() => {
    if (!profileUser) return [];
    return mockPosts.filter(post => post.userId === profileUser.id);
  }, [profileUser]);

  // Get user's listings
  const userListings = useMemo(() => {
    if (!profileUser) return [];
    return mockListings.filter(listing => listing.sellerId === profileUser.id);
  }, [profileUser]);

  // Calculate total collection value
  const totalCollectionValue = useMemo(() => {
    return collectionSneakers.reduce((sum, sneaker) => sum + sneaker.marketValue, 0);
  }, [collectionSneakers]);

  // Handle follow action
  const handleFollow = () => {
    toast.success(`Following ${profileUser?.displayName}!`);
  };

  // Handle edit profile
  const handleEdit = () => {
    toast('Edit profile coming soon!', { icon: '✏️' });
  };

  // Handle sneaker click
  const handleSneakerClick = () => {
    toast('Sneaker details coming soon!', { icon: '👟' });
  };

  // Handle verify sneaker
  const handleVerifyClick = (sneaker: Sneaker) => {
    setSelectedSneaker(sneaker);
    setShowVerificationModal(true);
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = () => {
    toast.success('Removed from wishlist');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-card rounded-lg mb-4"></div>
            <div className="h-12 bg-card rounded-lg mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48 bg-card rounded-lg"></div>
              <div className="h-48 bg-card rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User not found
  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">User Not Found</h1>
          <p className="text-gray-400 mb-6">
            The user @{username} doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4">
        {/* Profile Header */}
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          onFollow={handleFollow}
          onEdit={handleEdit}
        />

        {/* Collection Value Summary (only for own profile) */}
        {isOwnProfile && collectionSneakers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Collection Value</p>
                <p className="text-3xl font-bold text-foreground">
                  ${totalCollectionValue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Sneakers</p>
                <p className="text-2xl font-bold text-primary">
                  {collectionSneakers.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            collection: collectionSneakers.length,
            posts: userPosts.length,
            wishlist: wishlistSneakers.length,
            listings: userListings.length,
            reviews: 0,
          }}
        />

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'collection' && (
            <SneakerCollection
              sneakers={collectionSneakers}
              userId={profileUser.id}
              onSneakerClick={handleSneakerClick}
              onVerifyClick={isOwnProfile ? handleVerifyClick : undefined}
            />
          )}

          {activeTab === 'posts' && (
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No posts yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {isOwnProfile ? 'Share your first sneaker post!' : 'This user hasn&apos;t posted yet'}
                  </p>
                </div>
              ) : (
                userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <WishlistGrid
              sneakers={wishlistSneakers}
              onSneakerClick={handleSneakerClick}
              onRemove={isOwnProfile ? handleRemoveFromWishlist : undefined}
            />
          )}

          {activeTab === 'listings' && (
            <div className="space-y-4">
              {userListings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No listings yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {isOwnProfile ? 'Create your first listing!' : 'This user has no active listings'}
                  </p>
                </div>
              ) : (
                userListings.map((listing, index) => {
                  const sneaker = getSneakerById(listing.sneakerId);
                  if (!sneaker || !profileUser) return null;
                  
                  return (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListingCard
                        listing={listing}
                        sneaker={sneaker}
                        seller={profileUser}
                      />
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Reviews coming soon</p>
              <p className="text-gray-500 text-sm mt-2">
                User reviews and ratings will be available in a future update
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {selectedSneaker && profileUser && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedSneaker(null);
          }}
          sneaker={selectedSneaker}
          userId={profileUser.id}
        />
      )}
    </div>
  );
}
