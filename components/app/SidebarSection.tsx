'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarItem {
  href: string;
  label: string;
}

interface SidebarSectionProps {
  icon: LucideIcon;
  label: string;
  items: SidebarItem[];
  collapsed: boolean;
  defaultExpanded?: boolean;
}

export function SidebarSection({
  icon: Icon,
  label,
  items,
  collapsed,
  defaultExpanded = false,
}: SidebarSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const pathname = usePathname();

  // Check if any item in this section is active
  const isActive = items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  // When collapsed, clicking navigates to first item
  const handleCollapsedClick = () => {
    if (collapsed && items.length > 0) {
      window.location.href = items[0].href;
    }
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <button
        onClick={() => (collapsed ? handleCollapsedClick() : setExpanded(!expanded))}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
          isActive && collapsed
            ? 'bg-secondary/80 text-foreground'
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
          collapsed && 'justify-center'
        )}
        title={collapsed ? label : undefined}
      >
        <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-accent')} />
        
        {!collapsed && (
          <>
            <span className="text-sm font-medium flex-1 text-left">{label}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                expanded && 'rotate-180'
              )}
            />
          </>
        )}
      </button>

      {/* Section Items - only show when expanded and not collapsed */}
      {!collapsed && expanded && (
        <div className="mt-1 space-y-0.5 overflow-hidden">
          {items.map((item) => {
            const itemActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block pl-11 pr-3 py-2 rounded-lg text-sm transition-colors',
                  itemActive
                    ? 'bg-secondary/80 text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block">
          <div className="px-2 py-1 text-xs font-medium bg-foreground text-background rounded whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}
