import type { Metadata } from 'next';
import { RemediesContent } from './RemediesContent';
import { getAllRemedyListings } from '@/lib/remedies/queries';
import { getAllRemedies } from '@/lib/remedies/data';
import { RemedyListing } from '@/lib/remedies/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Remedy Database',
  description: 'Explore our comprehensive database of natural remedies, herbs, and supplements with evidence-based information.',
  openGraph: {
    title: 'Remedy Database | NatureScripts',
    description: 'Explore our comprehensive database of natural remedies, herbs, and supplements with evidence-based information.',
  },
};

export default async function RemediesPage() {
  let remedies: RemedyListing[];
  try {
    remedies = await getAllRemedyListings();
  } catch {
    remedies = [];
  }
  if (remedies.length === 0) {
    remedies = getAllRemedies();
  }
  return <RemediesContent initialRemedies={remedies} />;
}
