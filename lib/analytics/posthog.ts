import posthog from 'posthog-js';

let initialized = false;

/**
 * Initialize PostHog client.
 * No-op if NEXT_PUBLIC_POSTHOG_KEY is not set.
 */
export function initPostHog(): void {
  if (typeof window === 'undefined') return;
  if (initialized) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    loaded: () => {
      initialized = true;
    },
  });

  initialized = true;
}

/**
 * Get the PostHog client instance, or null if not initialized.
 */
export function getPostHog(): typeof posthog | null {
  if (!initialized) return null;
  return posthog;
}

/**
 * Identify a user in PostHog.
 * No-op if PostHog is not initialized.
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  const ph = getPostHog();
  if (!ph) return;
  ph.identify(userId, properties);
}

/**
 * Reset PostHog identity (on logout).
 */
export function resetUser(): void {
  const ph = getPostHog();
  if (!ph) return;
  ph.reset();
}

/**
 * Track a custom event.
 * No-op if PostHog is not initialized.
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  const ph = getPostHog();
  if (!ph) return;
  ph.capture(eventName, properties);
}
