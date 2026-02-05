import { NextRequest, NextResponse } from 'next/server';

// POST /api/subscription/create
// TODO: Implement subscription creation in Phase 2
// - Create Stripe checkout session
// - Return checkout URL

export async function POST(request: NextRequest) {
  try {
    // This endpoint is deprecated - use /api/stripe/checkout instead
    return NextResponse.json(
      { error: 'This endpoint is deprecated. Please use /api/stripe/checkout instead.' },
      { status: 410 }  // 410 Gone - resource no longer available
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/subscription/cancel
// Deprecated - use Stripe Customer Portal instead
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Please use /api/stripe/portal to access the Stripe Customer Portal for subscription management.' },
    { status: 410 }  // 410 Gone - resource no longer available
  );
}
