'use client';

import { useSearchParams } from 'next/navigation';
import { ChatInterface } from '@/components/consultation/ChatInterface';
import { routes } from '@/lib/constants/routes';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ConsultationPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || undefined;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        href={routes.dashboard}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">New Consultation</h1>
        <p className="text-muted-foreground text-sm mt-1">
          I'll ask a few questions to create your personalized protocol
        </p>
      </div>

      {/* Chat Interface */}
      <ChatInterface initialQuery={initialQuery} />

      {/* Privacy Note */}
      <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Your health information is private and encrypted. This is for educational purposes 
          only and not a substitute for medical advice.
        </p>
      </div>
    </div>
  );
}
