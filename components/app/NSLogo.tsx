import Link from 'next/link';
import { routes } from '@/lib/constants/routes';

interface NSLogoProps {
  collapsed?: boolean;
}

export function NSLogo({ collapsed = false }: NSLogoProps) {
  return (
    <Link
      href={routes.dashboard}
      className="flex items-center gap-0.5 px-2 py-4 hover:opacity-80 transition-opacity"
    >
      <span className="text-2xl font-bold text-foreground">N</span>
      <span className="text-2xl font-normal text-accent">S</span>
    </Link>
  );
}
