// Complete onboarding - Creates consultation, increments daily usage, sends email

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildProtocolSystemPrompt } from '@/lib/consultation/prompts';
import { sendVerificationEmail } from '@/lib/email/resend';
import { OnboardingState, getProfileData, buildProtocolContext } from '@/lib/onboarding/stateMachine';
import { HealthContext, GeneratedProtocol } from '@/lib/consultation/types';
import { validateConversationHistory } from '@/lib/utils/validation';
import { applyRateLimit, getClientIp } from '@/lib/utils/rateLimit';
import { logger } from '@/lib/utils/logger';
import crypto from 'crypto';

// Lazy admin client to avoid crash if env vars missing at module load
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;
function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    _supabaseAdmin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabaseAdmin;
}

interface OnboardingCompleteRequest {
  email: string;
  state: OnboardingState;
  conversationHistory: unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limit by IP (restrictive — this is an expensive endpoint)
    const ip = getClientIp(request);
    const rateLimitResult = applyRateLimit('onboarding-complete', ip, 5, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimitResult.retryAfter / 1000)) } }
      );
    }

    let supabaseAdmin: ReturnType<typeof createClient>;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Parse request body
    let body: OnboardingCompleteRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { email, state } = body;

    if (!email || !state) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate conversation history
    const validatedHistory = validateConversationHistory(body.conversationHistory || []);

    // Get profile data from state machine
    const profileData = getProfileData(state);

    // STEP 1: Create user account (or reuse if previous attempt failed mid-onboarding)
    const normalizedEmail = email.toLowerCase();
    const tempPassword = crypto.randomBytes(32).toString('hex');
    let userId: string;

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: tempPassword,
      email_confirm: false,
      user_metadata: { first_name: profileData.firstName, onboarding_in_progress: true },
    });

    if (createError) {
      if (createError.message?.includes('already been registered') || createError.message?.includes('duplicate')) {
        // Check if this is a retry (user created on a previous failed attempt).
        // Look up the existing user to check their onboarding_in_progress metadata.
        let existingUser: { id: string; user_metadata?: Record<string, unknown> } | null = null;
        let page = 1;
        while (!existingUser) {
          const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 50 });
          if (listError || !listData?.users?.length) break;
          const found = listData.users.find(u => u.email === normalizedEmail);
          if (found) { existingUser = found; break; }
          if (listData.users.length < 50) break; // last page
          page++;
        }

        if (existingUser?.user_metadata?.onboarding_in_progress === true) {
          // Previous attempt created the user but failed later — reuse this user
          logger.info('[ONBOARDING] Reusing user from previous failed attempt:', existingUser.id);
          userId = existingUser.id;

          // Check if a completed consultation already exists (previous attempt may have
          // succeeded all the way through but crashed at the very end, e.g. updateUserById)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: existingConsult } = await (supabaseAdmin.from('consultations') as any)
            .select('id')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .limit(1)
            .single();

          if (existingConsult) {
            logger.info('[ONBOARDING] Consultation already exists, marking complete and returning');
            // Mark complete (the previous attempt likely crashed before this)
            await supabaseAdmin.auth.admin.updateUserById(userId, {
              user_metadata: { first_name: profileData.firstName, onboarding_in_progress: false },
            });
            return NextResponse.json({
              success: true,
              firstName: profileData.firstName,
              emailSent: true,
              message: `Thanks ${profileData.firstName}! Check your email at ${email} to set your password and view your protocol.`,
            });
          }
        } else {
          // Genuinely existing completed account
          return NextResponse.json(
            { error: 'Account exists', existingUser: true },
            { status: 409 }
          );
        }
      } else {
        console.error('[ONBOARDING] User creation failed:', createError.message);
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
      }
    } else if (!newUser.user) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    } else {
      userId = newUser.user.id;
    }

    // STEP 2: Create profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabaseAdmin.from('profiles') as any).upsert({
      id: userId,
      tier: 'free',
      onboarding_completed: false,
      health_conditions: profileData.healthConditions,
      medications: profileData.medications.map((m: string) => ({ name: m, dosage: '', frequency: '' })),
      supplements: [],
      health_notes: profileData.primaryConcern ? `Primary concern: ${profileData.primaryConcern}` : null,
    });

    if (profileError) {
      console.error('[ONBOARDING] Profile creation warning:', profileError.message);
    }

    // STEP 3: Generate protocol (ONE API call)
    const healthContext: HealthContext = {
      health_conditions: profileData.healthConditions,
      medications: profileData.medications.map(m => ({ name: m, dosage: '', frequency: '' })),
      supplements: [],
      health_notes: profileData.primaryConcern,
      tier: 'free'
    };

    const protocolPrompt = buildProtocolSystemPrompt('free', healthContext);
    const protocolContext = buildProtocolContext(state);

    const protocolResponse = await chatWithClaude({
      systemPrompt: protocolPrompt,
      messages: [{ role: 'user', content: protocolContext }]
    });

    let protocol: GeneratedProtocol;
    try {
      let jsonStr = protocolResponse.content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```\n?/g, '');
      }
      protocol = JSON.parse(jsonStr);
    } catch {
      console.error('[ONBOARDING] Protocol parse error — using fallback');
      protocol = {
        title: 'Health Support',
        summary: 'Based on our conversation, here are wellness recommendations for you.',
        recommendations: [
          {
            name: 'General Wellness',
            type: 'other' as const,
            dosage: 'N/A',
            timing: 'N/A',
            rationale: 'We encountered an issue generating your detailed protocol. Please try a new consultation for personalized recommendations.',
            products: [],
          }
        ],
        disclaimer: 'Please consult with a healthcare provider before starting any new supplement regimen.'
      };
    }

    // STEP 4: Save consultation (use validated history)
    const formattedConversation = validatedHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date().toISOString()
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: consultation, error: consultError } = await (supabaseAdmin.from('consultations') as any)
      .insert({
        user_id: userId,
        initial_input: profileData.primaryConcern || 'Onboarding consultation',
        conversation_log: formattedConversation,
        protocol_data: protocol,
        status: 'completed',
        tier_at_creation: 'free',
      })
      .select('id')
      .single();

    if (consultError) {
      console.error('[ONBOARDING] Consultation save failed:', consultError.message);
    }

    const consultationId = consultation?.id;

    // STEP 5: Increment daily usage via RPC (uses CURRENT_DATE in Postgres
    // which is consistent with check_can_consult)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rpcResult = await (supabaseAdmin.rpc as any)('increment_daily_usage', {
      p_user_id: userId,
    });

    if (rpcResult.error) {
      console.error('[ONBOARDING] Daily usage increment warning:', rpcResult.error.message || rpcResult.error);
    }

    // STEP 6: Send verification email WITH consultation ID
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const redirectUrl = consultationId
      ? `${appUrl}/auth/callback?type=invite&consultation=${consultationId}`
      : `${appUrl}/auth/callback?type=invite`;

    const { data: inviteLinkData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: normalizedEmail,
      options: { redirectTo: redirectUrl },
    });

    if (inviteError) {
      console.error('[ONBOARDING] Invite link error:', inviteError.message);
    }

    let emailSent = false;
    if (inviteLinkData?.properties?.action_link) {
      try {
        await sendVerificationEmail({
          to: email,
          firstName: profileData.firstName,
          verificationUrl: inviteLinkData.properties.action_link,
          protocolSummary: protocol.summary,
        });
        emailSent = true;
      } catch (emailError) {
        console.error('[ONBOARDING] Email send error:', emailError instanceof Error ? emailError.message : emailError);
      }
    }

    // STEP 7: Mark onboarding as complete so retries won't reuse this user
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { first_name: profileData.firstName, onboarding_in_progress: false },
    });

    return NextResponse.json({
      success: true,
      firstName: profileData.firstName,
      emailSent,
      message: emailSent
        ? `Thanks ${profileData.firstName}! Check your email at ${email} to set your password and view your protocol.`
        : `Your protocol is ready, ${profileData.firstName}! We had trouble sending the email — please try signing in with your email.`,
    });

  } catch (error) {
    console.error('[ONBOARDING] Unexpected error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
