import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/signin
// Email/password signin is handled client-side via Supabase Auth.
// This endpoint exists as a placeholder for future server-side auth enhancements.

export async function POST(request: NextRequest) {
  // Signin is handled client-side via Supabase Auth
  // Direct users to use the client-side signin flow at /sign-in
  return NextResponse.json(
    {
      error: 'Please use the sign in page',
      message: 'Authentication is handled client-side. Visit /sign-in to log in.',
    },
    { status: 400 }
  );
}
