import { MOCK_USER } from '@/lib/data/hardcoded';

/**
 * Mock authentication helper
 * 
 * In production, this would check:
 * - Session cookies
 * - JWT tokens
 * - Auth provider (Clerk, NextAuth, etc.)
 * 
 * For now, we simulate auth state with a simple flag.
 * Set IS_AUTHENTICATED to false to test logged-out state.
 */

// Toggle this to test authenticated vs unauthenticated states
const IS_AUTHENTICATED = true;

export function isAuthenticated(): boolean {
  return IS_AUTHENTICATED;
}

export function getCurrentUser() {
  if (!IS_AUTHENTICATED) {
    return null;
  }
  return MOCK_USER;
}
