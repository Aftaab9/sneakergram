'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Users, 
  TrendingUp,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react';
import { getSneakerById, mockListings, getUserById } from '@/lib/mockData';
import { Sneaker, Listing } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ListingCard } from '@/components/marketplace/ListingCard';
import toast from 'react-hot-toast';

/**
 * Sneaker Detail Page - Comprehensive sneaker information
 * Displays market value, price history, sizes, ownership count, related listings
 * Requirements: 11.3
 */
export default function SneakerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuthStore();
  
  const [sneaker, setSneaker] = useState<Sneaker | null>(null);
  const [relatedListings, setRelatedListings] = useState<Listing[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Load sneaker data
    const sneakerData = getSneakerById(id);
    if (sneakerData) {
      setSneaker(sneakerData);
      
      // Check if in wishlist
      if (user && user.wishlist.includes(id)) {
        setIsInWishlist(true);
      }
      
      // Load related listings
      const listings = mockListings.filter(
        listing => listing.sneakerId === id
      );
      setRelatedListings(listings);
    }
  }, [id, user]);

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    setIsInWishlist(!isInWishlist);
    toast.success(
      isInWishlist 
        ? 'Removed from wishlist' 
        : 'Added to wishlist'
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${sneaker?.brand} ${sneaker?.model}`,
        text: `Check out this sneaker on SneakerGram!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getSizeSpecificPrice = (size: string): number => {
    if (!sneaker) return 0;
    
    // Base market value
    let price = sneaker.marketValue;
    
    // Add size-based variation (popular sizes cost more)
    const sizeNum = parseFloat(size);
    if (sizeNum >= 9 && sizeNum <= 11) {
      // Popular sizes (9-11) have 10-20% premium
      price = price * (1 + Math.random() * 0.1 + 0.1);
    } else if (sizeNum < 7 || sizeNum > 13) {
      // Rare sizes have 5-15% discount
      price = price * (1 - Math.random() * 0.1 - 0.05);
    }
    
    return Math.round(price);
  };

  if (!sneaker) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Sneaker not found</h2>
          <p className="text-gray-400 mb-4">The sneaker you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const priceChange = sneaker.marketValue - sneaker.retailPrice;
  const priceChangePercent = ((priceChange / sneaker.retailPrice) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-card rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-card rounded-full transition-colors"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleAddToWishlist}
              className="p-2 hover:bg-card rounded-full transition-colors"
            >
              <Heart 
                className={`w-6 h-6 ${isInWishlist ? 'fill-primary text-primary' : 'text-white'}`} 
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Image Gallery */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative aspect-square bg-gray-900">
            <Image
              src={sneaker.images[selectedImage]}
              alt={`${sneaker.brand} ${sneaker.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Image Thumbnails */}
          {sneaker.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {sneaker.images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index 
                      ? 'border-primary' 
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`View ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Sneaker Info */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-gray-400 text-sm mb-1">{sneaker.brand}</p>
              <h1 className="text-3xl font-bold text-white mb-1">
                {sneaker.model}
              </h1>
              <p className="text-gray-400">{sneaker.colorway}</p>
            </div>
          </div>
        </div>

        {/* Market Value Card */}
        <Card className="mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Market Value</p>
              <p className="text-3xl font-bold text-white">
                ${sneaker.marketValue}
              </p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-gray-400 text-sm mb-1">Retail Price</p>
              <p className="text-white font-semibold">${sneaker.retailPrice}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Release Date</p>
              <p className="text-white font-semibold">{sneaker.releaseDate}</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {sneaker.ownedByUsers.toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs">Owners</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Package className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {relatedListings.length}
            </p>
            <p className="text-gray-400 text-xs">Listings</p>
          </Card>
          
          <Card className="p-4 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {new Date().getFullYear() - parseInt(sneaker.releaseDate.split('-')[0])}y
            </p>
            <p className="text-gray-400 text-xs">Age</p>
          </Card>
        </div>

        {/* Description */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-bold text-white mb-3">About</h2>
          <p className="text-gray-300 leading-relaxed">
            {sneaker.description}
          </p>
        </Card>

        {/* Available Sizes */}
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Available Sizes</h2>
          <div className="grid grid-cols-4 gap-2">
            {sneaker.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedSize === size
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-white hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <p className="font-semibold">{size}</p>
                  {selectedSize === size && (
                    <p className="text-xs mt-1">
                      ${getSizeSpecificPrice(size)}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
          {selectedSize && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Size {selectedSize} Market Value</p>
                  <p className="text-2xl font-bold text-white">
                    ${getSizeSpecificPrice(selectedSize)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
          )}
        </Card>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Available Listings ({relatedListings.length})
            </h2>
            <div className="space-y-4">
              {relatedListings.map((listing) => {
                const seller = getUserById(listing.sellerId);
                if (!seller) return null;
                
                return (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    seller={seller}
                    sneaker={sneaker}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Add to Wishlist CTA */}
        <Card className="p-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">
            {isInWishlist ? 'In Your Wishlist' : 'Want These?'}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {isInWishlist 
              ? "We'll notify you of price drops and new listings"
              : 'Add to wishlist to track prices and get notified of deals'
            }
          </p>
          <Button
            onClick={handleAddToWishlist}
            variant={isInWishlist ? 'secondary' : 'primary'}
            className="w-full"
          >
            <Heart className={`w-5 h-5 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
            {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
