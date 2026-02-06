import { Metadata } from 'next';
import { getUserGrowthData, getConsultationTrends } from '@/lib/admin/apiUsage';
import { UserGrowthChart } from '@/components/admin/UserGrowthChart';
import { ConsultationTrendsChart } from '@/components/admin/ConsultationTrendsChart';

export const metadata: Metadata = {
  title: 'Analytics - Admin',
};

export default async function AdminAnalyticsPage() {
  const [userGrowth, consultationTrends] = await Promise.all([
    getUserGrowthData(30),
    getConsultationTrends(30),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">User growth and engagement trends</p>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Growth (Last 30 Days)</h2>
        <UserGrowthChart data={userGrowth} />
      </div>

      {/* Consultation Trends Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Consultations (Last 30 Days)</h2>
        <ConsultationTrendsChart data={consultationTrends} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total User Growth</h3>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {userGrowth.length > 0 ? userGrowth[userGrowth.length - 1].totalUsers : 0}
          </p>
          <p className="text-sm text-green-600 mt-1">
            +{userGrowth.reduce((sum, d) => sum + d.newUsers, 0)} in 30 days
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Consultations</h3>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {consultationTrends.reduce((sum, d) => sum + d.total, 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">in 30 days</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {(() => {
              const total = consultationTrends.reduce((sum, d) => sum + d.total, 0);
              const completed = consultationTrends.reduce((sum, d) => sum + d.completed, 0);
              return total > 0 ? Math.round((completed / total) * 100) : 0;
            })()}%
          </p>
          <p className="text-sm text-gray-500 mt-1">consultations completed</p>
        </div>
      </div>
    </div>
  );
}
