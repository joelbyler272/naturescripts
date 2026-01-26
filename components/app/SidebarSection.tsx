'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarItemData {
  href: string;
  label: string;
}

interface SidebarSectionProps {
  icon: LucideIcon;
  label: string;
  items: SidebarItemData[];
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Check if any item in this section is active
  const isActive = items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [items]);

  // When collapsed, clicking navigates to first item
  const handleClick = () => {
    if (collapsed && items.length > 0) {
      window.location.href = items[0].href;
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <button
        onClick={handleClick}
        onMouseEnter={() => collapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150',
          isActive && collapsed
            ? 'bg-accent/10 text-accent'
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
          collapsed && 'justify-center'
        )}
      >
        <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-accent')} />
        
        {!collapsed && (
          <>
            <span className={cn(
              'text-sm font-medium flex-1 text-left transition-opacity duration-150',
              isActive && 'text-foreground'
            )}>
              {label}
            </span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform duration-200',
                expanded && 'rotate-180'
              )}
            />
          </>
        )}
      </button>

      {/* Section Items with smooth height animation */}
      {!collapsed && (
        <div
          className="overflow-hidden transition-[height] duration-200 ease-out"
          style={{ height: expanded ? contentHeight : 0 }}
        >
          <div ref={contentRef} className="mt-1 space-y-0.5">
            {items.map((item) => {
              const itemActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block pl-11 pr-3 py-2 rounded-lg text-sm transition-colors duration-150',
                    itemActive
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && showTooltip && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50">
          <div className="px-2 py-1 text-xs font-medium bg-foreground text-background rounded whitespace-nowrap shadow-lg">
            {label}
          </div>
        </div>
      )}
    </div>
  );
}
