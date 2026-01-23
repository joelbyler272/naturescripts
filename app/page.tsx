"use client"

import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/shared/Footer"

export default function Home() {
  const [query, setQuery] = useState("")

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 md:py-20">

        {/* Header / Logo */}
        <header className="mb-20 md:mb-28 flex items-center justify-between">
          <div className="inline-block">
            <div className="cursor-pointer text-[1.6rem] font-semibold tracking-tight leading-none font-serif">
              <span className="text-foreground">Nature</span>
              <span className="text-accent font-light" style={{ color: 'rgba(64, 141, 89, 1)' }}>Scripts</span>
            </div>
            <span className="mt-0.5 block w-full text-right text-[9px] tracking-[0.4em] text-muted-foreground/40 uppercase">
              Protocol
            </span>
          </div>

          {/* Nav Links - minimal for landing */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/herbs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Herbal Database
            </Link>
            <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </header>

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
                  placeholder="I'm exhausted all the time, bloated after meals, can't sleep…"
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
                  className="
                    h-12 shrink-0 rounded-full
                    bg-accent px-6 text-[14px] font-medium text-accent-foreground
                    transition-all duration-200
                    hover:bg-accent/90
                    hover:shadow-[0_0_0_4px_rgba(107,142,127,0.15)]
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-accent/50
                    active:scale-[0.98]
                  "
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
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/50" />
              2,847 protocols generated
            </span>
            <span className="hidden sm:block h-3 w-px bg-border/60" />
            <span>Evidence-based recommendations</span>
            <span className="hidden sm:block h-3 w-px bg-border/60" />
            <span>Created by naturopathic doctors</span>
          </div>
        </section>

        {/* How It Works - Simple */}
        <section className="mt-32 md:mt-40">
          <h2 className="text-center text-sm font-medium tracking-wide text-muted-foreground/60 uppercase mb-12">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "Describe your symptoms",
                description: "Tell us what's going on — fatigue, digestion issues, sleep problems, stress, or anything else."
              },
              {
                step: "02",
                title: "AI analyzes patterns",
                description: "Our system identifies root cause patterns and checks for contraindications with any medications."
              },
              {
                step: "03",
                title: "Get your protocol",
                description: "Receive a personalized plan with herbs, diet shifts, and lifestyle practices — delivered to your inbox."
              }
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <span className="text-xs font-medium text-accent mb-3 block">{item.step}</span>
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
              href="/sign-up"
              className="
                inline-flex items-center gap-2
                rounded-full bg-accent px-8 py-3.5
                text-[15px] font-medium text-accent-foreground
                transition-all duration-200
                hover:bg-accent/90
                hover:shadow-[0_0_0_4px_rgba(107,142,127,0.15)]
              "
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
