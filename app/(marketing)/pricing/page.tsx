import type { Metadata } from "next"
import Link from "next/link"
import { routes } from "@/lib/constants/routes"
import { Check, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing | NatureScripts",
  description: "NatureScripts pricing plans. Start free with basic consultations or upgrade to Pro for unlimited protocols, tracking, and more.",
  openGraph: {
    title: "Pricing | NatureScripts",
    description: "Start free. Upgrade when you're ready.",
  },
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with natural health protocols. No credit card required.",
    cta: "Start free consultation",
    ctaHref: routes.onboarding,
    highlighted: false,
    features: [
      "1 consultation per week",
      "Basic 3-part protocol",
      "Herb-drug interaction safety check",
      "Access to remedy database",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Unlimited consultations, tracking, and advanced protocol features.",
    cta: "Upgrade to Pro",
    ctaHref: routes.upgrade,
    highlighted: true,
    features: [
      "Unlimited consultations",
      "Advanced protocol customization",
      "Symptom & supplement tracking",
      "Protocol history & comparison",
      "Adjust & refine protocols over time",
      "Priority support",
      "Early access to new features",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-14 md:mb-20">
        <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">Pricing</p>
        <h1 className="text-3xl md:text-5xl font-medium text-foreground mb-5 tracking-[-0.02em]">
          Start free. Upgrade when you're ready.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          No hidden fees. No surprise charges. Get your first protocol completely free.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-foreground text-white border-2 border-foreground"
                  : "bg-white border border-border/40"
              }`}
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-light tracking-tight">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-white/50" : "text-muted-foreground"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.highlighted ? "text-white/60" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <Link
                href={plan.ctaHref}
                className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-medium transition-all ${
                  plan.highlighted
                    ? "bg-accent text-white hover:brightness-110"
                    : "bg-foreground text-white hover:bg-foreground/90"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-accent" : "text-accent"}`} />
                    <span className={plan.highlighted ? "text-white/80" : "text-foreground/80"}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 mt-16 md:mt-24">
        <h2 className="text-2xl font-medium text-foreground mb-8 text-center tracking-[-0.01em]">
          Pricing questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Can I try NatureScripts without paying?",
              a: "Yes. Your first consultation is completely free, no account or credit card needed. The free plan gives you 1 consultation per week.",
            },
            {
              q: "Can I cancel Pro anytime?",
              a: "Yes. Cancel anytime from your account settings. You'll keep Pro access until the end of your billing period.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards through Stripe. Your payment information is securely processed and never stored on our servers.",
            },
          ].map((faq) => (
            <div key={faq.q}>
              <h3 className="font-medium text-foreground mb-1">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
