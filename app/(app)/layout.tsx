'use client';

import { AppSidebar, SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from '@/components/app/AppSidebar'
import { UserAvatar } from '@/components/app/UserAvatar'
import { SidebarProvider, useSidebar } from '@/components/app/SidebarContext'
import { MOCK_USER } from '@/lib/data/hardcoded'
import { cn } from '@/lib/utils'

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Sidebar */}
      <AppSidebar />
      
      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-screen overflow-hidden",
          "transition-all duration-300 ease-out"
        )}
      >
        {/* Top Bar with User Avatar */}
        <header className="flex justify-end items-center px-6 h-14 border-b border-border/30 bg-white shrink-0">
          <UserAvatar 
            firstName={MOCK_USER.first_name} 
            lastName="Byler" 
          />
        </header>
        
        {/* Page Content - Centered */}
        <main className="flex-1 overflow-y-auto bg-secondary/20">
          <div 
            className={cn(
              "min-h-full flex justify-center",
              "transition-all duration-300 ease-out"
            )}
          >
            <div className="w-full max-w-4xl px-6 py-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  )
}
