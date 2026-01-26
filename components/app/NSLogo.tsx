import Link from 'next/link';
import { routes } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';

interface NSLogoProps {
  collapsed?: boolean;
}

export function NSLogo({ collapsed = false }: NSLogoProps) {
  return (
    <Link
      href={routes.dashboard}
      className={cn(
        'flex items-center hover:opacity-80 transition-opacity',
        collapsed ? 'justify-center' : 'gap-0.5'
      )}
    >
      {/* Leaf/Script icon for collapsed state */}
      {collapsed ? (
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-accent"
          >
            <path
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.5 4.5-1.5-1.5-1-2.5-2.5-2.5-4.5 0-3 2.5-5.5 5.5-5.5.5 0 1 0 1.5.5C21 10 21 9 21 8c0-3-2.5-6-9-6z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M12 8v8M9 12h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <>
          <span className="text-xl font-bold text-foreground">Nature</span>
          <span className="text-xl font-bold text-accent">Scripts</span>
        </>
      )}
    </Link>
  );
}
