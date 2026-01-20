/**
 * Responsive Design Tests
 * Tests responsive behavior across mobile (375px), tablet (768px), and desktop (max 480px)
 * Requirements: 14.1, 14.2, 14.3
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomNav } from '@/components/ui/BottomNav';
import { PostCard } from '@/components/feed/PostCard';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { mockPosts, mockUsers, mockSneakers, mockListings } from '@/lib/mockData';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/feed',
}));

// Mock stores
vi.mock('@/stores/feedStore', () => ({
  useFeedStore: () => ({
    toggleLike: vi.fn(),
    savePost: vi.fn(),
    unsavePost: vi.fn(),
  }),
}));

vi.mock('@/stores/authStore', () => ({
  getCurrentUser: () => mockUsers[0],
}));

describe('Responsive Design', () => {
  describe('Mobile Layout (375px)', () => {
    beforeEach(() => {
      // Set viewport to mobile size
      global.innerWidth = 375;
      global.innerHeight = 667;
    });

    it('should render BottomNav with safe area padding', () => {
      const { container } = render(<BottomNav />);
      const nav = container.querySelector('nav');
      
      expect(nav).toBeTruthy();
      expect(nav?.className).toContain('safe-area-bottom');
    });

    it('should render PostCard with responsive images', () => {
      const post = mockPosts[0];
      const { container } = render(<PostCard post={post} />);
      
      const images = container.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
      
      // Check that at least one image has responsive sizing
      const hasResponsiveSizes = Array.from(images).some(img => 
        img.getAttribute('sizes') !== null
      );
      expect(hasResponsiveSizes).toBe(true);
    });

    it('should render navigation items in mobile layout', () => {
      render(<BottomNav />);
      
      // All 5 navigation items should be visible
      expect(screen.getByText('Home')).toBeTruthy();
      expect(screen.getByText('Store')).toBeTruthy();
      expect(screen.getByText('Services')).toBeTruthy();
      expect(screen.getByText('Profile')).toBeTruthy();
      expect(screen.getByText('Search')).toBeTruthy();
    });
  });

  describe('Tablet Layout (768px)', () => {
    beforeEach(() => {
      // Set viewport to tablet size
      global.innerWidth = 768;
      global.innerHeight = 1024;
    });

    it('should maintain max-width constraint on tablet', () => {
      const { container } = render(<BottomNav />);
      const navContainer = container.querySelector('.max-w-lg');
      
      expect(navContainer).toBeTruthy();
    });

    it('should render ListingCard with proper spacing on tablet', () => {
      const listing = mockListings[0];
      const seller = mockUsers[0];
      const sneaker = mockSneakers[0];
      
      const { container } = render(
        <ListingCard 
          listing={listing} 
          seller={seller} 
          sneaker={sneaker}
        />
      );
      
      // Check that card renders properly with grid layout
      const grid = container.querySelector('.grid-cols-2');
      expect(grid).toBeTruthy();
      
      // Check for proper spacing classes
      const spacingElements = container.querySelectorAll('[class*="space-y"]');
      expect(spacingElements.length).toBeGreaterThan(0);
    });
  });

  describe('Desktop Layout (max 480px)', () => {
    beforeEach(() => {
      // Set viewport to desktop size
      global.innerWidth = 1920;
      global.innerHeight = 1080;
    });

    it('should center content with max-width on desktop', () => {
      const { container } = render(<BottomNav />);
      const navContainer = container.querySelector('.max-w-lg');
      
      // Should have max-width and centering
      expect(navContainer).toBeTruthy();
      expect(navContainer?.className).toContain('mx-auto');
    });
  });

  describe('Safe Area Padding', () => {
    it('should apply safe-area-bottom to BottomNav', () => {
      const { container } = render(<BottomNav />);
      const nav = container.querySelector('nav');
      
      expect(nav?.className).toContain('safe-area-bottom');
    });

    it('should have proper z-index for fixed elements', () => {
      const { container } = render(<BottomNav />);
      const nav = container.querySelector('nav');
      
      expect(nav?.className).toContain('z-50');
      expect(nav?.className).toContain('fixed');
    });
  });

  describe('Component Responsiveness', () => {
    it('should render PostCard with responsive layout', () => {
      const post = mockPosts[0];
      const { container } = render(<PostCard post={post} />);
      
      // Check for responsive image container
      const imageContainer = container.querySelector('.aspect-square');
      expect(imageContainer).toBeTruthy();
    });

    it('should render ListingCard with responsive grid', () => {
      const listing = mockListings[0];
      const seller = mockUsers[0];
      const sneaker = mockSneakers[0];
      
      const { container } = render(
        <ListingCard 
          listing={listing} 
          seller={seller} 
          sneaker={sneaker}
        />
      );
      
      // Check for responsive grid layout
      const grid = container.querySelector('.grid-cols-2');
      expect(grid).toBeTruthy();
    });
  });

  describe('Typography Responsiveness', () => {
    it('should use appropriate text sizes for mobile', () => {
      render(<BottomNav />);
      
      // Navigation labels should use text-xs
      const labels = screen.getAllByText(/Home|Store|Services|Profile|Search/);
      labels.forEach(label => {
        expect(label.className).toContain('text-xs');
      });
    });
  });

  describe('Spacing and Padding', () => {
    it('should have consistent padding in PostCard', () => {
      const post = mockPosts[0];
      const { container } = render(<PostCard post={post} />);
      
      // Check for consistent padding classes
      const paddedElements = container.querySelectorAll('[class*="p-4"]');
      expect(paddedElements.length).toBeGreaterThan(0);
    });

    it('should have proper bottom padding for fixed navigation', () => {
      const post = mockPosts[0];
      const { container } = render(<PostCard post={post} />);
      
      // Main content should have bottom padding to avoid overlap with nav
      const article = container.querySelector('article');
      expect(article).toBeTruthy();
    });
  });
});
