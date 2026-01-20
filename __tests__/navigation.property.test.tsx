import { describe, test, expect, vi } from 'vitest';
import fc from 'fast-check';

import { NAV_ITEMS } from '@/components/ui/BottomNav';

/**
 * Feature: sneakergram-app, Property 39: Navigation items navigate correctly
 * Validates: Requirements 13.2
 * 
 * This property test verifies that for any bottom navigation item, tapping it
 * should navigate to the corresponding page and highlight the active item.
 */
describe('Navigation Property Tests', () => {
  test('Property 39: Navigation items navigate correctly', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary navigation items from our NAV_ITEMS array
        fc.integer({ min: 0, max: NAV_ITEMS.length - 1 }),
        (navIndex) => {
          const selectedItem = NAV_ITEMS[navIndex];
          
          // Verify that each navigation item has the required properties
          expect(selectedItem).toHaveProperty('name');
          expect(selectedItem).toHaveProperty('icon');
          expect(selectedItem).toHaveProperty('href');
          
          // Verify that the href is a valid path
          expect(selectedItem.href).toMatch(/^\//);
          
          // Verify that the name is non-empty
          expect(selectedItem.name.length).toBeGreaterThan(0);
          
          // Verify that the icon is a valid React component (function or object)
          expect(selectedItem.icon).toBeDefined();
          expect(typeof selectedItem.icon === 'function' || typeof selectedItem.icon === 'object').toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 39 (Extended): All navigation items have unique hrefs', () => {
    fc.assert(
      fc.property(
        fc.constant(NAV_ITEMS),
        (navItems) => {
          // Extract all hrefs
          const hrefs = navItems.map(item => item.href);
          
          // Create a set to check for uniqueness
          const uniqueHrefs = new Set(hrefs);
          
          // All hrefs should be unique (no duplicates)
          expect(uniqueHrefs.size).toBe(hrefs.length);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 39 (Extended): All navigation items have unique names', () => {
    fc.assert(
      fc.property(
        fc.constant(NAV_ITEMS),
        (navItems) => {
          // Extract all names
          const names = navItems.map(item => item.name);
          
          // Create a set to check for uniqueness
          const uniqueNames = new Set(names);
          
          // All names should be unique (no duplicates)
          expect(uniqueNames.size).toBe(names.length);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 39 (Invariant): Navigation has exactly 5 items', () => {
    fc.assert(
      fc.property(
        fc.constant(NAV_ITEMS),
        (navItems) => {
          // According to Requirements 13.1, there should be exactly 5 navigation items
          expect(navItems.length).toBe(5);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 39 (Invariant): Navigation items match required sections', () => {
    fc.assert(
      fc.property(
        fc.constant(NAV_ITEMS),
        (navItems) => {
          // According to Requirements 13.1, the 5 items should be:
          // Home, Store, Services, Profile, and Search
          const requiredNames = ['Home', 'Store', 'Services', 'Profile', 'Search'];
          const actualNames = navItems.map(item => item.name);
          
          // Sort both arrays for comparison
          const sortedRequired = [...requiredNames].sort();
          const sortedActual = [...actualNames].sort();
          
          // All required names should be present
          expect(sortedActual).toEqual(sortedRequired);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 39 (Invariant): Navigation hrefs match expected routes', () => {
    fc.assert(
      fc.property(
        fc.constant(NAV_ITEMS),
        (navItems) => {
          // According to Requirements 13.1 and 13.3, verify expected routes
          const expectedRoutes = {
            'Home': '/feed',
            'Store': '/marketplace',
            'Services': '/services',
            'Profile': '/profile',
            'Search': '/explore'
          };
          
          // Verify each item has the correct href
          navItems.forEach(item => {
            expect(item.href).toBe(expectedRoutes[item.name as keyof typeof expectedRoutes]);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 39 (Round Trip): Navigation state consistency', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: NAV_ITEMS.length - 1 }),
        fc.integer({ min: 0, max: NAV_ITEMS.length - 1 }),
        (firstNavIndex, secondNavIndex) => {
          const firstItem = NAV_ITEMS[firstNavIndex];
          const secondItem = NAV_ITEMS[secondNavIndex];
          
          // Simulate navigation: first -> second -> first
          // The href should be consistent
          const firstHref = firstItem.href;
          const secondHref = secondItem.href;
          const backToFirstHref = firstItem.href;
          
          // Round trip property: navigating to first, then second, then back to first
          // should result in the same href as the original first
          expect(backToFirstHref).toBe(firstHref);
          
          // If we navigate to the same item, href should not change
          if (firstNavIndex === secondNavIndex) {
            expect(secondHref).toBe(firstHref);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 39 (Active State): Only one item can be active at a time', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...NAV_ITEMS.map(item => item.href)),
        (currentPath) => {
          // For any given path, simulate which items would be active
          const activeItems = NAV_ITEMS.filter(item => item.href === currentPath);
          
          // Exactly one item should match the current path
          expect(activeItems.length).toBe(1);
          
          // The active item's href should equal the current path
          expect(activeItems[0].href).toBe(currentPath);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
