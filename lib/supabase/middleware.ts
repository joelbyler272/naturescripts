import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSubdomainInfo, isConsumerRoute, isPractitionerRoute, isAuthRoute } from '@/lib/subdomain/detect';

function getCookieDomain(): string | undefined {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || '';
  if (rootDomain.includes('naturescripts.io')) {
    return '.naturescripts.io';
  }
  return undefined;
}

export async function updateSession(request: NextRequest) {
  const hostname = request.headers.get('host') || 'localhost:3000';
  const { type, subdomain } = getSubdomainInfo(hostname);
  const cookieDomain = getCookieDomain();

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Set subdomain headers for downstream consumption
  response.headers.set('x-subdomain-type', type);
  if (subdomain) {
    response.headers.set('x-subdomain', subdomain);
  }

  // Supabase auth refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieOpts = { ...options, domain: cookieDomain ?? options.domain };
          request.cookies.set({
            name,
            value,
            ...cookieOpts,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Re-apply subdomain headers after response recreation
          response.headers.set('x-subdomain-type', type);
          if (subdomain) {
            response.headers.set('x-subdomain', subdomain);
          }
          response.cookies.set({
            name,
            value,
            ...cookieOpts,
          });
        },
        remove(name: string, options: CookieOptions) {
          const cookieOpts = { ...options, domain: cookieDomain ?? options.domain };
          request.cookies.set({
            name,
            value: '',
            ...cookieOpts,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Re-apply subdomain headers after response recreation
          response.headers.set('x-subdomain-type', type);
          if (subdomain) {
            response.headers.set('x-subdomain', subdomain);
          }
          response.cookies.set({
            name,
            value: '',
            ...cookieOpts,
          });
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  // Subdomain-based route enforcement
  const pathname = request.nextUrl.pathname;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  const protocol = rootDomain.includes('localhost') ? 'http' : 'https';

  // Auth routes should only live on the root marketing domain
  if (type !== 'marketing' && isAuthRoute(pathname)) {
    return NextResponse.redirect(
      new URL(`${protocol}://${rootDomain}${pathname}${request.nextUrl.search}`)
    );
  }

  // Marketing subdomain: redirect consumer/practitioner routes to proper subdomain
  if (type === 'marketing') {
    if (isConsumerRoute(pathname)) {
      return NextResponse.redirect(
        new URL(`${protocol}://app.${rootDomain}${pathname}${request.nextUrl.search}`)
      );
    }
    if (isPractitionerRoute(pathname)) {
      return NextResponse.redirect(
        new URL(`${protocol}://practitioner.${rootDomain}${pathname}${request.nextUrl.search}`)
      );
    }
  }

  // App subdomain: redirect practitioner routes
  if (type === 'app') {
    if (isPractitionerRoute(pathname)) {
      return NextResponse.redirect(
        new URL(`${protocol}://practitioner.${rootDomain}${pathname}${request.nextUrl.search}`)
      );
    }
  }

  // Practitioner/custom subdomain: redirect consumer routes to app
  if (type === 'practitioner' || type === 'custom') {
    if (isConsumerRoute(pathname)) {
      return NextResponse.redirect(
        new URL(`${protocol}://app.${rootDomain}${pathname}${request.nextUrl.search}`)
      );
    }
  }

  return response;
}
