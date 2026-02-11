import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Validate consultationId is a UUID to prevent injection
function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function buildSetPasswordUrl(origin: string, consultationId: string | null): string {
  const base = `${origin}/auth/set-password`;
  if (consultationId && isValidUuid(consultationId)) {
    return `${base}?consultation=${consultationId}`;
  }
  return base;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type');
  const consultationId = searchParams.get('consultation');

  // Handle PKCE flow (code in query params)
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (type === 'magiclink' || type === 'invite') {
        return NextResponse.redirect(buildSetPasswordUrl(origin, consultationId));
      }
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/set-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('[AUTH CALLBACK] Code exchange error:', error.message);
  }

  // Check for token_hash (alternative auth flow)
  const tokenHash = searchParams.get('token_hash');
  const tokenType = searchParams.get('type') as 'magiclink' | 'recovery' | 'invite' | 'email' | null;

  if (tokenHash && tokenType) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: tokenType,
    });

    if (!error) {
      return NextResponse.redirect(buildSetPasswordUrl(origin, consultationId));
    }

    console.error('[AUTH CALLBACK] Token verification error:', error.message);
  }

  // If we have type=magiclink/invite but no code or token_hash,
  // redirect to set-password which will handle hash fragment tokens client-side.
  // This is needed because Supabase sometimes uses hash fragments instead of query params.
  if ((type === 'magiclink' || type === 'invite') && !code && !tokenHash) {
    return NextResponse.redirect(buildSetPasswordUrl(origin, consultationId));
  }

  // Return the user to sign-in with an error message
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}
