'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-cream to-white py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>4,287 protocols generated this week</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-6 leading-tight">
            Your AI Naturopath,
            <br />
            <span className="text-primary">Available 24/7</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-charcoal/70 mb-10 leading-relaxed">
            Get personalized herbal protocols based on your unique health concerns. Evidence-based
            recommendations from traditional wisdom and modern research.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <Input
                type="text"
                placeholder="What health concerns are you experiencing? (e.g., fatigue, anxiety, digestion)"
                className="pl-12 pr-4 py-6 text-base rounded-xl border-2 border-primary/20 focus:border-primary"
              />
            </div>
            <Link href="/sign-up">
              <Button className="w-full sm:w-auto mt-4 sm:mt-0 sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 bg-primary hover:bg-primary/90 px-8 py-6 text-base">
                Start Consultation
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <p className="text-sm text-charcoal/60">
            Free tier: 3 consultations/day • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
