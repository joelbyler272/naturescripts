import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import Stripe from 'stripe';

// Validate required environment variables at startup
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    // Log webhook failures server-side for security audit (not to console in prod)
    if (process.env.NODE_ENV === 'development') {
      console.error('Webhook signature verification failed:', err);
    }
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Safely extract userId with proper null checks
        let userId: string | undefined;

        if (session.subscription && typeof session.subscription === 'string') {
          try {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            userId = subscription.metadata?.supabase_user_id;
          } catch (subError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to retrieve subscription:', subError);
            }
          }
        }

        // Fallback to session metadata
        if (!userId) {
          userId = session.metadata?.supabase_user_id;
        }

        if (userId && typeof userId === 'string') {
          const { error } = await supabase
            .from('profiles')
            .update({
              tier: 'pro',
              stripe_customer_id: session.customer as string,
            })
            .eq('id', userId);

          if (error) {
            // Return 500 so Stripe retries the webhook
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to update profile tier:', error);
            }
            return NextResponse.json(
              { error: 'Database update failed' },
              { status: 500 }
            );
          }
        } else {
          // Log missing userId but don't fail - might be a test event
          if (process.env.NODE_ENV === 'development') {
            console.warn('checkout.session.completed: No valid userId found');
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId && typeof userId === 'string') {
          const isActive = ['active', 'trialing'].includes(subscription.status);
          const { error } = await supabase
            .from('profiles')
            .update({ tier: isActive ? 'pro' : 'free' })
            .eq('id', userId);

          if (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to update subscription status:', error);
            }
            return NextResponse.json(
              { error: 'Database update failed' },
              { status: 500 }
            );
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId && typeof userId === 'string') {
          const { error } = await supabase
            .from('profiles')
            .update({ tier: 'free' })
            .eq('id', userId);

          if (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to downgrade user tier:', error);
            }
            return NextResponse.json(
              { error: 'Database update failed' },
              { status: 500 }
            );
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Webhook processing error:', error);
    }
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
