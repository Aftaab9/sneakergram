/**
 * PostCard Component - Instagram-like post display
 */

'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Post } from '@/types';
import { getUserById } from '@/lib/mockData';
import { useFeedStore } from '@/stores/feedStore';
import { getCurrentUser } from '@/stores/authStore';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { toggleLike, savePost, unsavePost } = useFeedStore();
  const currentUser = getCurrentUser();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const lastTapRef = useRef<number>(0);
  
  const user = getUserById(post.userId);
  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
  const isSaved = currentUser ? post.savedBy.includes(currentUser.id) : false;
  const hasMultipleImages = post.images.length > 1;

  if (!user) return null;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300 && now - lastTapRef.current > 0) {
      if (!isLiked) toggleLike(post.id);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
    }
    lastTapRef.current = now;
  };

  const handleLike = () => toggleLike(post.id);
  const handleSave = () => isSaved ? unsavePost(post.id) : savePost(post.id);


  return (
    <article className="bg-black border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <button 
          onClick={() => router.push(`/profile/${user.username}`)}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={user.avatar}
              alt={user.displayName}
              width={32}
              height={32}
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{user.username}</span>
            {user.verified && (
              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            )}
          </div>
        </button>
        <button className="p-2" aria-label="More options">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-card" onClick={handleDoubleTap}>
        <Image
          src={post.images[currentImageIndex]}
          alt={`Post by ${user.username}`}
          fill
          className="object-cover"
          sizes="(max-width: 470px) 100vw, 470px"
          priority
          unoptimized
        />
        
        {/* Double-tap like animation */}
        {showLikeAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg animate-like-pop" />
          </motion.div>
        )}

        {/* Image indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {post.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>


      {/* Actions */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="hover:opacity-70 transition-opacity">
              <Heart 
                className={`w-6 h-6 transition-all ${isLiked ? 'text-secondary fill-secondary scale-110' : ''}`}
              />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button onClick={handleSave} className="hover:opacity-70 transition-opacity">
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-foreground' : ''}`} />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-1">
          {post.likes.toLocaleString()} likes
        </p>

        {/* Caption */}
        <p className="text-sm">
          <button 
            onClick={() => router.push(`/profile/${user.username}`)}
            className="font-semibold mr-1"
          >
            {user.username}
          </button>
          {post.caption}
        </p>

        {/* Comments preview */}
        {post.comments.length > 0 && (
          <button className="text-muted text-sm mt-1">
            View all {post.comments.length} comments
          </button>
        )}

        {/* Timestamp */}
        <p className="text-muted text-xs mt-1 uppercase">
          {formatDistanceToNow(post.createdAt, { addSuffix: false })} ago
        </p>
      </div>
    </article>
  );
}
