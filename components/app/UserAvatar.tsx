'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/routes';
import { useAuth } from '@/lib/auth/AuthContext';
import { Settings, LogOut } from 'lucide-react';

export function UserAvatar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';
  const lastName = user?.user_metadata?.last_name || '';
  const initials = `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push('/');
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${firstName}`}
        className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center text-sm font-medium hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2"
      >
        {initials.toUpperCase()}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border/50 py-1 z-50"
        >
          <div className="px-4 py-2 border-b border-border/50">
            <p className="text-sm font-medium text-foreground truncate">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <Link
            href={routes.settings}
            role="menuitem"
            className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors min-h-[44px]"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            Settings
          </Link>
          <hr className="my-1 border-border/50" aria-hidden="true" />
          <button
            role="menuitem"
            className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors w-full text-left min-h-[44px]"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
