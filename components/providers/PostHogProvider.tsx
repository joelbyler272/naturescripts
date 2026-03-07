'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { initPostHog, identifyUser, resetUser } from '@/lib/analytics/posthog';

/**
 * PostHog analytics provider.
 * Initializes PostHog on mount and identifies users on auth change.
 * Gracefully no-ops when NEXT_PUBLIC_POSTHOG_KEY is not set.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Initialize PostHog once on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Identify/reset user on auth change
  useEffect(() => {
    if (user?.email) {
      identifyUser(user.id, {
        email: user.email,
        tier: user.user_metadata?.tier || 'free',
      });
    } else {
      resetUser();
    }
  }, [user]);

  return <>{children}</>;
}
