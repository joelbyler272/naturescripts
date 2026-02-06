import Stripe from 'stripe';
import { logger } from '@/lib/utils/logger';

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  });
}

export interface RevenueStats {
  mrr: number;
  totalRevenue: number;
  activeSubscriptions: number;
  canceledThisMonth: number;
  recentTransactions: Transaction[];
  subscriptionsByStatus: {
    active: number;
    canceled: number;
    pastDue: number;
    trialing: number;
  };
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string | null;
  created: Date;
  description: string | null;
}

export async function getRevenueStats(): Promise<RevenueStats | null> {
  const stripe = getStripe();
  
  if (!stripe) {
    return null;
  }

  try {
    // Get all active subscriptions for MRR
    const subscriptions = await stripe.subscriptions.list({
      status: 'all',
      limit: 100,
    });

    let mrr = 0;
    let activeCount = 0;
    let canceledCount = 0;
    let pastDueCount = 0;
    let trialingCount = 0;
    let canceledThisMonth = 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const sub of subscriptions.data) {
      // Count by status
      switch (sub.status) {
        case 'active':
          activeCount++;
          // Calculate MRR from active subscriptions
          if (sub.items.data[0]?.price?.unit_amount) {
            const amount = sub.items.data[0].price.unit_amount / 100;
            const interval = sub.items.data[0].price.recurring?.interval;
            if (interval === 'month') {
              mrr += amount;
            } else if (interval === 'year') {
              mrr += amount / 12;
            }
          }
          break;
        case 'canceled':
          canceledCount++;
          // Check if canceled this month
          if (sub.canceled_at && new Date(sub.canceled_at * 1000) >= startOfMonth) {
            canceledThisMonth++;
          }
          break;
        case 'past_due':
          pastDueCount++;
          break;
        case 'trialing':
          trialingCount++;
          break;
      }
    }

    // Get total revenue from balance transactions
    const balanceTransactions = await stripe.balanceTransactions.list({
      limit: 100,
      type: 'charge',
    });

    let totalRevenue = 0;
    for (const txn of balanceTransactions.data) {
      if (txn.type === 'charge' && txn.status === 'available') {
        totalRevenue += txn.net / 100; // Convert from cents
      }
    }

    // Get recent charges for transaction list
    const charges = await stripe.charges.list({
      limit: 10,
    });

    const recentTransactions: Transaction[] = charges.data.map(charge => ({
      id: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency.toUpperCase(),
      status: charge.status,
      customerEmail: charge.billing_details?.email || null,
      created: new Date(charge.created * 1000),
      description: charge.description,
    }));

    return {
      mrr,
      totalRevenue,
      activeSubscriptions: activeCount,
      canceledThisMonth,
      recentTransactions,
      subscriptionsByStatus: {
        active: activeCount,
        canceled: canceledCount,
        pastDue: pastDueCount,
        trialing: trialingCount,
      },
    };
  } catch (error) {
    logger.error('Error fetching Stripe revenue stats:', error);
    return null;
  }
}
