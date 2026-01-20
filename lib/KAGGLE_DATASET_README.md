# Kaggle Dataset Integration

This document describes the integration of the Kaggle sneaker image dataset with the SneakerGram application.

## Overview

The Kaggle dataset contains real sneaker images organized in directories by brand, model, and variant. The integration provides utilities to:

- Load images from the dataset
- Map sneaker models to dataset folders
- Provide fallback images for missing sneakers
- Parse and normalize sneaker names

## Dataset Structure

```
/data/
├── nike_air_jordan_1_high/
│   ├── 0001.jpg
│   ├── 0002.jpg
│   └── ...
├── adidas_ultraboost/
│   ├── 0001.jpg
│   └── ...
└── [50+ more sneaker models]
```

## Available Functions

### `getKaggleImages(className, count?, useFallback?)`

Get image paths for a specific sneaker class.

```typescript
// Get 5 images from Nike Air Jordan 1 High
const images = getKaggleImages('nike_air_jordan_1_high', 5);
// Returns: ['/data/nike_air_jordan_1_high/0001.jpg', ...]

// Get all available images
const allImages = getKaggleImages('nike_air_jordan_1_high');

// Disable fallback for missing classes
const images = getKaggleImages('invalid_class', 5, false);
// Returns: []
```

### `getFallbackImages(count?)`

Get fallback images when a sneaker class is not found.

```typescript
const fallback = getFallbackImages(3);
// Returns: ['/data/nike_air_jordan_1_high/0001.jpg', ...]
```

### `getRandomKaggleImage(className)`

Get a random image from a sneaker class.

```typescript
const randomImage = getRandomKaggleImage('nike_dunk_low');
// Returns: '/data/nike_dunk_low/0042.jpg' (random)
```

### `parseSneakerClassName(className)`

Parse a folder name to extract brand, model, and variant.

```typescript
const parsed = parseSneakerClassName('nike_air_jordan_1_high');
// Returns: { brand: 'Nike', model: 'Air Jordan 1', variant: 'High' }

const parsed2 = parseSneakerClassName('adidas_ultraboost');
// Returns: { brand: 'Adidas', model: 'Ultraboost', variant: undefined }
```

### `mapSneakerToKaggleClass(brand, model, variant?)`

Map a sneaker brand and model to its Kaggle dataset class name.

```typescript
const className = mapSneakerToKaggleClass('Nike', 'Air Jordan 1', 'High');
// Returns: 'nike_air_jordan_1_high'

const className2 = mapSneakerToKaggleClass('Adidas', 'Ultraboost');
// Returns: 'adidas_ultraboost'

const notFound = mapSneakerToKaggleClass('FakeBrand', 'FakeModel');
// Returns: null
```

### `isValidKaggleClass(className)`

Check if a sneaker class exists in the dataset.

```typescript
isValidKaggleClass('nike_air_jordan_1_high'); // true
isValidKaggleClass('invalid_class'); // false
```

### `getImagesByBrandModel(brand, model, variant?, count?)`

Get images for a sneaker by brand, model, and variant. Automatically maps to the correct Kaggle class.

```typescript
const images = getImagesByBrandModel('Nike', 'Air Jordan 1', 'High', 5);
// Returns: ['/data/nike_air_jordan_1_high/0001.jpg', ...]

// Automatically uses fallback if not found
const fallback = getImagesByBrandModel('FakeBrand', 'FakeModel', undefined, 3);
// Returns: ['/data/nike_air_jordan_1_high/0001.jpg', ...] (fallback)
```

### `getAllKaggleDatasetInfo()`

Get dataset info for all sneaker classes.

```typescript
const allInfo = getAllKaggleDatasetInfo();
// Returns: [
//   {
//     className: 'nike_air_jordan_1_high',
//     brand: 'Nike',
//     model: 'Air Jordan 1',
//     variant: 'High',
//     imageCount: 77,
//     imagePaths: ['/data/nike_air_jordan_1_high/0001.jpg', ...]
//   },
//   ...
// ]
```

## Dataset Statistics

