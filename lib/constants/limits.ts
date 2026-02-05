/**
 * Centralized configuration for usage limits
 * Change these values in one place to update across the app
 */

export const USAGE_LIMITS = {
  FREE_DAILY_CONSULTATIONS: 3,
  PRO_DAILY_CONSULTATIONS: Infinity,  // Unlimited
} as const;

export const PRICING = {
  PRO_MONTHLY_PRICE: 9,
  PRO_MONTHLY_PRICE_DISCOUNTED: 4.50,
  DISCOUNT_PERCENTAGE: 50,
} as const;

/**
 * Get the daily consultation limit for a tier
 */
export function getDailyLimit(tier: 'free' | 'pro'): number {
  return tier === 'pro'
    ? USAGE_LIMITS.PRO_DAILY_CONSULTATIONS
    : USAGE_LIMITS.FREE_DAILY_CONSULTATIONS;
}

/**
 * Format limit message for display
 */
export function formatLimitMessage(currentCount: number, tier: 'free' | 'pro'): string {
  const limit = getDailyLimit(tier);
  if (limit === Infinity) {
    return `${currentCount} consultations today (unlimited)`;
  }
  return `${currentCount} of ${limit} consultations used today`;
}
