/**
 * CreatePost Modal Component
 * Modal for creating new posts with image selection, caption, and sneaker tags
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PostType } from '@/types';
import { mockSneakers } from '@/lib/mockData';
import { useFeedStore } from '@/stores/feedStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CreatePost Modal Component
 * Validates: Requirements 4.1, 4.4
 */
export function CreatePost({ isOpen, onClose }: CreatePostProps) {
  const { createPost } = useFeedStore();
  
  // Form state
  const [postType, setPostType] = useState<PostType>(PostType.COLLECTION);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [selectedSneakerIds, setSelectedSneakerIds] = useState<string[]>([]);
  const [sneakerSearchQuery, setSneakerSearchQuery] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showSneakerPicker, setShowSneakerPicker] = useState(false);
  const [canBid, setCanBid] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get available images from mock sneakers (mock image upload)
  const availableImages = mockSneakers.flatMap(sneaker => sneaker.images.slice(0, 3));

  // Filter sneakers based on search query
  const filteredSneakers = mockSneakers.filter(sneaker => {
    const searchLower = sneakerSearchQuery.toLowerCase();
    return (
      sneaker.brand.toLowerCase().includes(searchLower) ||
      sneaker.model.toLowerCase().includes(searchLower) ||
      sneaker.colorway.toLowerCase().includes(searchLower)
    );
  });

  const handleImageToggle = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(img => img !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleSneakerToggle = (sneakerId: string) => {
    if (selectedSneakerIds.includes(sneakerId)) {
      setSelectedSneakerIds(selectedSneakerIds.filter(id => id !== sneakerId));
    } else {
      setSelectedSneakerIds([...selectedSneakerIds, sneakerId]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create post
      createPost({
        type: postType,
        images: selectedImages,
        caption: caption.trim(),
        sneakerTags: selectedSneakerIds,
        canBid,
        bidSneakerId: canBid && selectedSneakerIds.length > 0 ? selectedSneakerIds[0] : undefined,
      });

      toast.success('Post created successfully!');
      
      // Reset form and close
      handleClose();
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setPostType(PostType.COLLECTION);
    setSelectedImages([]);
    setCaption('');
    setSelectedSneakerIds([]);
    setSneakerSearchQuery('');
    setShowImagePicker(false);
    setShowSneakerPicker(false);
    setCanBid(false);
    setLoading(false);
    
    onClose();
  };

  const postTypes = [
    { value: PostType.COLLECTION, label: 'Collection Flex', emoji: '🔥' },
    { value: PostType.PICKUP, label: 'New Pickup', emoji: '📦' },
    { value: PostType.FITCHECK, label: 'Fit Check', emoji: '👟' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Post" size="lg">
      <ModalBody>
        {/* Post Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Post Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {postTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setPostType(type.value)}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
                  postType === type.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="text-2xl mb-1">{type.emoji}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Images {selectedImages.length > 0 && `(${selectedImages.length})`}
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
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-background/50 rounded-lg">
              {availableImages.slice(0, 40).map((image, index) => (
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

        {/* Caption Input */}
        <div className="mb-6">
          <label htmlFor="caption" className="block text-sm font-medium text-foreground mb-2">
            Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
            className={cn(
              'w-full px-4 py-2',
              'bg-card border border-border rounded-lg',
              'text-foreground placeholder:text-muted',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'transition-all duration-200',
              'resize-none'
            )}
          />
        </div>

        {/* Sneaker Tags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Tag Sneakers {selectedSneakerIds.length > 0 && `(${selectedSneakerIds.length})`}
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSneakerPicker(!showSneakerPicker)}
            >
              {showSneakerPicker ? 'Hide' : 'Add Tags'}
            </Button>
          </div>

          {/* Selected Sneakers */}
          {selectedSneakerIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSneakerIds.map((sneakerId) => {
                const sneaker = mockSneakers.find(s => s.id === sneakerId);
                if (!sneaker) return null;
                return (
                  <div
                    key={sneakerId}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full"
                  >
                    <span className="text-sm font-medium">
                      {sneaker.brand} {sneaker.model}
                    </span>
                    <button
                      onClick={() => handleSneakerToggle(sneakerId)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sneaker Picker */}
          {showSneakerPicker && (
            <div className="space-y-2">
              <Input
                placeholder="Search sneakers..."
                value={sneakerSearchQuery}
                onChange={(e) => setSneakerSearchQuery(e.target.value)}
              />
              <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-background/50 rounded-lg">
                {filteredSneakers.slice(0, 20).map((sneaker) => (
                  <button
                    key={sneaker.id}
                    onClick={() => handleSneakerToggle(sneaker.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left',
                      selectedSneakerIds.includes(sneaker.id)
                        ? 'bg-primary/20 border border-primary/50'
                        : 'hover:bg-card/50'
                    )}
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
                    {selectedSneakerIds.includes(sneaker.id) && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enable Bidding Option */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={canBid}
              onChange={(e) => setCanBid(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background"
            />
            <span className="text-sm font-medium text-foreground">
              Enable bidding on this post
            </span>
          </label>
          {canBid && selectedSneakerIds.length === 0 && (
            <p className="text-xs text-muted mt-1 ml-6">
              Tag at least one sneaker to enable bidding
            </p>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          Post
        </Button>
      </ModalFooter>
    </Modal>
  );
}
