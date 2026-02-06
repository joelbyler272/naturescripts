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
