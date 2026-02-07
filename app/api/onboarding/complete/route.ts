// Complete onboarding v3 - Creates consultation FIRST, then sends email with consultation ID

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
  console.log('[ONBOARDING] ====== START ======');
  
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[ONBOARDING] Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body: OnboardingCompleteRequest = await request.json();
    const { email, state, conversationHistory } = body;

    if (!email || !state) {
      console.error('[ONBOARDING] Missing email or state');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    console.log('[ONBOARDING] Email:', email);

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      console.log('[ONBOARDING] User already exists');
      return NextResponse.json(
        { error: 'Account exists', existingUser: true },
        { status: 409 }
      );
    }

    const profileData = getProfileData(state);
    console.log('[ONBOARDING] Profile firstName:', profileData.firstName);
    console.log('[ONBOARDING] Primary concern:', profileData.primaryConcern);

    // ==========================================
    // STEP 1: Create user account
    // ==========================================
    console.log('[ONBOARDING] Step 1: Creating user...');
    const tempPassword = crypto.randomBytes(32).toString('hex');
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: tempPassword,
      email_confirm: false,
      user_metadata: { first_name: profileData.firstName, onboarding_in_progress: true },
    });

    if (createError || !newUser.user) {
      console.error('[ONBOARDING] User creation failed:', createError);
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    const userId = newUser.user.id;
    console.log('[ONBOARDING] Step 1 DONE - User ID:', userId);

    // ==========================================
    // STEP 2: Create profile
    // ==========================================
    console.log('[ONBOARDING] Step 2: Creating profile...');
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
    } else {
      console.log('[ONBOARDING] Step 2 DONE - Profile created');
    }

    // ==========================================
    // STEP 3: Generate protocol
    // ==========================================
    console.log('[ONBOARDING] Step 3: Generating protocol with Claude...');
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
      console.log('[ONBOARDING] Step 3 DONE - Protocol generated, recommendations:', protocol.recommendations?.length || 0);
    } catch (parseError) {
      console.error('[ONBOARDING] Protocol parse error:', parseError);
      protocol = {
        summary: 'Based on our conversation, here are wellness recommendations for you.',
        recommendations: [],
        disclaimer: 'Please consult with a healthcare provider before starting any new supplement regimen.'
      };
    }

    // ==========================================
    // STEP 4: Save consultation - THIS IS WHERE WE GET THE ID
    // ==========================================
    console.log('[ONBOARDING] Step 4: Saving consultation...');
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
      console.error('[ONBOARDING] ❌ Consultation save FAILED:', consultError);
      console.error('[ONBOARDING] Consultation error details:', JSON.stringify(consultError, null, 2));
    } else {
      console.log('[ONBOARDING] Step 4 DONE - Consultation ID:', consultation?.id);
    }

    const consultationId = consultation?.id;
    
    // Log the consultation ID explicitly
    console.log('[ONBOARDING] ========================================');
    console.log('[ONBOARDING] CONSULTATION ID TO USE:', consultationId);
    console.log('[ONBOARDING] Type of consultationId:', typeof consultationId);
    console.log('[ONBOARDING] ========================================');

    // ==========================================
    // STEP 5: Send verification email with consultation ID
    // ==========================================
    console.log('[ONBOARDING] Step 5: Generating invite link...');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Build redirect URL with consultation ID
    const redirectUrl = consultationId 
      ? `${appUrl}/auth/callback?type=invite&consultation=${consultationId}`
      : `${appUrl}/auth/callback?type=invite`;
    
    console.log('[ONBOARDING] Redirect URL for invite:', redirectUrl);
    
    const { data: inviteLinkData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email.toLowerCase(),
      options: { 
        redirectTo: redirectUrl
      },
    });

    if (inviteError) {
      console.error('[ONBOARDING] ❌ Invite link generation FAILED:', inviteError);
    } else {
      console.log('[ONBOARDING] Step 5 DONE - Invite link generated');
      console.log('[ONBOARDING] Action link:', inviteLinkData?.properties?.action_link?.substring(0, 100) + '...');
    }

    let emailSent = false;
    if (inviteLinkData?.properties?.action_link) {
      try {
        console.log('[ONBOARDING] Sending email...');
        await sendVerificationEmail({
          to: email,
          firstName: profileData.firstName,
          verificationUrl: inviteLinkData.properties.action_link,
          protocolSummary: protocol.summary,
        });
        emailSent = true;
        console.log('[ONBOARDING] ✅ Email sent successfully');
      } catch (emailError) {
        console.error('[ONBOARDING] ❌ Email send FAILED:', emailError);
      }
    }

    console.log('[ONBOARDING] ====== COMPLETE ======');
    console.log('[ONBOARDING] Final consultationId being returned:', consultationId);

    return NextResponse.json({
      success: true,
      userId,
      consultationId,
      protocol,
      firstName: profileData.firstName,
      emailSent,
      message: emailSent 
        ? `Thanks ${profileData.firstName}! Check your email at ${email} to set your password.`
        : `Protocol ready! We had trouble sending the email.`,
    });

  } catch (error) {
    console.error('[ONBOARDING] ❌ UNEXPECTED ERROR:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
