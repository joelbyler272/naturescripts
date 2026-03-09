"use client"

import { useState } from "react"
import Link from "next/link"
import { routes } from "@/lib/constants/routes"
import { ChevronDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const faqCategories = [
  {
    title: "General",
    faqs: [
      {
        question: "What is NatureScripts?",
        answer: "NatureScripts is an AI-powered tool that creates personalized natural health protocols. You describe your symptoms and health goals, and we generate a tailored plan that includes herbal supplements, dietary adjustments, and lifestyle practices — all safety-checked for interactions.",
      },
      {
        question: "Is this medical advice?",
        answer: "No. NatureScripts provides educational information about natural health approaches. We do not diagnose, treat, or cure any disease. Always consult with a qualified healthcare provider before starting any new supplement or health regimen.",
      },
      {
        question: "How long does it take to get my protocol?",
        answer: "Most consultations take about 2-3 minutes to complete, and you'll receive your personalized protocol immediately after. No waiting, no appointments.",
      },
      {
        question: "Do I need an account to use NatureScripts?",
        answer: "No. You can get your first consultation completely free without creating an account. An account is only needed if you want to save your protocols, track symptoms, or access Pro features.",
      },
    ],
  },
  {
    title: "Safety",
    faqs: [
      {
        question: "How does NatureScripts check for safety?",
        answer: "Our system cross-references any medications you're taking against our database of known herb-drug interactions. We flag potential contraindications and always recommend discussing your protocol with your healthcare provider.",
      },
      {
        question: "What if I'm taking prescription medications?",
        answer: "Always mention your medications during the consultation. Our system will check for known interactions and flag any concerns. However, this is not a substitute for talking to your pharmacist or doctor — always verify with them before adding supplements.",
      },
      {
        question: "Is it safe to use during pregnancy or breastfeeding?",
        answer: "Many herbs and supplements are not recommended during pregnancy or breastfeeding. Our system flags these concerns, but you should always consult your OB/GYN or midwife before taking any supplements during pregnancy or while nursing.",
      },
    ],
  },
  {
    title: "Pricing & Plans",
    faqs: [
      {
        question: "Can I try NatureScripts without paying?",
        answer: "Yes. Your first consultation is completely free, no account or credit card needed. The free plan gives you 1 consultation per week with full safety checking.",
      },
      {
        question: "What does Pro include?",
        answer: "Pro ($9/month) includes unlimited consultations, symptom and supplement tracking, protocol history and comparison, the ability to adjust and refine protocols over time, and priority support.",
      },
      {
        question: "Can I cancel Pro anytime?",
        answer: "Yes. Cancel anytime from your account settings. You'll keep Pro access until the end of your billing period. No cancellation fees.",
      },
    ],
  },
  {
    title: "Privacy",
    faqs: [
      {
        question: "Is my health information private?",
        answer: "Yes. We take privacy seriously. Your health information is encrypted and never sold to third parties. See our Privacy Policy for complete details.",
      },
      {
        question: "What data do you collect?",
        answer: "We collect the information you provide during consultations (symptoms, medications, health goals) and basic account information if you sign up. We use this only to provide and improve our service.",
      },
      {
        question: "Can I delete my data?",
        answer: "Yes. You can request deletion of your data at any time by contacting support@naturescripts.com. We'll remove your data within 30 days of the request.",
      },
    ],
  },
]

export default function FAQsPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-14 md:mb-20">
        <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">FAQ</p>
        <h1 className="text-3xl md:text-5xl font-medium text-foreground mb-5 tracking-[-0.02em]">
          Frequently asked questions
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Everything you need to know about NatureScripts. Can't find your answer?{" "}
          <Link href={routes.contact} className="text-accent hover:text-accent/80 transition-colors">
            Contact us
          </Link>.
        </p>
      </div>

      {/* FAQ sections */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="space-y-10">
          {faqCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-lg font-medium text-foreground mb-4">{category.title}</h2>
              <div className="space-y-2">
                {category.faqs.map((faq, i) => {
                  const key = `${category.title}-${i}`
                  const isOpen = openItems[key]
                  return (
                    <div key={key} className="border border-border/40 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/20 transition-colors"
                      >
                        <span className="font-medium text-sm text-foreground pr-4">{faq.question}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200",
                          isOpen ? "max-h-96" : "max-h-0"
                        )}
                      >
                        <div className="px-5 pb-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 mt-14 text-center">
        <p className="text-muted-foreground mb-4">Still have questions?</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={routes.contact}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white hover:brightness-110 transition-all"
          >
            Contact us
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={routes.onboarding}
            className="inline-flex items-center gap-2 rounded-xl border border-border/50 px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/30 transition-all"
          >
            Try it free
          </Link>
        </div>
      </div>
    </div>
  )
}
