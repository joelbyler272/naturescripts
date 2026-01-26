'use client';

import { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';

interface NSLogoProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function NSLogo({ collapsed, onToggle }: NSLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={routes.dashboard}
        className="flex items-center hover:opacity-90 transition-opacity overflow-hidden"
        onClick={(e) => {
          // If collapsed and hovered, clicking expands instead of navigating
          if (collapsed && isHovered) {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {/* The logo with animated letters */}
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

      {/* Expand tooltip/button - only shows when collapsed and hovered */}
      {collapsed && isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "absolute left-full ml-2 z-50",
            "px-3 py-1.5 text-sm font-medium",
            "bg-foreground text-background rounded-md",
            "whitespace-nowrap shadow-lg",
            "hover:bg-foreground/90 transition-colors",
            "animate-in fade-in slide-in-from-left-1 duration-150"
          )}
        >
          Expand navigation
        </button>
      )}
    </div>
  );
}
