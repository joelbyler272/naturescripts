import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type'); // 'magiclink', 'recovery', 'invite', etc.

  // Handle PKCE flow (code in query params)
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // For magic links/invites from onboarding, redirect to set-password
      if (type === 'magiclink' || type === 'invite') {
        return NextResponse.redirect(`${origin}/auth/set-password`);
      }
      // For password recovery
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/set-password`);
      }
      // Default redirect
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error('[AUTH CALLBACK] Code exchange error:', error);
  }

  // If no code, Supabase might be using hash fragment flow
  // We need to redirect to a client-side page that can read the hash
  // and extract the tokens
  if (type === 'magiclink' || type === 'invite') {
    // Redirect to set-password page which will handle hash tokens client-side
    return NextResponse.redirect(`${origin}/auth/set-password`);
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
      return NextResponse.redirect(`${origin}/auth/set-password`);
    }
    
    console.error('[AUTH CALLBACK] Token verification error:', error);
  }

  // Return the user to sign-in with an error message
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}
