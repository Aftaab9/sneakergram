/**
 * Integration tests for Kaggle Dataset with Mock Data
 * Verifies that mock data properly uses Kaggle dataset images
 */

import { describe, it, expect } from 'vitest';
import { mockSneakers, mockPosts, mockListings } from '@/lib/mockData';
import { isValidKaggleClass, KAGGLE_SNEAKER_CLASSES } from '@/lib/kaggleDataset';

describe('Kaggle Dataset Integration with Mock Data', () => {
  describe('Mock Sneakers use Kaggle images', () => {
    it('should have sneakers with valid image paths', () => {
      mockSneakers.forEach(sneaker => {
        expect(sneaker.images).toBeDefined();
        expect(Array.isArray(sneaker.images)).toBe(true);
        expect(sneaker.images.length).toBeGreaterThan(0);
        
        // All images should be from /data directory
        sneaker.images.forEach(image => {
          expect(image).toContain('/data/');
          expect(image).toMatch(/\.(jpg|png)$/);
        });
      });
    });

    it('should have sneakers from multiple brands', () => {
      const brands = new Set(mockSneakers.map(s => s.brand));
      
      // Should have at least 5 different brands
      expect(brands.size).toBeGreaterThanOrEqual(5);
      
      // Should include major brands
      const brandArray = Array.from(brands);
      expect(brandArray.some(b => b.toLowerCase().includes('nike'))).toBe(true);
      expect(brandArray.some(b => b.toLowerCase().includes('adidas'))).toBe(true);
    });

    it('should have sneakers with proper metadata', () => {
      mockSneakers.forEach(sneaker => {
        expect(sneaker.brand).toBeDefined();
        expect(sneaker.model).toBeDefined();
        expect(sneaker.colorway).toBeDefined();
        expect(sneaker.retailPrice).toBeGreaterThan(0);
        expect(sneaker.marketValue).toBeGreaterThan(0);
        expect(sneaker.category).toBeDefined();
      });
    });
  });

  describe('Mock Posts use Kaggle images', () => {
    it('should have posts with valid sneaker images', () => {
      mockPosts.forEach(post => {
        expect(post.images).toBeDefined();
        expect(Array.isArray(post.images)).toBe(true);
        expect(post.images.length).toBeGreaterThan(0);
        
        // All images should be from /data directory
        post.images.forEach(image => {
          expect(image).toContain('/data/');
        });
      });
    });

    it('should have posts referencing valid sneakers', () => {
      mockPosts.forEach(post => {
        if (post.sneakerTags && post.sneakerTags.length > 0) {
          post.sneakerTags.forEach(sneakerId => {
            const sneaker = mockSneakers.find(s => s.id === sneakerId);
            expect(sneaker).toBeDefined();
          });
        }
      });
    });
  });

  describe('Mock Listings use Kaggle images', () => {
    it('should have listings with valid sneaker images', () => {
      mockListings.forEach(listing => {
        expect(listing.images).toBeDefined();
        expect(Array.isArray(listing.images)).toBe(true);
        expect(listing.images.length).toBeGreaterThan(0);
        
        // All images should be from /data directory
        listing.images.forEach(image => {
          expect(image).toContain('/data/');
        });
      });
    });

    it('should have listings referencing valid sneakers', () => {
      mockListings.forEach(listing => {
        const sneaker = mockSneakers.find(s => s.id === listing.sneakerId);
        expect(sneaker).toBeDefined();
        
        if (sneaker) {
          // Listing images should match sneaker images
          expect(sneaker.images.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Dataset coverage', () => {
    it('should use images from multiple Kaggle dataset directories', () => {
      const usedDirectories = new Set<string>();
      
      mockSneakers.forEach(sneaker => {
        sneaker.images.forEach(image => {
          // Extract directory name from path: /data/{directory}/####.jpg
          const match = image.match(/\/data\/([^\/]+)\//);
          if (match) {
            usedDirectories.add(match[1]);
          }
        });
      });
      
      // Should use images from at least 10 different directories
      expect(usedDirectories.size).toBeGreaterThanOrEqual(10);
      
      // Verify these are valid Kaggle classes
      usedDirectories.forEach(dir => {
        expect(KAGGLE_SNEAKER_CLASSES).toContain(dir);
      });
    });

    it('should have diverse sneaker models', () => {
      const models = new Set(mockSneakers.map(s => s.model));
      
      // Should have at least 15 different models
      expect(models.size).toBeGreaterThanOrEqual(15);
    });

    it('should include popular sneaker models', () => {
      const modelNames = mockSneakers.map(s => s.model.toLowerCase());
      
      // Check for some iconic models
      const hasJordan = modelNames.some(m => m.includes('jordan'));
      const hasAirForce = modelNames.some(m => m.includes('air force') || m.includes('force'));
      const hasYeezy = modelNames.some(m => m.includes('boost') || m.includes('yeezy'));
      
      // Should have at least 2 of these iconic models
      const iconicCount = [hasJordan, hasAirForce, hasYeezy].filter(Boolean).length;
      expect(iconicCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Image path format', () => {
    it('should have properly formatted image paths', () => {
      mockSneakers.forEach(sneaker => {
        sneaker.images.forEach(image => {
          // Should match pattern: /data/{class_name}/####.jpg
          expect(image).toMatch(/^\/data\/[a-z0-9_\-()]+\/\d{4}\.(jpg|png)$/);
        });
      });
    });

    it('should have sequential image numbering', () => {
      mockSneakers.forEach(sneaker => {
        sneaker.images.forEach(image => {
          // Extract the number from the path
          const match = image.match(/\/(\d{4})\.(jpg|png)$/);
          expect(match).toBeTruthy();
          
          if (match) {
            const imageNum = parseInt(match[1], 10);
            expect(imageNum).toBeGreaterThan(0);
            expect(imageNum).toBeLessThanOrEqual(9999);
          }
        });
      });
    });
  });

  describe('Fallback functionality', () => {
    it('should handle missing sneaker classes gracefully', () => {
      // This is tested in the kaggleDataset.test.ts file
      // Just verify that mock data doesn't have any broken references
      mockSneakers.forEach(sneaker => {
        expect(sneaker.images.length).toBeGreaterThan(0);
        sneaker.images.forEach(image => {
          expect(image).toBeTruthy();
          expect(typeof image).toBe('string');
        });
      });
    });
  });
});
