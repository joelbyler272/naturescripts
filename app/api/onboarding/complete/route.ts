// Complete onboarding v3 - Creates consultation FIRST, then sends email with consultation ID
// This ensures the user can be redirected directly to their protocol

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

    console.log('[ONBOARDING] Starting for email:', email);

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

    // Get profile data from state machine
    const profileData = getProfileData(state);
    console.log('[ONBOARDING] Profile data:', profileData.firstName);

    // ==========================================
    // STEP 1: Create user account
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
    console.log('[ONBOARDING] User created:', userId);

    // ==========================================
    // STEP 2: Create profile
    // ==========================================
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      tier: 'free',
      onboarding_completed: false,
      health_conditions: profileData.healthConditions,
      medications: profileData.medications.map(m => ({ name: m, dosage: '', frequency: '' })),
      supplements: [],
      health_notes: profileData.primaryConcern ? `Primary concern: ${profileData.primaryConcern}` : null,
    });

    if (profileError) {
      console.error('[ONBOARDING] Profile creation error:', profileError);
    }

    // ==========================================
    // STEP 3: Generate protocol (ONE API call)
    // ==========================================
    console.log('[ONBOARDING] Generating protocol...');
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
      console.log('[ONBOARDING] Protocol generated successfully');
    } catch (parseError) {
      console.error('[ONBOARDING] Protocol parse error:', parseError);
      protocol = {
        summary: 'Based on our conversation, here are wellness recommendations for you.',
        recommendations: [],
        disclaimer: 'Please consult with a healthcare provider before starting any new supplement regimen.'
      };
    }

    // ==========================================
    // STEP 4: Save consultation (GET THE ID!)
    // ==========================================
    const { data: consultation, error: consultError } = await supabaseAdmin
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

    if (consultError) {
      console.error('[ONBOARDING] Consultation save error:', consultError);
    }

    const consultationId = consultation?.id;
    console.log('[ONBOARDING] Consultation saved with ID:', consultationId);

    // ==========================================
    // STEP 5: Send verification email WITH consultation ID
    // ==========================================
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Build the redirect URL that includes the consultation ID
    const redirectPath = consultationId 
      ? `/protocols/${consultationId}?welcome=true`
      : '/dashboard?welcome=true';
    
    const { data: inviteLinkData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email.toLowerCase(),
      options: { 
        redirectTo: `${appUrl}/auth/callback?type=invite&consultation=${consultationId || ''}` 
      },
    });

    if (inviteError) {
      console.error('[ONBOARDING] Invite link error:', inviteError);
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
        console.log('[ONBOARDING] Verification email sent');
      } catch (emailError) {
        console.error('[ONBOARDING] Email send error:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      userId,
      consultationId,
      protocol,
      firstName: profileData.firstName,
      emailSent,
      message: emailSent 
        ? `Thanks ${profileData.firstName}! Check your email at ${email} to set your password and view your protocol.`
        : `Your protocol is ready, ${profileData.firstName}! We had trouble sending the email - please try signing in with your email.`,
    });

  } catch (error) {
    console.error('[ONBOARDING] Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
