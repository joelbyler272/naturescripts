import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isDevUser } from '@/lib/constants/devAccess';
import { logger } from '@/lib/utils/logger';
import { getWeekStartDate } from '@/lib/utils/date';

/**
 * Dev Tools API
 * Server-side validation ensures only dev users can access these endpoints.
 * Actions: reset_usage, clear_consultations, toggle_tier
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate user is a dev user
    if (!isDevUser(user.email)) {
      return NextResponse.json({ error: 'Dev tools access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'reset_usage': {
        // Get start of current ISO week (Monday)
        const weekStart = getWeekStartDate();

        // Update all records from this week to 0
        const { error } = await supabase
          .from('daily_usage')
          .update({ consultation_count: 0 })
          .eq('user_id', user.id)
          .gte('date', weekStart);

        if (error) {
          logger.error('Error resetting weekly usage:', error);
          return NextResponse.json({ error: 'Failed to reset usage' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Weekly usage reset to 0' });
      }

      case 'clear_consultations': {
        // Mark all consultations as abandoned and clear protocol data
        const { error } = await supabase
          .from('consultations')
          .update({ status: 'abandoned', protocol_data: null })
          .eq('user_id', user.id);

        if (error) {
          logger.error('Error clearing consultations:', error);
          return NextResponse.json({ error: 'Failed to clear consultations' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'All consultations cleared' });
      }

      case 'toggle_tier': {
        // Get current tier
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('tier')
          .eq('id', user.id)
          .single();

        if (profileError) {
          logger.error('Error fetching profile:', profileError);
          return NextResponse.json({ error: 'Failed to fetch current tier' }, { status: 500 });
        }

        const currentTier = profile?.tier || 'free';
        const newTier = currentTier === 'free' ? 'pro' : 'free';

        // Update tier
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ tier: newTier })
          .eq('id', user.id);

        if (updateError) {
          logger.error('Error updating tier:', updateError);
          return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 });
        }

        return NextResponse.json({ success: true, newTier, message: `Tier changed to ${newTier}` });
      }

      case 'clear_progress': {
        // Clear all progress logs for testing
        const { error } = await supabase
          .from('progress_logs')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          logger.error('Error clearing progress logs:', error);
          return NextResponse.json({ error: 'Failed to clear progress logs' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Progress logs cleared' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    logger.error('Dev tools error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
