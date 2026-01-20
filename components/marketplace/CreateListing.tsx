/**
 * CreateListing Modal Component
 * Modal for creating new marketplace listings with sneaker selection, pricing, and type-specific fields
 * Validates: Requirements 6.3
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Image as ImageIcon, Check, Calendar, DollarSign, Package, Info } from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ListingType, CreateListingInput } from '@/types';
import { mockSneakers } from '@/lib/mockData';
import { useMarketplaceStore } from '@/stores/marketplaceStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CreateListingProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CreateListing Modal Component
 * Allows users to create marketplace listings with all required fields
 */
export function CreateListing({ isOpen, onClose }: CreateListingProps) {
  const { createListing } = useMarketplaceStore();
  
  // Form state
  const [listingType, setListingType] = useState<ListingType>(ListingType.SALE);
  const [selectedSneakerId, setSelectedSneakerId] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState(10);
  const [price, setPrice] = useState('');
  
  // Rental-specific fields
  const [rentPrice, setRentPrice] = useState('');
  const [rentDeposit, setRentDeposit] = useState('');
  const [rentAvailableFrom, setRentAvailableFrom] = useState('');
  const [rentAvailableTo, setRentAvailableTo] = useState('');
  
  // Auction-specific fields
  const [startingBid, setStartingBid] = useState('');
  const [auctionEndDate, setAuctionEndDate] = useState('');
  const [auctionEndTime, setAuctionEndTime] = useState('');
  
  // UI state
  const [sneakerSearchQuery, setSneakerSearchQuery] = useState('');
  const [showSneakerPicker, setShowSneakerPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get selected sneaker
  const selectedSneaker = mockSneakers.find(s => s.id === selectedSneakerId);

  // Filter sneakers based on search query
  const filteredSneakers = mockSneakers.filter(sneaker => {
    const searchLower = sneakerSearchQuery.toLowerCase();
    return (
      sneaker.brand.toLowerCase().includes(searchLower) ||
      sneaker.model.toLowerCase().includes(searchLower) ||
      sneaker.colorway.toLowerCase().includes(searchLower)
    );
  });

  // Get available images from selected sneaker
  const availableImages = selectedSneaker ? selectedSneaker.images : [];

  const handleImageToggle = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(img => img !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleSneakerSelect = (sneakerId: string) => {
    setSelectedSneakerId(sneakerId);
    setShowSneakerPicker(false);
    // Auto-select first image
    const sneaker = mockSneakers.find(s => s.id === sneakerId);
    if (sneaker && sneaker.images.length > 0) {
      setSelectedImages([sneaker.images[0]]);
    }
  };

  const getConditionLabel = (value: number): string => {
    if (value === 10) return 'Deadstock (DS)';
    if (value >= 9) return 'Near Deadstock';
    if (value >= 7) return 'Very Good';
    if (value >= 5) return 'Good';
    if (value >= 3) return 'Fair';
    return 'Poor';
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedSneakerId) {
      toast.error('Please select a sneaker');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (!size) {
      toast.error('Please select a size');
      return;
    }

    // Type-specific validation
    if (listingType === ListingType.SALE) {
      if (!price || parseFloat(price) <= 0) {
        toast.error('Please enter a valid price');
        return;
      }
    }

    if (listingType === ListingType.RENT) {
      if (!rentPrice || parseFloat(rentPrice) <= 0) {
        toast.error('Please enter a valid rental price');
        return;
      }
      if (!rentDeposit || parseFloat(rentDeposit) <= 0) {
        toast.error('Please enter a valid deposit amount');
        return;
      }
      if (!rentAvailableFrom || !rentAvailableTo) {
        toast.error('Please select rental dates');
        return;
      }
      if (new Date(rentAvailableFrom) >= new Date(rentAvailableTo)) {
        toast.error('End date must be after start date');
        return;
      }
    }

    if (listingType === ListingType.AUCTION) {
      if (!startingBid || parseFloat(startingBid) <= 0) {
        toast.error('Please enter a valid starting bid');
        return;
      }
      if (!auctionEndDate || !auctionEndTime) {
        toast.error('Please select auction end date and time');
        return;
      }
      const endDateTime = new Date(`${auctionEndDate}T${auctionEndTime}`);
      if (endDateTime <= new Date()) {
        toast.error('Auction end time must be in the future');
        return;
      }
    }

    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Build listing data with all required fields
      const baseListingData: CreateListingInput = {
        sneakerId: selectedSneakerId,
        images: selectedImages,
        size,
        condition,
        type: listingType,
        price: 0, // Will be set based on type
      };

      // Add type-specific fields
      if (listingType === ListingType.SALE) {
        baseListingData.price = parseFloat(price);
      }

      if (listingType === ListingType.RENT) {
        baseListingData.price = parseFloat(rentPrice); // Base price field
        baseListingData.rentPrice = parseFloat(rentPrice);
        baseListingData.rentDeposit = parseFloat(rentDeposit);
        baseListingData.rentAvailableFrom = new Date(rentAvailableFrom);
        baseListingData.rentAvailableTo = new Date(rentAvailableTo);
      }

      if (listingType === ListingType.AUCTION) {
        baseListingData.price = parseFloat(startingBid); // Base price field
        baseListingData.currentBid = parseFloat(startingBid);
        baseListingData.bidEndTime = new Date(`${auctionEndDate}T${auctionEndTime}`);
      }

      // Create listing
      await createListing(baseListingData);

      toast.success('Listing created successfully!');
      
      // Reset form and close
      handleClose();
    } catch (error) {
      toast.error('Failed to create listing');
      console.error('Error creating listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setListingType(ListingType.SALE);
    setSelectedSneakerId('');
    setSelectedImages([]);
    setSize('');
    setCondition(10);
    setPrice('');
    setRentPrice('');
    setRentDeposit('');
    setRentAvailableFrom('');
    setRentAvailableTo('');
    setStartingBid('');
    setAuctionEndDate('');
    setAuctionEndTime('');
    setSneakerSearchQuery('');
    setShowSneakerPicker(false);
    setShowImagePicker(false);
    setLoading(false);
    
    onClose();
  };

  const listingTypes = [
    { value: ListingType.SALE, label: 'For Sale', emoji: '💰', description: 'Sell your sneakers' },
    { value: ListingType.RENT, label: 'For Rent', emoji: '📅', description: 'Rent out your kicks' },
    { value: ListingType.AUCTION, label: 'Auction', emoji: '🔨', description: 'Let buyers bid' },
  ];

  // Get available sizes from selected sneaker or default sizes
  const availableSizes = selectedSneaker?.sizes || [
    '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Listing" size="lg">
      <ModalBody>
        {/* Listing Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Listing Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {listingTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setListingType(type.value)}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
                  listingType === type.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="text-2xl mb-1">{type.emoji}</span>
                <span className="text-sm font-medium">{type.label}</span>
                <span className="text-xs text-muted mt-0.5">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sneaker Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Sneaker *
          </label>
          
          {selectedSneaker ? (
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <Image
                src={selectedSneaker.images[0]}
                alt={selectedSneaker.model}
                width={60}
                height={60}
                className="rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {selectedSneaker.brand} {selectedSneaker.model}
                </p>
                <p className="text-xs text-muted">
                  {selectedSneaker.colorway}
                </p>
                <p className="text-xs text-primary mt-1">
                  Market Value: ${selectedSneaker.marketValue}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedSneakerId('');
                  setSelectedImages([]);
                  setShowSneakerPicker(true);
                }}
              >
                Change
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowSneakerPicker(true)}
            >
              <Package className="w-4 h-4 mr-2" />
              Choose Sneaker
            </Button>
          )}

          {/* Sneaker Picker Modal */}
          {showSneakerPicker && (
            <div className="mt-3 space-y-2">
              <Input
                placeholder="Search sneakers..."
                value={sneakerSearchQuery}
                onChange={(e) => setSneakerSearchQuery(e.target.value)}
              />
              <div className="max-h-64 overflow-y-auto space-y-1 p-2 bg-background/50 rounded-lg border border-border">
                {filteredSneakers.slice(0, 20).map((sneaker) => (
                  <button
                    key={sneaker.id}
                    onClick={() => handleSneakerSelect(sneaker.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors text-left"
                  >
                    <Image
                      src={sneaker.images[0]}
                      alt={sneaker.model}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {sneaker.brand} {sneaker.model}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {sneaker.colorway}
                      </p>
                    </div>
                    <span className="text-xs text-primary flex-shrink-0">
                      ${sneaker.marketValue}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Selection */}
        {selectedSneaker && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Images * {selectedImages.length > 0 && `(${selectedImages.length})`}
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImagePicker(!showImagePicker)}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                {showImagePicker ? 'Hide' : 'Select Images'}
              </Button>
            </div>

            {/* Selected Images Preview */}
            {selectedImages.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <Image
                      src={image}
                      alt={`Selected ${index + 1}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <button
                      onClick={() => handleImageToggle(image)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Image Picker */}
            {showImagePicker && (
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-background/50 rounded-lg">
                {availableImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageToggle(image)}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                      selectedImages.includes(image)
                        ? 'border-primary ring-2 ring-primary/50'
                        : 'border-transparent hover:border-primary/50'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`Option ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                    {selectedImages.includes(image) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Size and Condition */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Size *
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className={cn(
                'w-full px-4 py-2',
                'bg-card border border-border rounded-lg',
                'text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                'transition-all duration-200'
              )}
            >
              <option value="">Select size</option>
              {availableSizes.map((s) => (
                <option key={s} value={s}>
                  US {s}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Slider */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Condition: {getConditionLabel(condition)}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={condition}
              onChange={(e) => setCondition(parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>Poor</span>
              <span>Deadstock</span>
            </div>
          </div>
        </div>

        {/* Type-Specific Fields */}
        
        {/* Sale Fields */}
        {listingType === ListingType.SALE && (
          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
              Price * (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-10"
                min="0"
                step="0.01"
              />
            </div>
            {selectedSneaker && price && (
              <p className={cn(
                'text-xs mt-1',
                parseFloat(price) < selectedSneaker.marketValue
                  ? 'text-green-500'
                  : 'text-muted'
              )}>
                {parseFloat(price) < selectedSneaker.marketValue
                  ? `$${(selectedSneaker.marketValue - parseFloat(price)).toFixed(0)} below market value!`
                  : `Market value: $${selectedSneaker.marketValue}`
                }
              </p>
            )}
          </div>
        )}

        {/* Rental Fields */}
        {listingType === ListingType.RENT && (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="rentPrice" className="block text-sm font-medium text-foreground mb-2">
                  Daily Rate * (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    id="rentPrice"
                    type="number"
                    placeholder="0.00"
                    value={rentPrice}
                    onChange={(e) => setRentPrice(e.target.value)}
                    className="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rentDeposit" className="block text-sm font-medium text-foreground mb-2">
                  Deposit * (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input
                    id="rentDeposit"
                    type="number"
                    placeholder="0.00"
                    value={rentDeposit}
                    onChange={(e) => setRentDeposit(e.target.value)}
                    className="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="rentFrom" className="block text-sm font-medium text-foreground mb-2">
                  Available From *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <Input
                    id="rentFrom"
                    type="date"
                    value={rentAvailableFrom}
                    onChange={(e) => setRentAvailableFrom(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rentTo" className="block text-sm font-medium text-foreground mb-2">
                  Available To *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <Input
                    id="rentTo"
                    type="date"
                    value={rentAvailableTo}
                    onChange={(e) => setRentAvailableTo(e.target.value)}
                    className="pl-10"
                    min={rentAvailableFrom || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-500">
                Renters will pay the daily rate × number of days + deposit. The deposit is refundable upon return.
              </p>
            </div>
          </div>
        )}

        {/* Auction Fields */}
        {listingType === ListingType.AUCTION && (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="startingBid" className="block text-sm font-medium text-foreground mb-2">
                Starting Bid * (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  id="startingBid"
                  type="number"
                  placeholder="0.00"
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="auctionDate" className="block text-sm font-medium text-foreground mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <Input
                    id="auctionDate"
                    type="date"
                    value={auctionEndDate}
                    onChange={(e) => setAuctionEndDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auctionTime" className="block text-sm font-medium text-foreground mb-2">
                  End Time *
                </label>
                <Input
                  id="auctionTime"
                  type="time"
                  value={auctionEndTime}
                  onChange={(e) => setAuctionEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Info className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-500">
                Bidders can place bids until the auction ends. The highest bidder wins the item.
              </p>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          Create Listing
        </Button>
      </ModalFooter>
    </Modal>
  );
}
