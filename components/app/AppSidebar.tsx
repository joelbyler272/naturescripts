'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NSLogo } from './NSLogo';
import { SidebarSection } from './SidebarSection';
import { SidebarItem } from './SidebarItem';
import { routes } from '@/lib/constants/routes';
import {
  Home,
  Leaf,
  BookOpen,
  Search,
  HelpCircle,
  PanelLeftClose,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_WIDTH_EXPANDED = 240;
const SIDEBAR_WIDTH_COLLAPSED = 56;

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
    setMounted(true);
  }, []);

  // Save preference
  const toggleCollapsed = () => {
    const newValue = !collapsed;
    setCollapsed(newValue);
    localStorage.setItem('sidebar-collapsed', String(newValue));
  };

  // Determine which section should be expanded by default based on current route
  const isHomeSection = pathname === routes.dashboard || 
    pathname.startsWith('/consultations') || 
    pathname.startsWith('/protocols');
  const isResourcesSection = pathname.startsWith(routes.remedies) || 
    pathname.startsWith(routes.library);

  // Prevent hydration mismatch
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
      {/* Header - Logo only (toggle is now built into the logo) */}
      <div
        className={cn(
          'flex items-center h-14 border-b border-border/30 shrink-0',
          collapsed ? 'justify-center px-2' : 'px-3'
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

          {/* Wellness Section */}
          <SidebarSection
            icon={Leaf}
            label="Wellness"
            collapsed={collapsed}
            defaultExpanded={false}
            items={[
              { href: routes.tracking, label: 'Health Tracking' },
            ]}
          />

          {/* Resources Section */}
          <SidebarSection
            icon={BookOpen}
            label="Resources"
            collapsed={collapsed}
            defaultExpanded={isResourcesSection}
            items={[
              { href: routes.remedies, label: 'Remedy Database' },
              { href: routes.library, label: 'Library' },
            ]}
          />
        </div>
      </nav>

      {/* Bottom Section - Help/Support and Collapse button */}
      <div className="border-t border-border/30 p-2 shrink-0 space-y-1">
        <SidebarItem
          href="/help"
          label="Help & Support"
          icon={HelpCircle}
          collapsed={collapsed}
        />
        
        {/* Collapse button - only visible when expanded */}
        {!collapsed && (
          <button
            onClick={toggleCollapsed}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
              'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
              'transition-colors text-sm'
            )}
          >
            <PanelLeftClose className="w-5 h-5" />
            <span>Collapse</span>
          </button>
        )}
      </div>
    </aside>
  );
}
