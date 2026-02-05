/**
 * Date utilities for timezone-aware operations.
 */

/**
 * Gets today's date in the user's local timezone as YYYY-MM-DD string.
 * This ensures daily limits reset at local midnight, not UTC midnight.
 */
export function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets today's date in UTC as YYYY-MM-DD string.
 * Use this for server-side operations where consistency across timezones is needed.
 */
export function getUTCDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Formats a date string or Date object for display.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(undefined, options ?? {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
