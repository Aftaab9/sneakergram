'use client';

import { User, Sneaker, Post, VerificationLevel } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Heart, MessageCircle } from 'lucide-react';

interface SearchResultsProps {
  users: User[];
  sneakers: Sneaker[];
  posts: Post[];
  query: string;
}

// Map verification level to badge variant
function getVerificationBadgeVariant(level: VerificationLevel): 'info' | 'success' | 'warning' {
  switch (level) {
    case VerificationLevel.EMAIL:
      return 'info';
    case VerificationLevel.ID:
      return 'success';
    case VerificationLevel.GOLD:
      return 'warning';
    default:
      return 'info';
  }
}

/**
 * SearchResults component displaying grouped results
 * Groups results by users, sneakers, and posts
 */
export function SearchResults({ users, sneakers, posts, query }: SearchResultsProps) {
  const router = useRouter();

  const hasResults = users.length > 0 || sneakers.length > 0 || posts.length > 0;

  if (!query) {
    return null;
  }

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No results found for &quot;{query}&quot;</p>
        <p className="text-sm text-gray-500 mt-2">Try different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users Section */}
      {users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3">Users</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => router.push(`/profile/${user.username}`)}
                className="
                  flex items-center gap-3 p-3
                  bg-card border border-border rounded-lg
                  hover:border-primary cursor-pointer
                  transition-all duration-200
                "
              >
                <Avatar
                  src={user.avatar}
                  alt={user.displayName}
                  size="md"
                  verified={user.verified}
                  verificationLevel={user.verificationLevel}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white truncate">
                      {user.displayName}
                    </p>
                    {user.verified && (
                      <Badge variant={getVerificationBadgeVariant(user.verificationLevel)} size="sm" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{user.followers} followers</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Sneakers Section */}
      {sneakers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3">Sneakers</h3>
          <div className="grid grid-cols-2 gap-3">
            {sneakers.map((sneaker) => (
              <div
                key={sneaker.id}
                onClick={() => router.push(`/sneaker/${sneaker.id}`)}
                className="
                  bg-card border border-border rounded-lg
                  overflow-hidden hover:border-primary
                  cursor-pointer transition-all duration-200
                "
              >
                <div className="relative aspect-square bg-gray-900">
                  <Image
                    src={sneaker.images[0]}
                    alt={sneaker.model}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-1">{sneaker.brand}</p>
                  <p className="text-sm font-semibold text-white line-clamp-2">
                    {sneaker.model}
                  </p>
                  <p className="text-sm text-primary mt-1">
                    ${sneaker.marketValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Posts Section */}
      {posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3">Posts</h3>
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => router.push(`/feed`)}
                className="
                  relative aspect-square bg-gray-900
                  rounded-lg overflow-hidden
                  cursor-pointer group
                "
              >
                <Image
                  src={post.images[0]}
                  alt="Post"
                  fill
                  className="object-cover"
                />
                <div className="
                  absolute inset-0 bg-black/50 opacity-0
                  group-hover:opacity-100 transition-opacity
                  flex items-center justify-center gap-4
                ">
                  <div className="flex items-center gap-1 text-white text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
