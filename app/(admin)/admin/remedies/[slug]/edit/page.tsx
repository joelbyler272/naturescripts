import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/service';
import { RemedyForm } from '@/components/admin/RemedyForm';
import { AdminError } from '@/components/admin/AdminError';
import { ServiceClientError } from '@/lib/supabase/service';
import type { Remedy } from '@/lib/remedies/types';

export const metadata: Metadata = { title: 'Edit Remedy - Admin' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToRemedy(row: any): Remedy {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    botanicalName: row.botanical_name,
    aliases: row.aliases,
    category: row.category,
    tags: row.tags,
    rating: Number(row.rating),
    summary: row.summary,
    overview: row.overview,
    howItWorks: row.how_it_works,
    benefits: row.benefits,
    dosages: row.dosages,
    bestTimeToTake: row.best_time_to_take,
    howLongToWork: row.how_long_to_work,
    sideEffects: row.side_effects,
    whoShouldAvoid: row.who_should_avoid,
    interactions: row.interactions,
    faqs: row.faqs,
    qualityMarkers: row.quality_markers,
    products: row.products,
    relatedRemedies: row.related_remedies,
    oftenPairedWith: row.often_paired_with,
    lastUpdated: row.last_updated,
  };
}

export default async function EditRemedyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        notFound();
      }
      throw error;
    }

    const remedy = mapRowToRemedy(data);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit: {remedy.name}</h1>
          <p className="text-gray-500 mt-1">Update this remedy entry</p>
        </div>
        <RemedyForm initialData={remedy} mode="edit" />
      </div>
    );
  } catch (error) {
    return (
      <AdminError
        message={
          error instanceof ServiceClientError
            ? error.message
            : 'Failed to load remedy.'
        }
      />
    );
  }
}
