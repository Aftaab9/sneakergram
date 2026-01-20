'use client';

import { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterChips } from '@/components/shared/FilterChips';
import { TrendingSneakers } from '@/components/shared/TrendingSneakers';
import { SearchResults } from '@/components/shared/SearchResults';
import { useSearchStore } from '@/stores/searchStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useMemo } from 'react';

/**
 * Explore Page - Search and discovery
 * Displays search bar, filters, trending sneakers, and search results
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
export default function ExplorePage() {
  const router = useRouter();
  const {
    query,
    activeFilter,
    users,
    sneakers,
    posts,
    trendingSneakers,
    setQuery,
    setFilter,
    clearSearch,
  } = useSearchStore();
  const { unreadCount, loadNotifications } = useNotificationStore();

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Filter results based on active filter
  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') {
      return { users, sneakers, posts };
    }
    
    return {
      users: activeFilter === 'users' ? users : [],
      sneakers: activeFilter === 'sneakers' ? sneakers : [],
      posts: activeFilter === 'posts' ? posts : [],
    };
  }, [activeFilter, users, sneakers, posts]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header with notification bell */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            Explore
          </h1>
          
          {/* Notification bell with unread count */}
          <button
            onClick={() => router.push('/notifications')}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell className="w-6 h-6 text-gray-400" />
            
            {/* Unread count badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={clearSearch}
            placeholder="Search users, sneakers, posts..."
          />
        </div>

        {/* Filter Chips */}
        <div className="mb-6">
          <FilterChips
            activeFilter={activeFilter}
            onFilterChange={setFilter}
          />
        </div>

        {/* Trending Section - Show when no search query */}
        {!query && (
          <TrendingSneakers sneakers={trendingSneakers} />
        )}

        {/* Search Results - Show when there's a query */}
        {query && (
          <SearchResults
            users={filteredResults.users}
            sneakers={filteredResults.sneakers}
            posts={filteredResults.posts}
            query={query}
          />
        )}
      </div>
    </div>
  );
}
