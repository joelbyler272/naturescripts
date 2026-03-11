/**
 * Cloudflare Turnstile server-side verification.
 *
 * Add these env vars:
 *   TURNSTILE_SECRET_KEY - from Cloudflare dashboard
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY - for client widget
 *
 * In development, if TURNSTILE_SECRET_KEY is not set, verification is skipped.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(
  token: string | null | undefined,
  ip?: string
): Promise<{ success: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Skip verification in development if not configured
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      return { success: true };
    }
    console.warn('[TURNSTILE] Secret key not configured in production. Allowing request.');
    return { success: true };
  }

  if (!token) {
    return { success: false, error: 'CAPTCHA verification required' };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    });

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, error: 'CAPTCHA verification failed. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[TURNSTILE] Verification request failed:', err);
    // Fail open to not block real users if Cloudflare is down
    return { success: true };
  }
}
