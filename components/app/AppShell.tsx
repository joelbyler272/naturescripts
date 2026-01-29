'use client';

import { AppSidebar } from '@/components/app/AppSidebar';
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
    <div className="min-h-screen flex bg-background">
      {/* Left Sidebar */}
      <AppSidebar />
      
      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen overflow-hidden relative",
          "transition-all duration-300 ease-out"
        )}
      >
        {/* User Avatar - Fixed to top right */}
        {user && !loading && (
          <div className="absolute top-4 right-6 z-10">
            <UserAvatar />
          </div>
        )}
        
        {/* Page Content - Centered */}
        <main className="flex-1 overflow-y-auto bg-secondary/20">
          <div 
            className={cn(
              "min-h-full flex justify-center",
              "transition-all duration-300 ease-out"
            )}
          >
            <div className={cn("w-full px-6 py-6", maxWidth)}>
              {children}
            </div>
          </div>
        </main>
      </div>
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
