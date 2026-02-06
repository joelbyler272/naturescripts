import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildChatSystemPrompt } from '@/lib/consultation/prompts';
import { logConsultation, calculateCost } from '@/lib/consultation/logger';
import { 
  HealthContext, 
  ConsultationHistory, 
  ConversationMessage,
  ChatRequest,
  ChatResponse 
} from '@/lib/consultation/types';
import { applyRateLimit, RateLimitResult } from '@/lib/utils/rateLimit';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  // Rate limiting
  const rateLimitResult: RateLimitResult = applyRateLimit('consultation-chat', 20, 60000);
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
      console.error('[CONSULTATION CHAT] Failed to get health context:', healthError);
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
        console.error('[CONSULTATION CHAT] Failed to get consultation history:', historyError);
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

    // Count exchanges (user messages only)
    const exchangeCount = updatedHistory.filter(m => m.role === 'user').length;

    // Build system prompt
    const systemPrompt = buildChatSystemPrompt(tier, healthContext, consultationHistoryData);

    // Build messages for Claude
    const messagesForClaude = updatedHistory.map(m => ({ role: m.role, content: m.content }));

    // Call Claude
    const claudeResponse = await chatWithClaude({
      systemPrompt,
      messages: messagesForClaude
    });

    const duration = Date.now() - startTime;

    // Log the consultation with usage data
    logConsultation({
      timestamp: new Date().toISOString(),
      type: 'chat',
      userId: user.id,
      consultationId: consultationId || undefined,
      tier,
      request: {
        systemPrompt,
        messages: messagesForClaude,
        healthContext
      },
      response: {
        content: claudeResponse.content,
        usage: claudeResponse.usage,
        cost: calculateCost(claudeResponse.usage)
      },
      duration
    });

    // Determine if ready to generate protocol
    const isReadyIndicator = claudeResponse.content.toLowerCase().includes('i have what i need') ||
                            claudeResponse.content.toLowerCase().includes('ready to put together') ||
                            claudeResponse.content.toLowerCase().includes('i have enough information');
    
    const isReadyToGenerate = isReadyIndicator;

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
