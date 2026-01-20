/**
 * Utility functions for working with the Kaggle sneaker image dataset
 * Located in /data directory with structure: /data/{brand_model_variant}/####.jpg
 */

export interface KaggleDatasetInfo {
  className: string;
  brand: string;
  model: string;
  variant?: string;
  imageCount: number;
  imagePaths: string[];
}

/**
 * Parse folder name to extract brand, model, and variant
 * Example: "nike_air_jordan_1_high" -> { brand: "Nike", model: "Air Jordan 1", variant: "High" }
 */
export function parseSneakerClassName(className: string): {
  brand: string;
  model: string;
  variant?: string;
} {
  const parts = className.split('_');
  
  // Brand mapping
  const brandMap: Record<string, string> = {
    'nike': 'Nike',
    'adidas': 'Adidas',
    'yeezy': 'Yeezy',
    'new': 'New Balance',
    'converse': 'Converse',
    'vans': 'Vans',
    'puma': 'Puma',
    'reebok': 'Reebok',
    'asics': 'ASICS',
    'salomon': 'Salomon',
  };

  let brand = brandMap[parts[0]] || parts[0];
  
  // Handle "New Balance" special case
  if (parts[0] === 'new' && parts[1] === 'balance') {
    brand = 'New Balance';
    parts.splice(0, 2);
  } else {
    parts.splice(0, 1);
  }

  // Last part might be variant (high, low, mid, etc.)
  const variants = ['high', 'low', 'mid', 'checkerboard'];
  let variant: string | undefined;
  
  if (parts.length > 0 && variants.includes(parts[parts.length - 1])) {
    const variantPart = parts.pop();
    if (variantPart) {
      variant = variantPart.charAt(0).toUpperCase() + variantPart.slice(1);
    }
  }

  // Remaining parts are the model
  const model = parts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return { brand, model, variant };
}

/**
 * Get all available sneaker classes from the dataset
 */
export const KAGGLE_SNEAKER_CLASSES = [
  'adidas_forum_high',
  'adidas_forum_low',
  'adidas_gazelle',
  'adidas_nmd_r1',
  'adidas_samba',
  'adidas_stan_smith',
  'adidas_superstar',
  'adidas_ultraboost',
  'asics_gel-lyte_iii',
  'converse_chuck_70_high',
  'converse_chuck_70_low',
  'converse_chuck_taylor_all-star_high',
  'converse_chuck_taylor_all-star_low',
  'converse_one_star',
  'new_balance_327',
  'new_balance_550',
  'new_balance_574',
  'new_balance_990',
  'new_balance_992',
  'nike_air_force_1_high',
  'nike_air_force_1_low',
  'nike_air_force_1_mid',
  'nike_air_jordan_1_high',
  'nike_air_jordan_1_low',
  'nike_air_jordan_3',
  'nike_air_jordan_4',
  'nike_air_jordan_11',
  'nike_air_max_1',
  'nike_air_max_90',
  'nike_air_max_95',
  'nike_air_max_97',
  'nike_air_max_270',
  'nike_air_max_plus_(tn)',
  'nike_air_vapormax_flyknit',
  'nike_air_vapormax_plus',
  'nike_blazer_mid_77',
  'nike_cortez',
  'nike_dunk_high',
  'nike_dunk_low',
  'puma_suede_classic',
  'reebok_classic_leather',
  'reebok_club_c_85',
  'salomon_xt-6',
  'vans_authentic',
  'vans_old_skool',
  'vans_sk8-hi',
  'vans_slip-on_checkerboard',
  'yeezy_700_wave_runner',
  'yeezy_boost_350_v2',
  'yeezy_slide',
];

/**
 * Get image paths for a specific sneaker class
 * @param className - The folder name (e.g., "nike_air_jordan_1_high")
 * @param count - Number of images to return (default: all available)
 * @param useFallback - Whether to include fallback images if class not found (default: true)
 */
