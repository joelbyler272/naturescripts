"use client"

import { useState } from "react"
import Link from "next/link"
import { routes } from "@/lib/constants/routes"
import { Mail, MessageSquare, ArrowRight, Send } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, open mailto with the form data
    const subject = encodeURIComponent(`NatureScripts Contact: ${formState.name}`)
    const body = encodeURIComponent(`From: ${formState.name} (${formState.email})\n\n${formState.message}`)
    window.location.href = `mailto:support@naturescripts.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-14 md:mb-20">
        <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">Contact</p>
        <h1 className="text-3xl md:text-5xl font-medium text-foreground mb-5 tracking-[-0.02em]">
          Get in touch
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Have a question, suggestion, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-border/30 p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-medium text-sm text-foreground">Email us</h3>
              </div>
              <a
                href="mailto:support@naturescripts.com"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                support@naturescripts.com
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                We typically respond within 24 hours.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-border/30 p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-medium text-sm text-foreground">Common questions</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Check our FAQ for quick answers to common questions.
              </p>
              <Link
                href={routes.faqs}
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors"
              >
                View FAQs
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="bg-white rounded-xl border border-border/30 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Message ready to send</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your email client should have opened with your message. If it didn't, email us directly at support@naturescripts.com.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "" }) }}
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border/30 p-6 md:p-8">
                <h2 className="font-medium text-foreground mb-6">Send us a message</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                      className={cn(
                        "w-full rounded-lg border border-border/50 px-4 py-2.5 text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
                        "placeholder:text-muted-foreground/50"
                      )}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
                      className={cn(
                        "w-full rounded-lg border border-border/50 px-4 py-2.5 text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
                        "placeholder:text-muted-foreground/50"
                      )}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                      className={cn(
                        "w-full rounded-lg border border-border/50 px-4 py-2.5 text-sm resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
                        "placeholder:text-muted-foreground/50"
                      )}
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Send message
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
