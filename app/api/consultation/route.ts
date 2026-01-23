import { NextRequest, NextResponse } from 'next/server';

// POST /api/consultation
// TODO: Implement consultation logic in Phase 2
// - Check user tier and daily limits
// - Send message to Anthropic API
// - Process AI response
// - Save to Supabase
// - Return protocol data

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationLog } = body;

    // TODO: Implement consultation logic
    console.log('Consultation request:', { message });

    return NextResponse.json(
      { message: 'Consultation endpoint - implementation pending' },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/consultation/[id]
// TODO: Implement get consultation by ID
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement get consultation logic
    return NextResponse.json(
      { message: 'Get consultation endpoint - implementation pending' },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
