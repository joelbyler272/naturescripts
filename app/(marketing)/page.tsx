"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/constants/routes"
import { colors } from "@/lib/constants/colors"
import { cn } from "@/lib/utils"
import {
  Zap,
  Leaf,
  Moon,
  Brain,
  Scale,
  Flame,
  Bone,
  Sparkles,
  Clock,
  Layers,
  BookOpen,
  Heart,
  Sun,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  Shield,
  Search as SearchIcon,
  AlertTriangle,
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [animatedStats, setAnimatedStats] = useState({ time: 0, parts: 0, herbs: 0 })

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
    { name: "Fatigue & Low Energy", Icon: Zap },
    { name: "Digestive Issues", Icon: Leaf },
    { name: "Sleep Problems", Icon: Moon },
    { name: "Stress & Anxiety", Icon: Brain },
    { name: "Hormonal Imbalance", Icon: Scale },
    { name: "Brain Fog", Icon: Flame },
    { name: "Joint & Muscle Pain", Icon: Bone },
    { name: "Skin Conditions", Icon: Sparkles },
  ]

  const faqs = [
    {
      question: "Is this medical advice?",
      answer: "No. NatureScripts provides educational information about natural health approaches. We do not diagnose, treat, or cure any disease. Always consult with a qualified healthcare provider before starting any new supplement or health regimen.",
    },
    {
      question: "How does NatureScripts check for safety?",
      answer: "Our system cross-references any medications you're taking against our database of known herb-drug interactions. We flag potential contraindications and always recommend discussing your protocol with your healthcare provider.",
    },
    {
      question: "What kind of recommendations will I receive?",
      answer: "Your personalized protocol may include herbal supplements, dietary suggestions, lifestyle practices, and other natural approaches based on the symptoms and health goals you share with us.",
    },
    {
      question: "How long does it take to get my protocol?",
      answer: "Most consultations take about 2-3 minutes to complete, and you'll receive your personalized protocol immediately after.",
    },
    {
      question: "Is my health information private?",
      answer: "Yes. We take privacy seriously. Your health information is encrypted and never sold to third parties. See our Privacy Policy for complete details.",
    },
  ]

  const handleStartConsultation = () => {
    if (query.trim()) {
      router.push(`${routes.onboarding}?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push(routes.onboarding)
    }
  }

  return (
    <>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full opacity-[0.04] animate-float-slow" style={{ backgroundColor: colors.sage.DEFAULT }} />
            <div className="absolute top-48 right-[12%] w-56 h-56 rounded-full opacity-[0.03] animate-float-medium" style={{ backgroundColor: colors.sage.DEFAULT }} />
            <div className="absolute bottom-24 left-[25%] w-40 h-40 rounded-full opacity-[0.03] animate-float-fast" style={{ backgroundColor: colors.sage.DEFAULT }} />
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8">
              <Shield className="w-3.5 h-3.5" />
              Safety-checked protocols
            </div>

            <h1 className="mb-6 max-w-3xl text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-medium leading-[1.08] tracking-[-0.03em] text-foreground">
              Your personalized natural health protocol
            </h1>

            <p className="mb-12 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
              Describe your symptoms. Get an evidence-based protocol with herbs, diet, and lifestyle changes, in minutes.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-2xl">
              <div className="rounded-2xl bg-foreground p-[5px] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-2">
                  <SearchIcon className="w-5 h-5 text-background/30 ml-5 shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStartConsultation()}
                    placeholder="I'm exhausted all the time, bloated after meals..."
                    maxLength={500}
                    aria-label="Describe your health concern"
                    className="h-14 flex-1 bg-transparent px-3 text-[15px] text-background placeholder:text-background/35 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleStartConsultation}
                    aria-label="Start consultation"
                    className="h-12 shrink-0 rounded-xl px-6 text-[14px] font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                    style={{ backgroundColor: colors.sage.DEFAULT }}
                  >
                    Get my protocol
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between px-2">
                <p className="text-xs text-muted-foreground/50">
                  No account needed. No diagnosis. Free to start.
                </p>
                <span className="text-xs tabular-nums text-muted-foreground/30">
                  {query.trim().length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/30 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: `~${animatedStats.time}`, unit: "min", label: "Average consultation", Icon: Clock },
              { value: `${animatedStats.parts}`, unit: "-part", label: "Comprehensive protocol", Icon: Layers },
              { value: `${animatedStats.herbs}`, unit: "+", label: "Herbs in database", Icon: Leaf },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <stat.Icon className="w-5 h-5 text-accent mb-3 hidden sm:block" />
                <div className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
                  {stat.value}
                  <span className="text-xl md:text-2xl text-muted-foreground/50">{stat.unit}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Preview */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">
              What you get
            </p>
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4 tracking-[-0.02em]">
              A complete protocol, instantly
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Herbs, diet changes, and lifestyle shifts tailored to your symptoms and checked for safety.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-border/30 overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-border/30 bg-secondary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Your Protocol</p>
                  <h3 className="text-lg font-medium text-foreground">Fatigue & Low Energy Support</h3>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Generated</p>
                  <p className="text-sm text-foreground">Just now</p>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/30">
              {/* Herbal Support */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-accent" />
                  </div>
                  <h4 className="font-medium text-sm text-foreground">Herbal Support</h4>
                </div>
                <ul className="space-y-3.5">
                  {[
                    { name: "Ashwagandha", dose: "300mg, twice daily with meals" },
                    { name: "Rhodiola Rosea", dose: "200mg, morning on empty stomach" },
                    { name: "B-Complex", dose: "1 capsule, with breakfast" },
                  ].map((item) => (
                    <li key={item.name} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-accent" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.dose}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diet Changes */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-accent" />
                  </div>
                  <h4 className="font-medium text-sm text-foreground">Diet Changes</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    { text: "Increase iron-rich foods: spinach, lentils", add: true },
                    { text: "Add vitamin C with iron for absorption", add: true },
                    { text: "Reduce caffeine after 12pm", add: false },
                    { text: "Limit refined sugar and processed foods", add: false },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      {item.add ? (
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm text-foreground">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lifestyle */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-accent" />
                  </div>
                  <h4 className="font-medium text-sm text-foreground">Lifestyle</h4>
                </div>
                <ul className="space-y-3.5">
                  {[
                    "Sleep by 10:30pm to align with cortisol rhythm",
                    "Morning sunlight within 30 min of waking",
                    "10-minute walk after lunch",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-accent" />
                      <p className="text-sm text-foreground">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety Note */}
            <div className="px-6 sm:px-8 py-3.5 bg-amber-50/80 border-t border-amber-100/60">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs sm:text-sm text-amber-800">
                  <span className="font-medium">Safety check passed.</span>{" "}
                  No interactions detected. Always consult your healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm font-medium tracking-wider text-accent uppercase mb-3">
            How it works
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-medium text-foreground mb-16 tracking-[-0.02em]">
            Three steps to your protocol
          </h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-4">
            {[
              {
                step: "01",
                title: "Describe your symptoms",
                description: "Tell us what's going on in your own words. No forms, no dropdowns.",
              },
              {
                step: "02",
                title: "We analyze patterns",
                description: "We identify root causes, check herb-drug interactions, and build your protocol.",
              },
              {
                step: "03",
                title: "Get your protocol",
                description: "Herbs, diet shifts, and lifestyle practices delivered instantly.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-border/30 h-full">
                  <span className="text-xs font-mono text-accent tracking-wider">{item.step}</span>
                  <h3 className="text-lg font-medium text-foreground mt-3 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {/* Connector arrow (desktop only) */}
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 w-8 items-center justify-center z-10">
                    <ArrowRight className="w-4 h-4 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4 tracking-[-0.02em]">
              Get support for what you're experiencing
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Whether it's a single symptom or something more complex, we can help you find natural approaches.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {conditions.map((condition) => (
              <button
                key={condition.name}
                type="button"
                onClick={() => router.push(`${routes.onboarding}?q=${encodeURIComponent(condition.name)}`)}
                className={cn(
                  "group bg-white border border-border/40 rounded-xl p-5 sm:p-6 text-center",
                  "transition-all duration-200 cursor-pointer",
                  "hover:border-accent/30 hover:shadow-[0_4px_20px_rgba(64,141,89,0.08)] hover:-translate-y-0.5"
                )}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/8 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/12 transition-colors">
                  <condition.Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">{condition.name}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            And many more. Just describe what you're experiencing.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-foreground text-background py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-sm font-medium tracking-wider uppercase mb-3" style={{ color: colors.sage.light }}>
                Our approach
              </p>
              <h2 className="text-3xl md:text-4xl font-medium mb-6 tracking-[-0.02em]">
                Address root causes, not just symptoms
              </h2>
              <p className="text-background/60 text-base leading-relaxed mb-8">
                Our protocols draw from traditional herbal medicine, modern nutritional science,
                and holistic wellness practices, all filtered through safety-first principles.
              </p>
              <Link
                href={routes.onboarding}
                className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: colors.sage.light }}
              >
                Start your consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Root cause focused",
                  description: "We look at patterns and connections, not isolated symptoms.",
                },
                {
                  title: "Safety first",
                  description: "Every recommendation is checked against your medications and conditions.",
                },
                {
                  title: "Whole person wellness",
                  description: "Mind, body, and lifestyle, not just a pill for every problem.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: colors.sage.DEFAULT }}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-0.5">{item.title}</h3>
                    <p className="text-sm text-background/50">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-center text-sm font-medium tracking-wider text-accent uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-center text-3xl md:text-4xl font-medium text-foreground mb-12 tracking-[-0.02em]">
            Common questions
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border/40 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/20 transition-colors"
                >
                  <span className="font-medium text-sm text-foreground pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      openFaq === index && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    openFaq === index ? "max-h-96" : "max-h-0"
                  )}
                >
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ backgroundColor: colors.sage.DEFAULT }} />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-5 tracking-[-0.02em]">
            Ready to feel better naturally?
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-md mx-auto">
            Get your personalized protocol in minutes. No account needed.
          </p>
          <Link
            href={routes.onboarding}
            className="inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-base font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] shadow-[0_8px_30px_rgba(64,141,89,0.3)]"
            style={{ backgroundColor: colors.sage.DEFAULT }}
          >
            Start your free consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </>
  )
}
