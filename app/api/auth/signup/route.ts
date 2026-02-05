import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/signup
// Email/password signup is handled client-side via Supabase Auth.
// This endpoint exists as a placeholder for future server-side signup enhancements.

export async function POST(request: NextRequest) {
  // Signup is handled client-side via Supabase Auth
  // Direct users to use the client-side signup flow at /sign-up
  return NextResponse.json(
    {
      error: 'Please use the signup page',
      message: 'Email/password signup is handled client-side. Visit /sign-up to create an account.',
    },
    { status: 400 }
  );
}
