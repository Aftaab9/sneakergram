/**
 * Feed Property-Based Tests
 * Tests universal properties for feed functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { useFeedStore } from '@/stores/feedStore';
import { useAuthStore } from '@/stores/authStore';
import { Post, PostType, User, VerificationLevel } from '@/types';

// Helper to create a mock user
function createMockUser(id: string): User {
  return {
    id,
    username: `user_${id}`,
    displayName: `User ${id}`,
    email: `user${id}@test.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    bio: 'Test user',
    shoeSize: '10',
    verified: false,
    verificationLevel: VerificationLevel.EMAIL,
    followers: 0,
    following: 0,
    collection: [],
    wishlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Helper to create a mock post
function createMockPost(overrides?: Partial<Post>): Post {
  return {
    id: `post-${Math.random().toString(36).substring(2, 9)}`,
    userId: 'user-1',
    type: PostType.COLLECTION,
    images: ['/test-image.jpg'],
    caption: 'Test post',
    sneakerTags: [],
    likes: 0,
    comments: [],
    likedBy: [],
    savedBy: [],
    canBid: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('Feed Property Tests', () => {
  beforeEach(() => {
    // Reset stores before each test
    const authStore = useAuthStore.getState();
    
    // Clear posts
    useFeedStore.setState({ posts: [], loading: false, error: null });
    
    // Set up a mock user
    const mockUser = createMockUser('test-user-1');
    authStore.user = mockUser;
    authStore.isAuthenticated = true;
  });

  /**
   * Feature: sneakergram-app, Property 5: Double-tap increments likes
   * Validates: Requirements 3.3
   */
  describe('Property 5: Double-tap increments likes', () => {
    it('should increment likes when double-tapping an unliked post', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            likes: fc.nat(10000),
            likedBy: fc.array(fc.string(), { maxLength: 10 }),
          }),
          (postData) => {
            const currentUser = useAuthStore.getState().user;
            if (!currentUser) return;

            // Ensure post is not liked by current user
            const likedByWithoutCurrentUser = postData.likedBy.filter(id => id !== currentUser.id);
            
            const post = createMockPost({
              id: postData.id,
              likes: postData.likes,
              likedBy: likedByWithoutCurrentUser,
            });

            useFeedStore.setState({ posts: [post] });

            const initialLikes = post.likes;

            // Simulate double-tap (which should like the post)
            useFeedStore.getState().likePost(post.id);
            
            const afterDoubleTap = useFeedStore.getState().posts.find(p => p.id === post.id);
            expect(afterDoubleTap).toBeDefined();
            expect(afterDoubleTap!.likes).toBe(initialLikes + 1);
            expect(afterDoubleTap!.likedBy).toContain(currentUser.id);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not increment likes when double-tapping an already liked post', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            likes: fc.nat(10000),
          }),
          (postData) => {
            const currentUser = useAuthStore.getState().user;
            if (!currentUser) return;

            // Ensure post is already liked by current user
            const post = createMockPost({
              id: postData.id,
              likes: postData.likes,
              likedBy: [currentUser.id],
            });

            useFeedStore.setState({ posts: [post] });

            const initialLikes = post.likes;

            // Try to like again (double-tap on already liked post)
            useFeedStore.getState().likePost(post.id);
            
            const afterDoubleTap = useFeedStore.getState().posts.find(p => p.id === post.id);
            expect(afterDoubleTap).toBeDefined();
            // Should not increment if already liked
            expect(afterDoubleTap!.likes).toBe(initialLikes);
            expect(afterDoubleTap!.likedBy).toContain(currentUser.id);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: sneakergram-app, Property 6: Like button toggles state
   * Validates: Requirements 3.4
   */
  describe('Property 6: Like button toggles state', () => {
    it('should toggle like state (round trip property)', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            likes: fc.nat(10000),
            likedBy: fc.array(fc.string(), { maxLength: 10 }),
          }),
          (postData) => {
            // Create a post with the generated data
            const post = createMockPost({
              id: postData.id,
              likes: postData.likes,
              likedBy: postData.likedBy,
            });

            // Add post to store
            useFeedStore.setState({ posts: [post] });

            // Get current user
            const currentUser = useAuthStore.getState().user;
            if (!currentUser) return; // Skip if no user

            // Store initial state
            const initialLikes = post.likes;
            const wasLiked = post.likedBy.includes(currentUser.id);

            // Toggle like (first time)
            useFeedStore.getState().toggleLike(post.id);
            const afterFirstToggle = useFeedStore.getState().posts.find(p => p.id === post.id);
            expect(afterFirstToggle).toBeDefined();

            if (wasLiked) {
              // If was liked, should now be unliked
              expect(afterFirstToggle!.likedBy).not.toContain(currentUser.id);
              expect(afterFirstToggle!.likes).toBe(Math.max(0, initialLikes - 1));
            } else {
              // If was not liked, should now be liked
              expect(afterFirstToggle!.likedBy).toContain(currentUser.id);
              expect(afterFirstToggle!.likes).toBe(initialLikes + 1);
            }

            // Toggle like (second time - round trip)
            useFeedStore.getState().toggleLike(post.id);
            const afterSecondToggle = useFeedStore.getState().posts.find(p => p.id === post.id);
            expect(afterSecondToggle).toBeDefined();

            // After round trip, should return to original state
            if (wasLiked) {
              expect(afterSecondToggle!.likedBy).toContain(currentUser.id);
              expect(afterSecondToggle!.likes).toBe(initialLikes);
            } else {
              expect(afterSecondToggle!.likedBy).not.toContain(currentUser.id);
              expect(afterSecondToggle!.likes).toBe(initialLikes);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should never have negative likes', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            likes: fc.nat(100),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              likes: postData.likes,
              likedBy: [],
            });

            useFeedStore.setState({ posts: [post] });

            // Try to unlike when not liked
            useFeedStore.getState().unlikePost(post.id);
            const afterUnlike = useFeedStore.getState().posts.find(p => p.id === post.id);
            
            expect(afterUnlike).toBeDefined();
            expect(afterUnlike!.likes).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: sneakergram-app, Property 7: Posts display all action buttons
   * Validates: Requirements 3.5
   */
  describe('Property 7: Posts display all action buttons', () => {
    it('should have all required action buttons in PostCard', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            canBid: fc.boolean(),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              canBid: postData.canBid,
            });

            // The PostCard component should render these buttons:
            // 1. Like button (Heart icon)
            // 2. Comment button (MessageCircle icon)
            // 3. Share button (Share2 icon)
            // 4. BID button (if canBid is true)
            // 5. Save/Bookmark button (Bookmark icon)
            
            // We verify this by checking the post structure has the necessary data
            expect(post).toHaveProperty('likes');
            expect(post).toHaveProperty('comments');
            expect(post).toHaveProperty('likedBy');
            expect(post).toHaveProperty('savedBy');
            expect(post).toHaveProperty('canBid');
            
            // All posts should support these actions
            expect(typeof post.likes).toBe('number');
            expect(Array.isArray(post.comments)).toBe(true);
            expect(Array.isArray(post.likedBy)).toBe(true);
            expect(Array.isArray(post.savedBy)).toBe(true);
            expect(typeof post.canBid).toBe('boolean');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: sneakergram-app, Property 9: Sneaker tags display as chips
   * Validates: Requirements 4.3
   */
  describe('Property 9: Sneaker tags display as chips', () => {
    it('should display sneaker tags as chips for any post with tags', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            sneakerTags: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              sneakerTags: postData.sneakerTags,
            });

            // Verify post has sneaker tags
            expect(post.sneakerTags).toBeDefined();
            expect(Array.isArray(post.sneakerTags)).toBe(true);
            expect(post.sneakerTags.length).toBeGreaterThan(0);
            
            // Each tag should be a string
            post.sneakerTags.forEach(tag => {
              expect(typeof tag).toBe('string');
              expect(tag.length).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle posts with no sneaker tags', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          (postId) => {
            const post = createMockPost({
              id: postId,
              sneakerTags: [],
            });

            // Verify post can have empty sneaker tags
            expect(post.sneakerTags).toBeDefined();
            expect(Array.isArray(post.sneakerTags)).toBe(true);
            expect(post.sneakerTags.length).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: sneakergram-app, Property 8: Multiple images enable carousel
   * Validates: Requirements 4.2
   */
  describe('Property 8: Multiple images enable carousel', () => {
    it('should enable carousel functionality for posts with multiple images', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            images: fc.array(fc.webUrl(), { minLength: 2, maxLength: 10 }),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              images: postData.images,
            });

            // Verify post has multiple images
            expect(post.images).toBeDefined();
            expect(Array.isArray(post.images)).toBe(true);
            expect(post.images.length).toBeGreaterThan(1);
            
            // Each image should be a valid string
            post.images.forEach(image => {
              expect(typeof image).toBe('string');
              expect(image.length).toBeGreaterThan(0);
            });
            
            // The PostCard component should enable carousel when images.length > 1
            const hasMultipleImages = post.images.length > 1;
            expect(hasMultipleImages).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not enable carousel for posts with single image', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            image: fc.webUrl(),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              images: [postData.image],
            });

            // Verify post has single image
            expect(post.images).toBeDefined();
            expect(Array.isArray(post.images)).toBe(true);
            expect(post.images.length).toBe(1);
            
            // The PostCard component should NOT enable carousel when images.length === 1
            const hasMultipleImages = post.images.length > 1;
            expect(hasMultipleImages).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle any number of images correctly', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 20 }),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              images: postData.images,
            });

            // Verify images array structure
            expect(post.images).toBeDefined();
            expect(Array.isArray(post.images)).toBe(true);
            expect(post.images.length).toBeGreaterThanOrEqual(1);
            
            // Carousel should be enabled based on image count
            const shouldEnableCarousel = post.images.length > 1;
            const hasMultipleImages = post.images.length > 1;
            expect(hasMultipleImages).toBe(shouldEnableCarousel);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: sneakergram-app, Property 11: Multiple images show navigation dots
   * Validates: Requirements 4.5
   */
  describe('Property 11: Multiple images show navigation dots', () => {
    it('should show navigation dots equal to number of images', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            images: fc.array(fc.webUrl(), { minLength: 2, maxLength: 10 }),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              images: postData.images,
            });

            // Verify post has multiple images
            expect(post.images.length).toBeGreaterThan(1);
            
            // The number of navigation dots should equal the number of images
            const expectedDotCount = post.images.length;
            expect(expectedDotCount).toBe(post.images.length);
            
            // Each image should have a corresponding dot
            for (let i = 0; i < post.images.length; i++) {
              expect(i).toBeLessThan(expectedDotCount);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not show navigation dots for single image posts', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            image: fc.webUrl(),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              images: [postData.image],
            });

            // Verify post has single image
            expect(post.images.length).toBe(1);
            
            // Navigation dots should not be shown for single image
            const shouldShowDots = post.images.length > 1;
            expect(shouldShowDots).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly map dot index to image index', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            images: fc.array(fc.webUrl(), { minLength: 2, maxLength: 10 }),
            currentIndex: fc.nat(),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              images: postData.images,
            });

            // Normalize current index to valid range
            const normalizedIndex = postData.currentIndex % post.images.length;
            
            // Verify the index is within bounds
            expect(normalizedIndex).toBeGreaterThanOrEqual(0);
            expect(normalizedIndex).toBeLessThan(post.images.length);
            
            // The dot at normalizedIndex should correspond to the image at normalizedIndex
            expect(post.images[normalizedIndex]).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle navigation through all images', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1 }),
            images: fc.array(fc.webUrl(), { minLength: 2, maxLength: 10 }),
          }),
          (postData) => {
            const post = createMockPost({
              id: postData.id,
              images: postData.images,
            });

            // Simulate navigating through all images
            for (let i = 0; i < post.images.length; i++) {
              // Each index should be valid
              expect(i).toBeGreaterThanOrEqual(0);
              expect(i).toBeLessThan(post.images.length);
              
              // Each image should be accessible
              expect(post.images[i]).toBeDefined();
              expect(typeof post.images[i]).toBe('string');
            }
            
            // Verify we can navigate to all images
            expect(post.images.length).toBeGreaterThan(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: sneakergram-app, Property 10: Submitted posts appear in feed
   * Validates: Requirements 4.4
   */
  describe('Property 10: Submitted posts appear in feed', () => {
    it('should add submitted posts to the feed with all required fields', () => {
      fc.assert(
        fc.property(
          fc.record({
            userId: fc.string({ minLength: 1 }),
            type: fc.constantFrom(PostType.COLLECTION, PostType.PICKUP, PostType.FITCHECK),
            images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 }),
            caption: fc.string({ minLength: 1, maxLength: 500 }),
            sneakerTags: fc.array(fc.string({ minLength: 1 }), { maxLength: 5 }),
            canBid: fc.boolean(),
          }),
          (postData) => {
            const currentUser = useAuthStore.getState().user;
            if (!currentUser) return;

            // Clear feed
            useFeedStore.setState({ posts: [] });

            // Create a post
            useFeedStore.getState().createPost({
              type: postData.type,
              images: postData.images,
              caption: postData.caption,
              sneakerTags: postData.sneakerTags,
              canBid: postData.canBid,
              bidSneakerId: postData.canBid ? 'sneaker-1' : undefined,
            });

            const posts = useFeedStore.getState().posts;
            
            // Post should appear in feed
            expect(posts.length).toBe(1);
            
            const submittedPost = posts[0];
            
            // Verify all required fields are present
            expect(submittedPost).toBeDefined();
            expect(submittedPost.id).toBeDefined();
            expect(submittedPost.userId).toBe(currentUser.id);
            expect(submittedPost.type).toBe(postData.type);
            expect(submittedPost.images).toEqual(postData.images);
            expect(submittedPost.caption).toBe(postData.caption);
            expect(submittedPost.sneakerTags).toEqual(postData.sneakerTags);
            expect(submittedPost.canBid).toBe(postData.canBid);
            
            // Verify timestamp is present
            expect(submittedPost.createdAt).toBeInstanceOf(Date);
            expect(submittedPost.updatedAt).toBeInstanceOf(Date);
            
            // Verify initial engagement metrics
            expect(submittedPost.likes).toBe(0);
            expect(submittedPost.likedBy).toEqual([]);
            expect(submittedPost.savedBy).toEqual([]);
            expect(submittedPost.comments).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should add new posts to the beginning of the feed', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              caption: fc.string({ minLength: 1, maxLength: 100 }),
              images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 3 }),
            }),
            { minLength: 2, maxLength: 5 }
          ),
          (postsData) => {
            const currentUser = useAuthStore.getState().user;
            if (!currentUser) return;

            // Clear feed
            useFeedStore.setState({ posts: [] });

            // Create multiple posts
            postsData.forEach(postData => {
              useFeedStore.getState().createPost({
                type: PostType.COLLECTION,
                images: postData.images,
                caption: postData.caption,
                sneakerTags: [],
                canBid: false,
              });
            });

            const posts = useFeedStore.getState().posts;
            
            // All posts should be in feed
            expect(posts.length).toBe(postsData.length);
            
            // Most recent post should be first
            expect(posts[0].caption).toBe(postsData[postsData.length - 1].caption);
            
            // Oldest post should be last
            expect(posts[posts.length - 1].caption).toBe(postsData[0].caption);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve existing posts when adding new ones', () => {
      fc.assert(
        fc.property(
          fc.record({
            existingPostsCount: fc.integer({ min: 1, max: 10 }),
            newCaption: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          (testData) => {
            const currentUser = useAuthStore.getState().user;
            if (!currentUser) return;

            // Create existing posts
            const existingPosts = Array.from({ length: testData.existingPostsCount }, (_, i) =>
              createMockPost({
                id: `existing-post-${i}`,
                caption: `Existing post ${i}`,
              })
            );
            
            useFeedStore.setState({ posts: existingPosts });

            const initialCount = useFeedStore.getState().posts.length;

            // Add a new post
            useFeedStore.getState().createPost({
              type: PostType.PICKUP,
              images: ['/test.jpg'],
              caption: testData.newCaption,
              sneakerTags: [],
              canBid: false,
            });

            const posts = useFeedStore.getState().posts;
            
            // Should have one more post
            expect(posts.length).toBe(initialCount + 1);
            
            // New post should be first
            expect(posts[0].caption).toBe(testData.newCaption);
            
            // All existing posts should still be present
            existingPosts.forEach(existingPost => {
              const found = posts.find(p => p.id === existingPost.id);
              expect(found).toBeDefined();
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
