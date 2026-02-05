import type { Metadata } from 'next';
import { ConsultationContent } from './ConsultationContent';

export const metadata: Metadata = {
  title: 'New Consultation',
  description: 'Start a new consultation to get personalized natural health recommendations.',
};

export default function ConsultationPage() {
  return <ConsultationContent />;
}
