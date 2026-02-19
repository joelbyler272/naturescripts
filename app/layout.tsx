import type React from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { AuthProvider } from "@/lib/auth/AuthContext"
import { PostHogProvider } from "@/components/providers/PostHogProvider"
import "./globals.css"

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: '--font-geist-mono'
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naturescripts.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NatureScripts — Personalized Natural Health Protocols",
    template: "%s | NatureScripts",
  },
  description: "AI-powered naturopathic consultation. Get personalized herbal, diet, and lifestyle protocols in about a minute.",
  keywords: ["natural health", "herbal medicine", "naturopathic", "health protocol", "wellness", "supplements", "holistic health", "herbal remedies"],
  authors: [{ name: "NatureScripts" }],
  creator: "NatureScripts",
  publisher: "NatureScripts",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "NatureScripts",
    title: "NatureScripts — Personalized Natural Health Protocols",
    description: "AI-powered naturopathic consultation. Get personalized herbal, diet, and lifestyle protocols in about a minute.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "NatureScripts — Personalized Natural Health Protocols",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NatureScripts — Personalized Natural Health Protocols",
    description: "AI-powered naturopathic consultation. Get personalized herbal, diet, and lifestyle protocols in about a minute.",
    images: ["/og-image.svg"],
    creator: "@naturescripts",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
