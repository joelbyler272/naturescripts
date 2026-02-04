import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.subscription
        ? (await stripe.subscriptions.retrieve(session.subscription as string))
            .metadata.supabase_user_id
        : session.metadata?.supabase_user_id;

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            tier: 'pro',
            stripe_customer_id: session.customer as string,
          })
          .eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.supabase_user_id;
      if (userId) {
        const isActive = ['active', 'trialing'].includes(subscription.status);
        await supabase
          .from('profiles')
          .update({ tier: isActive ? 'pro' : 'free' })
          .eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.supabase_user_id;
      if (userId) {
        await supabase
          .from('profiles')
          .update({ tier: 'free' })
          .eq('id', userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
