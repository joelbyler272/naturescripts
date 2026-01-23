import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Take Control of Your Health?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Start your first consultation today. No credit card required.
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
