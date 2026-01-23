import { Navigation } from '@/components/app/Navigation'
import { Footer } from '@/components/shared/Footer'
import { MOCK_USER } from '@/lib/data/hardcoded'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation isAuthenticated={true} userTier={MOCK_USER.tier} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
