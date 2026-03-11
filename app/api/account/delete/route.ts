import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse confirmation from body
    let body: { confirmation?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Require explicit confirmation
    if (body.confirmation !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Please type "DELETE MY ACCOUNT" to confirm' },
        { status: 400 }
      );
    }

    // Cancel Stripe subscription before deleting data
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profile?.stripe_customer_id && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' });
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'active',
        });
        for (const sub of subscriptions.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
      } catch (stripeErr) {
        console.error('[ACCOUNT DELETE] Error cancelling Stripe subscription:', stripeErr);
        // Continue with deletion even if Stripe cancel fails
      }
    }

    // Delete user data using the database function
    const { error: deleteDataError } = await supabase
      .rpc('delete_user_account', { p_user_id: user.id });

    if (deleteDataError) {
      console.error('[ACCOUNT DELETE] Error deleting user data:', deleteDataError);
      return NextResponse.json(
        { error: 'Failed to delete account data' },
        { status: 500 }
      );
    }

    // Delete the auth user using admin client
    // This requires SUPABASE_SERVICE_ROLE_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error('[ACCOUNT DELETE] SUPABASE_SERVICE_ROLE_KEY not set — auth user record was NOT deleted');
      return NextResponse.json(
        { error: 'Server configuration error: unable to fully delete account. Please contact support.' },
        { status: 500 }
      );
    }

    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteAuthError) {
      console.error('[ACCOUNT DELETE] Error deleting auth user:', deleteAuthError.message);
    }

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });

  } catch (error) {
    console.error('[ACCOUNT DELETE] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
