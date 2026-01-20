/**
 * Community Page - Reddit-like discussion forums with 3D Sneaker Viewer
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Bookmark,
  Plus,
  Users,
  TrendingUp,
  Clock,
  Box,
  X,
  Sparkles
} from 'lucide-react';
import { useCommunityStore, CommunityPost } from '@/stores/communityStore';
import { getUserById } from '@/lib/mockData';
import { getCurrentUser } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Dynamically import 3D viewer to avoid SSR issues
const SneakerViewer3D = dynamic(
  () => import('@/components/community/SneakerViewer3D').then(mod => mod.SneakerViewer3D),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square bg-card rounded-xl border border-border flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    ),
  }
);

type SortOption = 'hot' | 'new' | 'top';

// Featured Indian Bridal Sneakers
const FEATURED_SNEAKERS = [
  {
    id: 'red-ghungroo',
    name: 'Red Ghungroo Sneakers',
    image: '/data/best/red ghungroo.jpg',
    description: 'Traditional bells meet modern style',
    likes: 2847,
  },
  {
    id: 'sangeet-1',
    name: 'Sangeet Gold Embroidery',
    image: '/data/best/sangeet sneakers 1.jpg',
    description: 'Perfect for dancing all night',
    likes: 1923,
  },
  {
    id: 'sangeet-3',
    name: 'Sangeet Mirror Work',
    image: '/data/best/sangeet sneakers 3.jpg',
    description: 'Sparkle with every step',
    likes: 1654,
  },
  {
    id: 'saree',
    name: 'Saree Sneakers',
    image: '/data/best/saree sneakers.avif',
    description: 'Breaking stereotypes beautifully',
    likes: 3124,
  },
];

function FeaturedSneakerCard({ sneaker, onClick }: { sneaker: typeof FEATURED_SNEAKERS[0]; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative aspect-square rounded-xl overflow-hidden group"
    >
      <Image
        src={sneaker.image}
        alt={sneaker.name}
        fill
        className="object-cover transition-transform group-hover:scale-110"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h4 className="font-semibold text-sm text-white truncate">{sneaker.name}</h4>
        <p className="text-xs text-white/70 truncate">{sneaker.description}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-primary">
          <Sparkles className="w-3 h-3" />
          <span>{sneaker.likes.toLocaleString()} likes</span>
        </div>
      </div>
    </motion.button>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  const { votePost, addComment } = useCommunityStore();
  const currentUser = getCurrentUser();
  const author = getUserById(post.userId);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const userVote = currentUser ? post.votedBy[currentUser.id] : undefined;
  const score = post.upvotes - post.downvotes;

  const handleVote = (voteType: 'up' | 'down') => {
    if (!currentUser) {
      toast.error('Please login to vote');
      return;
    }
    votePost(post.id, voteType);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }
    addComment(post.id, commentText.trim());
    setCommentText('');
    toast.success('Comment added!');
  };

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg overflow-hidden"
    >
      <div className="flex">
        {/* Vote Column */}
        <div className="flex flex-col items-center gap-1 p-2 bg-black/20">
          <button
            onClick={() => handleVote('up')}
            className={cn(
              'p-1 rounded hover:bg-primary/20 transition-colors',
              userVote === 'up' && 'text-primary'
            )}
            aria-label="Upvote"
          >
            <ArrowBigUp className={cn('w-6 h-6', userVote === 'up' && 'fill-current')} />
          </button>
          <span className={cn(
            'font-bold text-sm',
            score > 0 && 'text-primary',
            score < 0 && 'text-red-500'
          )}>
            {score}
          </span>
          <button
            onClick={() => handleVote('down')}
            className={cn(
              'p-1 rounded hover:bg-red-500/20 transition-colors',
              userVote === 'down' && 'text-red-500'
            )}
            aria-label="Downvote"
          >
            <ArrowBigDown className={cn('w-6 h-6', userVote === 'down' && 'fill-current')} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs text-muted mb-2">
            <div className="w-5 h-5 rounded-full overflow-hidden">
              <Image
                src={author?.avatar || '/avatars/default.jpg'}
                alt={author?.username || 'User'}
                width={20}
                height={20}
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="font-medium text-foreground">u/{author?.username}</span>
            <span>•</span>
            <span>{timeAgo(post.createdAt)}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-foreground mb-2">{post.title}</h3>

          {/* Content */}
          <p className="text-sm text-gray-300 mb-3 line-clamp-3">{post.content}</p>

          {/* Images */}
          {post.images.length > 0 && (
            <div className={cn(
              'grid gap-2 mb-3',
              post.images.length === 1 && 'grid-cols-1',
              post.images.length === 2 && 'grid-cols-2',
              post.images.length >= 3 && 'grid-cols-3'
            )}>
              {post.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-muted">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 text-xs hover:text-foreground transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments.length} Comments</span>
            </button>
            <button className="flex items-center gap-1 text-xs hover:text-foreground transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-1 text-xs hover:text-foreground transition-colors">
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                {/* Add Comment */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-black/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                  />
                  <Button size="sm" onClick={handleComment}>Post</Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {post.comments.map((comment) => {
                    const commentAuthor = getUserById(comment.userId);
                    return (
                      <div key={comment.id} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={commentAuthor?.avatar || '/avatars/default.jpg'}
                            alt={commentAuthor?.username || 'User'}
                            width={24}
                            height={24}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium">u/{commentAuthor?.username}</span>
                            <span className="text-muted">• {timeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              <ArrowBigUp className="w-4 h-4" />
                              {comment.upvotes - comment.downvotes}
                            </span>
                            <button className="hover:text-foreground">Reply</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function CommunityPage() {
  const { communities, posts, loading, loadCommunities } = useCommunityStore();
  const [sortBy, setSortBy] = useState<SortOption>('hot');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const { createPost } = useCommunityStore();

  const community = communities[0]; // Indian Bridals community
  const communityPosts = posts.filter(p => p.communityId === community?.id);

  // Sort posts
  const sortedPosts = [...communityPosts].sort((a, b) => {
    if (sortBy === 'new') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    if (sortBy === 'top') {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    }
    // Hot: combination of score and recency
    const scoreA = (a.upvotes - a.downvotes) / Math.pow((Date.now() - a.createdAt.getTime()) / 3600000 + 2, 1.5);
    const scoreB = (b.upvotes - b.downvotes) / Math.pow((Date.now() - b.createdAt.getTime()) / 3600000 + 2, 1.5);
    return scoreB - scoreA;
  });

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error('Please fill in title and content');
      return;
    }
    createPost(community.id, newPostTitle.trim(), newPostContent.trim(), []);
    setNewPostTitle('');
    setNewPostContent('');
    setShowCreatePost(false);
    toast.success('Post created!');
  };

  const handleSneakerClick = (sneaker: typeof FEATURED_SNEAKERS[0]) => {
    setSelectedImage(sneaker.image);
  };

  if (!community) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Community Banner */}
      <div className="relative h-32 md:h-48">
        <Image
          src={community.banner}
          alt={community.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Community Info */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-20 h-20 rounded-full border-4 border-black overflow-hidden">
            <Image
              src={community.icon}
              alt={community.name}
              width={80}
              height={80}
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold text-foreground">{community.name}</h1>
            <p className="text-sm text-muted flex items-center gap-2">
              <Users className="w-4 h-4" />
              {community.members.toLocaleString()} members
            </p>
          </div>
          <Button variant="primary" size="sm">
            Join
          </Button>
        </div>

        <p className="text-sm text-gray-300 mb-6">{community.description}</p>

        {/* Featured Sneakers Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Featured Designs
            </h2>
            <button
              onClick={() => setShow3DViewer(!show3DViewer)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm hover:bg-primary/30 transition-colors"
            >
              <Box className="w-4 h-4" />
              {show3DViewer ? 'Hide 3D' : 'View in 3D'}
            </button>
          </div>

          {/* 3D Viewer */}
          <AnimatePresence>
            {show3DViewer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="max-w-md mx-auto">
                  <SneakerViewer3D />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURED_SNEAKERS.map((sneaker) => (
              <FeaturedSneakerCard
                key={sneaker.id}
                sneaker={sneaker}
                onClick={() => handleSneakerClick(sneaker)}
              />
            ))}
          </div>
        </div>

        {/* Sort & Create */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy('hot')}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
                sortBy === 'hot' ? 'bg-primary text-white' : 'bg-card text-muted hover:text-foreground'
              )}
            >
              <TrendingUp className="w-4 h-4" />
              Hot
            </button>
            <button
              onClick={() => setSortBy('new')}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
                sortBy === 'new' ? 'bg-primary text-white' : 'bg-card text-muted hover:text-foreground'
              )}
            >
              <Clock className="w-4 h-4" />
              New
            </button>
            <button
              onClick={() => setSortBy('top')}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors',
                sortBy === 'top' ? 'bg-primary text-white' : 'bg-card text-muted hover:text-foreground'
              )}
            >
              <ArrowBigUp className="w-4 h-4" />
              Top
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreatePost(!showCreatePost)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Post
          </Button>
        </div>

        {/* Create Post Form */}
        <AnimatePresence>
          {showCreatePost && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Post title..."
                  className="w-full px-3 py-2 bg-black/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full px-3 py-2 bg-black/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowCreatePost(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleCreatePost}>
                    Post
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-2xl max-h-[80vh] w-full aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Featured sneaker"
                fill
                className="object-contain rounded-lg"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
