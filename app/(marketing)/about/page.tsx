import type { Metadata } from "next"
import Link from "next/link"
import { routes } from "@/lib/constants/routes"
import { Leaf, Heart, Shield, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About | NatureScripts",
  description: "NatureScripts makes evidence-based natural health accessible. Learn about our mission to help people find safe, personalized herbal and lifestyle protocols.",
  openGraph: {
    title: "About | NatureScripts",
    description: "Making evidence-based natural health accessible to everyone.",
  },
}

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 mb-16 md:mb-24">
        <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">About</p>
        <h1 className="text-3xl md:text-5xl font-medium text-foreground mb-6 tracking-[-0.02em] max-w-3xl">
          Making natural health accessible, safe, and evidence-based
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          NatureScripts was born from a simple frustration: finding trustworthy, personalized natural health information shouldn't be this hard. We built the tool we wished existed.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-6 mb-16 md:mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-medium text-foreground mb-4 tracking-[-0.01em]">Our mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Too many people are stuck between conventional medicine that doesn't address root causes and a sea of conflicting natural health advice online.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We're building a bridge — giving people access to personalized, safety-checked natural health protocols grounded in both traditional wisdom and modern research. No hype, no miracle cures. Just honest, evidence-based guidance.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-border/30 p-8">
            <h3 className="font-medium text-foreground mb-6">What we believe</h3>
            <div className="space-y-5">
              {[
                {
                  Icon: Leaf,
                  title: "Nature has answers",
                  text: "Thousands of years of traditional medicine deserve modern rigor, not dismissal.",
                },
                {
                  Icon: Shield,
                  title: "Safety is non-negotiable",
                  text: "Every recommendation must be checked for interactions and contraindications.",
                },
                {
                  Icon: Heart,
                  title: "Health is personal",
                  text: "Cookie-cutter advice fails. Protocols should be tailored to the individual.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <item.Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What NatureScripts is not */}
      <div className="max-w-4xl mx-auto px-6 mb-16 md:mb-24">
        <div className="bg-secondary/30 rounded-2xl p-8 md:p-10">
          <h2 className="text-xl font-medium text-foreground mb-4">What NatureScripts is not</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Not a replacement for your doctor",
              "Not a diagnosis or treatment tool",
              "Not a place to buy supplements",
              "Not making miracle claims",
            ].map((item) => (
              <p key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
                {item}
              </p>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            We provide educational information and always recommend consulting with qualified healthcare providers before making changes to your health regimen.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-medium text-foreground mb-4 tracking-[-0.01em]">
          See it in action
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Try a free consultation and see what a personalized protocol looks like.
        </p>
        <Link
          href={routes.onboarding}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white hover:brightness-110 transition-all"
        >
          Start your free consultation
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
