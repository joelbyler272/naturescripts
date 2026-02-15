// API route for the ONE clarifying question
// This is the only API call during onboarding chat (besides protocol generation)

import { NextRequest, NextResponse } from 'next/server';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildClarifyingQuestionPrompt, OnboardingState } from '@/lib/onboarding/stateMachine';
import { applyRateLimit, getClientIp } from '@/lib/utils/rateLimit';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limit by IP
    const ip = getClientIp(request);
    const rateLimitResult = applyRateLimit('onboarding-clarify', ip, 10, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimitResult.retryAfter / 1000)) } }
      );
    }

    let body: { state?: OnboardingState };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const state = body.state;

    if (!state || !state.firstName || !state.primaryConcern) {
      return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }

    const prompt = buildClarifyingQuestionPrompt(state);

    const response = await chatWithClaude({
      systemPrompt: prompt,
      messages: [{ role: 'user', content: 'Generate the follow-up question.' }],
    });

    return NextResponse.json({
      question: response.content,
    });

  } catch (error) {
    console.error('[CLARIFY API] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
