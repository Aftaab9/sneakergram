/**
 * Posts API Adapter
 * Provides abstraction layer for posts data access
 */

import { Post, CreatePostInput, Comment } from '@/types';
import { mockPosts } from '../mockData';

// API Interface
export interface PostsAPI {
  getPosts(): Promise<Post[]>;
  getPostById(postId: string): Promise<Post | null>;
  createPost(post: CreatePostInput, userId: string): Promise<Post>;
  likePost(postId: string, userId: string): Promise<void>;
  unlikePost(postId: string, userId: string): Promise<void>;
  addComment(postId: string, userId: string, text: string): Promise<Comment>;
  deletePost(postId: string): Promise<void>;
}

// Mock Implementation
class MockPostsAPI implements PostsAPI {
  private posts: Post[] = [...mockPosts];

  async getPosts(): Promise<Post[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPostById(postId: string): Promise<Post | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.posts.find(p => p.id === postId) || null;
  }

  async createPost(input: CreatePostInput, userId: string): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId,
      type: input.type,
      images: input.images,
      caption: input.caption,
      sneakerTags: input.sneakerTags,
      likes: 0,
      comments: [],
      likedBy: [],
      savedBy: [],
      canBid: input.canBid || false,
      bidSneakerId: input.bidSneakerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  async likePost(postId: string, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const post = this.posts.find(p => p.id === postId);
    if (post && !post.likedBy.includes(userId)) {
      post.likes++;
      post.likedBy.push(userId);
      post.updatedAt = new Date();
    }
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const post = this.posts.find(p => p.id === postId);
    if (post && post.likedBy.includes(userId)) {
      post.likes--;
      post.likedBy = post.likedBy.filter(id => id !== userId);
      post.updatedAt = new Date();
    }
  }

  async addComment(postId: string, userId: string, text: string): Promise<Comment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      userId,
      text,
      createdAt: new Date(),
    };

    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.comments.push(comment);
      post.updatedAt = new Date();
    }

    return comment;
  }

  async deletePost(postId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.posts = this.posts.filter(p => p.id !== postId);
  }
}

// Export current implementation
export const postsAPI: PostsAPI = new MockPostsAPI();
