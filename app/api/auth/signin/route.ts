import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/signin
// TODO: Implement signin logic in Phase 2
// - Validate credentials
// - Check Supabase auth
// - Return session token
// - Set auth cookie

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Implement signin logic
    console.log('Signin request:', { email });

    return NextResponse.json(
      { message: 'Signin endpoint - implementation pending' },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
