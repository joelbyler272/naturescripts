import { createClient } from '@supabase/supabase-js';

// Import the hardcoded remedies
// We need to use require since this is a standalone script
const { REMEDIES } = require('../lib/remedies/data');

async function seedRemedies() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Seeding ${REMEDIES.length} remedies...`);

  for (const remedy of REMEDIES) {
    const row = {
      id: remedy.id,
      slug: remedy.slug,
      name: remedy.name,
      botanical_name: remedy.botanicalName,
      aliases: remedy.aliases,
      category: remedy.category,
      tags: remedy.tags,
      rating: remedy.rating,
      summary: remedy.summary,
      overview: remedy.overview,
      how_it_works: remedy.howItWorks,
      benefits: remedy.benefits,
      dosages: remedy.dosages,
      best_time_to_take: remedy.bestTimeToTake,
      how_long_to_work: remedy.howLongToWork,
      side_effects: remedy.sideEffects,
      who_should_avoid: remedy.whoShouldAvoid,
      interactions: remedy.interactions,
      faqs: remedy.faqs,
      quality_markers: remedy.qualityMarkers,
      products: remedy.products,
      related_remedies: remedy.relatedRemedies,
      often_paired_with: remedy.oftenPairedWith,
      last_updated: remedy.lastUpdated,
    };

    const { error } = await supabase
      .from('remedies')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error(`Failed to seed ${remedy.name}:`, error.message);
    } else {
      console.log(`  ✓ ${remedy.name}`);
    }
  }

  console.log('Done!');
}

seedRemedies().catch(console.error);
