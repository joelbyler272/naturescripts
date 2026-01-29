'use client';

import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { NSLogo } from './NSLogo';
import { SidebarSection } from './SidebarSection';
import { SidebarItem } from './SidebarItem';
import { routes } from '@/lib/constants/routes';
import {
  Home,
  BookOpen,
  Leaf,
  Search,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SIDEBAR_WIDTH_EXPANDED = 240;
export const SIDEBAR_WIDTH_COLLAPSED = 56;

export function AppSidebar() {
  const { collapsed, toggleCollapsed, mounted } = useSidebar();
  const pathname = usePathname();

  // Determine which section should be expanded by default based on current route
  const isHomeSection = pathname === routes.dashboard || 
    pathname.startsWith('/consultations') || 
    pathname.startsWith('/protocols');

  // Prevent hydration mismatch - show expanded state initially
  if (!mounted) {
    return (
      <aside
        className="h-screen bg-white border-r border-border/50 flex flex-col sticky top-0"
        style={{ width: SIDEBAR_WIDTH_EXPANDED }}
      />
    );
  }

  return (
    <aside
      className={cn(
        'h-screen bg-white border-r border-border/50 flex flex-col sticky top-0',
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

      {/* Search Bar (expanded only) */}
      {!collapsed && (
        <div className="px-3 py-3 shrink-0">
          <button
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
              'bg-secondary/30 hover:bg-secondary/50 transition-colors',
              'text-muted-foreground text-sm'
            )}
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="text-xs bg-background px-1.5 py-0.5 rounded border border-border/50">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Collapsed Search Icon */}
      {collapsed && (
        <div className="px-2 py-3 flex justify-center shrink-0">
          <button
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-lg',
              'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
              'transition-colors'
            )}
            title="Search (⌘K)"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="space-y-1 px-2">
          {/* Home Section */}
          <SidebarSection
            icon={Home}
            label="Home"
            collapsed={collapsed}
            defaultExpanded={isHomeSection}
            items={[
              { href: routes.dashboard, label: 'Overview' },
              { href: routes.protocols, label: 'My Protocols' },
              { href: routes.consultation, label: 'New Consultation' },
            ]}
          />

          {/* Remedy Database - standalone item */}
          <SidebarItem
            href={routes.remedies}
            label="Remedy Database"
            icon={Leaf}
            collapsed={collapsed}
          />

          {/* Library - standalone item */}
          <SidebarItem
            href={routes.library}
            label="Library"
            icon={BookOpen}
            collapsed={collapsed}
          />
        </div>
      </nav>

      {/* Bottom Section - Help/Support */}
      <div className="border-t border-border/30 p-2 shrink-0">
        <SidebarItem
          href="/help"
          label="Help & Support"
          icon={HelpCircle}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
