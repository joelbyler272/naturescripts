"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/app/Navigation"
import { Footer } from "@/components/shared/Footer"
import { routes } from "@/lib/constants/routes"
import { colors } from "@/lib/constants/colors"

export default function LandingPage() {
  const [query, setQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const conditions = [
    { name: "Fatigue & Low Energy", icon: "⚡" },
    { name: "Digestive Issues", icon: "🌿" },
    { name: "Sleep Problems", icon: "🌙" },
    { name: "Stress & Anxiety", icon: "🧘" },
    { name: "Hormonal Imbalance", icon: "⚖️" },
    { name: "Brain Fog", icon: "🧠" },
    { name: "Joint & Muscle Pain", icon: "💪" },
    { name: "Skin Conditions", icon: "✨" },
  ]

  const faqs = [
    {
      question: "Is this medical advice?",
      answer: "No. NatureScripts provides educational information about natural health approaches. We do not diagnose, treat, or cure any disease. Always consult with a qualified healthcare provider before starting any new supplement or health regimen."
    },
    {
      question: "How does NatureScripts check for safety?",
      answer: "Our system cross-references any medications you're taking against our database of known herb-drug interactions. We flag potential contraindications and always recommend discussing your protocol with your healthcare provider."
    },
    {
      question: "What kind of recommendations will I receive?",
      answer: "Your personalized protocol may include herbal supplements, dietary suggestions, lifestyle practices, and other natural approaches based on the symptoms and health goals you share with us."
    },
    {
      question: "How long does it take to get my protocol?",
      answer: "Most consultations take about 2-3 minutes to complete, and you'll receive your personalized protocol immediately after."
    },
    {
      question: "Is my health information private?",
      answer: "Yes. We take privacy seriously. Your health information is encrypted and never sold to third parties. See our Privacy Policy for complete details."
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation isAuthenticated={false} />

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-6 max-w-3xl text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] font-normal leading-[1.1] tracking-[-0.025em] text-foreground text-balance">
            Personalized natural health protocols, in about a minute
          </h1>

          <p className="mb-12 max-w-lg text-base md:text-[17px] font-light leading-relaxed text-muted-foreground">
            Describe what's going on in your body. We analyze patterns and suggest safe, evidence-based natural support.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <div className="rounded-full bg-foreground p-[5px] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
              <div className="flex items-center gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="I'm exhausted all the time, bloated after meals, can't sleep..."
                  className="h-12 flex-1 bg-transparent px-5 text-[15px] text-background placeholder:text-background/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (query.trim()) {
                      console.log("Starting consultation with:", query)
                    }
                  }}
                  className="h-12 shrink-0 rounded-full px-6 text-[14px] font-medium text-accent-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: colors.sage.DEFAULT }}
                >
                  Start consultation
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between px-3">
              <p className="text-[11px] text-muted-foreground/45">
                No diagnosis. Safety-checked for herb-drug interactions.
              </p>
              <span className="text-[11px] tabular-nums text-muted-foreground/35">
                {query.trim().length}/500
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border/40 bg-secondary/30">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: colors.sage.DEFAULT }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Evidence-based recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: colors.sage.DEFAULT }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Safety-checked for interactions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: colors.sage.DEFAULT }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Personalized to your body</span>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-4">
            Your personalized protocol
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive natural health plan tailored to your unique symptoms, goals, and any medications you're taking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Herbal Support",
              description: "Specific herbs and supplements matched to your symptoms, with dosage guidance and timing recommendations.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )
            },
            {
              title: "Diet & Nutrition",
              description: "Foods to embrace and avoid based on your health goals, plus meal timing and preparation tips.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )
            },
            {
              title: "Lifestyle Practices",
              description: "Daily routines, sleep hygiene, stress management techniques, and movement recommendations.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )
            },
          ].map((item, index) => (
            <div key={index} className="bg-secondary/40 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-6" style={{ color: colors.sage.DEFAULT }}>
                {item.icon}
              </div>
              <h3 className="text-lg font-medium text-foreground mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-sm font-medium tracking-wide text-muted-foreground/60 uppercase mb-16">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Describe your symptoms",
                description: "Tell us what's going on — fatigue, digestion issues, sleep problems, stress, or anything else affecting your wellbeing."
              },
              {
                step: "02",
                title: "We analyze patterns",
                description: "Our system identifies root cause patterns, checks for herb-drug interactions, and considers your complete health picture."
              },
              {
                step: "03",
                title: "Get your protocol",
                description: "Receive a personalized plan with specific herbs, diet shifts, and lifestyle practices — delivered instantly."
              }
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium text-white mb-4" style={{ backgroundColor: colors.sage.DEFAULT }}>
                  {item.step}
                </div>
                <h3 className="text-xl font-normal text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-4">
            Get support for what you're experiencing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether it's a nagging issue or a complex set of symptoms, we can help you find natural approaches.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {conditions.map((condition, index) => (
            <div
              key={index}
              className="group bg-secondary/40 hover:bg-secondary/60 rounded-xl p-6 text-center transition-colors cursor-pointer"
            >
              <span className="text-2xl mb-3 block">{condition.icon}</span>
              <span className="text-sm font-medium text-foreground">{condition.name}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          And many more — just describe what you're experiencing.
        </p>
      </section>

      {/* Our Approach */}
      <section className="bg-foreground text-background py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-6">
            A different approach to health
          </h2>
          <p className="text-background/70 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            We believe in addressing root causes, not just masking symptoms. Our protocols draw from traditional herbal medicine, 
            modern nutritional science, and holistic wellness practices — all filtered through safety-first principles.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Root cause focused",
                description: "We look at patterns and connections, not isolated symptoms."
              },
              {
                title: "Safety first",
                description: "Every recommendation is checked against your medications and conditions."
              },
              {
                title: "Whole person wellness",
                description: "Mind, body, and lifestyle — not just a pill for every problem."
              }
            ].map((item, index) => (
              <div key={index} className="border-l-2 pl-6" style={{ borderColor: colors.sage.DEFAULT }}>
                <h3 className="font-medium mb-2">{item.title}</h3>
                <p className="text-background/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <h2 className="text-center text-3xl md:text-4xl font-normal text-foreground mb-16">
          Frequently asked questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border/60 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/30 transition-colors"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-secondary/40 py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-6">
            Ready to discover your natural path to better health?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Get your personalized protocol in minutes. No account required to start.
          </p>
          <Link
            href={routes.consultation}
            className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-[16px] font-medium text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: colors.sage.DEFAULT }}
          >
            Start your free consultation
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
