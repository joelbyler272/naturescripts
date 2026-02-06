import { Metadata } from 'next';
import { getRevenueStats } from '@/lib/admin/revenue';
import { getAdminStats } from '@/lib/admin/queries';
import { StatsCard } from '@/components/admin/StatsCard';
import { RecentTransactions } from '@/components/admin/RecentTransactions';
import { DollarSign, TrendingUp, Users, CreditCard, AlertCircle, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Revenue - Admin',
};

export default async function AdminRevenuePage() {
  const [revenueStats, adminStats] = await Promise.all([
    getRevenueStats(),
    getAdminStats(),
  ]);

  // If Stripe is not configured
  if (!revenueStats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Revenue</h1>
          <p className="text-gray-500 mt-1">Stripe subscription metrics</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h2 className="text-lg font-medium text-amber-800">Stripe Not Configured</h2>
              <p className="text-amber-700 text-sm mt-1">
                Add your <code className="bg-amber-100 px-1.5 py-0.5 rounded">STRIPE_SECRET_KEY</code> to 
                your environment variables to see revenue data.
              </p>
            </div>
          </div>
        </div>

        {/* Show basic pro user stats from database */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Pro Users (from DB)"
            value={adminStats.proUsers}
            icon={Users}
            subtext={`${adminStats.freeUsers} free users`}
            color="purple"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Revenue</h1>
        <p className="text-gray-500 mt-1">Stripe subscription metrics and transactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Monthly Recurring Revenue"
          value={`$${revenueStats.mrr.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${revenueStats.totalRevenue.toFixed(2)}`}
          icon={TrendingUp}
          subtext="Net revenue after fees"
          color="blue"
        />
        <StatsCard
          title="Active Subscriptions"
          value={revenueStats.activeSubscriptions}
          icon={Users}
          subtext={`${revenueStats.subscriptionsByStatus.trialing} trialing`}
          color="purple"
        />
        <StatsCard
          title="Canceled This Month"
          value={revenueStats.canceledThisMonth}
          icon={XCircle}
          subtext={`${revenueStats.subscriptionsByStatus.pastDue} past due`}
          color="amber"
        />
      </div>

      {/* Subscription Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-semibold text-green-600">
              {revenueStats.subscriptionsByStatus.active}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trialing</p>
            <p className="text-2xl font-semibold text-blue-600">
              {revenueStats.subscriptionsByStatus.trialing}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Past Due</p>
            <p className="text-2xl font-semibold text-amber-600">
              {revenueStats.subscriptionsByStatus.pastDue}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Canceled</p>
            <p className="text-2xl font-semibold text-gray-600">
              {revenueStats.subscriptionsByStatus.canceled}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
        <RecentTransactions transactions={revenueStats.recentTransactions} />
      </div>
    </div>
  );
}
