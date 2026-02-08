'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { OnboardingChat } from '@/components/onboarding/OnboardingChat';
import { Logo } from '@/components/shared/Logo';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function OnboardingInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Link 
            href="/sign-in" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </header>

      {/* Chat area */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <OnboardingChat initialQuery={initialQuery ? decodeURIComponent(initialQuery) : undefined} />
      </main>
    </div>
  );
}

export function OnboardingContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    }>
      <OnboardingInner />
    </Suspense>
  );
}
