import { NextRequest, NextResponse } from 'next/server';

// POST /api/consultation
// Consultations are currently processed client-side.
// This endpoint is reserved for future AI API integration.

export async function POST(request: NextRequest) {
  // Consultations are currently handled client-side
  // This endpoint will be implemented when AI backend is integrated
  return NextResponse.json(
    {
      error: 'Feature in development',
      message: 'AI-powered consultations are processed client-side. This API endpoint is reserved for future enhancements.',
    },
    { status: 400 }
  );
}

// GET /api/consultation/[id]
// Consultation data is fetched directly from Supabase client-side.
export async function GET(request: NextRequest) {
  // Consultation retrieval is handled client-side via Supabase
  return NextResponse.json(
    {
      error: 'Use client-side fetch',
      message: 'Consultation data should be fetched client-side using Supabase.',
    },
    { status: 400 }
  );
}
