import { Metadata } from 'next';
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';

export const metadata: Metadata = {
  title: 'Revenue - Admin',
};

// TODO: Integrate with Stripe API to fetch real data
export default async function AdminRevenuePage() {
  // Placeholder data - will be replaced with Stripe API calls
  const revenueStats = {
    mrr: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    churnRate: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Revenue</h1>
        <p className="text-gray-500 mt-1">Stripe integration coming soon</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Monthly Recurring Revenue"
          value={`$${revenueStats.mrr}`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${revenueStats.totalRevenue}`}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Active Subscriptions"
          value={revenueStats.activeSubscriptions}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Churn Rate"
          value={`${revenueStats.churnRate}%`}
          icon={CreditCard}
          color="amber"
        />
      </div>

      {/* Stripe Integration Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-lg font-medium text-amber-800 mb-2">Stripe Integration Required</h2>
        <p className="text-amber-700 text-sm">
          To see real revenue data, you need to configure Stripe API access. The following environment variables are needed:
        </p>
        <ul className="mt-3 text-sm text-amber-700 list-disc list-inside space-y-1">
          <li>STRIPE_SECRET_KEY - Your Stripe secret key</li>
          <li>STRIPE_WEBHOOK_SECRET - Webhook signing secret</li>
        </ul>
        <p className="text-amber-700 text-sm mt-3">
          Once configured, this page will show MRR, subscriber counts, and recent transactions.
        </p>
      </div>
    </div>
  );
}
