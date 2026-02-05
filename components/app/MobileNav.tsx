'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, MessageSquare, Leaf, BookOpen } from 'lucide-react';
import { routes } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';

const navItems = [
  { href: routes.dashboard, label: 'Home', icon: Home },
  { href: routes.consultation, label: 'Consult', icon: MessageSquare },
  { href: routes.remedies, label: 'Remedies', icon: Leaf },
  { href: routes.library, label: 'Library', icon: BookOpen },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-border/50 safe-area-bottom"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full rounded-lg transition-colors min-h-[44px]',
                isActive
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
