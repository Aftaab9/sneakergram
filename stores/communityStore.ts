/**
 * Community Store
 * Manages community posts, discussions, and voting (Reddit-like)
 */

import { create } from 'zustand';
import { mockUsers } from '@/lib/mockData';
import { getCurrentUser } from './authStore';

export interface CommunityPost {
  id: string;
  communityId: string;
  userId: string;
  title: string;
  content: string;
  images: string[];
  upvotes: number;
  downvotes: number;
  votedBy: { [userId: string]: 'up' | 'down' };
  comments: CommunityComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  votedBy: { [userId: string]: 'up' | 'down' };
  replies: CommunityComment[];
  createdAt: Date;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  members: number;
  posts: string[];
  createdAt: Date;
}

interface CommunityState {
  communities: Community[];
  posts: CommunityPost[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadCommunities: () => Promise<void>;
  loadPosts: (communityId: string) => Promise<void>;
  createPost: (communityId: string, title: string, content: string, images: string[]) => void;
  votePost: (postId: string, voteType: 'up' | 'down') => void;
  addComment: (postId: string, content: string) => void;
  voteComment: (postId: string, commentId: string, voteType: 'up' | 'down') => void;
  joinCommunity: (communityId: string) => void;
}

// Indian Bridals Community Data
const INDIAN_BRIDALS_COMMUNITY: Community = {
  id: 'indian-bridals',
  name: 'Indian Bridals',
  description: 'Celebrate the fusion of traditional Indian fashion with modern sneaker culture. Share your bridal sneakers, sangeet kicks, and wedding day footwear! 🇮🇳👟💍',
  icon: '/data/best/red ghungroo.jpg',
  banner: '/data/best/sangeet sneakers 1.jpg',
  members: 2847,
  posts: [],
  createdAt: new Date('2024-06-15'),
};

// Initial posts for Indian Bridals community
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    communityId: 'indian-bridals',
    userId: 'user-2',
    title: '🔥 Red Ghungroo Sneakers - Perfect for Sangeet Night!',
    content: 'Just got these custom red ghungroo sneakers made for my sister\'s sangeet! The traditional bells with modern sneaker design is absolutely stunning. The craftsman added real ghungroos that actually jingle when you walk! Perfect for dancing all night. What do you all think?',
    images: ['/data/best/red ghungroo.jpg'],
    upvotes: 156,
    downvotes: 3,
    votedBy: {},
    comments: [
      {
        id: 'comment-1',
        postId: 'post-1',
        userId: 'user-3',
        content: 'OMG these are gorgeous! Where did you get them made? 😍',
        upvotes: 24,
        downvotes: 0,
        votedBy: {},
        replies: [],
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: 'comment-2',
        postId: 'post-1',
        userId: 'user-4',
        content: 'The ghungroo detail is everything! This is the perfect blend of tradition and comfort.',
        upvotes: 18,
        downvotes: 0,
        votedBy: {},
        replies: [],
        createdAt: new Date(Date.now() - 7200000),
      },
    ],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'post-2',
    communityId: 'indian-bridals',
    userId: 'user-5',
    title: 'Sangeet Sneakers Collection - Which one for my wedding?',
    content: 'I\'ve been collecting these sangeet-themed sneakers for months! Can\'t decide which pair to wear for my wedding reception. The gold embroidery one or the mirror work design? Help me choose! Both are super comfortable for dancing.',
    images: ['/data/best/sangeet sneakers 1.jpg', '/data/best/sangeet sneakers 3.jpg', '/data/best/sangeet sneakers.avif'],
    upvotes: 234,
    downvotes: 5,
    votedBy: {},
    comments: [
      {
        id: 'comment-3',
        postId: 'post-2',
        userId: 'user-6',
        content: 'The gold embroidery one is STUNNING! Goes perfectly with a lehenga 💛',
        upvotes: 45,
        downvotes: 2,
        votedBy: {},
        replies: [],
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'post-3',
    communityId: 'indian-bridals',
    userId: 'user-7',
    title: 'Saree Sneakers - Breaking stereotypes one step at a time! 🙌',
    content: 'Who says you can\'t wear sneakers with a saree? These custom designed sneakers match perfectly with my silk saree. Wore them to a wedding last week and got SO many compliments! Comfort + Style = Perfect combo for those 5-hour Indian weddings 😂',
    images: ['/data/best/saree sneakers.avif'],
    upvotes: 312,
    downvotes: 8,
    votedBy: {},
    comments: [
      {
        id: 'comment-4',
        postId: 'post-3',
        userId: 'user-8',
        content: 'This is revolutionary! My feet always hurt at weddings. Need these ASAP!',
        upvotes: 67,
        downvotes: 1,
        votedBy: {},
        replies: [],
        createdAt: new Date(Date.now() - 900000),
      },
      {
        id: 'comment-5',
        postId: 'post-3',
        userId: 'user-9',
        content: 'The color coordination is on point! 🔥',
        upvotes: 34,
        downvotes: 0,
        votedBy: {},
        replies: [],
        createdAt: new Date(Date.now() - 1200000),
      },
    ],
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 259200000),
  },
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  communities: [INDIAN_BRIDALS_COMMUNITY],
  posts: INITIAL_POSTS,
  loading: false,
  error: null,

