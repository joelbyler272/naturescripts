// API route to create a user during onboarding (passwordless)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendVerificationEmail } from '@/lib/email/resend';
import crypto from 'crypto';

// Admin client for user creation
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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
    // Verify we have the service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[ONBOARDING USER] Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
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

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      // User already exists - send a different email or handle gracefully
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Generate a temporary password (user will set their own via verification link)
    const tempPassword = crypto.randomBytes(32).toString('hex');

    // Create user without email confirmation (we'll handle verification ourselves)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: tempPassword,
      email_confirm: false, // We'll verify via our own flow
      user_metadata: {
        first_name: firstName,
        onboarding_in_progress: true,
      },
    });

    if (createError || !newUser.user) {
      console.error('[ONBOARDING USER] Failed to create user:', createError);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    const userId = newUser.user.id;

    // Create profile with health data
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        tier: 'free',
        onboarding_completed: false,
        health_conditions: profileData.healthConditions || [],
        medications: profileData.medications?.map(m => ({ name: m, dosage: '', frequency: '' })) || [],
        supplements: profileData.supplements?.map(s => ({ name: s, dosage: '', frequency: '' })) || [],
        health_notes: profileData.primaryConcern ? `Primary concern: ${profileData.primaryConcern}` : null,
      });

    if (profileError) {
      console.error('[ONBOARDING USER] Failed to create profile:', profileError);
      // Continue anyway - profile will be created on first login if needed
    }

    // Generate verification token
    // We'll use Supabase's magic link feature for this
    const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase(),
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/set-password`,
      },
    });

    if (magicLinkError || !magicLinkData) {
      console.error('[ONBOARDING USER] Failed to generate magic link:', magicLinkError);
      return NextResponse.json(
        { error: 'Failed to generate verification link' },
        { status: 500 }
      );
    }

    // Extract the verification URL from the magic link
    const verificationUrl = magicLinkData.properties?.action_link;

    if (!verificationUrl) {
      console.error('[ONBOARDING USER] No action link in magic link response');
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
      // Don't fail the whole request - user is created, they just won't get the email
      // They can still request a new verification email
    }

    return NextResponse.json({
      success: true,
      userId,
      emailSent: emailResult.success,
      message: 'Account created. Check your email to set your password.',
    });

  } catch (error) {
    console.error('[ONBOARDING USER] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
