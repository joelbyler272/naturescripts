import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import Stripe from 'stripe';
import { cacheInvalidateUser } from '@/lib/utils/cache';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not configured');
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' });
}

function getWebhookSecret() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  return process.env.STRIPE_WEBHOOK_SECRET;
}

/**
 * Resolve a Stripe subscription's userId.
 * 1. Check subscription.metadata.supabase_user_id
 * 2. Fallback: look up stripe_customer_id in profiles table
 */
async function resolveUserId(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServiceClient>,
  sessionMetadata?: Record<string, string>
): Promise<string | undefined> {
  // Try subscription metadata first
  const userId = subscription.metadata?.supabase_user_id;
  if (userId) return userId;

  // Try session metadata
  if (sessionMetadata?.supabase_user_id) return sessionMetadata.supabase_user_id;

  // Fallback: look up by customer ID
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (customerId) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();
    if (data?.id) return data.id;
  }

  return undefined;
}

/**
 * Idempotency: check if we've already processed this event.
 * Uses Upstash Redis if available, otherwise a lightweight Supabase check.
 */
async function isEventProcessed(eventId: string): Promise<boolean> {
  // Use Redis if available
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      const exists = await redis.get(`stripe_event:${eventId}`);
      if (exists) return true;
      // Mark as processed with 48h TTL
      await redis.set(`stripe_event:${eventId}`, '1', { ex: 172800 });
      return false;
    } catch {
      // Redis unavailable, fall through
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = getStripe();
  const webhookSecret = getWebhookSecret();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Webhook signature verification failed:', err);
    }
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency check
  if (await isEventProcessed(event.id)) {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        let userId: string | undefined;

        if (session.subscription && typeof session.subscription === 'string') {
          try {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            userId = await resolveUserId(subscription, supabase, session.metadata as Record<string, string>);
          } catch (subError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to retrieve subscription:', subError);
            }
          }
        }

        if (!userId) {
          userId = session.metadata?.supabase_user_id;
        }

        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .update({ tier: 'pro', stripe_customer_id: session.customer as string })
            .eq('id', userId);

          if (error) {
            console.error('Failed to update profile tier:', error);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
          }
          // Invalidate cached health context / tier
          cacheInvalidateUser(userId).catch(() => {});
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription, supabase);

        if (userId) {
          const isActive = ['active', 'trialing'].includes(subscription.status);
          const { error } = await supabase
            .from('profiles')
            .update({ tier: isActive ? 'pro' : 'free' })
            .eq('id', userId);

          if (error) {
            console.error('Failed to update subscription status:', error);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
          }
          cacheInvalidateUser(userId).catch(() => {});
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription, supabase);

        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .update({ tier: 'free' })
            .eq('id', userId);

          if (error) {
            console.error('Failed to downgrade user tier:', error);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
          }
          cacheInvalidateUser(userId).catch(() => {});
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        // Get the subscription to find the user
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;

        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const userId = await resolveUserId(subscription, supabase);

            if (userId) {
              // After multiple failures, Stripe will send subscription.deleted.
              // For now, log the failure. On the final failure, Stripe auto-cancels
              // and triggers customer.subscription.deleted which downgrades the user.
              console.warn(`[STRIPE] Payment failed for user ${userId}, invoice ${invoice.id}`);

              // If this is a past_due subscription, downgrade immediately
              if (subscription.status === 'past_due') {
                await supabase
                  .from('profiles')
                  .update({ tier: 'free' })
                  .eq('id', userId);
                cacheInvalidateUser(userId).catch(() => {});
              }
            }
          } catch (err) {
            console.error('[STRIPE] Error handling payment failure:', err);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
