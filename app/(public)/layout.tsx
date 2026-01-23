import { Navigation } from '@/components/app/Navigation'
import { Footer } from '@/components/shared/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation isAuthenticated={false} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
