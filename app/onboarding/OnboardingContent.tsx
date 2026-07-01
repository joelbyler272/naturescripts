'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { OnboardingChat } from '@/components/onboarding/OnboardingChat';
import { Logo } from '@/components/shared/Logo';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const PENDING_CONCERN_KEY = 'ns_pending_concern';

function OnboardingInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);
  const [resolved, setResolved] = useState(false);

  // Resolve initial concern client-side so we can prefer sessionStorage
  // (per-tab, never networked) over ?q= (leaks to PostHog/referrer/title).
  // Also strip any legacy ?q= from the URL so the symptom doesn't sit in the
  // address bar / page <title> longer than necessary.
  useEffect(() => {
    let value: string | undefined;
    try {
      const stashed = window.sessionStorage.getItem(PENDING_CONCERN_KEY);
      if (stashed) {
        window.sessionStorage.removeItem(PENDING_CONCERN_KEY);
        value = stashed;
      }
    } catch {
      // sessionStorage unavailable; fall through to ?q= compatibility path.
    }
    if (!value) {
      const fromQuery = searchParams.get('q');
      if (fromQuery) value = fromQuery;
    }
    if (searchParams.has('q')) {
      router.replace(pathname);
    }
    setInitialQuery(value || undefined);
    setResolved(true);
  }, [searchParams, router, pathname]);

  if (!resolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" aria-label="Loading" />
      </div>
    );
  }

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
        <OnboardingChat initialQuery={initialQuery} />

        {/* Medical disclaimer */}
        <p className="mt-4 text-xs text-muted-foreground/60 text-center max-w-xl mx-auto leading-relaxed">
          NatureScripts provides educational information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before starting any supplement regimen.{' '}
          <Link href="/disclaimer" className="underline hover:text-muted-foreground transition-colors">
            Full disclaimer
          </Link>
        </p>
      </main>
    </div>
  );
}

export function OnboardingContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" aria-label="Loading" />
      </div>
    }>
      <OnboardingInner />
    </Suspense>
  );
}
