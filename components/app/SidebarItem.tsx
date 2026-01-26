'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
  badge?: string;
}

export function SidebarItem({
  href,
  label,
  icon: Icon,
  collapsed,
  badge,
}: SidebarItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="relative">
      <Link
        href={href}
        onMouseEnter={() => collapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
          isActive
            ? 'bg-accent/10 text-accent'
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
          collapsed && 'justify-center'
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        
        {!collapsed && (
          <>
            <span className="text-sm font-medium flex-1">{label}</span>
            {badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                {badge}
              </span>
            )}
          </>
        )}
      </Link>

      {/* Tooltip for collapsed state */}
      {collapsed && showTooltip && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50">
          <div className="px-2 py-1 text-xs font-medium bg-foreground text-background rounded whitespace-nowrap flex items-center gap-2">
            {label}
            {badge && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-background/20">
                {badge}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
