import type { Metadata } from 'next';
import { ProtocolsContent } from './ProtocolsContent';

export const metadata: Metadata = {
  title: 'My Protocols',
  description: 'View and manage your personalized health protocols from past consultations.',
};

export default function ProtocolsPage() {
  return <ProtocolsContent />;
}
