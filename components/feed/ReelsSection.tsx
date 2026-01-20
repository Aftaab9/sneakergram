/**
 * ReelsSection Component
 * Instagram-like Reels section with video content
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { mockUsers } from '@/lib/mockData';

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail?: string;
  userId: string;
  caption: string;
  likes: number;
  comments: number;
  views: string;
}

const REELS_DATA: Reel[] = [
  {
    id: 'reel-1',
    videoUrl: '/data/best/4380323-hd_1080_1920_30fps.mp4',
    userId: 'user-2',
    caption: 'Fresh kicks rotation 🔥 #SneakerHead',
    likes: 12400,
    comments: 342,
    views: '45.2K',
  },
  {
    id: 'reel-2',
    videoUrl: '/data/best/vecteezy_close-up-of-a-person-s-feet-in-sneakers-walking-along-a_68699972.mp4',
    userId: 'user-3',
    caption: 'Walking in style 👟✨',
    likes: 8900,
    comments: 156,
    views: '32.1K',
  },
  {
    id: 'reel-3',
    videoUrl: '/data/best/vecteezy_close-up-of-white-sneakers-on-the-grass_1617742.mp4',
    userId: 'user-4',
    caption: 'Clean whites on the green 🌿',
    likes: 15600,
    comments: 289,
    views: '52.8K',
  },
  {
    id: 'reel-4',
    videoUrl: '/data/best/vecteezy_use-for-e-commerce-shopping-and-digital-ads-campaings_29226494.mp4',
    userId: 'user-5',
    caption: 'Sneaker shopping vibes 🛍️',
    likes: 10200,
    comments: 198,
    views: '38.5K',
  },
];

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
}

function ReelCard({ reel, isActive }: ReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const user = mockUsers.find(u => u.id === reel.userId) || mockUsers[0];

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play().catch(err => console.log('Play error:', err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden group">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

      {/* User Info */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
            <Image
              src={user.avatar}
              alt={user.username}
              width={32}
              height={32}
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="text-white font-semibold text-sm drop-shadow-lg">
            {user.username}
          </span>
          <button className="px-3 py-1 bg-primary rounded-full text-white text-xs font-semibold">
            Follow
          </button>
        </div>
        <button className="text-white">
          <MoreHorizontal className="w-6 h-6 drop-shadow-lg" />
        </button>
      </div>

      {/* Caption & Info */}
      <div className="absolute bottom-4 left-4 right-20">
        <p className="text-white text-sm mb-2 drop-shadow-lg line-clamp-2">
          {reel.caption}
        </p>
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <span>{reel.views} views</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4">
        {/* Like */}
        <button
          onClick={toggleLike}
          className="flex flex-col items-center gap-1 text-white"
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isLiked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
            )}
          >
            <Heart
              className={cn('w-6 h-6', isLiked && 'fill-white')}
            />
          </motion.div>
          <span className="text-xs font-semibold drop-shadow-lg">
            {formatNumber(reel.likes + (isLiked ? 1 : 0))}
          </span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1 text-white">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold drop-shadow-lg">
            {formatNumber(reel.comments)}
          </span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 text-white">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </button>

        {/* Save */}
        <button className="flex flex-col items-center gap-1 text-white">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
        </button>

        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          className="flex flex-col items-center gap-1 text-white mt-2"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

export function ReelsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Play className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Reels</h3>
            <p className="text-xs text-muted">Trending sneaker content</p>
          </div>
        </div>
        <button className="text-primary text-sm font-semibold hover:text-primary/80">
          See All
        </button>
      </div>

      {/* Reels Carousel */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {REELS_DATA.map((reel, index) => (
          <div
            key={reel.id}
            className="flex-shrink-0 w-full snap-center"
            style={{ height: '500px' }}
          >
            <ReelCard reel={reel} isActive={index === currentIndex} />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-1.5 py-3 bg-black/50">
        {REELS_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = index * scrollContainerRef.current.offsetWidth;
              }
            }}
            className={cn(
              'h-1 rounded-full transition-all',
              index === currentIndex
                ? 'w-6 bg-primary'
                : 'w-1.5 bg-white/30'
            )}
          />
        ))}
      </div>
    </div>
  );
}
