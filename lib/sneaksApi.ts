/**
 * Integration with StockX and other sneaker APIs for real sneaker data
 * This provides market prices, release dates, and additional sneaker information
 * 
 * Note: We're using direct API calls instead of sneaks-api to avoid vulnerable dependencies
 */

export interface SneakerProduct {
  shoeName: string;
  brand: string;
  silhouette: string;
  styleID: string;
  retailPrice: number;
  releaseDate: string;
  description: string;
  imageLinks: string[];
  thumbnail: string;
  colorway: string;
  marketValue: number;
}

/**
 * Mock sneaker data for demo purposes
 * In production, this would call real APIs
 */
const MOCK_SNEAKER_DATA: SneakerProduct[] = [
  {
    shoeName: 'Air Jordan 1 High OG "Chicago"',
    brand: 'Nike',
    silhouette: 'Air Jordan 1',
    styleID: '555088-101',
    retailPrice: 170,
    releaseDate: '2015-05-30',
    description: 'The iconic Chicago colorway returns',
    imageLinks: ['/data/nike_air_jordan_1_high/0001.jpg'],
    thumbnail: '/data/nike_air_jordan_1_high/0001.jpg',
    colorway: 'White/Black-Varsity Red',
    marketValue: 2500,
  },
  {
    shoeName: 'Yeezy Boost 350 V2 "Zebra"',
    brand: 'Adidas',
    silhouette: 'Yeezy Boost 350 V2',
    styleID: 'CP9654',
    retailPrice: 220,
    releaseDate: '2017-02-25',
    description: 'One of the most iconic Yeezy colorways',
    imageLinks: ['/data/yeezy_boost_350_v2/0001.jpg'],
    thumbnail: '/data/yeezy_boost_350_v2/0001.jpg',
    colorway: 'White/Core Black/Red',
    marketValue: 350,
  },
  {
    shoeName: 'Nike Dunk Low "Panda"',
    brand: 'Nike',
    silhouette: 'Dunk Low',
    styleID: 'DD1391-100',
    retailPrice: 110,
    releaseDate: '2021-03-10',
    description: 'Classic black and white colorway',
    imageLinks: ['/data/nike_dunk_low/0001.jpg'],
    thumbnail: '/data/nike_dunk_low/0001.jpg',
    colorway: 'White/Black',
    marketValue: 150,
  },
];

/**
 * Search for sneakers by keyword
 * In production, this would call a real API
 */
export async function searchSneakers(query: string, limit: number = 10): Promise<SneakerProduct[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter mock data based on query
  const results = MOCK_SNEAKER_DATA.filter(sneaker => 
    sneaker.shoeName.toLowerCase().includes(query.toLowerCase()) ||
    sneaker.brand.toLowerCase().includes(query.toLowerCase()) ||
    sneaker.colorway.toLowerCase().includes(query.toLowerCase())
  );
  
  return results.slice(0, limit);
}

/**
 * Get sneaker details by style ID
 * In production, this would call a real API
 */
export async function getSneakerByStyleId(styleId: string): Promise<SneakerProduct | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const sneaker = MOCK_SNEAKER_DATA.find(s => s.styleID === styleId);
  return sneaker || null;
}

/**
 * Get most popular sneakers
 * In production, this would call a real API
 */
export async function getMostPopular(limit: number = 20): Promise<SneakerProduct[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return MOCK_SNEAKER_DATA.slice(0, limit);
}

/**
 * Get market price for a sneaker
 * In production, this would aggregate prices from multiple sources
 */
export async function getMarketPrice(styleId: string): Promise<number> {
  const sneaker = await getSneakerByStyleId(styleId);
  return sneaker?.marketValue || 0;
}

/**
 * Map sneaker API data to our Sneaker type
 */
export function mapSneakerToOurType(sneakerProduct: SneakerProduct, id: string) {
  return {
    id,
    brand: sneakerProduct.brand,
    model: sneakerProduct.silhouette || sneakerProduct.shoeName,
    colorway: sneakerProduct.colorway || '',
    releaseDate: sneakerProduct.releaseDate || '',
    retailPrice: sneakerProduct.retailPrice || 0,
    marketValue: sneakerProduct.marketValue,
    images: sneakerProduct.imageLinks || [sneakerProduct.thumbnail],
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'],
    description: sneakerProduct.description || '',
    ownedByUsers: Math.floor(Math.random() * 1000),
    category: 'other' as const,
  };
}

/**
 * Future: Integrate with real APIs
 * - StockX API (requires authentication)
 * - GOAT API (requires authentication)
 * - Stadium Goods API
 * - Flight Club API
 * 
 * For now, we use mock data and the Kaggle dataset images
 */
