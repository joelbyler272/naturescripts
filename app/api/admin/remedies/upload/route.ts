import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminUser } from '@/lib/constants/adminAccess';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Accept a single remedy object or an array
    const remedies = Array.isArray(body) ? body : [body];

    if (remedies.length === 0) {
      return NextResponse.json({ error: 'No remedies provided' }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const results: { success: string[]; errors: { name: string; error: string }[] } = {
      success: [],
      errors: [],
    };

    for (const remedy of remedies) {
      if (!remedy.name || !remedy.slug) {
        results.errors.push({
          name: remedy.name || '(unnamed)',
          error: 'Missing required fields: name and slug',
        });
        continue;
      }

      const row = {
        id: remedy.slug,
        slug: remedy.slug,
        name: remedy.name,
        botanical_name: remedy.botanicalName || '',
        aliases: remedy.aliases || [],
        category: remedy.category || '',
        tags: remedy.tags || [],
        rating: remedy.rating || 0,
        summary: remedy.summary || '',
        overview: remedy.overview || '',
        how_it_works: remedy.howItWorks || '',
        benefits: remedy.benefits || [],
        dosages: remedy.dosages || [],
        best_time_to_take: remedy.bestTimeToTake || '',
        how_long_to_work: remedy.howLongToWork || '',
        side_effects: remedy.sideEffects || [],
        who_should_avoid: remedy.whoShouldAvoid || [],
        interactions: remedy.interactions || [],
        faqs: remedy.faqs || [],
        quality_markers: remedy.qualityMarkers || [],
        products: remedy.products || [],
        related_remedies: remedy.relatedRemedies || [],
        often_paired_with: remedy.oftenPairedWith || [],
        last_updated: new Date().toISOString().split('T')[0],
      };

      const { error } = await serviceClient
        .from('remedies')
        .upsert(row, { onConflict: 'slug' });

      if (error) {
        results.errors.push({ name: remedy.name, error: error.message });
      } else {
        results.success.push(remedy.name);
      }
    }

    return NextResponse.json({
      message: `${results.success.length} of ${remedies.length} remedies uploaded successfully`,
      ...results,
    }, { status: results.errors.length > 0 ? 207 : 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
