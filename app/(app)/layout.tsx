import { AppSidebar } from '@/components/app/AppSidebar'
import { UserAvatar } from '@/components/app/UserAvatar'
import { MOCK_USER } from '@/lib/data/hardcoded'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Sidebar */}
      <AppSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar with User Avatar */}
        <header className="flex justify-end items-center px-6 h-14 border-b border-border/30 bg-white">
          <UserAvatar 
            firstName={MOCK_USER.first_name} 
            lastName="Byler" 
          />
        </header>
        
        {/* Page Content */}
        <main className="flex-1 px-6 py-6 overflow-y-auto bg-secondary/20">
          {children}
        </main>
      </div>
    </div>
  )
}
