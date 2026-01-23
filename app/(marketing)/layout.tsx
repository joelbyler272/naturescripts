import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NatureScripts - Personalized Natural Health Protocols',
  description: 'AI-powered naturopathic consultation. Get personalized herbal, diet, and lifestyle protocols in about a minute.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