export function getKaggleImages(className: string, count?: number, useFallback: boolean = true): string[] {
  // Image counts for each sneaker class in the dataset
  const imageCounts: Record<string, number> = {
    'adidas_forum_high': 150,
    'adidas_ultraboost': 150,
    'new_balance_550': 150,
    'new_balance_574': 150,
    'converse_one_star': 150,
    'nike_cortez': 150,
    'nike_dunk_high': 150,
    'nike_air_max_90': 150,
    'nike_air_jordan_4': 150,
    'new_balance_992': 150,
    'nike_air_max_270': 149,
    'nike_air_vapormax_flyknit': 149,
    'vans_sk8-hi': 149,
    'adidas_gazelle': 149,
    'converse_chuck_70_low': 148,
    'yeezy_boost_350_v2': 148,
    'puma_suede_classic': 148,
    'reebok_club_c_85': 148,
    'nike_air_force_1_mid': 148,
    'vans_authentic': 148,
    'adidas_stan_smith': 147,
    'salomon_xt-6': 147,
    'nike_air_force_1_low': 147,
    'yeezy_slide': 145,
    'yeezy_700_wave_runner': 108,
    'new_balance_327': 108,
    'nike_air_vapormax_plus': 107,
    'nike_air_max_1': 106,
    'nike_air_jordan_3': 100,
    'reebok_classic_leather': 98,
    'nike_air_max_97': 97,
    'nike_blazer_mid_77': 97,
    'adidas_nmd_r1': 95,
    'new_balance_990': 95,
    'nike_air_jordan_11': 93,
    'vans_old_skool': 93,
    'converse_chuck_taylor_all-star_low': 93,
    'nike_air_max_plus_(tn)': 93,
    'adidas_superstar': 93,
    'adidas_forum_low': 92,
    'asics_gel-lyte_iii': 91,
    'vans_slip-on_checkerboard': 88,
    'nike_air_force_1_high': 87,
    'nike_air_max_95': 86,
    'nike_dunk_low': 80,
    'nike_air_jordan_1_low': 79,
    'converse_chuck_taylor_all-star_high': 78,
    'nike_air_jordan_1_high': 77,
    'converse_chuck_70_high': 75,
    'adidas_samba': 74,
  };

  // Check if the class exists in our dataset
  const totalImages = imageCounts[className];
  
  // If class not found and fallback is enabled, use a default sneaker class
  if (!totalImages && useFallback) {
    console.warn(`Sneaker class "${className}" not found in dataset. Using fallback images.`);
    return getFallbackImages(count);
  }
  
  // If class not found and no fallback, return empty array
  if (!totalImages) {
    return [];
  }

  const numImages = count && count < totalImages ? count : totalImages;
  
  const paths: string[] = [];
  for (let i = 1; i <= numImages; i++) {
    const imageNum = i.toString().padStart(4, '0');
    paths.push(`/data/${className}/${imageNum}.jpg`);
  }
  
  return paths;
}

/**
 * Get fallback images when a sneaker class is not found
 * Uses Nike Air Jordan 1 High as the default fallback
 */
export function getFallbackImages(count?: number): string[] {
  const fallbackClass = 'nike_air_jordan_1_high';
  const fallbackCount = 77; // Known count for this class
  const numImages = count && count < fallbackCount ? count : Math.min(fallbackCount, 5);
  
  const paths: string[] = [];
  for (let i = 1; i <= numImages; i++) {
    const imageNum = i.toString().padStart(4, '0');
    paths.push(`/data/${fallbackClass}/${imageNum}.jpg`);
  }
  
  return paths;
}

/**
 * Get a random image from a sneaker class
 */
export function getRandomKaggleImage(className: string): string {
  const images = getKaggleImages(className);
  if (images.length === 0) {
    // Return first fallback image if no images found
    const fallback = getFallbackImages(1);
    return fallback[0] || '/placeholder-sneaker.jpg';
  }
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Map a sneaker brand and model to its Kaggle dataset class name
 * @param brand - Sneaker brand (e.g., "Nike", "Adidas")
 * @param model - Sneaker model (e.g., "Air Jordan 1", "Ultraboost")
 * @param variant - Optional variant (e.g., "High", "Low")
 * @returns The matching Kaggle class name or null if not found
 */
export function mapSneakerToKaggleClass(
  brand: string,
  model: string,
  variant?: string
): string | null {
  // Normalize inputs
  const normalizedBrand = brand.toLowerCase().replace(/\s+/g, '_');
  const normalizedModel = model.toLowerCase().replace(/\s+/g, '_');
  const normalizedVariant = variant?.toLowerCase().replace(/\s+/g, '_');

  // Build potential class name
  let className = `${normalizedBrand}_${normalizedModel}`;
  if (normalizedVariant) {
    className += `_${normalizedVariant}`;
  }

  // Check if it exists in our dataset
  if (KAGGLE_SNEAKER_CLASSES.includes(className)) {
    return className;
  }

  // Try without variant
  if (normalizedVariant) {
    const classNameWithoutVariant = `${normalizedBrand}_${normalizedModel}`;
    if (KAGGLE_SNEAKER_CLASSES.includes(classNameWithoutVariant)) {
      return classNameWithoutVariant;
    }
  }

  // Try to find a partial match
  const partialMatch = KAGGLE_SNEAKER_CLASSES.find(cls => 
    cls.includes(normalizedBrand) && cls.includes(normalizedModel)
  );

  return partialMatch || null;
}

/**
 * Check if a sneaker class exists in the Kaggle dataset
 */
export function isValidKaggleClass(className: string): boolean {
  return KAGGLE_SNEAKER_CLASSES.includes(className);
}

/**
 * Get images for a sneaker by brand, model, and variant
 * Automatically maps to the correct Kaggle class
 */
export function getImagesByBrandModel(
  brand: string,
  model: string,
  variant?: string,
  count?: number
): string[] {
  const className = mapSneakerToKaggleClass(brand, model, variant);
  
  if (!className) {
    console.warn(`No Kaggle dataset found for ${brand} ${model} ${variant || ''}`);
    return getFallbackImages(count);
  }

  return getKaggleImages(className, count);
}

/**
 * Get dataset info for all sneaker classes
 */
export function getAllKaggleDatasetInfo(): KaggleDatasetInfo[] {
  return KAGGLE_SNEAKER_CLASSES.map(className => {
    const parsed = parseSneakerClassName(className);
    const imagePaths = getKaggleImages(className);
    
    return {
      className,
      brand: parsed.brand,
      model: parsed.model,
      variant: parsed.variant,
      imageCount: imagePaths.length,
      imagePaths,
    };
  });
}
