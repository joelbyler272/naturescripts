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

  return (
    <div 
      className="flex items-center justify-between w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo or Toggle Button (when collapsed and hovered) */}
      <div className="flex items-center">
        {collapsed && isHovered ? (
          // Show expand button when collapsed and hovered
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
          // Show logo
          <Link
            href={routes.dashboard}
            className="flex items-center hover:opacity-90 transition-opacity overflow-hidden"
          >
            <span className="flex items-baseline whitespace-nowrap">
              {/* N - always visible, bold black */}
              <span className="text-xl font-bold text-foreground">N</span>
              
              {/* "ature" - animated */}
              <span 
                className={cn(
                  "text-xl font-bold text-foreground overflow-hidden transition-all duration-300 ease-out",
                  collapsed ? "max-w-0 opacity-0" : "max-w-[100px] opacity-100"
                )}
              >
                ature
              </span>
              
              {/* S - always visible, bold sage green */}
              <span className="text-xl font-bold text-accent">S</span>
              
              {/* "cripts" - animated */}
              <span 
                className={cn(
                  "text-xl font-bold text-accent overflow-hidden transition-all duration-300 ease-out",
                  collapsed ? "max-w-0 opacity-0" : "max-w-[100px] opacity-100"
                )}
              >
                cripts
              </span>
            </span>
          </Link>
        )}
      </div>

      {/* Collapse button - only visible when expanded */}
      {!collapsed && (
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
      )}
    </div>
  );
}
