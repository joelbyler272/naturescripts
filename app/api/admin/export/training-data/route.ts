import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/constants/adminAccess';
import { getTrainingData } from '@/lib/admin/queries';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get format from query params
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'jsonl';
    const limit = parseInt(searchParams.get('limit') || '1000', 10);

    // Fetch anonymized training data
    const trainingData = await getTrainingData(limit);

    if (format === 'jsonl') {
      // Convert to JSONL format (one JSON object per line)
      // Format suitable for OpenAI fine-tuning
      const jsonlLines = trainingData.map(entry => {
        // Convert to chat completion format
        const messages = entry.conversation.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

        // Add the protocol as a final assistant message if available
        if (entry.protocol) {
          messages.push({
            role: 'assistant',
            content: `[PROTOCOL]\n${JSON.stringify(entry.protocol, null, 2)}`,
          });
        }

        return JSON.stringify({
          messages,
          metadata: {
            tier: entry.tier,
            completed: entry.completed,
          },
        });
      });

      const jsonlContent = jsonlLines.join('\n');

      return new NextResponse(jsonlContent, {
        headers: {
          'Content-Type': 'application/jsonl',
          'Content-Disposition': `attachment; filename="naturescripts-training-data-${new Date().toISOString().split('T')[0]}.jsonl"`,
        },
      });
    }

    // Default: return as JSON array
    return NextResponse.json(trainingData, {
      headers: {
        'Content-Disposition': `attachment; filename="naturescripts-training-data-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
