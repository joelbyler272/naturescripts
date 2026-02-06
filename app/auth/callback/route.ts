import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type'); // 'magiclink', 'recovery', 'invite', etc.

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // For magic links from onboarding, redirect to set-password
      if (type === 'magiclink' || type === 'invite') {
        return NextResponse.redirect(`${origin}/auth/set-password`);
      }
      // For password recovery, also go to set-password
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/set-password`);
      }
      // Default redirect
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Check for token_hash (alternative auth flow)
  const tokenHash = searchParams.get('token_hash');
  if (tokenHash) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: (type as 'magiclink' | 'recovery' | 'invite' | 'email') || 'magiclink',
    });
    
    if (!error) {
      return NextResponse.redirect(`${origin}/auth/set-password`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}
