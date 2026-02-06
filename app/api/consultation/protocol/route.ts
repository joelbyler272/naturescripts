import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateProtocolWithClaude } from '@/lib/anthropic/client';
import { buildProtocolSystemPrompt } from '@/lib/consultation/prompts';
import { logConsultationCall, printUsageSummary } from '@/lib/consultation/debugLogger';
import { 
  HealthContext, 
  GeneratedProtocol,
  GenerateProtocolRequest,
  Recommendation
} from '@/lib/consultation/types';
import { applyRateLimit, RateLimitResult } from '@/lib/utils/rateLimit';
import { addAffiliateLinks } from '@/lib/consultation/affiliateLinks';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limiting
  const rateLimitResult: RateLimitResult = applyRateLimit('consultation-protocol', 10, 60000);
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
    const body: GenerateProtocolRequest = await request.json();
    const { conversationHistory, consultationId } = body;

    if (!conversationHistory || conversationHistory.length === 0) {
      return NextResponse.json({ error: 'Conversation history is required' }, { status: 400 });
    }

    // Get user's health context
    const { data: healthData, error: healthError } = await supabase
      .rpc('get_user_health_context', { p_user_id: user.id });
    
    if (healthError) {
      console.error('[PROTOCOL GENERATION] Failed to get health context:', healthError);
    }

    const healthContext: HealthContext = healthData || {
      health_conditions: [],
      medications: [],
      supplements: [],
      health_notes: '',
      tier: 'free'
    };

    const tier = healthContext.tier || 'free';

    // Extract the user's primary concern from the first user message
    const firstUserMessage = conversationHistory.find(m => m.role === 'user');
    const primaryConcern = firstUserMessage?.content || 'General wellness';

    // Build system prompt for protocol generation
    const systemPrompt = buildProtocolSystemPrompt(tier, healthContext);

    // Build the final message asking for the protocol
    const messagesWithRequest: { role: 'user' | 'assistant'; content: string }[] = [
      ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
      {
        role: 'user' as const,
        content: 'Based on our conversation, please generate my personalized protocol as a JSON object.'
      }
    ];

    // Call Claude for protocol generation
    const claudeResponse = await generateProtocolWithClaude({
      systemPrompt,
      messages: messagesWithRequest,
      maxTokens: 2048
    });

    // Log the full consultation call with cost tracking
    logConsultationCall({
      endpoint: 'protocol',
      userId: user.id,
      consultationId: consultationId || undefined,
      request: {
        systemPrompt,
        messages: messagesWithRequest,
      },
      response: {
        content: claudeResponse.content,
        model: claudeResponse.usage.model,
      },
      healthContext,
      metadata: {
        tier,
        primaryConcern,
        conversationLength: conversationHistory.length,
      },
    });

    // Print usage summary after each call
    printUsageSummary();

    // Parse the JSON response
    let protocolData: Partial<GeneratedProtocol>;
    try {
      // Try to extract JSON from the response (Claude might wrap it in markdown)
      const jsonMatch = claudeResponse.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      protocolData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[PROTOCOL GENERATION] Failed to parse protocol JSON:', parseError);
      console.error('[PROTOCOL GENERATION] Raw response:', claudeResponse.content);
      return NextResponse.json(
        { error: 'Failed to generate protocol. Please try again.' },
        { status: 500 }
      );
    }

    // Add IDs and affiliate links to recommendations
    const recommendations: Recommendation[] = (protocolData.recommendations || []).map((rec, index) => ({
      ...rec,
      id: `rec-${Date.now()}-${index}`,
      products: addAffiliateLinks(rec.products || [])
    }));

    // Build the final protocol
    const protocol: GeneratedProtocol = {
      id: `protocol-${Date.now()}`,
      summary: protocolData.summary || 'Your personalized wellness protocol.',
      recommendations,
      dietary_shifts: tier === 'pro' ? (protocolData.dietary_shifts || []).map((ds, i) => ({
        ...ds,
        id: `diet-${Date.now()}-${i}`
      })) : undefined,
      lifestyle_practices: tier === 'pro' ? (protocolData.lifestyle_practices || []).map((lp, i) => ({
        ...lp,
        id: `lifestyle-${Date.now()}-${i}`
      })) : undefined,
      tracking_suggestions: tier === 'pro' ? (protocolData.tracking_suggestions || []).map((ts, i) => ({
        ...ts,
        id: `tracking-${Date.now()}-${i}`
      })) : undefined,
      disclaimer: protocolData.disclaimer || 'If symptoms persist or worsen, please consult a healthcare provider.',
      created_at: new Date().toISOString()
    };

    // Save to database - also update initial_input with the primary concern
    if (consultationId) {
      const { error: updateError } = await supabase
        .from('consultations')
        .update({
          initial_input: primaryConcern,
          protocol_data: protocol,
          conversation_log: conversationHistory,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', consultationId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('[PROTOCOL GENERATION] Failed to save protocol:', updateError);
      }
    }

    // Increment daily usage
    const { error: usageError } = await supabase.rpc('increment_daily_usage', { p_user_id: user.id });
    if (usageError) {
      console.error('[PROTOCOL GENERATION] Failed to increment usage:', usageError);
    }

    return NextResponse.json({
      protocol,
      consultationId
    });

  } catch (error) {
    console.error('[PROTOCOL GENERATION] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate protocol. Please try again.' },
      { status: 500 }
    );
  }
}
