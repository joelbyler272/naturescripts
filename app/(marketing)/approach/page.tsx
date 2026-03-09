import type { Metadata } from "next"
import Link from "next/link"
import { routes } from "@/lib/constants/routes"
import { Search, Shield, User, BookOpen, ArrowRight, Leaf } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Approach | NatureScripts",
  description: "How NatureScripts builds personalized protocols. Root cause analysis, safety-first recommendations, and whole-person wellness grounded in evidence.",
  openGraph: {
    title: "Our Approach | NatureScripts",
    description: "Root cause focused. Safety first. Whole person wellness.",
  },
}

export default function ApproachPage() {
  const pillars = [
    {
      Icon: Search,
      title: "Root cause focused",
      description: "We don't just match symptoms to supplements. Our system looks at patterns across your symptoms to identify potential underlying causes — whether it's adrenal fatigue, gut dysbiosis, nutrient deficiencies, or hormonal imbalances.",
      details: [
        "Symptom cluster analysis to find connections",
        "Multi-system perspective — not just isolated symptoms",
        "Protocols address causes, not just effects",
      ],
    },
    {
      Icon: Shield,
      title: "Safety first",
      description: "Every herb and supplement we recommend is cross-referenced against your medications and health conditions. We flag potential interactions, contraindications, and dosage concerns before they become problems.",
      details: [
        "Herb-drug interaction database",
        "Contraindication screening",
        "Pregnancy and nursing safety flags",
        "Dosage range validation",
      ],
    },
    {
      Icon: User,
      title: "Whole person wellness",
      description: "A pill isn't always the answer. Our protocols include dietary adjustments, lifestyle practices, and behavioral changes alongside herbal recommendations — because lasting health requires a holistic approach.",
      details: [
        "Herbal supplements with specific dosages",
        "Dietary changes — what to add and remove",
        "Lifestyle practices and daily habits",
        "Sleep, movement, and stress management",
      ],
    },
  ]

  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 mb-16 md:mb-24">
        <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">Our approach</p>
        <h1 className="text-3xl md:text-5xl font-medium text-foreground mb-6 tracking-[-0.02em] max-w-3xl">
          Address root causes, not just symptoms
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Our protocols draw from traditional herbal medicine, modern nutritional science, and holistic wellness practices — all filtered through safety-first principles.
        </p>
      </div>

      {/* Pillars */}
      <div className="max-w-4xl mx-auto px-6 mb-16 md:mb-24">
        <div className="space-y-10">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-3">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <pillar.Icon className="w-4 h-4 text-accent" />
                  </div>
                  <h2 className="text-xl font-medium text-foreground">{pillar.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
              <div className="md:col-span-2 bg-white rounded-xl border border-border/30 p-5">
                <ul className="space-y-2.5">
                  {pillar.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence */}
      <div className="max-w-4xl mx-auto px-6 mb-16 md:mb-24">
        <div className="bg-secondary/30 rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-medium text-foreground">Evidence-based ratings</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Every remedy in our database is rated from 1.0 to 10.0 based on the quality and quantity of scientific research supporting its uses. We're honest about what the evidence shows — not everything gets a high score.
          </p>
          <Link
            href="/remedies/evidence-rating"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Learn about our rating methodology
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Database callout */}
      <div className="max-w-4xl mx-auto px-6 mb-16 md:mb-24">
        <div className="flex items-start gap-4 bg-white rounded-2xl border border-border/30 p-8">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">150+ herbs and growing</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Our remedy database covers adaptogens, nervines, immune support, digestive herbs, essential oils, vitamins, and minerals — each with detailed dosage guidance, safety information, and evidence ratings.
            </p>
            <Link
              href={routes.remedies}
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Browse the remedy database
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-medium text-foreground mb-4 tracking-[-0.01em]">
          Experience it yourself
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          See how our approach translates into a personalized protocol for your symptoms.
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
