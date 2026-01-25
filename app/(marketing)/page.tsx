"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/app/Navigation"
import { Footer } from "@/components/shared/Footer"
import { routes } from "@/lib/constants/routes"
import { colors } from "@/lib/constants/colors"

export default function LandingPage() {
  const [query, setQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [animatedStats, setAnimatedStats] = useState({ time: 0, parts: 0, herbs: 0 })

  // Animate stats on mount
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setAnimatedStats({
        time: Math.round(progress * 3),
        parts: Math.round(progress * 3),
        herbs: Math.round(progress * 150),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

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

      {/* Hero Section - With Animated Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/50">
          {/* Floating botanical elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full opacity-[0.03] animate-float-slow" style={{ backgroundColor: colors.sage.DEFAULT }} />
            <div className="absolute top-40 right-[15%] w-48 h-48 rounded-full opacity-[0.04] animate-float-medium" style={{ backgroundColor: colors.sage.DEFAULT }} />
            <div className="absolute bottom-32 left-[20%] w-32 h-32 rounded-full opacity-[0.03] animate-float-fast" style={{ backgroundColor: colors.sage.DEFAULT }} />
            <div className="absolute bottom-20 right-[25%] w-56 h-56 rounded-full opacity-[0.02] animate-float-slow" style={{ backgroundColor: colors.sage.DEFAULT }} />
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-8 max-w-4xl text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-normal leading-[1.05] tracking-[-0.03em] text-foreground">
              Personalized natural health protocols, in about a minute
            </h1>

            <p className="mb-14 max-w-xl text-lg md:text-xl font-light leading-relaxed text-muted-foreground tracking-[-0.01em]">
              Describe what's going on in your body. We analyze patterns and suggest safe, evidence-based natural support.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <div className="rounded-full bg-foreground p-[5px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <div className="flex items-center gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="I'm exhausted all the time, bloated after meals, can't sleep..."
                    className="h-14 flex-1 bg-transparent px-6 text-[15px] text-background placeholder:text-background/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (query.trim()) {
                        console.log("Starting consultation with:", query)
                      }
                    }}
                    className="h-14 shrink-0 rounded-full px-8 text-[15px] font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: colors.sage.DEFAULT }}
                  >
                    Start consultation
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between px-4">
                <p className="text-xs text-muted-foreground/50">
                  No diagnosis. Safety-checked for herb-drug interactions.
                </p>
                <span className="text-xs tabular-nums text-muted-foreground/40">
                  {query.trim().length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <section className="border-y border-border/30 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-2">
                ~{animatedStats.time}<span className="text-2xl md:text-3xl text-muted-foreground/60"> min</span>
              </div>
              <p className="text-sm text-muted-foreground">Average consultation time</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-2">
                {animatedStats.parts}<span className="text-2xl md:text-3xl text-muted-foreground/60">-part</span>
              </div>
              <p className="text-sm text-muted-foreground">Comprehensive protocol</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-2">
                {animatedStats.herbs}<span className="text-2xl md:text-3xl text-muted-foreground/60">+</span>
              </div>
              <p className="text-sm text-muted-foreground">Herbs in our database</p>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Preview Section - NEW */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-normal text-foreground mb-5 tracking-[-0.02em]">
              See what you'll receive
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete, personalized protocol delivered instantly — herbs, diet, and lifestyle changes tailored to your symptoms.
            </p>
          </div>

          {/* Protocol Mockup */}
          <div className="relative">
            {/* Main Protocol Card */}
            <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-border/40 overflow-hidden max-w-4xl mx-auto">
              {/* Header */}
              <div className="px-8 py-6 border-b border-border/40 bg-secondary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Protocol</p>
                    <h3 className="text-xl font-medium text-foreground">Fatigue & Low Energy Support</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Generated</p>
                    <p className="text-sm text-foreground">Just now</p>
                  </div>
                </div>
              </div>

              {/* Protocol Content Grid */}
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
                {/* Herbal Support */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.sage.DEFAULT}15` }}>
                      <svg className="w-5 h-5" style={{ color: colors.sage.DEFAULT }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-foreground">Herbal Support</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.sage.DEFAULT }} />
                      <div>
                        <p className="font-medium text-sm text-foreground">Ashwagandha</p>
                        <p className="text-xs text-muted-foreground">300mg, twice daily with meals</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.sage.DEFAULT }} />
                      <div>
                        <p className="font-medium text-sm text-foreground">Rhodiola Rosea</p>
                        <p className="text-xs text-muted-foreground">200mg, morning on empty stomach</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.sage.DEFAULT }} />
                      <div>
                        <p className="font-medium text-sm text-foreground">B-Complex</p>
                        <p className="text-xs text-muted-foreground">1 capsule, with breakfast</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Diet Changes */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.sage.DEFAULT}15` }}>
                      <svg className="w-5 h-5" style={{ color: colors.sage.DEFAULT }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-foreground">Diet Changes</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-sm">✓</span>
                      <p className="text-sm text-foreground">Increase iron-rich foods: spinach, lentils, grass-fed beef</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-sm">✓</span>
                      <p className="text-sm text-foreground">Add vitamin C with iron sources for absorption</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 text-sm">✗</span>
                      <p className="text-sm text-foreground">Reduce caffeine after 12pm</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 text-sm">✗</span>
                      <p className="text-sm text-foreground">Limit refined sugar and processed foods</p>
                    </li>
                  </ul>
                </div>

                {/* Lifestyle */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.sage.DEFAULT}15` }}>
                      <svg className="w-5 h-5" style={{ color: colors.sage.DEFAULT }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-foreground">Lifestyle</h4>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.sage.DEFAULT }} />
                      <p className="text-sm text-foreground">Sleep by 10:30pm to align with cortisol rhythm</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.sage.DEFAULT }} />
                      <p className="text-sm text-foreground">Morning sunlight exposure within 30 min of waking</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colors.sage.DEFAULT }} />
                      <p className="text-sm text-foreground">10-minute walk after lunch</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Safety Note */}
              <div className="px-8 py-4 bg-amber-50 border-t border-amber-100">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Safety check passed.</span> No interactions detected with your current medications. Always consult your healthcare provider before starting new supplements.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.05] -z-10" style={{ backgroundColor: colors.sage.DEFAULT }} />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-[0.05] -z-10" style={{ backgroundColor: colors.sage.DEFAULT }} />
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="bg-secondary/30 py-28 md:py-40">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm font-medium tracking-wider text-muted-foreground/60 uppercase mb-4">
            How it works
          </p>
          <h2 className="text-center text-3xl md:text-5xl font-normal text-foreground mb-20 tracking-[-0.02em]">
            Three steps to your protocol
          </h2>

          {/* Progress Line */}
          <div className="hidden md:block relative mb-16">
            <div className="absolute top-5 left-[16.67%] right-[16.67%] h-0.5 bg-border" />
            <div className="absolute top-5 left-[16.67%] w-1/3 h-0.5" style={{ backgroundColor: colors.sage.DEFAULT }} />
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
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
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full text-base font-medium text-white mb-6" style={{ backgroundColor: colors.sage.DEFAULT }}>
                  {item.step}
                </div>
                <h3 className="text-xl md:text-2xl font-normal text-foreground mb-4 tracking-[-0.01em]">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For - Refined */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-normal text-foreground mb-5 tracking-[-0.02em]">
              Get support for what you're experiencing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether it's a nagging issue or a complex set of symptoms, we can help you find natural approaches.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conditions.map((condition, index) => (
              <div
                key={index}
                className="group bg-white hover:bg-secondary/40 border border-border/40 hover:border-border rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer"
              >
                <span className="text-3xl mb-4 block">{condition.icon}</span>
                <span className="text-sm font-medium text-foreground">{condition.name}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            And many more — just describe what you're experiencing.
          </p>
        </div>
      </section>

      {/* Our Approach - Dark Section */}
      <section className="bg-foreground text-background py-28 md:py-40">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-normal mb-8 tracking-[-0.02em]">
                A different approach to health
              </h2>
              <p className="text-background/70 text-lg leading-relaxed mb-10">
                We believe in addressing root causes, not just masking symptoms. Our protocols draw from traditional herbal medicine, 
                modern nutritional science, and holistic wellness practices — all filtered through safety-first principles.
              </p>
              <Link
                href={routes.consultation}
                className="inline-flex items-center gap-2 text-base font-medium transition-opacity hover:opacity-80"
                style={{ color: colors.sage.light }}
              >
                Start your consultation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            <div className="space-y-8">
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
                <div key={index} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: colors.sage.DEFAULT }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-lg">{item.title}</h3>
                    <p className="text-background/60">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl md:text-5xl font-normal text-foreground mb-16 tracking-[-0.02em]">
            Frequently asked questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border/50 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/20 transition-colors"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-zinc-800" />
        
        {/* Decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]" style={{ backgroundColor: colors.sage.DEFAULT }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ backgroundColor: colors.sage.DEFAULT }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ backgroundColor: colors.sage.DEFAULT }} />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal text-white mb-8 tracking-[-0.02em]">
            Ready to discover your natural path to better health?
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
            Get your personalized protocol in minutes. No account required to start.
          </p>
          <Link
            href={routes.consultation}
            className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-lg font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgba(64,141,89,0.4)]"
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

      {/* CSS for floating animation */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, 25px) rotate(-5deg); }
          66% { transform: translate(25px, -15px) rotate(5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -20px); }
        }
        .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 15s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 10s ease-in-out infinite; }
      `}</style>
    </main>
  )
}
