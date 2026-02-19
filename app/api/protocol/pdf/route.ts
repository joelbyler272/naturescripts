import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateProtocolPdf } from '@/lib/pdf/generateProtocolPdf';
import { GeneratedProtocol } from '@/lib/consultation/types';
import { logger } from '@/lib/utils/logger';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const consultationId = searchParams.get('id');

    if (!consultationId || !UUID_REGEX.test(consultationId)) {
      return NextResponse.json({ error: 'Invalid consultation ID' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is Pro
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, first_name')
      .eq('id', user.id)
      .single();

    if (profile?.tier !== 'pro') {
      return NextResponse.json(
        { error: 'PDF export is a Pro feature. Please upgrade to access.' },
        { status: 403 }
      );
    }

    // Get the consultation
    const { data: consultation, error: consultationError } = await supabase
      .from('consultations')
      .select('protocol_data')
      .eq('id', consultationId)
      .eq('user_id', user.id)
      .single();

    if (consultationError || !consultation) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
    }

    if (!consultation.protocol_data) {
      return NextResponse.json({ error: 'No protocol data available' }, { status: 400 });
    }

    // Generate PDF
    const protocol = consultation.protocol_data as GeneratedProtocol;
    const userName = profile?.first_name || undefined;
    const pdfBlob = await generateProtocolPdf(protocol, userName);

    // Convert blob to buffer for response
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="naturescripts-protocol-${consultationId.slice(0, 8)}.pdf"`,
      },
    });
  } catch (error) {
    logger.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
