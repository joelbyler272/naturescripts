'use client';

import { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeft } from 'lucide-react';

interface NSLogoProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function NSLogo({ collapsed, onToggle }: NSLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // When collapsed, center the logo/toggle
  if (collapsed) {
    return (
      <div 
        className="flex items-center justify-center w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? (
          <button
            onClick={onToggle}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-md',
              'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
              'transition-all duration-150'
            )}
            title="Expand navigation"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        ) : (
          <Link
            href={routes.dashboard}
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <span className="flex items-baseline">
              <span className="text-xl font-bold text-foreground">N</span>
              <span className="text-xl font-bold text-accent">S</span>
            </span>
          </Link>
        )}
      </div>
    );
  }

  // Expanded state - logo on left, toggle on right
  return (
    <div className="flex items-center justify-between w-full">
      <Link
        href={routes.dashboard}
        className="flex items-center hover:opacity-90 transition-opacity"
      >
        <span className="flex items-baseline whitespace-nowrap">
          <span className="text-xl font-bold text-foreground">Nature</span>
          <span className="text-xl font-bold text-accent">Scripts</span>
        </span>
      </Link>

      <button
        onClick={onToggle}
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-md',
          'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
          'transition-colors'
        )}
        title="Collapse navigation"
      >
        <PanelLeftClose className="w-5 h-5" />
      </button>
    </div>
  );
}
