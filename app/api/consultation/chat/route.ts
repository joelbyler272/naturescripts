import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildChatSystemPrompt } from '@/lib/consultation/prompts';
import { logConsultationCall, printUsageSummary } from '@/lib/consultation/debugLogger';
import { recordApiUsage } from '@/lib/admin/apiUsage';
import {
  HealthContext,
  ConsultationHistory,
  ConversationMessage,
  ChatResponse
} from '@/lib/consultation/types';
import { applyRateLimit } from '@/lib/utils/rateLimit';
import { validateConversationHistory, CHAT_LIMITS } from '@/lib/utils/validation';
import { cacheGet, cacheSet, healthContextKey, CACHE_TTL } from '@/lib/utils/cache';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate first (before rate limiting)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Per-user rate limiting
    const rateLimitResult = await applyRateLimit('consultation-chat', user.id, 20, 60000);
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
    let body: { message?: string; conversationHistory?: unknown; consultationId?: string; parentProtocolSummary?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { message, consultationId, parentProtocolSummary } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `Message too long (max ${CHAT_LIMITS.MAX_MESSAGE_LENGTH} characters)` }, { status: 400 });
    }

    // Validate conversation history
    const validatedHistory = validateConversationHistory(body.conversationHistory || []);

    // Server-side consultation limit check on first message (new consultation)
    if (validatedHistory.length === 0 && !consultationId) {
      const { data: limitData, error: limitError } = await supabase
        .rpc('check_can_consult', { p_user_id: user.id });

      const limitResult = limitError ? null : limitData?.[0];
      if (limitError || !limitResult || !limitResult.can_consult) {
        return NextResponse.json(
          { error: 'Weekly consultation limit reached. Upgrade to Pro for unlimited consultations.' },
          { status: 403 }
        );
      }
    }

    // Get user's health context (cached for 5 minutes)
    const cacheKey = healthContextKey(user.id);
    let healthContext: HealthContext = (await cacheGet<HealthContext>(cacheKey)) as HealthContext;

    if (!healthContext) {
      const { data: healthData, error: healthError } = await supabase
        .rpc('get_user_health_context', { p_user_id: user.id });

      if (healthError) {
        console.error('[CONSULTATION CHAT] Failed to get health context:', healthError);
      }

      healthContext = healthData || {
        health_conditions: [],
        medications: [],
        supplements: [],
        health_notes: '',
        tier: 'free'
      };

      // Cache for subsequent requests
      cacheSet(cacheKey, healthContext, CACHE_TTL.HEALTH_CONTEXT).catch(() => {});
    }

    const tier = healthContext.tier || 'free';

    // For Pro users, get consultation history
    let consultationHistoryData: ConsultationHistory[] = [];
    if (tier === 'pro') {
      const { data: historyData, error: historyError } = await supabase
        .rpc('get_consultation_history', { p_user_id: user.id, p_limit: 5 });

      if (historyError) {
        console.error('[CONSULTATION CHAT] Failed to get consultation history:', historyError);
      } else if (historyData) {
        consultationHistoryData = historyData;
      }
    }

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

    // Count exchanges (user messages only)
    const exchangeCount = updatedHistory.filter(m => m.role === 'user').length;

    // Build system prompt
    let systemPrompt = buildChatSystemPrompt(tier, healthContext, consultationHistoryData);

    // If adjusting a previous protocol, append context
    if (parentProtocolSummary && typeof parentProtocolSummary === 'string') {
      const sanitizedSummary = parentProtocolSummary.slice(0, 2000);
      systemPrompt += `\n\n## Adjusting Previous Protocol\nThe user is adjusting a previous protocol. Here is the summary:\n<previous_protocol>\n${sanitizedSummary}\n</previous_protocol>\nAsk what they'd like to change about their current protocol. Focus on understanding what isn't working or what new symptoms have appeared.`;
    }

    // Build messages for Claude
    const messagesForClaude = updatedHistory.map(m => ({ role: m.role, content: m.content }));

    // Call Claude
    const claudeResponse = await chatWithClaude({
      systemPrompt,
      messages: messagesForClaude
    });

    // Record API usage (fire-and-forget — don't let tracking failures kill the response)
    recordApiUsage({
      userId: user.id,
      consultationId: consultationId || undefined,
      endpoint: 'chat',
      model: claudeResponse.usage.model,
      inputTokens: claudeResponse.usage.inputTokens,
      outputTokens: claudeResponse.usage.outputTokens,
    }).catch(() => { /* silently ignore tracking failures */ });

    // Log the full consultation call with cost tracking (dev only)
    logConsultationCall({
      endpoint: 'chat',
      userId: user.id,
      consultationId: consultationId || undefined,
      request: {
        systemPrompt,
        messages: messagesForClaude,
        userMessage: message,
      },
      response: {
        content: claudeResponse.content,
        model: claudeResponse.usage.model,
      },
      healthContext,
      metadata: {
        tier,
        exchangeCount,
        consultationHistoryCount: consultationHistoryData.length,
      },
    });

    // Print usage summary after each call
    printUsageSummary();

    // Determine if ready to generate protocol (word boundary regex for robustness)
    const readinessPatterns = [
      /\bi have what i need\b/i,
      /\bready to put together\b/i,
      /\bi have enough information\b/i,
      /\blet me (?:now )?(?:create|put together|generate)\b/i,
    ];
    const isReadyToGenerate = readinessPatterns.some(p => p.test(claudeResponse.content));

    const response: ChatResponse = {
      message: claudeResponse.content,
      isReadyToGenerate,
      exchangeCount
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[CONSULTATION CHAT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation. Please try again.' },
      { status: 500 }
    );
  }
}
