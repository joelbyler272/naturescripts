import type { Metadata } from 'next';
import { RemediesContent } from './RemediesContent';
import { getAllRemediesFromDb } from '@/lib/remedies/queries';
import { getAllRemedies } from '@/lib/remedies/data';
import { Remedy } from '@/lib/remedies/types';

export const metadata: Metadata = {
  title: 'Remedy Database',
  description: 'Explore our comprehensive database of natural remedies, herbs, and supplements with evidence-based information.',
  openGraph: {
    title: 'Remedy Database | NatureScripts',
    description: 'Explore our comprehensive database of natural remedies, herbs, and supplements with evidence-based information.',
  },
};

export default async function RemediesPage() {
  let remedies: Remedy[];
  try {
    remedies = await getAllRemediesFromDb();
  } catch {
    remedies = [];
  }
  // Fall back to hardcoded data if DB returns empty
  if (remedies.length === 0) {
    remedies = getAllRemedies();
  }
  return <RemediesContent initialRemedies={remedies} />;
}
