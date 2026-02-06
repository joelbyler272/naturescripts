// Complete onboarding v2 - Uses state machine data instead of extracting from conversation
// Only ONE API call: protocol generation

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildProtocolSystemPrompt } from '@/lib/consultation/prompts';
import { sendVerificationEmail } from '@/lib/email/resend';
import { OnboardingState, getProfileData, buildProtocolContext } from '@/lib/onboarding/stateMachine';
import { HealthContext, GeneratedProtocol } from '@/lib/consultation/types';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

interface OnboardingCompleteRequest {
  email: string;
  state: OnboardingState;
  conversationHistory: Array<{ role: string; content: string }>;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body: OnboardingCompleteRequest = await request.json();
    const { email, state, conversationHistory } = body;

    if (!email || !state) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Account exists', existingUser: true },
        { status: 409 }
      );
    }

    // Get profile data from state machine (no API call needed!)
    const profileData = getProfileData(state);

    // ==========================================
    // Create user account
    // ==========================================
    const tempPassword = crypto.randomBytes(32).toString('hex');
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: tempPassword,
      email_confirm: false,
      user_metadata: { first_name: profileData.firstName, onboarding_in_progress: true },
    });

    if (createError || !newUser.user) {
      console.error('[ONBOARDING] Failed to create user:', createError);
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    const userId = newUser.user.id;

    // ==========================================
    // Create profile
    // ==========================================
    await supabaseAdmin.from('profiles').upsert({
      id: userId,
      tier: 'free',
      onboarding_completed: false,
      health_conditions: profileData.healthConditions,
      medications: profileData.medications.map(m => ({ name: m, dosage: '', frequency: '' })),
      supplements: [],
      health_notes: profileData.primaryConcern ? `Primary concern: ${profileData.primaryConcern}` : null,
    });

    // ==========================================
    // Generate protocol (ONE API call)
    // ==========================================
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
      protocol = {
        summary: 'Based on our conversation, here are wellness recommendations for you.',
        recommendations: [],
        disclaimer: 'Please consult with a healthcare provider before starting any new supplement regimen.'
      };
    }

    // ==========================================
    // Save consultation
    // ==========================================
    const { data: consultation } = await supabaseAdmin
      .from('consultations')
      .insert({
        user_id: userId,
        initial_input: profileData.primaryConcern || 'Onboarding consultation',
        conversation_history: conversationHistory,
        protocol_data: protocol,
        status: 'completed',
        tier_at_creation: 'free',
      })
      .select('id')
      .single();

    // ==========================================
    // Send verification email
    // ==========================================
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const { data: inviteLinkData } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email.toLowerCase(),
      options: { redirectTo: `${appUrl}/auth/callback?type=invite` },
    });

    if (inviteLinkData?.properties?.action_link) {
      await sendVerificationEmail({
        to: email,
        firstName: profileData.firstName,
        verificationUrl: inviteLinkData.properties.action_link,
        protocolSummary: protocol.summary,
      });
    }

    return NextResponse.json({
      success: true,
      userId,
      consultationId: consultation?.id,
      protocol,
      firstName: profileData.firstName,
      message: `Thanks ${profileData.firstName}! Check your email at ${email} to set your password.`,
    });

  } catch (error) {
    console.error('[ONBOARDING] Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
