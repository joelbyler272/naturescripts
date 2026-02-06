'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, MessageSquare, DollarSign, Zap, BarChart3, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/consultations', label: 'Consultations', icon: MessageSquare },
  { href: '/admin/costs', label: 'API Costs', icon: Zap },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/revenue', label: 'Revenue', icon: DollarSign },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4 hidden lg:block">
      {/* Back to App */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to App
      </Link>

      {/* Logo/Title */}
      <div className="px-3 mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
        <p className="text-xs text-gray-500">NatureScripts Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sage-50 text-sage-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin Email */}
      <div className="mt-8 px-3 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400">Logged in as admin</p>
      </div>
    </aside>
  );
}
