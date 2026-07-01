import { Remedy, RemedyListing } from './types';
import { createClient } from '@/lib/supabase/server';

const LISTING_COLUMNS = 'id, slug, name, botanical_name, aliases, category, remedy_group, tags, rating, summary, benefits, faqs';

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
    pharmaceuticalEquivalents: row.pharmaceutical_equivalents || [],
    lastUpdated: row.last_updated,
    group: row.remedy_group || 'Herbs',
  };
}

export async function getAllRemediesFromDb(): Promise<Remedy[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('remedies')
    .select('*')
    .order('name', { ascending: true })
    .limit(5000);

  if (error) {
    console.error('Failed to fetch remedies:', error.message);
    return [];
  }

  return (data ?? []).map(mapRowToRemedy);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToRemedyListing(row: any): RemedyListing {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    botanicalName: row.botanical_name,
    aliases: row.aliases ?? [],
    category: row.category,
    tags: row.tags ?? [],
    rating: Number(row.rating),
    summary: row.summary,
    benefits: row.benefits ?? [],
    faqs: row.faqs ?? [],
    group: row.remedy_group || 'Herbs',
  };
}

export async function getAllRemedyListings(): Promise<RemedyListing[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('remedies')
    .select(LISTING_COLUMNS)
    .order('name', { ascending: true })
    .limit(5000);

  if (error) {
    console.error('Failed to fetch remedy listings:', error.message);
    return [];
  }

  return (data ?? []).map(mapRowToRemedyListing);
}

export async function getRemedyBySlugFromDb(slug: string): Promise<Remedy | undefined> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('remedies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return undefined;
    }
    console.error('Failed to fetch remedy by slug:', error.message);
    return undefined;
  }

  return data ? mapRowToRemedy(data) : undefined;
}

export async function searchRemediesFromDb(query: string): Promise<Remedy[]> {
  // Fetch all remedies and filter client-side (same approach as data.ts,
  // practical since there are only ~36 entries)
  const allRemedies = await getAllRemediesFromDb();
  const lowerQuery = query.toLowerCase();

  return allRemedies.filter(remedy => {
    if (remedy.name.toLowerCase().includes(lowerQuery)) return true;
    if (remedy.botanicalName.toLowerCase().includes(lowerQuery)) return true;
    if (remedy.aliases.some(a => a.toLowerCase().includes(lowerQuery))) return true;
    if (remedy.tags.some(t => t.toLowerCase().includes(lowerQuery))) return true;
    if (remedy.faqs.some(faq =>
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery)
    )) return true;
    if (remedy.benefits.some(b =>
      b.name.toLowerCase().includes(lowerQuery) ||
      b.description.toLowerCase().includes(lowerQuery)
    )) return true;
    return false;
  });
}
