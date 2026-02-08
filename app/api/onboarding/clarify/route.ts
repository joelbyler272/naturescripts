// API route for the ONE clarifying question
// This is the only API call during onboarding chat (besides protocol generation)

import { NextRequest, NextResponse } from 'next/server';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildClarifyingQuestionPrompt, OnboardingState } from '@/lib/onboarding/stateMachine';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const state: OnboardingState = body.state;

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
    console.error('[CLARIFY API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
