'use client';

import { AppSidebar } from '@/components/app/AppSidebar';
import { MobileNav } from '@/components/app/MobileNav';
import { UserAvatar } from '@/components/app/UserAvatar';
import { SidebarProvider, useSidebar } from '@/components/app/SidebarContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { cn } from '@/lib/utils';

interface AppShellContentProps {
  children: React.ReactNode;
  maxWidth?: string;
}

function AppShellContent({ children, maxWidth = 'max-w-4xl' }: AppShellContentProps) {
  const { collapsed } = useSidebar();
  const { user, loading } = useAuth();

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Desktop Sidebar - hidden on mobile, fixed on desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col h-screen overflow-hidden relative",
          "transition-all duration-300 ease-out"
        )}
      >
        {/* User Avatar - Fixed to top right */}
        {user && !loading && (
          <div className="absolute top-3 right-4 sm:top-4 sm:right-6 z-10">
            <UserAvatar />
          </div>
        )}

        {/* Page Content - Scrollable */}
        <main className="flex-1 bg-secondary/20 pb-20 md:pb-0 overflow-y-auto">
          <div
            className={cn(
              "min-h-full flex justify-center",
              "transition-all duration-300 ease-out"
            )}
          >
            <div className={cn("w-full px-4 sm:px-6 py-4 sm:py-6", maxWidth)}>
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav - visible only on mobile */}
      <MobileNav />
    </div>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function AppShell({ children, maxWidth }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent maxWidth={maxWidth}>{children}</AppShellContent>
    </SidebarProvider>
  );
}