  loadCommunities: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load communities',
        loading: false 
      });
    }
  },

  loadPosts: async (communityId: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load posts',
        loading: false 
      });
    }
  },

  createPost: (communityId: string, title: string, content: string, images: string[]) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const newPost: CommunityPost = {
      id: `post-${generateId()}`,
      communityId,
      userId: currentUser.id,
      title,
      content,
      images,
      upvotes: 1,
      downvotes: 0,
      votedBy: { [currentUser.id]: 'up' },
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set(state => ({
      posts: [newPost, ...state.posts],
    }));
  },

  votePost: (postId: string, voteType: 'up' | 'down') => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id !== postId) return post;

        const previousVote = post.votedBy[currentUser.id];
        const newVotedBy = { ...post.votedBy };
        let upvotes = post.upvotes;
        let downvotes = post.downvotes;

        // Remove previous vote
        if (previousVote === 'up') upvotes--;
        if (previousVote === 'down') downvotes--;

        // Toggle or add new vote
        if (previousVote === voteType) {
          delete newVotedBy[currentUser.id];
        } else {
          newVotedBy[currentUser.id] = voteType;
          if (voteType === 'up') upvotes++;
          if (voteType === 'down') downvotes++;
        }

        return {
          ...post,
          upvotes,
          downvotes,
          votedBy: newVotedBy,
        };
      }),
    }));
  },

  addComment: (postId: string, content: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const newComment: CommunityComment = {
      id: `comment-${generateId()}`,
      postId,
      userId: currentUser.id,
      content,
      upvotes: 1,
      downvotes: 0,
      votedBy: { [currentUser.id]: 'up' },
      replies: [],
      createdAt: new Date(),
    };

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }),
    }));
  },

  voteComment: (postId: string, commentId: string, voteType: 'up' | 'down') => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    set(state => ({
      posts: state.posts.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id !== commentId) return comment;

            const previousVote = comment.votedBy[currentUser.id];
            const newVotedBy = { ...comment.votedBy };
            let upvotes = comment.upvotes;
            let downvotes = comment.downvotes;

            if (previousVote === 'up') upvotes--;
            if (previousVote === 'down') downvotes--;

            if (previousVote === voteType) {
              delete newVotedBy[currentUser.id];
            } else {
              newVotedBy[currentUser.id] = voteType;
              if (voteType === 'up') upvotes++;
              if (voteType === 'down') downvotes++;
            }

            return {
              ...comment,
              upvotes,
              downvotes,
              votedBy: newVotedBy,
            };
          }),
        };
      }),
    }));
  },

  joinCommunity: (communityId: string) => {
    set(state => ({
      communities: state.communities.map(community => {
        if (community.id !== communityId) return community;
        return {
          ...community,
          members: community.members + 1,
        };
      }),
    }));
  },
}));

// Utility functions
export function getCommunityById(communityId: string): Community | null {
  return useCommunityStore.getState().communities.find(c => c.id === communityId) || null;
}

export function getPostsByCommunity(communityId: string): CommunityPost[] {
  return useCommunityStore.getState().posts.filter(p => p.communityId === communityId);
}
