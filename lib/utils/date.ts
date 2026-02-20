/**
 * Date utilities for NatureScripts
 *
 * Note on timezone strategy: Client-side dates use the user's local timezone
 * for display and progress tracking. The Supabase DB functions use
 * `date_trunc('week', CURRENT_DATE)` which uses the server's timezone (UTC by
 * default in Supabase). For consultation limits this is acceptable because the
 * check is always done server-side. Progress tracking dates are stored as
 * plain DATE values keyed to the user's local date.
 */

/**
 * Format a Date as YYYY-MM-DD in the user's local timezone.
 * Uses toLocaleDateString('en-CA') which outputs ISO format (YYYY-MM-DD)
 * and correctly handles DST transitions.
 */
function toLocalISODate(date: Date): string {
  return date.toLocaleDateString('en-CA'); // en-CA always outputs YYYY-MM-DD
}

/**
 * Get the current date as a YYYY-MM-DD string in the user's local timezone.
 * This ensures daily limits reset at the user's midnight, not UTC midnight.
 */
export function getLocalDateString(): string {
  return toLocalISODate(new Date());
}

/**
 * Get the start of the current ISO week (Monday) as a YYYY-MM-DD string.
 * ISO weeks start on Monday.
 */
export function getWeekStartDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // Calculate days to subtract to get to Monday
  // If Sunday (0), go back 6 days. If Monday (1), go back 0 days. etc.
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToMonday);
  return toLocalISODate(monday);
}

/**
 * Format a date for display.
 * When parsing a YYYY-MM-DD string, appends T00:00:00 to ensure
 * the date is interpreted in local timezone (not UTC).
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date as a short string (e.g., "Jan 15").
 * When parsing a YYYY-MM-DD string, appends T00:00:00 to ensure
 * the date is interpreted in local timezone (not UTC).
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}
