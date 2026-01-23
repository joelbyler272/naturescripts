import { ConsultationChat } from '@/components/consultation/ConsultationChat';
import { MOCK_CHAT_MESSAGES } from '@/lib/data/hardcoded';
import { routes } from '@/lib/constants/routes';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ConsultationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href={routes.dashboard}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">New Consultation</h1>
        <p className="text-muted-foreground">
          Share your health concerns and I'll create a personalized protocol for you
        </p>
      </div>

      {/* Chat Interface */}
      <ConsultationChat initialMessages={MOCK_CHAT_MESSAGES} />

      {/* Info Box */}
      <div className="mt-6 bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-foreground/80">
          <strong>Privacy Note:</strong> Your health information is encrypted and never shared.
          This consultation is for educational purposes only and not a substitute for medical
          advice.
        </p>
      </div>
    </div>
  );
}
