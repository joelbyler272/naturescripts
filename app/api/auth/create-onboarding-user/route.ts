// API route to create a user during onboarding (passwordless)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendVerificationEmail } from '@/lib/email/resend';
import { applyRateLimit, getClientIp } from '@/lib/utils/rateLimit';
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

export interface CreateOnboardingUserRequest {
  email: string;
  firstName: string;
  profileData: {
    healthConditions?: string[];
    medications?: string[];
    supplements?: string[];
    primaryConcern?: string;
  };
  protocolSummary?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limit by IP
    const ip = getClientIp(request);
    const rateLimitResult = applyRateLimit('create-onboarding-user', ip, 5, 60000);
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

    // Parse request
    let body: CreateOnboardingUserRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { email, firstName, profileData, protocolSummary } = body;

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Fallback: try creating the user directly — Supabase will reject duplicates
    // Generate a temporary password (user will set their own via verification link)
    const tempPassword = crypto.randomBytes(32).toString('hex');

    // Create user without email confirmation (we'll handle verification ourselves)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: tempPassword,
      email_confirm: false,
      user_metadata: {
        first_name: firstName,
        onboarding_in_progress: true,
      },
    });

    if (createError) {
      // Supabase returns a specific error for duplicate emails
      if (createError.message?.includes('already been registered') || createError.message?.includes('duplicate')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in.' },
          { status: 409 }
        );
      }
      console.error('[ONBOARDING USER] Failed to create user:', createError.message);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    if (!newUser.user) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    const userId = newUser.user.id;

    // Create profile with health data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabaseAdmin.from('profiles') as any)
      .upsert({
        id: userId,
        tier: 'free',
        onboarding_completed: false,
        health_conditions: profileData.healthConditions || [],
        medications: profileData.medications?.map((m: string) => ({ name: m, dosage: '', frequency: '' })) || [],
        supplements: profileData.supplements?.map((s: string) => ({ name: s, dosage: '', frequency: '' })) || [],
        health_notes: profileData.primaryConcern ? `Primary concern: ${profileData.primaryConcern}` : null,
      });

    if (profileError) {
      console.error('[ONBOARDING USER] Failed to create profile:', profileError.message);
    }

    // Generate verification token via Supabase invite link
    const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/set-password`,
      },
    });

    if (magicLinkError || !magicLinkData) {
      console.error('[ONBOARDING USER] Failed to generate magic link:', magicLinkError?.message);
      return NextResponse.json(
        { error: 'Failed to generate verification link' },
        { status: 500 }
      );
    }

    const verificationUrl = magicLinkData.properties?.action_link;

    if (!verificationUrl) {
      return NextResponse.json(
        { error: 'Failed to generate verification link' },
        { status: 500 }
      );
    }

    // Send verification email via Resend
    const emailResult = await sendVerificationEmail({
      to: email,
      firstName,
      verificationUrl,
      protocolSummary,
    });

    if (!emailResult.success) {
      console.error('[ONBOARDING USER] Failed to send email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      emailSent: emailResult.success,
      message: 'Account created. Check your email to set your password.',
    });

  } catch (error) {
    console.error('[ONBOARDING USER] Unexpected error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
