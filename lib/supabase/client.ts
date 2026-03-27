import { createBrowserClient } from '@supabase/ssr';

function getCookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const host = window.location.hostname;
  // In production, set cookie on root domain so it's shared across subdomains
  if (host.endsWith('naturescripts.io')) {
    return '.naturescripts.io';
  }
  // For localhost, don't set a domain (cookies work on localhost by default)
  return undefined;
}

export function createClient() {
  const cookieDomain = getCookieDomain();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: cookieDomain,
        path: '/',
        sameSite: 'lax',
        secure: cookieDomain ? true : false,
      },
    }
  );
}
