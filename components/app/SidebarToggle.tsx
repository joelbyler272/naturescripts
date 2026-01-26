'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-md',
          'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
          'transition-colors'
        )}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      >
        {/* Ramp-style sidebar icon - two vertical rectangles */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <rect
            x="1"
            y="2"
            width="5"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="10"
            y="2"
            width="5"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 z-50',
            'px-2 py-1 text-xs font-medium',
            'bg-foreground text-background rounded',
            'whitespace-nowrap',
            collapsed ? 'left-full ml-2' : 'left-full ml-2'
          )}
        >
          {collapsed ? 'Expand navigation' : 'Collapse navigation'}
        </div>
      )}
    </div>
  );
}
