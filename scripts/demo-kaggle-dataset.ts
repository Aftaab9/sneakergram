/**
 * Demo script to showcase Kaggle Dataset Integration
 * Run with: npx tsx scripts/demo-kaggle-dataset.ts
 */

import {
  getKaggleImages,
  getFallbackImages,
  getRandomKaggleImage,
  parseSneakerClassName,
  mapSneakerToKaggleClass,
  getImagesByBrandModel,
  getAllKaggleDatasetInfo,
  KAGGLE_SNEAKER_CLASSES,
} from '../lib/kaggleDataset';

console.log('🎨 Kaggle Dataset Integration Demo\n');
console.log('=' .repeat(60));

// 1. Show available sneaker classes
console.log('\n📦 Available Sneaker Classes:');
console.log(`Total: ${KAGGLE_SNEAKER_CLASSES.length} classes`);
console.log('Sample classes:');
KAGGLE_SNEAKER_CLASSES.slice(0, 5).forEach(cls => {
  const parsed = parseSneakerClassName(cls);
  console.log(`  - ${cls}`);
  console.log(`    → ${parsed.brand} ${parsed.model} ${parsed.variant || ''}`);
});

// 2. Get images for specific sneakers
console.log('\n🖼️  Loading Images for Nike Air Jordan 1 High:');
const jordan1Images = getKaggleImages('nike_air_jordan_1_high', 3);
jordan1Images.forEach((img, i) => {
  console.log(`  ${i + 1}. ${img}`);
});

// 3. Get images from multiple brands
console.log('\n🏷️  Loading Images from Multiple Brands:');
const brands = [
  { class: 'nike_air_force_1_low', name: 'Nike Air Force 1 Low' },
  { class: 'adidas_ultraboost', name: 'Adidas Ultraboost' },
  { class: 'yeezy_boost_350_v2', name: 'Yeezy Boost 350 V2' },
  { class: 'new_balance_550', name: 'New Balance 550' },
];

brands.forEach(({ class: cls, name }) => {
  const images = getKaggleImages(cls, 2);
  console.log(`\n  ${name}:`);
  images.forEach(img => console.log(`    - ${img}`));
});

// 4. Test fallback functionality
console.log('\n🔄 Testing Fallback for Non-existent Sneaker:');
const fallbackImages = getKaggleImages('fake_sneaker_model', 3, true);
console.log('  Fallback images returned:');
fallbackImages.forEach(img => console.log(`    - ${img}`));

// 5. Map brand/model to Kaggle class
console.log('\n🗺️  Mapping Brand/Model to Kaggle Class:');
const mappings = [
  { brand: 'Nike', model: 'Air Jordan 1', variant: 'High' },
  { brand: 'Adidas', model: 'Ultraboost' },
  { brand: 'New Balance', model: '550' },
  { brand: 'Yeezy', model: 'Boost 350 V2' },
];

mappings.forEach(({ brand, model, variant }) => {
  const className = mapSneakerToKaggleClass(brand, model, variant);
  console.log(`  ${brand} ${model} ${variant || ''} → ${className || 'NOT FOUND'}`);
});

// 6. Get images by brand and model
console.log('\n🎯 Getting Images by Brand and Model:');
const imagesByBrand = getImagesByBrandModel('Nike', 'Air Jordan 1', 'High', 2);
console.log('  Nike Air Jordan 1 High:');
imagesByBrand.forEach(img => console.log(`    - ${img}`));

// 7. Random image selection
console.log('\n🎲 Random Image Selection:');
for (let i = 0; i < 3; i++) {
  const randomImg = getRandomKaggleImage('nike_dunk_low');
  console.log(`  ${i + 1}. ${randomImg}`);
}

// 8. Dataset statistics
console.log('\n📊 Dataset Statistics:');
const allInfo = getAllKaggleDatasetInfo();
const totalImages = allInfo.reduce((sum, info) => sum + info.imageCount, 0);
const avgImages = Math.round(totalImages / allInfo.length);

console.log(`  Total Classes: ${allInfo.length}`);
console.log(`  Total Images: ${totalImages}`);
console.log(`  Average Images per Class: ${avgImages}`);

// Find class with most images
const maxClass = allInfo.reduce((max, info) => 
  info.imageCount > max.imageCount ? info : max
);
console.log(`  Most Images: ${maxClass.className} (${maxClass.imageCount} images)`);

// Find class with least images
const minClass = allInfo.reduce((min, info) => 
  info.imageCount < min.imageCount ? info : min
);
console.log(`  Least Images: ${minClass.className} (${minClass.imageCount} images)`);

// 9. Brand distribution
console.log('\n🏢 Brand Distribution:');
const brandCounts = allInfo.reduce((acc, info) => {
  acc[info.brand] = (acc[info.brand] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

Object.entries(brandCounts)
  .sort(([, a], [, b]) => b - a)
  .forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} models`);
  });

console.log('\n' + '='.repeat(60));
console.log('✅ Demo Complete!\n');
