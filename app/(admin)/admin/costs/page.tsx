import { Metadata } from 'next';
import { getApiUsageStats } from '@/lib/admin/apiUsage';
import { StatsCard } from '@/components/admin/StatsCard';
import { CostChart } from '@/components/admin/CostChart';
import { UsageBreakdown } from '@/components/admin/UsageBreakdown';
import { DollarSign, Zap, TrendingUp, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Costs - Admin',
};

export default async function AdminCostsPage() {
  const usage = await getApiUsageStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Claude API Costs</h1>
        <p className="text-gray-500 mt-1">Track token usage and spending</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Cost"
          value={`$${usage.today.cost.toFixed(4)}`}
          icon={DollarSign}
          subtext={`${usage.today.requests} requests`}
          color="green"
        />
        <StatsCard
          title="This Week"
          value={`$${usage.thisWeek.cost.toFixed(4)}`}
          icon={TrendingUp}
          subtext={`${usage.thisWeek.requests} requests`}
          color="blue"
        />
        <StatsCard
          title="This Month"
          value={`$${usage.thisMonth.cost.toFixed(4)}`}
          icon={Clock}
          subtext={`${usage.thisMonth.requests} requests`}
          color="purple"
        />
        <StatsCard
          title="All Time"
          value={`$${usage.allTime.cost.toFixed(2)}`}
          icon={Zap}
          subtext={`${usage.allTime.requests.toLocaleString()} total requests`}
          color="sage"
        />
      </div>

      {/* Today's Token Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Usage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Input Tokens</p>
            <p className="text-2xl font-semibold text-gray-900">
              {usage.today.inputTokens.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Output Tokens</p>
            <p className="text-2xl font-semibold text-gray-900">
              {usage.today.outputTokens.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Tokens</p>
            <p className="text-2xl font-semibold text-gray-900">
              {(usage.today.inputTokens + usage.today.outputTokens).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Cost/Request</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${usage.today.requests > 0 ? (usage.today.cost / usage.today.requests).toFixed(4) : '0.0000'}
            </p>
          </div>
        </div>
      </div>

      {/* Cost Over Time Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Daily Costs (Last 30 Days)</h2>
        <CostChart data={usage.dailyUsage} />
      </div>

      {/* Usage Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Request Breakdown</h2>
        <UsageBreakdown data={usage.dailyUsage} />
      </div>

      {/* Setup Notice if no data */}
      {usage.allTime.requests === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-blue-800 mb-2">No Usage Data Yet</h2>
          <p className="text-blue-700 text-sm">
            API usage will be tracked once you run the database migration and start making consultations.
          </p>
          <div className="mt-4 text-sm text-blue-700">
            <p className="font-medium">To set up tracking:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Run the migration: <code className="bg-blue-100 px-2 py-0.5 rounded">supabase/migrations/20260206_api_usage.sql</code></li>
              <li>The API routes will automatically record usage</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
