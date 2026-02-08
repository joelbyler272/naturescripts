// Onboarding Chat API - No authentication required
// Uses special onboarding prompts to collect user info

import { NextRequest, NextResponse } from 'next/server';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildOnboardingSystemPrompt, extractEmailFromConversation } from '@/lib/consultation/onboardingPrompts';
import { ConversationMessage, ChatResponse } from '@/lib/consultation/types';
import { applyRateLimit, RateLimitResult } from '@/lib/utils/rateLimit';
import { validateConversationHistory, CHAT_LIMITS } from '@/lib/utils/validation';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get IP for rate limiting (since no user ID)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Rate limit by IP (more restrictive than authenticated users)
    const rateLimitResult: RateLimitResult = applyRateLimit('onboarding-chat', ip, 30, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rateLimitResult.retryAfter / 1000)) }
        }
      );
    }

    // Parse request body
    let body: { message?: string; conversationHistory?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long (max ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} characters)` },
        { status: 400 }
      );
    }

    // Validate conversation history
    const validatedHistory = validateConversationHistory(body.conversationHistory || []);

    // Build conversation for Claude
    const updatedHistory: ConversationMessage[] = [
      ...validatedHistory.map(m => ({
        id: crypto.randomUUID(),
        role: m.role,
        content: m.content,
        timestamp: new Date().toISOString()
      })),
      {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString()
      }
    ];

    // Count exchanges
    const exchangeCount = updatedHistory.filter(m => m.role === 'user').length;

    // Build onboarding system prompt (special prompt that collects info)
    const systemPrompt = buildOnboardingSystemPrompt();

    // Build messages for Claude
    const messagesForClaude = updatedHistory.map(m => ({ role: m.role, content: m.content }));

    // Call Claude
    const claudeResponse = await chatWithClaude({
      systemPrompt,
      messages: messagesForClaude
    });

    // Check if email was just provided in this message
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    const emailInCurrentMessage = message.match(emailPattern);
    const collectedEmail = emailInCurrentMessage ? emailInCurrentMessage[0].toLowerCase() : null;

    // Also check full history for email
    const emailFromHistory = extractEmailFromConversation(updatedHistory);

    // Determine if ready to generate protocol
    const readinessPatterns = [
      /\bi have what i need\b/i,
      /\bready to put together\b/i,
      /\bi have enough information\b/i,
      /\blet me (?:now )?(?:create|put together|generate)\b/i,
      /\bcreate your (?:personalized )?protocol\b/i,
    ];
    const isReadyToGenerate = readinessPatterns.some(p => p.test(claudeResponse.content));

    const response: ChatResponse & { 
      collectedEmail?: string; 
      hasEmail?: boolean;
    } = {
      message: claudeResponse.content,
      isReadyToGenerate,
      exchangeCount,
      collectedEmail: collectedEmail || undefined,
      hasEmail: !!(collectedEmail || emailFromHistory),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[ONBOARDING CHAT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process. Please try again.' },
      { status: 500 }
    );
  }
}
