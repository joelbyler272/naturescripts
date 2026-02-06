import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateProtocolWithClaude } from '@/lib/anthropic/client';
import { buildProtocolSystemPrompt } from '@/lib/consultation/prompts';
import { logConsultationCall, printUsageSummary } from '@/lib/consultation/debugLogger';
import { recordApiUsage } from '@/lib/admin/apiUsage';
import {
  HealthContext,
  GeneratedProtocol,
  Recommendation
} from '@/lib/consultation/types';
import { applyRateLimit, RateLimitResult } from '@/lib/utils/rateLimit';
import { addAffiliateLinks } from '@/lib/consultation/affiliateLinks';
import { validateConversationHistory } from '@/lib/utils/validation';

/**
 * Extract the first balanced JSON object from text.
 * Strips markdown code blocks first, then finds balanced braces.
 */
function extractJsonObject(text: string): string | null {
  const stripped = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1');
  const start = stripped.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < stripped.length; i++) {
    if (stripped[i] === '{') depth++;
    else if (stripped[i] === '}') depth--;
    if (depth === 0) return stripped.substring(start, i + 1);
  }
  return null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate first (before rate limiting)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Per-user rate limiting
    const rateLimitResult: RateLimitResult = applyRateLimit('consultation-protocol', user.id, 10, 60000);
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
    let body: { conversationHistory?: unknown; consultationId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { consultationId } = body;

    // Validate conversation history
    const validatedHistory = validateConversationHistory(body.conversationHistory || []);
    if (validatedHistory.length === 0) {
      return NextResponse.json({ error: 'Conversation history is required' }, { status: 400 });
    }

    // Verify consultation ownership before making expensive Claude call
    if (consultationId) {
      const { data: existingConsultation, error: ownershipError } = await supabase
        .from('consultations')
        .select('id')
        .eq('id', consultationId)
        .eq('user_id', user.id)
        .single();
      if (ownershipError || !existingConsultation) {
        return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
      }
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
    const firstUserMessage = validatedHistory.find(m => m.role === 'user');
    const primaryConcern = firstUserMessage?.content || 'General wellness';

    // Build system prompt for protocol generation
    const systemPrompt = buildProtocolSystemPrompt(tier, healthContext);

    // Build the final message asking for the protocol
    const messagesWithRequest: { role: 'user' | 'assistant'; content: string }[] = [
      ...validatedHistory.map(m => ({ role: m.role, content: m.content })),
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

    // Record API usage to database for admin dashboard
    await recordApiUsage({
      userId: user.id,
      consultationId: consultationId || undefined,
      endpoint: 'protocol',
      model: claudeResponse.usage.model,
      inputTokens: claudeResponse.usage.inputTokens,
      outputTokens: claudeResponse.usage.outputTokens,
    });

    // Log the full consultation call with cost tracking (dev only)
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
        conversationLength: validatedHistory.length,
      },
    });

    // Print usage summary after each call
    printUsageSummary();

    // Parse the JSON response
    let protocolData: Record<string, unknown>;
    try {
      const jsonStr = extractJsonObject(claudeResponse.content);
      if (!jsonStr) {
        throw new Error('No JSON found in response');
      }
      protocolData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[PROTOCOL GENERATION] Failed to parse protocol JSON:', parseError);
      console.error('[PROTOCOL GENERATION] Raw response (truncated):', claudeResponse.content.substring(0, 200));
      return NextResponse.json(
        { error: 'Failed to generate protocol. Please try again.' },
        { status: 500 }
      );
    }

    // Validate parsed protocol data shape
    if (!protocolData || typeof protocolData !== 'object') {
      return NextResponse.json(
        { error: 'Failed to generate protocol. Please try again.' },
        { status: 500 }
      );
    }
    const summary = typeof protocolData.summary === 'string'
      ? protocolData.summary
      : 'Your personalized wellness protocol.';
    const rawRecommendations = Array.isArray(protocolData.recommendations)
      ? protocolData.recommendations
      : [];
    const rawDietaryShifts = Array.isArray(protocolData.dietary_shifts)
      ? protocolData.dietary_shifts
      : [];
    const rawLifestylePractices = Array.isArray(protocolData.lifestyle_practices)
      ? protocolData.lifestyle_practices
      : [];
    const rawTrackingSuggestions = Array.isArray(protocolData.tracking_suggestions)
      ? protocolData.tracking_suggestions
      : [];
    const disclaimer = typeof protocolData.disclaimer === 'string'
      ? protocolData.disclaimer
      : 'If symptoms persist or worsen, please consult a healthcare provider.';

    // Add IDs and affiliate links to recommendations
    const recommendations: Recommendation[] = rawRecommendations.map((rec: Record<string, unknown>) => ({
      name: typeof rec.name === 'string' ? rec.name : 'Unknown',
      type: typeof rec.type === 'string' ? rec.type as Recommendation['type'] : 'other',
      dosage: typeof rec.dosage === 'string' ? rec.dosage : '',
      timing: typeof rec.timing === 'string' ? rec.timing : '',
      rationale: typeof rec.rationale === 'string' ? rec.rationale : '',
      cautions: typeof rec.cautions === 'string' ? rec.cautions : undefined,
      id: crypto.randomUUID(),
      products: addAffiliateLinks(Array.isArray(rec.products) ? rec.products : [])
    }));

    // Build the final protocol
    const protocol: GeneratedProtocol = {
      id: crypto.randomUUID(),
      summary,
      recommendations,
      dietary_shifts: tier === 'pro' ? rawDietaryShifts.map((ds: Record<string, unknown>) => ({
        id: crypto.randomUUID(),
        action: typeof ds.action === 'string' ? ds.action as 'add' | 'reduce' | 'avoid' : 'add',
        item: typeof ds.item === 'string' ? ds.item : '',
        rationale: typeof ds.rationale === 'string' ? ds.rationale : '',
      })) : undefined,
      lifestyle_practices: tier === 'pro' ? rawLifestylePractices.map((lp: Record<string, unknown>) => ({
        id: crypto.randomUUID(),
        practice: typeof lp.practice === 'string' ? lp.practice : '',
        timing: typeof lp.timing === 'string' ? lp.timing : undefined,
        rationale: typeof lp.rationale === 'string' ? lp.rationale : '',
      })) : undefined,
      tracking_suggestions: tier === 'pro' ? rawTrackingSuggestions.map((ts: Record<string, unknown>) => ({
        id: crypto.randomUUID(),
        metric: typeof ts.metric === 'string' ? ts.metric : '',
        frequency: ts.frequency === 'weekly' ? 'weekly' as const : 'daily' as const,
        description: typeof ts.description === 'string' ? ts.description : '',
      })) : undefined,
      disclaimer,
      created_at: new Date().toISOString()
    };

    // Save to database - also update initial_input with the primary concern
    if (consultationId) {
      const { error: updateError } = await supabase
        .from('consultations')
        .update({
          initial_input: primaryConcern,
          protocol_data: protocol,
          conversation_log: validatedHistory,
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
