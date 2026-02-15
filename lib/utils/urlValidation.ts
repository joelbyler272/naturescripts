/**
 * Validates that a URL uses the https:// scheme.
 * Returns the URL if valid, or '#' as a safe fallback.
 */
export function sanitizeProductUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '#';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') return url;
    return '#';
  } catch {
    return '#';
  }
}

/**
 * Generate a search URL for a product on Amazon or iHerb.
 * Used when Claude returns product recommendations without direct URLs.
 */
export function generateProductSearchUrl(
  brand: string,
  name: string,
  source: 'amazon' | 'iherb' | 'other'
): string {
  const query = `${brand} ${name}`.trim();
  if (!query) return '#';

  const encoded = encodeURIComponent(query);
  switch (source) {
    case 'amazon':
      return `https://www.amazon.com/s?k=${encoded}`;
    case 'iherb':
      return `https://www.iherb.com/search?kw=${encoded}`;
    default:
      return '#';
  }
}

/**
 * Get a usable URL for a product — uses the existing URL if valid,
 * otherwise generates a search URL from brand + name + source.
 */
export function getProductUrl(product: {
  url?: string;
  brand: string;
  name: string;
  source: 'amazon' | 'iherb' | 'other';
}): string {
  const sanitized = sanitizeProductUrl(product.url);
  if (sanitized !== '#') return sanitized;
  return generateProductSearchUrl(product.brand, product.name, product.source);
}
