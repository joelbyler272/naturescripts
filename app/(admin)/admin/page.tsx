import { Metadata } from 'next';
import { getAdminStats } from '@/lib/admin/queries';
import { StatsCard } from '@/components/admin/StatsCard';
import { Users, MessageSquare, FileText, TrendingUp, Crown, UserPlus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Monitor your app performance and user activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users */}
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={`+${stats.newUsersThisWeek} this week`}
          color="blue"
        />
        
        <StatsCard
          title="New Users Today"
          value={stats.newUsersToday}
          icon={UserPlus}
          subtext={`${stats.newUsersThisMonth} this month`}
          color="green"
        />

        <StatsCard
          title="Pro Users"
          value={stats.proUsers}
          icon={Crown}
          subtext={`${stats.freeUsers} free users`}
          color="purple"
        />

        {/* Consultations */}
        <StatsCard
          title="Total Consultations"
          value={stats.totalConsultations}
          icon={MessageSquare}
          trend={`+${stats.consultationsThisWeek} this week`}
          color="blue"
        />

        <StatsCard
          title="Consultations Today"
          value={stats.consultationsToday}
          icon={TrendingUp}
          color="green"
        />

        <StatsCard
          title="Protocols Generated"
          value={stats.protocolsGenerated}
          icon={FileText}
          subtext={`${Math.round((stats.protocolsGenerated / Math.max(stats.totalConsultations, 1)) * 100)}% completion rate`}
          color="sage"
        />
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Avg consultations/user</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.totalUsers > 0 ? (stats.totalConsultations / stats.totalUsers).toFixed(1) : '0'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Pro conversion rate</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.totalUsers > 0 ? Math.round((stats.proUsers / stats.totalUsers) * 100) : 0}%
            </p>
          </div>
          <div>
            <p className="text-gray-500">Protocol completion</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.totalConsultations > 0 ? Math.round((stats.protocolsGenerated / stats.totalConsultations) * 100) : 0}%
            </p>
          </div>
          <div>
            <p className="text-gray-500">Active today</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats.consultationsToday} consultations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
