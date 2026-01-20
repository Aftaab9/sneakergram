import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  calculateParallaxRotation,
  normalizeMousePosition,
  isValidMousePosition,
  type MousePosition,
} from '@/lib/parallax';

describe('Parallax Property Tests', () => {
  /**
   * Feature: sneakergram-app, Property 1: Parallax responds to all input positions
   * Validates: Requirements 1.3
   */
  describe('Property 1: Parallax responds to all input positions', () => {
    it('should calculate parallax rotation for any valid mouse position', () => {
      fc.assert(
        fc.property(
          fc.record({
            x: fc.float({ min: -1, max: 1, noNaN: true }),
            y: fc.float({ min: -1, max: 1, noNaN: true }),
          }),
          (mousePosition: MousePosition) => {
            // Calculate parallax rotation
            const rotation = calculateParallaxRotation(mousePosition);
            
            // Property: Rotation should always be calculated (not null/undefined)
            expect(rotation).toBeDefined();
            expect(rotation.x).toBeDefined();
            expect(rotation.y).toBeDefined();
            expect(rotation.z).toBeDefined();
            
            // Property: Rotation values should be finite numbers
            expect(Number.isFinite(rotation.x)).toBe(true);
            expect(Number.isFinite(rotation.y)).toBe(true);
            expect(Number.isFinite(rotation.z)).toBe(true);
            
            // Property: X rotation should be proportional to Y mouse position
            expect(rotation.x).toBe(mousePosition.y * 0.3);
            
            // Property: Z rotation should be proportional to X mouse position
            expect(rotation.z).toBe(mousePosition.x * 0.1);
            
            // Property: Y rotation should always be 0 (handled by auto-rotation)
            expect(rotation.y).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should normalize screen coordinates to valid mouse positions', () => {
      fc.assert(
        fc.property(
          fc.record({
            clientX: fc.nat(1920),
            clientY: fc.nat(1080),
            screenWidth: fc.integer({ min: 320, max: 3840 }),
            screenHeight: fc.integer({ min: 240, max: 2160 }),
          }),
          ({ clientX, clientY, screenWidth, screenHeight }) => {
            // Normalize coordinates
            const mousePosition = normalizeMousePosition(
              clientX,
              clientY,
              screenWidth,
              screenHeight
            );
            
            // Property: Normalized position should be within -1 to 1 range
            expect(isValidMousePosition(mousePosition)).toBe(true);
            expect(mousePosition.x).toBeGreaterThanOrEqual(-1);
            expect(mousePosition.x).toBeLessThanOrEqual(1);
            expect(mousePosition.y).toBeGreaterThanOrEqual(-1);
            expect(mousePosition.y).toBeLessThanOrEqual(1);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should produce consistent rotation for the same input', () => {
      fc.assert(
        fc.property(
          fc.record({
            x: fc.float({ min: -1, max: 1, noNaN: true }),
            y: fc.float({ min: -1, max: 1, noNaN: true }),
          }),
          (mousePosition: MousePosition) => {
            // Calculate rotation twice with same input
            const rotation1 = calculateParallaxRotation(mousePosition);
            const rotation2 = calculateParallaxRotation(mousePosition);
            
            // Property: Same input should produce same output (deterministic)
            expect(rotation1.x).toBe(rotation2.x);
            expect(rotation1.y).toBe(rotation2.y);
            expect(rotation1.z).toBe(rotation2.z);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should scale rotation proportionally to mouse movement', () => {
      fc.assert(
        fc.property(
          fc.record({
            x: fc.float({ min: -1, max: 1, noNaN: true }),
            y: fc.float({ min: -1, max: 1, noNaN: true }),
          }),
          (mousePosition: MousePosition) => {
            // Calculate rotation for original position
            const rotation1 = calculateParallaxRotation(mousePosition);
            
            // Calculate rotation for doubled position (clamped to valid range)
            const doubledPosition = {
              x: Math.max(-1, Math.min(1, mousePosition.x * 2)),
              y: Math.max(-1, Math.min(1, mousePosition.y * 2)),
            };
            const rotation2 = calculateParallaxRotation(doubledPosition);
            
            // Property: If mouse position doubles, rotation should approximately double
            // (within valid range constraints)
            if (Math.abs(mousePosition.x * 2) <= 1) {
              expect(Math.abs(rotation2.z)).toBeCloseTo(Math.abs(rotation1.z * 2), 5);
            }
            if (Math.abs(mousePosition.y * 2) <= 1) {
              expect(Math.abs(rotation2.x)).toBeCloseTo(Math.abs(rotation1.x * 2), 5);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should handle edge cases at boundaries', () => {
      // Test corner positions
      const corners: MousePosition[] = [
        { x: -1, y: -1 }, // Bottom-left
        { x: 1, y: -1 },  // Bottom-right
        { x: -1, y: 1 },  // Top-left
        { x: 1, y: 1 },   // Top-right
        { x: 0, y: 0 },   // Center
      ];
      
      corners.forEach((corner) => {
        const rotation = calculateParallaxRotation(corner);
        
        // Property: Should handle boundary positions without errors
        expect(rotation).toBeDefined();
        expect(Number.isFinite(rotation.x)).toBe(true);
        expect(Number.isFinite(rotation.z)).toBe(true);
        
        // Property: Center position should produce no rotation
        if (corner.x === 0 && corner.y === 0) {
          expect(rotation.x).toBe(0);
          expect(rotation.z).toBe(0);
        }
      });
    });
  });
});
