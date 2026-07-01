'use client';

import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { NSLogo } from './NSLogo';
import { SidebarItem } from './SidebarItem';
import { routes } from '@/lib/constants/routes';
import {
  Home,
  FileText,
  Leaf,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SIDEBAR_WIDTH_EXPANDED = 240;
export const SIDEBAR_WIDTH_COLLAPSED = 56;

export function AppSidebar() {
  const { collapsed, toggleCollapsed, mounted } = useSidebar();
  const pathname = usePathname();

  if (!mounted) {
    return (
      <aside
        className="h-screen bg-white border-r border-border/50 flex flex-col"
        style={{ width: SIDEBAR_WIDTH_EXPANDED }}
      />
    );
  }

  return (
    <aside
      className={cn(
        'h-screen bg-white border-r border-border/50 flex flex-col',
        'transition-[width] duration-300 ease-out'
      )}
      style={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
    >
      {/* Header - Logo and Toggle */}
      <div
        className={cn(
          'flex items-center justify-center h-14 border-b border-border/30 shrink-0',
          collapsed ? 'px-2' : 'px-3'
        )}
      >
        <NSLogo collapsed={collapsed} onToggle={toggleCollapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="space-y-1 px-2">
          <SidebarItem
            href={routes.dashboard}
            label="Dashboard"
            icon={Home}
            collapsed={collapsed}
          />

          <SidebarItem
            href={routes.protocols}
            label="My Protocols"
            icon={FileText}
            collapsed={collapsed}
          />

          <SidebarItem
            href={routes.remedies}
            label="Remedy Database"
            icon={Leaf}
            collapsed={collapsed}
          />

        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border/30 p-2 shrink-0">
        <SidebarItem
          href={routes.help}
          label="Help & Support"
          icon={HelpCircle}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
