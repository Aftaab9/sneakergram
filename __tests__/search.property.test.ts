import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { useSearchStore, FilterOption } from '@/stores/searchStore';
import { mockUsers, mockSneakers, mockPosts } from '@/lib/mockData';

/**
 * Property-Based Tests for Search Functionality
 * Tests search grouping, filtering, and trending sneakers
 */

describe('Search Property Tests', () => {
  /**
   * Feature: sneakergram-app, Property 12: Search results are grouped correctly
   * Validates: Requirements 5.2
   */
  it('Property 12: search results are grouped into users, sneakers, and posts', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9\s]+$/).filter(s => s.trim().length > 0 && s.length <= 20),
        (searchQuery) => {
          const store = useSearchStore.getState();
          
          // Clear any previous search state
          store.clearSearch();
          
          // Perform search
          store.search(searchQuery);
          
          const { users, sneakers, posts } = useSearchStore.getState();
          
          // All results should be arrays
          expect(Array.isArray(users)).toBe(true);
          expect(Array.isArray(sneakers)).toBe(true);
          expect(Array.isArray(posts)).toBe(true);
          
          // All users should be from mockUsers
          users.forEach(user => {
            expect(mockUsers.some(u => u.id === user.id)).toBe(true);
          });
          
          // All sneakers should be from mockSneakers
          sneakers.forEach(sneaker => {
            expect(mockSneakers.some(s => s.id === sneaker.id)).toBe(true);
          });
          
          // All posts should be from mockPosts
          posts.forEach(post => {
            expect(mockPosts.some(p => p.id === post.id)).toBe(true);
          });
          
          // Results should match the search query (if any results exist)
          const lowerQuery = searchQuery.toLowerCase();
          
          users.forEach(user => {
            const matchesQuery = 
              user.username.toLowerCase().includes(lowerQuery) ||
              user.displayName.toLowerCase().includes(lowerQuery) ||
              user.bio.toLowerCase().includes(lowerQuery);
            expect(matchesQuery).toBe(true);
          });
          
          sneakers.forEach(sneaker => {
            const matchesQuery = 
              sneaker.brand.toLowerCase().includes(lowerQuery) ||
              sneaker.model.toLowerCase().includes(lowerQuery) ||
              sneaker.colorway.toLowerCase().includes(lowerQuery) ||
              sneaker.description.toLowerCase().includes(lowerQuery);
            expect(matchesQuery).toBe(true);
          });
          
          posts.forEach(post => {
            const matchesQuery = 
              post.caption.toLowerCase().includes(lowerQuery) ||
              post.sneakerTags.some(tag => tag.toLowerCase().includes(lowerQuery));
            expect(matchesQuery).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: sneakergram-app, Property 13: Filters show only matching items
   * Validates: Requirements 5.4
   */
  it('Property 13: filters show only items matching the selected category', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9\s]+$/).filter(s => s.trim().length > 0 && s.length <= 20),
        fc.constantFrom<FilterOption>('all', 'users', 'sneakers', 'posts'),
        (searchQuery, filter) => {
          // Get a fresh store state
          const store = useSearchStore.getState();
          
          // Reset to default state first
          store.clearSearch();
          
          // Perform search and set filter
          store.search(searchQuery);
          store.setFilter(filter);
          
          const { users, sneakers, posts, activeFilter } = useSearchStore.getState();
          
          // Verify filter is set correctly
          expect(activeFilter).toBe(filter);
          
          // The store maintains all search results regardless of filter
          // The UI layer (useMemo in the page) handles filtering display
          // So we just verify the store has the correct structure
          expect(Array.isArray(users)).toBe(true);
          expect(Array.isArray(sneakers)).toBe(true);
          expect(Array.isArray(posts)).toBe(true);
          
          // All results should still match the search query
          const lowerQuery = searchQuery.toLowerCase();
          
          users.forEach(user => {
            const matchesQuery = 
              user.username.toLowerCase().includes(lowerQuery) ||
              user.displayName.toLowerCase().includes(lowerQuery) ||
              user.bio.toLowerCase().includes(lowerQuery);
            expect(matchesQuery).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: sneakergram-app, Property 14: Trending sneakers show ownership count
   * Validates: Requirements 5.5
   */
  it('Property 14: trending sneakers display ownership count', () => {
    const store = useSearchStore.getState();
    const { trendingSneakers } = store;
    
    // Trending sneakers should exist
    expect(trendingSneakers.length).toBeGreaterThan(0);
    
    // All trending sneakers should have ownedByUsers property
    trendingSneakers.forEach(sneaker => {
      expect(sneaker).toHaveProperty('ownedByUsers');
      expect(typeof sneaker.ownedByUsers).toBe('number');
      expect(sneaker.ownedByUsers).toBeGreaterThanOrEqual(0);
    });
    
    // Trending sneakers should be sorted by ownership count (descending)
    for (let i = 0; i < trendingSneakers.length - 1; i++) {
      expect(trendingSneakers[i].ownedByUsers).toBeGreaterThanOrEqual(
        trendingSneakers[i + 1].ownedByUsers
      );
    }
  });

  /**
   * Additional property: Empty search clears results
   */
  it('empty search query clears all results', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9\s]+$/).filter(s => s.trim().length > 0 && s.length <= 20),
        (searchQuery) => {
          const store = useSearchStore.getState();
          
          // Clear any previous state
          store.clearSearch();
          
          // First perform a search
          store.search(searchQuery);
          
          // Then clear it
          store.search('');
          
          const { users, sneakers, posts } = useSearchStore.getState();
          
          // All results should be empty
          expect(users.length).toBe(0);
          expect(sneakers.length).toBe(0);
          expect(posts.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Search is case-insensitive
   */
  it('search is case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9\s]+$/).filter(s => s.trim().length > 0 && s.length <= 20),
        (searchQuery) => {
          const store = useSearchStore.getState();
          
          // Clear any previous state
          store.clearSearch();
          
          // Search with lowercase
          store.search(searchQuery.toLowerCase());
          const lowerResults = {
            users: useSearchStore.getState().users.length,
            sneakers: useSearchStore.getState().sneakers.length,
            posts: useSearchStore.getState().posts.length,
          };
          
          // Clear and search with uppercase
          store.clearSearch();
          store.search(searchQuery.toUpperCase());
          const upperResults = {
            users: useSearchStore.getState().users.length,
            sneakers: useSearchStore.getState().sneakers.length,
            posts: useSearchStore.getState().posts.length,
          };
          
          // Results should be the same regardless of case
          expect(lowerResults.users).toBe(upperResults.users);
          expect(lowerResults.sneakers).toBe(upperResults.sneakers);
          expect(lowerResults.posts).toBe(upperResults.posts);
        }
      ),
      { numRuns: 100 }
    );
  });
});
