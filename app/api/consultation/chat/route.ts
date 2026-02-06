import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildChatSystemPrompt } from '@/lib/consultation/prompts';
import { 
  HealthContext, 
  ConsultationHistory, 
  ConversationMessage,
  ChatRequest,
  ChatResponse 
} from '@/lib/consultation/types';
import { applyRateLimit, RateLimitResult } from '@/lib/utils/rateLimit';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limiting
  const rateLimitResult: RateLimitResult = applyRateLimit('consultation-chat', 20, 60000); // 20 per minute
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { 
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rateLimitResult.retryAfter / 1000)) }
      }
    );
  }

  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: ChatRequest = await request.json();
    const { message, conversationHistory, consultationId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get user's health context
    const { data: healthData, error: healthError } = await supabase
      .rpc('get_user_health_context', { p_user_id: user.id });
    
    if (healthError) {
      logger.error('Failed to get health context:', healthError);
    }

    const healthContext: HealthContext = healthData || {
      health_conditions: [],
      medications: [],
      supplements: [],
      health_notes: '',
      tier: 'free'
    };

    const tier = healthContext.tier || 'free';

    // For Pro users, get consultation history
    let consultationHistoryData: ConsultationHistory[] = [];
    if (tier === 'pro') {
      const { data: historyData, error: historyError } = await supabase
        .rpc('get_consultation_history', { p_user_id: user.id, p_limit: 5 });
      
      if (historyError) {
        logger.error('Failed to get consultation history:', historyError);
      } else if (historyData) {
        consultationHistoryData = historyData;
      }
    }

    // Build conversation for Claude
    const updatedHistory: ConversationMessage[] = [
      ...conversationHistory,
      {
        id: `msg-${Date.now()}`,
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString()
      }
    ];

    // Count exchanges (user messages)
    const exchangeCount = updatedHistory.filter(m => m.role === 'user').length;

    // Build system prompt
    const systemPrompt = buildChatSystemPrompt(tier, healthContext, consultationHistoryData);

    // Call Claude
    const claudeResponse = await chatWithClaude({
      systemPrompt,
      messages: updatedHistory.map(m => ({ role: m.role, content: m.content }))
    });

    // Determine if ready to generate protocol
    // Free: after 1-2 exchanges, Pro: after 1-4 exchanges or when Claude indicates
    const maxExchanges = tier === 'free' ? 2 : 4;
    const isReadyIndicator = claudeResponse.toLowerCase().includes('i have what i need') ||
                            claudeResponse.toLowerCase().includes('ready to put together');
    const isReadyToGenerate = exchangeCount >= maxExchanges || isReadyIndicator;

    const response: ChatResponse = {
      message: claudeResponse,
      isReadyToGenerate,
      exchangeCount
    };

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Consultation chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation. Please try again.' },
      { status: 500 }
    );
  }
}
