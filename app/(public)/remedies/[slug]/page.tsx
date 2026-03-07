import { notFound } from 'next/navigation';
import { getRemedyBySlugFromDb } from '@/lib/remedies/queries';
import { getRemedyBySlug, getAllRemedies } from '@/lib/remedies/data';
import { RemedyDetail } from './RemedyDetail';

export async function generateStaticParams() {
  const remedies = getAllRemedies();
  return remedies.map(r => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let remedy;
  try {
    remedy = await getRemedyBySlugFromDb(params.slug);
  } catch {
    remedy = getRemedyBySlug(params.slug);
  }
  if (!remedy) return { title: 'Remedy Not Found' };
  return {
    title: `${remedy.name} - Natural Remedy Guide`,
    description: remedy.summary,
  };
}

export default async function RemedyPage({ params }: { params: { slug: string } }) {
  let remedy;
  try {
    remedy = await getRemedyBySlugFromDb(params.slug);
  } catch {
    remedy = undefined;
  }
  // Fallback to hardcoded
  if (!remedy) {
    remedy = getRemedyBySlug(params.slug);
  }
  if (!remedy) {
    notFound();
  }
  return <RemedyDetail remedy={remedy} />;
}
