import type { Metadata } from 'next';
import { RemediesContent } from './RemediesContent';

export const metadata: Metadata = {
  title: 'Remedy Database',
  description: 'Explore our comprehensive database of natural remedies, herbs, and supplements with evidence-based information.',
  openGraph: {
    title: 'Remedy Database | NatureScripts',
    description: 'Explore our comprehensive database of natural remedies, herbs, and supplements with evidence-based information.',
  },
};

export default function RemediesPage() {
  return <RemediesContent />;
}
