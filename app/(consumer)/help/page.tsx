'use client';

import { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/lib/constants/routes';
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  Leaf,
  CreditCard,
  Shield,
  ChevronDown,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const helpSections = [
  {
    icon: MessageSquare,
    title: 'Consultations',
    faqs: [
      {
        q: 'How do consultations work?',
        a: 'Describe your symptoms or health concern, and our AI naturopathic consultant will ask a few clarifying questions before generating a personalized protocol with natural remedies, dosages, and timing.',
      },
      {
        q: 'How many consultations do I get?',
        a: 'Free users get 5 consultations per week. Pro users ($12.99/month) get unlimited consultations.',
      },
      {
        q: 'Can I adjust a previous protocol?',
        a: 'Yes. From any past protocol, click "Adjust Protocol" to start a new consultation that references your previous recommendations.',
      },
    ],
  },
  {
    icon: BookOpen,
    title: 'Protocols',
    faqs: [
      {
        q: 'What\'s included in a protocol?',
        a: 'Every protocol includes remedy recommendations with dosages, timing, and a daily schedule. Pro protocols also include dietary shifts, lifestyle practices, and tracking suggestions.',
      },
      {
        q: 'Where can I find my past protocols?',
        a: 'Go to Home > My Protocols in the sidebar, or visit the Your Protocols section on your dashboard.',
      },
      {
        q: 'Are the product links affiliated?',
        a: 'Yes. Product links to Amazon and iHerb include affiliate tags. This helps support NatureScripts at no extra cost to you. We only recommend reputable brands.',
      },
    ],
  },
  {
    icon: Leaf,
    title: 'Remedies & Safety',
    faqs: [
      {
        q: 'Is NatureScripts medical advice?',
        a: 'No. NatureScripts provides educational information about natural health approaches. Always consult with a qualified healthcare provider before starting any new supplement or health regimen.',
      },
      {
        q: 'Does it check for drug interactions?',
        a: 'Yes. Our AI considers your current medications and health conditions when making recommendations and will flag potential interactions or cautions.',
      },
      {
        q: 'Where can I learn more about a remedy?',
        a: 'Visit the Remedy Database in the sidebar to browse detailed profiles for herbs, vitamins, minerals, and supplements.',
      },
    ],
  },
  {
    icon: CreditCard,
    title: 'Billing & Pro',
    faqs: [
      {
        q: 'What does Pro include?',
        a: 'Unlimited consultations, comprehensive protocols with dietary and lifestyle guidance, symptom and supplement tracking, full protocol history, and priority support — all for $12.99/month.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes. Cancel from Settings > Subscription. You\'ll keep Pro access until the end of your billing period.',
      },
      {
        q: 'How do I upgrade?',
        a: 'Go to Settings or visit the Upgrade page. Payment is handled securely through Stripe.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'Privacy & Data',
    faqs: [
      {
        q: 'Is my health data private?',
        a: 'Yes. Your health profile, consultations, and protocols are private to your account. We never share or sell your data.',
      },
      {
        q: 'Can I delete my data?',
        a: 'Yes. Contact us at the email below and we\'ll delete your account and all associated data.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left"
    >
      <div className="flex items-start justify-between gap-3 py-3">
        <span className="text-sm font-medium text-foreground">{q}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 shrink-0 text-muted-foreground transition-transform mt-0.5',
            open && 'rotate-180'
          )}
        />
      </div>
      {open && (
        <p className="text-sm text-muted-foreground pb-3 pr-8">{a}</p>
      )}
    </button>
  );
}

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-semibold text-foreground">Help & Support</h1>
        </div>
        <p className="text-muted-foreground">
          Find answers to common questions or get in touch.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-6">
        {helpSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-border/40 overflow-hidden"
            >
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/30">
                <Icon className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
              </div>
              <div className="px-5 divide-y divide-border/30">
                {section.faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="mt-8 bg-secondary/20 rounded-xl border border-border/30 p-6 text-center">
        <h3 className="font-medium text-foreground mb-2">Still need help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="mailto:support@naturescripts.io"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            support@naturescripts.io
          </a>
          <Link
            href={routes.faqs}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-foreground text-sm font-medium rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Full FAQ page
          </Link>
        </div>
      </div>
    </div>
  );
}
