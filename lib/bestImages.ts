/**
 * Best quality sneaker images from public/data/best folder
 * These are high-quality Google images, not blurry Kaggle dataset
 */

export const BEST_SNEAKER_IMAGES = {
  // Nike
  airForces1: '/data/best/air forces 1.jpg',
  nikeAirForces: '/data/best/nike air forces.jpg',
  nikeRedForces: '/data/best/nike red forces.jpg',
  nikePinks: '/data/best/nike pinks.jpg',
  
  // Jordan
  jordanBlue: '/data/best/Air jordan blue.jpg',
  jordanBlackRed: '/data/best/nike jordan black and reds.png',
  jordanBlackYellow: '/data/best/nike jordan black and yellow.jpg',
  jordanRetro: '/data/best/jordan retro.jpg',
  blackCats: '/data/best/black cats.jpg',
  jordanPineGreen: '/data/best/nike-sb-x-air-jordan-4-pine-green-dr5415-103-release-date.avif',
  
  // Adidas
  adidasForum: '/data/best/Adidas_forum1.jpg',
  adidasStand: '/data/best/adidas_stand.jpg',
  adidasSuperstar: '/data/best/ADIDAS_SUPERSTAR_ADV_BLACK_WHITE_SHOES_1200x.webp',
  adidas: '/data/best/adidas.jpg',
  
  // New Balance
  newBalance1: '/data/best/NB_1.jpg',
  newBalancePerformance: '/data/best/NB_Performance.png',
  
  // Luxury
  lv1: '/data/best/LV_12.jpg',
  lv2: '/data/best/LV.avif',
  
  // New additions
  heroSneaker: '/data/best/360_F_410655365_MjietOoPZAMAdqA74M6EXqRL3F8g5dHH.jpg',
  yellowBlackSneaker: '/data/best/stylish-yellow-black-sneakers-free-png.png',
  airJordanRed: '/data/best/air jordan red.png',
};

// Array of all best images for easy iteration
export const ALL_BEST_IMAGES = Object.values(BEST_SNEAKER_IMAGES);

// Get random best image
export function getRandomBestImage(): string {
  return ALL_BEST_IMAGES[Math.floor(Math.random() * ALL_BEST_IMAGES.length)];
}

// Get best images by category
export function getBestImagesByCategory(category: 'nike' | 'jordan' | 'adidas' | 'newbalance' | 'luxury'): string[] {
  switch (category) {
    case 'nike':
      return [BEST_SNEAKER_IMAGES.airForces1, BEST_SNEAKER_IMAGES.nikeAirForces, BEST_SNEAKER_IMAGES.nikeRedForces, BEST_SNEAKER_IMAGES.nikePinks];
    case 'jordan':
      return [BEST_SNEAKER_IMAGES.jordanBlue, BEST_SNEAKER_IMAGES.jordanBlackRed, BEST_SNEAKER_IMAGES.jordanBlackYellow, BEST_SNEAKER_IMAGES.jordanRetro, BEST_SNEAKER_IMAGES.blackCats, BEST_SNEAKER_IMAGES.jordanPineGreen];
    case 'adidas':
      return [BEST_SNEAKER_IMAGES.adidasForum, BEST_SNEAKER_IMAGES.adidasStand, BEST_SNEAKER_IMAGES.adidasSuperstar, BEST_SNEAKER_IMAGES.adidas];
    case 'newbalance':
      return [BEST_SNEAKER_IMAGES.newBalance1, BEST_SNEAKER_IMAGES.newBalancePerformance];
    case 'luxury':
      return [BEST_SNEAKER_IMAGES.lv1, BEST_SNEAKER_IMAGES.lv2];
    default:
      return ALL_BEST_IMAGES;
  }
}