- **Total Classes**: 52 sneaker models
- **Total Images**: ~5,500+ images
- **Brands**: Nike, Adidas, Yeezy, New Balance, Converse, Vans, Puma, Reebok, ASICS, Salomon
- **Image Format**: JPG (some PNG)
- **Naming Convention**: 4-digit zero-padded numbers (0001.jpg, 0002.jpg, etc.)

## Fallback Behavior

When a sneaker class is not found in the dataset:

1. By default, fallback images are returned (Nike Air Jordan 1 High)
2. A warning is logged to the console
3. You can disable fallback by passing `useFallback: false`

```typescript
// With fallback (default)
const images = getKaggleImages('invalid_class', 3);
// Returns fallback images + console warning

// Without fallback
const images = getKaggleImages('invalid_class', 3, false);
// Returns empty array []
```

## Integration with Mock Data

The mock data system (`lib/mockData.ts`) automatically uses the Kaggle dataset:

```typescript
// Mock sneakers are generated from Kaggle dataset
export const mockSneakers: Sneaker[] = KAGGLE_SNEAKER_CLASSES
  .slice(0, 20)
  .map((className, index) => {
    const parsed = parseSneakerClassName(className);
    const images = getKaggleImages(className, 5);
    
    return {
      id: `sneaker-${index + 1}`,
      brand: parsed.brand,
      model: parsed.model,
      colorway: parsed.variant || 'Original',
      images, // Real Kaggle dataset images
      // ... other fields
    };
  });
```

## Testing

Comprehensive tests are available in:

- `__tests__/kaggleDataset.test.ts` - Unit tests for all functions
- `__tests__/kaggleIntegration.test.ts` - Integration tests with mock data

Run tests:

```bash
npm test -- __tests__/kaggleDataset.test.ts --run
npm test -- __tests__/kaggleIntegration.test.ts --run
```

## Demo Script

Run the demo script to see the integration in action:

```bash
npx tsx scripts/demo-kaggle-dataset.ts
```

## Available Sneaker Classes

The dataset includes 52 sneaker models:

### Nike (21 models)
- Air Jordan 1 (High, Low)
- Air Jordan 3, 4, 11
- Air Force 1 (High, Mid, Low)
- Air Max (1, 90, 95, 97, 270, Plus/TN)
- Air VaporMax (Flyknit, Plus)
- Dunk (High, Low)
- Blazer Mid 77
- Cortez

### Adidas (8 models)
- Forum (High, Low)
- Gazelle
- NMD R1
- Samba
- Stan Smith
- Superstar
- Ultraboost

### Yeezy (3 models)
- Boost 350 V2
- 700 Wave Runner
- Slide

### New Balance (5 models)
- 327, 550, 574, 990, 992

### Converse (5 models)
- Chuck 70 (High, Low)
- Chuck Taylor All-Star (High, Low)
- One Star

### Vans (4 models)
- Authentic
- Old Skool
- SK8-Hi
- Slip-On Checkerboard

### Other Brands
- ASICS Gel-Lyte III
- Puma Suede Classic
- Reebok Classic Leather
- Reebok Club C 85
- Salomon XT-6

## Future Enhancements

Potential improvements for the dataset integration:

1. **Dynamic Loading**: Read actual file system instead of hardcoded counts
2. **Image Optimization**: Compress and optimize images for web
3. **CDN Integration**: Serve images from CDN for better performance
4. **Lazy Loading**: Load images on-demand as needed
5. **Caching**: Cache loaded images in memory or localStorage
6. **Search**: Full-text search across sneaker names and metadata
7. **Filtering**: Filter by brand, release year, price range, etc.

## Requirements Validation

This implementation satisfies **Requirement 11.5**:

> WHEN the Kaggle dataset images are available THEN the SneakerGram System SHALL use real sneaker images from the data directory

✅ All mock sneakers use real images from `/data` directory  
✅ Fallback mechanism ensures graceful handling of missing images  
✅ Multiple sneaker directories are properly mapped and loaded  
✅ Integration is tested and verified
