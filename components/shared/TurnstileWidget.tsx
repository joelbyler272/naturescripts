'use client';

import { useRef, useCallback } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
}

/**
 * Cloudflare Turnstile CAPTCHA widget.
 * Renders as a managed (invisible) challenge by default.
 * Skips rendering entirely if the site key isn't configured.
 */
export function TurnstileWidget({ onToken, onExpire }: TurnstileWidgetProps) {
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const handleSuccess = useCallback((token: string) => {
    onToken(token);
  }, [onToken]);

  const handleExpire = useCallback(() => {
    onExpire?.();
    // Auto-reset so user can re-verify
    turnstileRef.current?.reset();
  }, [onExpire]);

  // Don't render if no site key (dev environment)
  if (!siteKey) return null;

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      onSuccess={handleSuccess}
      onExpire={handleExpire}
      options={{
        size: 'flexible',
        theme: 'light',
      }}
    />
  );
}
