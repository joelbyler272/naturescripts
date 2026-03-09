import type { Metadata } from "next"
import Link from "next/link"
import { routes } from "@/lib/constants/routes"
import { MessageSquare, Search, FileText, Shield, ArrowRight, Clock, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works | NatureScripts",
  description: "Learn how NatureScripts creates personalized natural health protocols in minutes. Describe your symptoms, get safety-checked recommendations.",
  openGraph: {
    title: "How It Works | NatureScripts",
    description: "Learn how NatureScripts creates personalized natural health protocols in minutes.",
  },
}

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Describe your symptoms",
      description: "Tell us what you're experiencing in your own words. No forms, no dropdowns, no medical jargon required. Just describe how you're feeling — whether it's fatigue, digestive issues, trouble sleeping, or something more complex.",
      details: [
        "Write in natural language — like texting a friend",
        "Mention any medications you're currently taking",
        "Include how long you've been experiencing symptoms",
        "No account required to get started",
      ],
      Icon: MessageSquare,
    },
    {
      number: "02",
      title: "We analyze and check for safety",
      description: "Our system identifies patterns in your symptoms, cross-references potential root causes, and checks every recommendation against known herb-drug interactions and contraindications.",
      details: [
        "Pattern recognition across symptom clusters",
        "Herb-drug interaction database cross-check",
        "Contraindication screening for safety",
        "Evidence-based matching from 150+ herbs",
      ],
      Icon: Search,
    },
    {
      number: "03",
      title: "Get your personalized protocol",
      description: "Receive a comprehensive, three-part protocol tailored to your specific situation — herbal supplements, dietary adjustments, and lifestyle practices. Everything is explained clearly with dosages, timing, and reasoning.",
      details: [
        "Specific herbs with dosages and timing",
        "Diet changes — what to add and what to reduce",
        "Lifestyle practices for long-term support",
        "Safety notes and healthcare provider guidance",
      ],
      Icon: FileText,
    },
  ]

  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-24">
        <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">How it works</p>
        <h1 className="text-3xl md:text-5xl font-medium text-foreground mb-5 tracking-[-0.02em]">
          Your protocol in three simple steps
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          No appointments, no waiting rooms, no complex forms. Describe what you're experiencing and get evidence-based natural health recommendations in minutes.
        </p>
      </div>

      {/* Quick stats */}
      <div className="max-w-3xl mx-auto px-6 mb-16 md:mb-24">
        <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl border border-border/30 p-6">
          <div className="text-center">
            <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-2xl font-light text-foreground">~3 min</p>
            <p className="text-xs text-muted-foreground">Start to finish</p>
          </div>
          <div className="text-center border-x border-border/30">
            <Shield className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-2xl font-light text-foreground">Safety first</p>
            <p className="text-xs text-muted-foreground">Interaction checks</p>
          </div>
          <div className="text-center">
            <CheckCircle className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-2xl font-light text-foreground">Free</p>
            <p className="text-xs text-muted-foreground">No account needed</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="space-y-12 md:space-y-16">
          {steps.map((step) => (
            <div key={step.number} className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <span className="text-xs font-mono text-accent tracking-wider">{step.number}</span>
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mt-2 mb-4 tracking-[-0.01em]">
                  {step.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              <div className="bg-white rounded-xl border border-border/30 p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <step.Icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Key details</span>
                </div>
                <ul className="space-y-3">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-16 md:mt-24 text-center">
        <div className="bg-foreground rounded-2xl p-10 md:p-14">
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-[-0.02em]">
            Ready to get started?
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Describe your symptoms and get your personalized protocol in minutes.
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
    </div>
  )
}
