// Affiliate Link Generator for Product Recommendations

import { ProductLink } from './types';

// Affiliate IDs from environment variables
const AMAZON_AFFILIATE_TAG = process.env.AMAZON_AFFILIATE_TAG || '';
const IHERB_AFFILIATE_CODE = process.env.IHERB_AFFILIATE_CODE || '';

if (!process.env.AMAZON_AFFILIATE_TAG) {
  console.warn('[AffiliateLinks] AMAZON_AFFILIATE_TAG env var not set. Affiliate links will not include a tag.');
}
if (!process.env.IHERB_AFFILIATE_CODE) {
  console.warn('[AffiliateLinks] IHERB_AFFILIATE_CODE env var not set. Affiliate links will not include a code.');
}

/**
 * Generate Amazon search URL with affiliate tag
 */
function generateAmazonUrl(productName: string, brand: string): string {
  const searchQuery = encodeURIComponent(`${brand} ${productName}`);
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${AMAZON_AFFILIATE_TAG}`;
}

/**
 * Generate iHerb search URL with affiliate code
 */
function generateIHerbUrl(productName: string, brand: string): string {
  const searchQuery = encodeURIComponent(`${brand} ${productName}`);
  return `https://www.iherb.com/search?kw=${searchQuery}&rcode=${IHERB_AFFILIATE_CODE}`;
}

/**
 * Add affiliate links to product recommendations from Claude
 */
export function addAffiliateLinks(products: Partial<ProductLink>[]): ProductLink[] {
  return products.map(product => {
    const name = product.name || 'Supplement';
    const brand = product.brand || '';
    const source = product.source || 'amazon';

    let url: string;
    if (source === 'iherb') {
      url = generateIHerbUrl(name, brand);
    } else {
      url = generateAmazonUrl(name, brand);
    }

    return {
      name,
      brand,
      url,
      source: source as 'amazon' | 'iherb' | 'other',
      price: product.price
    };
  });
}

/**
 * Generate default product links for a remedy
 * Used when Claude doesn't provide specific products
 */
export function generateDefaultProductLinks(remedyName: string): ProductLink[] {
  return [
    {
      name: remedyName,
      brand: 'NOW Foods',
      url: generateAmazonUrl(remedyName, 'NOW Foods'),
      source: 'amazon'
    },
    {
      name: remedyName,
      brand: "Nature's Way",
      url: generateIHerbUrl(remedyName, "Nature's Way"),
      source: 'iherb'
    }
  ];
}

/**
 * Trusted supplement brands for quality recommendations
 */
export const TRUSTED_BRANDS = [
  'NOW Foods',
  "Nature's Way",
  'Gaia Herbs',
  'Pure Encapsulations',
  'Thorne',
  'Garden of Life',
  'Jarrow Formulas',
  'Life Extension',
  'Source Naturals',
  'Herb Pharm',
  'Solgar',
  'Nordic Naturals',
  'MegaFood',
  'New Chapter',
  'Vital Nutrients'
];
