import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatWithClaude } from '@/lib/anthropic/client';
import { buildLabInterpretationPrompt, buildDocSimplifierPrompt, parseInterpretationResponse } from '@/lib/documents/interpreter';
import { logger } from '@/lib/utils/logger';
import { applyRateLimit } from '@/lib/utils/rateLimit';

// Cap interpreted document size to bound Claude input cost. Real lab reports /
// documents are well under this; larger payloads are abuse.
const MAX_DOCUMENT_TEXT_LENGTH = 50_000;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit AI calls per user (this endpoint hits Claude with user input).
    const rateLimitResult = await applyRateLimit('documents-interpret', user.id, 10, 60000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimitResult.retryAfter / 1000)) } }
      );
    }

    const { documentId, documentText, documentType } = await req.json();

    if (!documentId || !documentText || typeof documentText !== 'string') {
      return NextResponse.json(
        { error: 'Missing documentId or documentText' },
        { status: 400 }
      );
    }

    if (documentText.length > MAX_DOCUMENT_TEXT_LENGTH) {
      return NextResponse.json(
        { error: 'Document is too large to interpret.' },
        { status: 413 }
      );
    }

    // Verify document belongs to user
    const { data: doc, error: docError } = await supabase
      .from('user_documents')
      .select('id, user_id')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Update status to processing
    await supabase
      .from('user_documents')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', documentId);

    // Choose prompt based on document type
    const isLabReport = documentType === 'lab_report';
    const systemPrompt = isLabReport
      ? buildLabInterpretationPrompt()
      : buildDocSimplifierPrompt();

    const userMessage = isLabReport
      ? `Please analyze this lab report and extract all markers with their values and reference ranges:\n\n<document_text>\n${documentText}\n</document_text>`
      : `Please simplify this medical document into plain English:\n\n<document_text>\n${documentText}\n</document_text>`;

    // Call Claude for interpretation
    const response = await chatWithClaude({
      systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      maxTokens: 2048,
      temperature: 0.3,
    });

    const interpretation = parseInterpretationResponse(response.content);

    if (!interpretation) {
      await supabase
        .from('user_documents')
        .update({ status: 'error', updated_at: new Date().toISOString() })
        .eq('id', documentId);

      return NextResponse.json(
        { error: 'Failed to parse interpretation' },
        { status: 500 }
      );
    }

    // Save interpretation to document
    await supabase
      .from('user_documents')
      .update({
        ai_interpretation: interpretation.summary,
        ai_interpretation_data: interpretation,
        parsed_text: documentText,
        status: 'interpreted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    // If lab report, save individual markers
    if (isLabReport && interpretation.markers && interpretation.markers.length > 0) {
      const markers = interpretation.markers.map((m) => ({
        user_id: user.id,
        document_id: documentId,
        marker_name: m.name,
        value: m.value,
        unit: m.unit,
        reference_low: m.referenceLow ?? null,
        reference_high: m.referenceHigh ?? null,
        status: m.status,
        interpretation: `${m.name}: ${m.value} ${m.unit} (${m.status})`,
      }));

      const { error: markersError } = await supabase
        .from('lab_results')
        .insert(markers);

      if (markersError) {
        logger.error('Error saving lab markers:', markersError);
      }
    }

    return NextResponse.json({
      interpretation,
      usage: response.usage,
    });
  } catch (error) {
    logger.error('Error interpreting document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
