import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminUser } from '@/lib/constants/adminAccess';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceClient = createServiceClient();
    const { data, error } = await serviceClient
      .from('remedies')
      .select('id, slug, name, botanical_name, category, rating, last_updated, created_at')
      .order('name');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const row = {
      id: body.slug,
      slug: body.slug,
      name: body.name,
      botanical_name: body.botanicalName || '',
      aliases: body.aliases || [],
      category: body.category || '',
      tags: body.tags || [],
      rating: body.rating || 0,
      summary: body.summary || '',
      overview: body.overview || '',
      how_it_works: body.howItWorks || '',
      benefits: body.benefits || [],
      dosages: body.dosages || [],
      best_time_to_take: body.bestTimeToTake || '',
      how_long_to_work: body.howLongToWork || '',
      side_effects: body.sideEffects || [],
      who_should_avoid: body.whoShouldAvoid || [],
      interactions: body.interactions || [],
      faqs: body.faqs || [],
      quality_markers: body.qualityMarkers || [],
      products: body.products || [],
      related_remedies: body.relatedRemedies || [],
      often_paired_with: body.oftenPairedWith || [],
      last_updated: new Date().toISOString().split('T')[0],
    };

    const { error } = await serviceClient.from('remedies').insert(row);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 });
  }
}
