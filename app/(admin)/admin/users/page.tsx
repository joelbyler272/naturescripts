import { Metadata } from 'next';
import { getUsers, getAdminStats } from '@/lib/admin/queries';
import { UsersTable } from '@/components/admin/UsersTable';

export const metadata: Metadata = {
  title: 'Users - Admin',
};

export default async function AdminUsersPage() {
  const [users, stats] = await Promise.all([
    getUsers(100),
    getAdminStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">
            {stats.totalUsers} total users ({stats.proUsers} pro, {stats.freeUsers} free)
          </p>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable users={users} />
    </div>
  );
}
