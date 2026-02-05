'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/consultation/ChatInterface';
import { Loader2 } from 'lucide-react';

function ConsultationInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || undefined;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <ChatInterface initialQuery={initialQuery ? decodeURIComponent(initialQuery) : undefined} />
    </div>
  );
}

export function ConsultationContent() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-3xl mx-auto flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    }>
      <ConsultationInner />
    </Suspense>
  );
}
