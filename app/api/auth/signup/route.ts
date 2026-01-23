import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/signup
// TODO: Implement signup logic in Phase 2
// - Validate email/password
// - Create user in Supabase
// - Send verification email
// - Return user data or error

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName } = body;

    // TODO: Implement signup logic
    console.log('Signup request:', { email, firstName });

    return NextResponse.json(
      { message: 'Signup endpoint - implementation pending' },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
