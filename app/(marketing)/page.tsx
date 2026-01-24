"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/app/Navigation"
import { Footer } from "@/components/shared/Footer"
import { routes } from "@/lib/constants/routes"
import { colors } from "@/lib/constants/colors"

export default function LandingPage() {
  const [query, setQuery] = useState("")

  return (
    <main className="min-h-screen bg-background">
      {/* Same Navigation as Remedy Database and Library */}
      <Navigation isAuthenticated={false} />

      <div className="mx-auto w-full max-w-5xl px-6 py-12 md:py-20">
        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="mb-6 max-w-3xl text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] font-normal leading-[1.1] tracking-[-0.025em] text-foreground text-balance">
            Personalized natural health protocols, in about a minute
          </h1>

          {/* Subtitle */}
          <p className="mb-14 max-w-lg text-base md:text-[17px] font-light leading-relaxed text-muted-foreground">
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
                      // Will connect to consultation flow
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

            {/* Micro-trust */}
            <div className="mt-4 flex items-center justify-between px-3">
              <p className="text-[11px] text-muted-foreground/45">
                No diagnosis. Safety-checked for herb-drug interactions.
              </p>
              <span className="text-[11px] tabular-nums text-muted-foreground/35">
                {query.trim().length}/500
              </span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground/40">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.sage.DEFAULT, opacity: 0.5 }} />
              2,847 protocols generated
            </span>
            <span className="hidden sm:block h-3 w-px bg-border/60" />
            <span>Evidence-based recommendations</span>
            <span className="hidden sm:block h-3 w-px bg-border/60" />
            <span>Created by naturopathic doctors</span>
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-32 md:mt-40">
          <h2 className="text-center text-sm font-medium tracking-wide text-muted-foreground/60 uppercase mb-12">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "Describe your symptoms",
                description: "Tell us what's going on - fatigue, digestion issues, sleep problems, stress, or anything else."
              },
              {
                step: "02",
                title: "AI analyzes patterns",
                description: "Our system identifies root cause patterns and checks for contraindications with any medications."
              },
              {
                step: "03",
                title: "Get your protocol",
                description: "Receive a personalized plan with herbs, diet shifts, and lifestyle practices."
              }
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <span className="text-xs font-medium mb-3 block" style={{ color: colors.sage.DEFAULT }}>{item.step}</span>
                <h3 className="text-lg font-normal text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32 md:mt-40 mb-32 md:mb-40 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-muted-foreground mb-6 max-w-md">
              Join thousands who've discovered a clearer path to better health.
            </p>
            <Link
              href={routes.signUp}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-medium text-accent-foreground transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: colors.sage.DEFAULT }}
            >
              Start your free consultation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
