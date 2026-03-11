import type { Metadata } from 'next'
import { Navigation } from '@/components/app/Navigation'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'NatureScripts - Personalized Natural Health Protocols',
  description: 'AI-powered naturopathic consultation. Get personalized herbal, diet, and lifestyle protocols in about a minute.',
}

export default function MarketingLayout({
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
