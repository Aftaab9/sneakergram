import { create } from 'zustand';
import { User, Sneaker, Post } from '@/types';
import { mockUsers, mockSneakers, mockPosts } from '@/lib/mockData';
import { debounce } from '@/lib/performance';

export type FilterOption = 'all' | 'users' | 'sneakers' | 'posts';

interface SearchState {
  query: string;
  activeFilter: FilterOption;
  users: User[];
  sneakers: Sneaker[];
  posts: Post[];
  trendingSneakers: Sneaker[];
  isSearching: boolean;
  
  setQuery: (query: string) => void;
  setFilter: (filter: FilterOption) => void;
  search: (query: string) => void;
  clearSearch: () => void;
}

// Create debounced search function outside the store
const performSearch = (query: string, set: (partial: Partial<SearchState>) => void) => {
  if (!query.trim()) {
    set({ users: [], sneakers: [], posts: [], isSearching: false });
    return;
  }
  
  set({ isSearching: true });
  
  const searchTerm = query.toLowerCase();
  
  // Search users
  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm) ||
    user.displayName.toLowerCase().includes(searchTerm) ||
    user.bio.toLowerCase().includes(searchTerm)
  );
  
  // Search sneakers
  const filteredSneakers = mockSneakers.filter(sneaker =>
    sneaker.brand.toLowerCase().includes(searchTerm) ||
    sneaker.model.toLowerCase().includes(searchTerm) ||
    sneaker.colorway.toLowerCase().includes(searchTerm) ||
    sneaker.description.toLowerCase().includes(searchTerm)
  );
  
  // Search posts
  const filteredPosts = mockPosts.filter(post =>
    post.caption.toLowerCase().includes(searchTerm) ||
    post.sneakerTags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
  
  set({
    users: filteredUsers,
    sneakers: filteredSneakers,
    posts: filteredPosts,
    isSearching: false,
  });
};

// Debounce the search with 300ms delay
const debouncedSearch = debounce(
  (query: unknown, set: unknown) => {
    performSearch(query as string, set as (partial: Partial<SearchState>) => void);
  },
  300
);

/**
 * Search Store
 * Manages search state and filtering logic with debounced search
 */
export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  activeFilter: 'all',
  users: [],
  sneakers: [],
  posts: [],
  trendingSneakers: mockSneakers
    .sort((a, b) => b.ownedByUsers - a.ownedByUsers)
    .slice(0, 10),
  isSearching: false,
  
  setQuery: (query: string) => {
    set({ query });
    // Use debounced search to avoid excessive filtering
    debouncedSearch(query, set);
  },
  
  setFilter: (filter: FilterOption) => {
    set({ activeFilter: filter });
  },
  
  search: (query: string) => {
    performSearch(query, set);
  },
  
  clearSearch: () => {
    set({
      query: '',
      users: [],
      sneakers: [],
      posts: [],
      isSearching: false,
    });
  },
}));
