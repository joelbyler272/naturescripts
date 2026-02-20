/**
 * Centralized configuration for usage limits and pricing.
 * Change these values in one place to update across the app.
 */

export const USAGE_LIMITS = {
  FREE_WEEKLY_CONSULTATIONS: 5,
  PRO_WEEKLY_CONSULTATIONS: Infinity,  // Unlimited
  FREE_TIER_PROTOCOL_HISTORY: 3,  // Free users can only see their last 3 protocols
} as const;

export const PRICING = {
  PRO_MONTHLY_PRICE: 12.99,
} as const;

/**
 * Get the weekly consultation limit for a tier
 */
export function getWeeklyLimit(tier: 'free' | 'pro'): number {
  return tier === 'pro'
    ? USAGE_LIMITS.PRO_WEEKLY_CONSULTATIONS
    : USAGE_LIMITS.FREE_WEEKLY_CONSULTATIONS;
}

/**
 * Format limit message for display
 */
export function formatLimitMessage(currentCount: number, tier: 'free' | 'pro'): string {
  const limit = getWeeklyLimit(tier);
  if (limit === Infinity) {
    return `${currentCount} consultations this week (unlimited)`;
  }
  return `${currentCount} of ${limit} consultations used this week`;
}
