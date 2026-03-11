import type { Metadata } from "next"
import Link from "next/link"
import { routes } from "@/lib/constants/routes"
import { BookOpen, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | NatureScripts",
  description: "Articles on natural health, herbal medicine, nutrition, and evidence-based wellness. Coming soon.",
  openGraph: {
    title: "Blog | NatureScripts",
    description: "Evidence-based articles on natural health. Coming soon.",
  },
}

export default function BlogPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-6 h-6 text-accent" />
        </div>
        <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">Blog</p>
        <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-5 tracking-[-0.02em]">
          Coming soon
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          We're working on articles covering natural health, herbal medicine, nutrition science, and evidence-based wellness practices. Check back soon.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={routes.remedies}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white hover:brightness-110 transition-all"
          >
            Browse remedies
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={routes.onboarding}
            className="inline-flex items-center gap-2 rounded-xl border border-border/50 px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/30 transition-all"
          >
            Start consultation
          </Link>
        </div>
      </div>
    </div>
  )
}
