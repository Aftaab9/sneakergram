/**
 * Tests for Kaggle Dataset Integration
 * Validates image loading, fallback functionality, and mapping
 */

import { describe, it, expect } from 'vitest';
import {
  getKaggleImages,
  getFallbackImages,
  getRandomKaggleImage,
  parseSneakerClassName,
  mapSneakerToKaggleClass,
  isValidKaggleClass,
  getImagesByBrandModel,
  getAllKaggleDatasetInfo,
  KAGGLE_SNEAKER_CLASSES,
} from '@/lib/kaggleDataset';

describe('Kaggle Dataset Integration', () => {
  describe('getKaggleImages', () => {
    it('should return image paths for valid sneaker class', () => {
      const images = getKaggleImages('nike_air_jordan_1_high', 5);
      
      expect(images).toHaveLength(5);
      expect(images[0]).toBe('/data/nike_air_jordan_1_high/0001.jpg');
      expect(images[4]).toBe('/data/nike_air_jordan_1_high/0005.jpg');
    });

    it('should return all images when count is not specified', () => {
      const images = getKaggleImages('nike_air_jordan_1_high');
      
      expect(images.length).toBe(77); // Known count for this class
      expect(images[0]).toBe('/data/nike_air_jordan_1_high/0001.jpg');
      expect(images[76]).toBe('/data/nike_air_jordan_1_high/0077.jpg');
    });

    it('should return fallback images for invalid class when useFallback is true', () => {
      const images = getKaggleImages('invalid_sneaker_class', 3, true);
      
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toContain('/data/');
      expect(images[0]).toContain('.jpg');
    });

    it('should return empty array for invalid class when useFallback is false', () => {
      const images = getKaggleImages('invalid_sneaker_class', 3, false);
      
      expect(images).toHaveLength(0);
    });

    it('should handle multiple different sneaker classes', () => {
      const jordan1 = getKaggleImages('nike_air_jordan_1_high', 3);
      const airForce1 = getKaggleImages('nike_air_force_1_low', 3);
      const yeezy = getKaggleImages('yeezy_boost_350_v2', 3);
      
      expect(jordan1).toHaveLength(3);
      expect(airForce1).toHaveLength(3);
      expect(yeezy).toHaveLength(3);
      
      expect(jordan1[0]).toContain('nike_air_jordan_1_high');
      expect(airForce1[0]).toContain('nike_air_force_1_low');
      expect(yeezy[0]).toContain('yeezy_boost_350_v2');
    });
  });

  describe('getFallbackImages', () => {
    it('should return fallback images', () => {
      const images = getFallbackImages(3);
      
      expect(images).toHaveLength(3);
      expect(images[0]).toContain('/data/');
      expect(images[0]).toContain('.jpg');
    });

    it('should limit fallback images to requested count', () => {
      const images = getFallbackImages(10);
      
      expect(images.length).toBeLessThanOrEqual(10);
    });
  });

  describe('getRandomKaggleImage', () => {
    it('should return a random image from valid class', () => {
      const image = getRandomKaggleImage('nike_air_jordan_1_high');
      
      expect(image).toContain('/data/nike_air_jordan_1_high/');
      expect(image).toMatch(/\/\d{4}\.jpg$/);
    });

    it('should return fallback for invalid class', () => {
      const image = getRandomKaggleImage('invalid_class');
      
      expect(image).toContain('/data/');
      expect(image).toContain('.jpg');
    });
  });

  describe('parseSneakerClassName', () => {
    it('should parse Nike Air Jordan 1 High correctly', () => {
      const result = parseSneakerClassName('nike_air_jordan_1_high');
      
      expect(result.brand).toBe('Nike');
      expect(result.model).toBe('Air Jordan 1');
      expect(result.variant).toBe('High');
    });

    it('should parse Adidas Ultraboost correctly', () => {
      const result = parseSneakerClassName('adidas_ultraboost');
      
      expect(result.brand).toBe('Adidas');
      expect(result.model).toBe('Ultraboost');
      expect(result.variant).toBeUndefined();
    });

    it('should parse New Balance 550 correctly', () => {
      const result = parseSneakerClassName('new_balance_550');
      
      expect(result.brand).toBe('New Balance');
      expect(result.model).toBe('550');
      expect(result.variant).toBeUndefined();
    });

    it('should parse Yeezy Boost 350 V2 correctly', () => {
      const result = parseSneakerClassName('yeezy_boost_350_v2');
      
      expect(result.brand).toBe('Yeezy');
      expect(result.model).toBe('Boost 350 V2');
      expect(result.variant).toBeUndefined();
    });

    it('should parse Vans Slip-On Checkerboard correctly', () => {
      const result = parseSneakerClassName('vans_slip-on_checkerboard');
      
      expect(result.brand).toBe('Vans');
      expect(result.model).toBe('Slip-on');
      expect(result.variant).toBe('Checkerboard');
    });
  });

  describe('mapSneakerToKaggleClass', () => {
    it('should map Nike Air Jordan 1 High to correct class', () => {
      const className = mapSneakerToKaggleClass('Nike', 'Air Jordan 1', 'High');
      
      expect(className).toBe('nike_air_jordan_1_high');
    });

    it('should map Adidas Ultraboost to correct class', () => {
      const className = mapSneakerToKaggleClass('Adidas', 'Ultraboost');
      
      expect(className).toBe('adidas_ultraboost');
    });

    it('should map New Balance 550 to correct class', () => {
      const className = mapSneakerToKaggleClass('New Balance', '550');
      
      expect(className).toBe('new_balance_550');
    });

    it('should return null for non-existent sneaker', () => {
      const className = mapSneakerToKaggleClass('FakeBrand', 'FakeModel');
      
      expect(className).toBeNull();
    });

    it('should find match without variant if exact match not found', () => {
      const className = mapSneakerToKaggleClass('Nike', 'Air Jordan 1', 'NonExistentVariant');
      
      // Should find nike_air_jordan_1_high or nike_air_jordan_1_low
      expect(className).toMatch(/nike_air_jordan_1_(high|low)/);
    });
  });

  describe('isValidKaggleClass', () => {
    it('should return true for valid class', () => {
      expect(isValidKaggleClass('nike_air_jordan_1_high')).toBe(true);
      expect(isValidKaggleClass('adidas_ultraboost')).toBe(true);
      expect(isValidKaggleClass('yeezy_boost_350_v2')).toBe(true);
    });

    it('should return false for invalid class', () => {
      expect(isValidKaggleClass('invalid_class')).toBe(false);
      expect(isValidKaggleClass('fake_sneaker')).toBe(false);
    });
  });

  describe('getImagesByBrandModel', () => {
    it('should get images by brand and model', () => {
      const images = getImagesByBrandModel('Nike', 'Air Jordan 1', 'High', 5);
      
      expect(images).toHaveLength(5);
      expect(images[0]).toContain('nike_air_jordan_1_high');
    });

    it('should return fallback for non-existent sneaker', () => {
      const images = getImagesByBrandModel('FakeBrand', 'FakeModel', undefined, 3);
      
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toContain('/data/');
    });

    it('should work without variant', () => {
      const images = getImagesByBrandModel('Adidas', 'Ultraboost', undefined, 5);
      
      expect(images).toHaveLength(5);
      expect(images[0]).toContain('adidas_ultraboost');
    });
  });

  describe('getAllKaggleDatasetInfo', () => {
    it('should return info for all sneaker classes', () => {
      const allInfo = getAllKaggleDatasetInfo();
      
      expect(allInfo.length).toBe(KAGGLE_SNEAKER_CLASSES.length);
      expect(allInfo[0]).toHaveProperty('className');
      expect(allInfo[0]).toHaveProperty('brand');
      expect(allInfo[0]).toHaveProperty('model');
      expect(allInfo[0]).toHaveProperty('imageCount');
      expect(allInfo[0]).toHaveProperty('imagePaths');
    });

    it('should have valid image paths for each class', () => {
      const allInfo = getAllKaggleDatasetInfo();
      
      allInfo.forEach(info => {
        expect(info.imagePaths.length).toBeGreaterThan(0);
        expect(info.imagePaths[0]).toContain(`/data/${info.className}/`);
        expect(info.imageCount).toBe(info.imagePaths.length);
      });
    });
  });

  describe('Integration with multiple directories', () => {
    it('should load images from Nike directory', () => {
      const nikeClasses = KAGGLE_SNEAKER_CLASSES.filter(cls => cls.startsWith('nike_'));
      
      expect(nikeClasses.length).toBeGreaterThan(0);
      
      nikeClasses.forEach(className => {
        const images = getKaggleImages(className, 1);
        expect(images).toHaveLength(1);
        expect(images[0]).toContain(`/data/${className}/`);
      });
    });

    it('should load images from Adidas directory', () => {
      const adidasClasses = KAGGLE_SNEAKER_CLASSES.filter(cls => cls.startsWith('adidas_'));
      
      expect(adidasClasses.length).toBeGreaterThan(0);
      
      adidasClasses.forEach(className => {
        const images = getKaggleImages(className, 1);
        expect(images).toHaveLength(1);
        expect(images[0]).toContain(`/data/${className}/`);
      });
    });

    it('should load images from Yeezy directory', () => {
      const yeezyClasses = KAGGLE_SNEAKER_CLASSES.filter(cls => cls.startsWith('yeezy_'));
      
      expect(yeezyClasses.length).toBeGreaterThan(0);
      
      yeezyClasses.forEach(className => {
        const images = getKaggleImages(className, 1);
        expect(images).toHaveLength(1);
        expect(images[0]).toContain(`/data/${className}/`);
      });
    });

    it('should load images from New Balance directory', () => {
      const nbClasses = KAGGLE_SNEAKER_CLASSES.filter(cls => cls.startsWith('new_balance_'));
      
      expect(nbClasses.length).toBeGreaterThan(0);
      
      nbClasses.forEach(className => {
        const images = getKaggleImages(className, 1);
        expect(images).toHaveLength(1);
        expect(images[0]).toContain(`/data/${className}/`);
      });
    });

    it('should load images from Converse directory', () => {
      const converseClasses = KAGGLE_SNEAKER_CLASSES.filter(cls => cls.startsWith('converse_'));
      
      expect(converseClasses.length).toBeGreaterThan(0);
      
      converseClasses.forEach(className => {
        const images = getKaggleImages(className, 1);
        expect(images).toHaveLength(1);
        expect(images[0]).toContain(`/data/${className}/`);
      });
    });
  });
});
