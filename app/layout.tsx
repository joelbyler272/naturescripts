import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { AuthProvider } from "@/lib/auth/AuthContext"
import "./globals.css"

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: "NatureScripts — Personalized Natural Health Protocols",
  description: "AI-powered naturopathic consultation. Get personalized herbal, diet, and lifestyle protocols in about a minute.",
  keywords: ["natural health", "herbal medicine", "naturopathic", "health protocol", "wellness"],
  authors: [{ name: "NatureScripts" }],
  openGraph: {
    title: "NatureScripts — Personalized Natural Health Protocols",
    description: "AI-powered naturopathic consultation. Get personalized herbal, diet, and lifestyle protocols in about a minute.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
