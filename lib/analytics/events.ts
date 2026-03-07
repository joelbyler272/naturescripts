/**
 * Typed PostHog event helpers.
 * All functions are no-ops when PostHog is not configured.
 */
import { trackEvent } from './posthog';

export function trackConsultationStarted(tier: 'free' | 'pro'): void {
  trackEvent('consultation_started', { tier });
}

export function trackConsultationCompleted(tier: 'free' | 'pro'): void {
  trackEvent('consultation_completed', { tier });
}

export function trackProtocolGenerated(tier: 'free' | 'pro'): void {
  trackEvent('protocol_generated', { tier });
}

export function trackUpgradeClicked(source: string): void {
  trackEvent('upgrade_clicked', { source });
}

export function trackLimitReached(tier: 'free' | 'pro', currentCount: number): void {
  trackEvent('limit_reached', { tier, current_count: currentCount });
}

export function trackAffiliateClick(source: string, productName: string): void {
  trackEvent('affiliate_click', { source, product_name: productName });
}

export function trackOnboardingCompleted(): void {
  trackEvent('onboarding_completed');
}

export function trackProtocolViewed(consultationId: string): void {
  trackEvent('protocol_viewed', { consultation_id: consultationId });
}
