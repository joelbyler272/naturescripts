import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type'); // 'magiclink', 'recovery', 'invite', etc.
  const consultationId = searchParams.get('consultation'); // consultation ID from onboarding

  console.log('[AUTH CALLBACK] type:', type, 'consultation:', consultationId);

  // Handle PKCE flow (code in query params)
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // For magic links/invites from onboarding, redirect to set-password with consultation ID
      if (type === 'magiclink' || type === 'invite') {
        const redirectUrl = consultationId 
          ? `${origin}/auth/set-password?consultation=${consultationId}`
          : `${origin}/auth/set-password`;
        return NextResponse.redirect(redirectUrl);
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
  // Redirect to set-password page which will handle hash tokens client-side
  if (type === 'magiclink' || type === 'invite') {
    const redirectUrl = consultationId 
      ? `${origin}/auth/set-password?consultation=${consultationId}`
      : `${origin}/auth/set-password`;
    return NextResponse.redirect(redirectUrl);
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
      const redirectUrl = consultationId 
        ? `${origin}/auth/set-password?consultation=${consultationId}`
        : `${origin}/auth/set-password`;
      return NextResponse.redirect(redirectUrl);
    }
    
    console.error('[AUTH CALLBACK] Token verification error:', error);
  }

  // Return the user to sign-in with an error message
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}
