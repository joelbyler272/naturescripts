'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Activity, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  pendingInvites: number;
  totalProtocols: number;
}

export function PractitionerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    pendingInvites: 0,
    totalProtocols: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: clients } = await supabase
        .from('practitioner_clients')
        .select('status')
        .eq('practitioner_id', user.id);

      setStats({
        totalClients: clients?.length || 0,
        activeClients: clients?.filter(c => c.status === 'active').length || 0,
        pendingInvites: clients?.filter(c => c.status === 'invited').length || 0,
        totalProtocols: 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Clients', value: stats.totalClients, icon: Users, href: '/clients' },
    { label: 'Active Clients', value: stats.activeClients, icon: Activity, href: '/clients' },
    { label: 'Pending Invites', value: stats.pendingInvites, icon: UserPlus, href: '/clients/invite' },
    { label: 'Protocols Created', value: stats.totalProtocols, icon: FileText, href: '/portal' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Practice Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your clients and protocols</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '--' : stat.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/clients/invite"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <UserPlus className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Invite a Client</p>
                <p className="text-xs text-muted-foreground">Send an invitation to join your practice</p>
              </div>
            </Link>
            <Link
              href="/practice-settings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Customize Branding</p>
                <p className="text-xs text-muted-foreground">Set up your custom subdomain and branding</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity yet. Invite your first client to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
