// Complete onboarding - Create user account and generate protocol
// Called after email is collected during onboarding chat

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildProtocolSystemPrompt } from '@/lib/consultation/prompts';
import { buildProfileExtractionPrompt } from '@/lib/consultation/onboardingPrompts';
import { sendVerificationEmail } from '@/lib/email/resend';
import { ConversationMessage, HealthContext, GeneratedProtocol } from '@/lib/consultation/types';
import { validateConversationHistory } from '@/lib/utils/validation';
import crypto from 'crypto';

// Admin client for user creation
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

interface OnboardingCompleteRequest {
  email: string;
  conversationHistory: unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify we have the service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[ONBOARDING COMPLETE] Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse request
    let body: OnboardingCompleteRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate conversation history
    const conversationHistory = validateConversationHistory(body.conversationHistory || []);
    
    if (conversationHistory.length < 4) {
      return NextResponse.json(
        { error: 'Incomplete conversation. Please complete the consultation first.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'An account with this email already exists.',
          existingUser: true,
          message: 'Please sign in to continue your consultation.'
        },
        { status: 409 }
      );
    }

    // ==========================================
    // STEP 1: Extract profile data from conversation
    // ==========================================
    const extractionPrompt = buildProfileExtractionPrompt(
      conversationHistory.map(m => ({
        id: crypto.randomUUID(),
        role: m.role,
        content: m.content,
        timestamp: new Date().toISOString()
      }))
    );

    const extractionResponse = await chatWithClaude({
      systemPrompt: 'You are a data extraction assistant. Extract the requested information and return ONLY valid JSON.',
      messages: [{ role: 'user', content: extractionPrompt }]
    });

    let profileData = {
      firstName: 'Friend',
      healthConditions: [] as string[],
      medications: [] as string[],
      supplements: [] as string[],
      primaryConcern: '',
    };

    try {
      // Clean the response (remove markdown code blocks if present)
      let jsonStr = extractionResponse.content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```\n?/g, '');
      }
      const extracted = JSON.parse(jsonStr);
      profileData = {
        firstName: extracted.firstName || 'Friend',
        healthConditions: extracted.healthConditions || [],
        medications: extracted.medications || [],
        supplements: extracted.supplements || [],
        primaryConcern: extracted.primaryConcern || '',
      };
    } catch (parseError) {
      console.error('[ONBOARDING COMPLETE] Failed to parse extracted data:', parseError);
      // Continue with defaults
    }

    // ==========================================
    // STEP 2: Create user account (passwordless)
    // ==========================================
    const tempPassword = crypto.randomBytes(32).toString('hex');

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: tempPassword,
      email_confirm: false,
      user_metadata: {
        first_name: profileData.firstName,
        onboarding_in_progress: true,
      },
    });

    if (createError || !newUser.user) {
      console.error('[ONBOARDING COMPLETE] Failed to create user:', createError);
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    const userId = newUser.user.id;

    // ==========================================
    // STEP 3: Create profile with health data
    // ==========================================
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        tier: 'free',
        onboarding_completed: false,
        health_conditions: profileData.healthConditions,
        medications: profileData.medications.map(m => ({ name: m, dosage: '', frequency: '' })),
        supplements: profileData.supplements.map(s => ({ name: s, dosage: '', frequency: '' })),
        health_notes: profileData.primaryConcern ? `Primary concern: ${profileData.primaryConcern}` : null,
      });

    if (profileError) {
      console.error('[ONBOARDING COMPLETE] Failed to create profile:', profileError);
    }

    // ==========================================
    // STEP 4: Generate protocol
    // ==========================================
    const healthContext: HealthContext = {
      health_conditions: profileData.healthConditions,
      medications: profileData.medications.map(m => ({ name: m, dosage: '', frequency: '' })),
      supplements: profileData.supplements.map(s => ({ name: s, dosage: '', frequency: '' })),
      health_notes: profileData.primaryConcern,
      tier: 'free'
    };

    const protocolPrompt = buildProtocolSystemPrompt('free', healthContext);
    const conversationSummary = conversationHistory
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const protocolResponse = await chatWithClaude({
      systemPrompt: protocolPrompt,
      messages: [{
        role: 'user',
        content: `Based on this consultation conversation, generate a personalized protocol:\n\n${conversationSummary}`
      }]
    });

    let protocol: GeneratedProtocol | null = null;
    try {
      let jsonStr = protocolResponse.content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```\n?/g, '');
      }
      protocol = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('[ONBOARDING COMPLETE] Failed to parse protocol:', parseError);
      // Create a basic protocol structure
      protocol = {
        summary: 'Based on our conversation, here are some general wellness recommendations.',
        recommendations: [],
        disclaimer: 'Please consult with a healthcare provider before starting any new supplement regimen.'
      };
    }

    // ==========================================
    // STEP 5: Save consultation and protocol
    // ==========================================
    const { data: consultation, error: consultationError } = await supabaseAdmin
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

    if (consultationError) {
      console.error('[ONBOARDING COMPLETE] Failed to save consultation:', consultationError);
    }

    // ==========================================
    // STEP 6: Generate magic link and send email
    // ==========================================
    const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase(),
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/set-password`,
      },
    });

    if (magicLinkError || !magicLinkData) {
      console.error('[ONBOARDING COMPLETE] Failed to generate magic link:', magicLinkError);
    }

    const verificationUrl = magicLinkData?.properties?.action_link;

    // Send verification email
    if (verificationUrl) {
      const emailResult = await sendVerificationEmail({
        to: email,
        firstName: profileData.firstName,
        verificationUrl,
        protocolSummary: protocol?.summary,
      });

      if (!emailResult.success) {
        console.error('[ONBOARDING COMPLETE] Failed to send email:', emailResult.error);
      }
    }

    // ==========================================
    // STEP 7: Return success with protocol
    // ==========================================
    return NextResponse.json({
      success: true,
      userId,
      consultationId: consultation?.id,
      protocol,
      firstName: profileData.firstName,
      message: `Thanks ${profileData.firstName}! Check your email at ${email} to save your protocol and set up your account.`,
    });

  } catch (error) {
    console.error('[ONBOARDING COMPLETE] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
