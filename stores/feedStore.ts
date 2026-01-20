/**
 * Feed Store
 * Manages feed state, posts, and social interactions
 */

import { create } from 'zustand';
import { Post, Comment } from '@/types';
import { mockPosts, getUserById, getSneakerById } from '@/lib/mockData';
import { getCurrentUser } from './authStore';

interface FeedState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadPosts: () => Promise<void>;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  createPost: (post: Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'savedBy' | 'comments'>) => void;
  refreshFeed: () => Promise<void>;
}

/**
 * Generate a unique post ID
 */
function generatePostId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique comment ID
 */
function generateCommentId(): string {
  return `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Feed Store
 * Manages posts and social interactions
 */
export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  /**
   * Load posts from mock data
   */
  loadPosts: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Load posts and sort by date (newest first)
      const posts = [...mockPosts].sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      );
      
      set({ posts, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load posts',
        loading: false 
      });
    }
  },

  /**
   * Like a post
   * Property 6: Like button toggles state
   * Validates: Requirements 3.4
   */
  likePost: (postId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId && !post.likedBy.includes(currentUser.id)) {
          return {
            ...post,
            likes: post.likes + 1,
            likedBy: [...post.likedBy, currentUser.id],
          };
        }
        return post;
      }),
    }));
  },

  /**
   * Unlike a post
   * Property 6: Like button toggles state
   * Validates: Requirements 3.4
   */
  unlikePost: (postId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId && post.likedBy.includes(currentUser.id)) {
          return {
            ...post,
            likes: Math.max(0, post.likes - 1),
            likedBy: post.likedBy.filter(id => id !== currentUser.id),
          };
        }
        return post;
      }),
    }));
  },

  /**
   * Toggle like state on a post
   * Property 6: Like button toggles state
   * Validates: Requirements 3.4
   */
  toggleLike: (postId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const post = get().posts.find(p => p.id === postId);
    if (!post) return;

    if (post.likedBy.includes(currentUser.id)) {
      get().unlikePost(postId);
    } else {
      get().likePost(postId);
    }
  },

  /**
   * Add a comment to a post
   */
  addComment: (postId: string, text: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const newComment: Comment = {
      id: generateCommentId(),
      postId,
      userId: currentUser.id,
      text,
      createdAt: new Date(),
    };

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      }),
    }));
  },

  /**
   * Save a post
   */
  savePost: (postId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId && !post.savedBy.includes(currentUser.id)) {
          return {
            ...post,
            savedBy: [...post.savedBy, currentUser.id],
          };
        }
        return post;
      }),
    }));
  },

  /**
   * Unsave a post
   */
  unsavePost: (postId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id === postId && post.savedBy.includes(currentUser.id)) {
          return {
            ...post,
            savedBy: post.savedBy.filter(id => id !== currentUser.id),
          };
        }
        return post;
      }),
    }));
  },

  /**
   * Create a new post
   */
  createPost: (postData) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const newPost: Post = {
      ...postData,
      userId: currentUser.id,
      id: generatePostId(),
      likes: 0,
      likedBy: [],
      savedBy: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set(state => ({
      posts: [newPost, ...state.posts],
    }));
  },

  /**
   * Refresh feed (reload posts)
   */
  refreshFeed: async () => {
    await get().loadPosts();
  },
}));

/**
 * Utility function to get post by ID
 */
export function getPostById(postId: string): Post | null {
  return useFeedStore.getState().posts.find(p => p.id === postId) || null;
}

/**
 * Utility function to check if current user liked a post
 */
export function isPostLikedByCurrentUser(postId: string): boolean {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const post = getPostById(postId);
  return post ? post.likedBy.includes(currentUser.id) : false;
}

/**
 * Utility function to check if current user saved a post
 */
export function isPostSavedByCurrentUser(postId: string): boolean {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const post = getPostById(postId);
  return post ? post.savedBy.includes(currentUser.id) : false;
}

/**
 * Utility function to get enriched post data with user and sneaker info
 */
export function getEnrichedPost(postId: string) {
  const post = getPostById(postId);
  if (!post) return null;

  const user = getUserById(post.userId);
  const sneakers = post.sneakerTags.map(id => getSneakerById(id)).filter(Boolean);

  return {
    post,
    user,
    sneakers,
  };
}
