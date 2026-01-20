/**
 * Feed Page - Instagram-like home feed
 */

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFeedStore } from '@/stores/feedStore';
import { mockUsers } from '@/lib/mockData';
import { PostCard } from '@/components/feed/PostCard';
import { SneakerPoll } from '@/components/feed/SneakerPoll';
import { SneakerOfTheWeek } from '@/components/feed/SneakerOfTheWeek';
import { ReelsSection } from '@/components/feed/ReelsSection';
import { QuickActions } from '@/components/ui/QuickActions';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getCurrentUser } from '@/stores/authStore';
import { BEST_SNEAKER_IMAGES } from '@/lib/bestImages';

// Stories component - Instagram-like
function Stories() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  
  return (
    <div className="border-b border-border bg-black py-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-4">
        {/* Your Story */}
        <button className="flex flex-col items-center gap-1 min-w-[66px]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-card border-2 border-border overflow-hidden">
              <Image
                src={currentUser?.avatar || mockUsers[0].avatar}
                alt="Your story"
                width={64}
                height={64}
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-black flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>
          <span className="text-xs text-foreground">Your story</span>
        </button>

        {/* Other users' stories */}
        {mockUsers.slice(1, 10).map((user) => (
          <button
            key={user.id}
            onClick={() => router.push(`/profile/${user.username}`)}
            className="flex flex-col items-center gap-1 min-w-[66px]"
          >
            <div className="story-ring">
              <div className="story-ring-inner">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar}
                    alt={user.displayName}
                    width={56}
                    height={56}
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
            <span className="text-xs text-foreground truncate w-16 text-center">
              {user.username.slice(0, 10)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Suggested Users Sidebar - Instagram-like
function SuggestedSidebar() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const suggestedUsers = mockUsers.filter(u => u.id !== currentUser?.id).slice(0, 5);

  return (
    <div className="hidden xl:block w-[320px] pl-8 pt-8">
      {/* Current User */}
      {currentUser && (
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.push('/profile')}
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden">
              <Image
                src={currentUser.avatar}
                alt={currentUser.displayName}
                width={44}
                height={44}
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">{currentUser.username}</p>
              <p className="text-sm text-muted">{currentUser.displayName}</p>
            </div>
          </button>
          <button className="text-xs text-primary font-semibold hover:text-white">
            Switch
          </button>
        </div>
      )}

      {/* Suggested for you */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted">Suggested for you</span>
        <button className="text-xs font-semibold hover:text-muted">See All</button>
      </div>

      {/* Suggested Users List */}
      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
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
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold">{user.username}</p>
                  {user.verified && (
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  )}
                </div>
                <p className="text-xs text-muted">Suggested for you</p>
              </div>
            </button>
            <button className="text-xs text-primary font-semibold hover:text-white">
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-xs text-muted/50 space-y-4">
        <div className="flex flex-wrap gap-x-1 gap-y-1">
          <span>About</span>·<span>Help</span>·<span>Press</span>·<span>API</span>·<span>Jobs</span>·<span>Privacy</span>·<span>Terms</span>
        </div>
        <p>© 2026 SNEAKERGRAM</p>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="bg-black border-b border-border animate-pulse">
      <div className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 rounded-full bg-card" />
        <div className="flex-1">
          <div className="h-3 bg-card rounded w-24" />
        </div>
      </div>
      <div className="aspect-square bg-card" />
      <div className="p-3 space-y-2">
        <div className="flex gap-4">
          <div className="w-6 h-6 bg-card rounded" />
          <div className="w-6 h-6 bg-card rounded" />
          <div className="w-6 h-6 bg-card rounded" />
        </div>
        <div className="h-3 bg-card rounded w-20" />
        <div className="h-3 bg-card rounded w-full" />
      </div>
    </div>
  );
}


export default function FeedPage() {
  const router = useRouter();
  const { posts, loading, loadPosts } = useFeedStore();
  
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [displayedPosts, setDisplayedPosts] = useState<typeof posts>([]);
  const [pollVote, setPollVote] = useState<string | undefined>();
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Poll data
  const pollOptions = [
    { id: '1', sneaker: 'Air Jordan 1 Chicago', image: BEST_SNEAKER_IMAGES.jordanBlackRed, votes: 1247 },
    { id: '2', sneaker: 'Nike Dunk Low Panda', image: BEST_SNEAKER_IMAGES.airForces1, votes: 892 },
    { id: '3', sneaker: 'Yeezy 350 V2 Onyx', image: BEST_SNEAKER_IMAGES.adidasSuperstar, votes: 1534 },
  ];

  const handlePollVote = (optionId: string) => {
    setPollVote(optionId);
    // In real app, send to backend
  };

  useEffect(() => {
    if (posts.length === 0) {
      loadPosts();
    }
  }, [posts.length, loadPosts]);

  useEffect(() => {
    const postsPerPage = 5;
    const endIndex = page * postsPerPage;
    setDisplayedPosts(posts.slice(0, endIndex));
    setHasMore(endIndex < posts.length);
  }, [posts, page]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleIntersection]);


  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-black border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-2xl font-semibold">Sneakergram</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/notifications')}
              className="relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full" />
            </button>
            <button onClick={() => router.push('/messages')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex justify-center">
        <div className="w-full max-w-[630px]">
          {/* Stories */}
          <Stories />

          {/* Posts */}
          <div className="max-w-[470px] mx-auto">
            {loading && displayedPosts.length === 0 && (
              <div className="space-y-0">
                {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {displayedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Sneaker of the Week - Show at top */}
                  {index === 0 && (
                    <div className="px-4 py-2">
                      <SneakerOfTheWeek />
                    </div>
                  )}
                  
                  <PostCard post={post} />
                  
                  {/* Insert Reels after 1st post */}
                  {index === 1 && (
                    <div className="px-4 py-2">
                      <ReelsSection />
                    </div>
                  )}
                  
                  {/* Insert poll after 4th post */}
                  {index === 4 && (
                    <div className="px-4 py-2">
                      <SneakerPoll
                        question="🔥 Sneaker of the Week - Vote Now!"
                        options={pollOptions}
                        totalVotes={pollOptions.reduce((sum, opt) => sum + opt.votes, 0)}
                        userVote={pollVote}
                        onVote={handlePollVote}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {hasMore && displayedPosts.length > 0 && (
              <div ref={observerTarget} className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            )}

            {!hasMore && displayedPosts.length > 0 && (
              <div className="text-center py-8 border-t border-border">
                <p className="text-muted text-sm">You&apos;re all caught up ✓</p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Sidebar - Desktop only */}
        <SuggestedSidebar />
      </div>

      {/* Quick Actions Button */}
      <QuickActions />
    </div>
  );
}
