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

// Development logging helper
const DEV_MODE = process.env.NODE_ENV === 'development';

function devLog(label: string, data: unknown) {
  if (DEV_MODE) {
    console.log('\n' + '='.repeat(60));
    console.log(`[CONSULTATION CHAT] ${label}`);
    console.log('='.repeat(60));
    if (typeof data === 'string') {
      console.log(data);
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
    console.log('='.repeat(60) + '\n');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
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

    devLog('INCOMING REQUEST', {
      userId: user.id,
      consultationId,
      userMessage: message,
      conversationHistoryLength: conversationHistory.length
    });

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

    devLog('HEALTH CONTEXT FROM DATABASE', healthContext);

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
        devLog('PRO USER CONSULTATION HISTORY', consultationHistoryData);
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

    // Count exchanges (user messages only, not including the greeting)
    const exchangeCount = updatedHistory.filter(m => m.role === 'user').length;

    devLog('EXCHANGE COUNT', { 
      exchangeCount, 
      tier,
      maxExchangesForTier: tier === 'free' ? 2 : 4
    });

    // Build system prompt
    const systemPrompt = buildChatSystemPrompt(tier, healthContext, consultationHistoryData);

    devLog('SYSTEM PROMPT SENT TO CLAUDE', systemPrompt);

    // Build messages for Claude
    const messagesForClaude = updatedHistory.map(m => ({ role: m.role, content: m.content }));
    
    devLog('CONVERSATION HISTORY SENT TO CLAUDE', messagesForClaude);

    // Call Claude
    const claudeResponse = await chatWithClaude({
      systemPrompt,
      messages: messagesForClaude
    });

    devLog('CLAUDE RAW RESPONSE', claudeResponse);

    // Determine if ready to generate protocol
    // FIXED: Only trigger when Claude explicitly says the ready phrase
    // Don't auto-trigger based on exchange count alone
    const isReadyIndicator = claudeResponse.toLowerCase().includes('i have what i need') ||
                            claudeResponse.toLowerCase().includes('ready to put together') ||
                            claudeResponse.toLowerCase().includes('i have enough information');
    
    // Only set ready if Claude explicitly indicates readiness
    const isReadyToGenerate = isReadyIndicator;

    devLog('READY TO GENERATE CHECK', {
      isReadyIndicator,
      isReadyToGenerate,
      exchangeCount,
      claudeResponsePreview: claudeResponse.substring(0, 100) + '...'
    });

    const response: ChatResponse = {
      message: claudeResponse,
      isReadyToGenerate,
      exchangeCount
    };

    devLog('RESPONSE SENT TO FRONTEND', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[CONSULTATION CHAT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process consultation. Please try again.' },
      { status: 500 }
    );
  }
}
