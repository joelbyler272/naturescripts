import { createClient } from './client';
import { logger } from '@/lib/utils/logger';
import { getLocalDateString } from '@/lib/utils/date';

export interface ProgressLog {
  id: string;
  user_id: string;
  date: string;
  energy_level: number | null;
  mood_level: number | null;
  sleep_quality: number | null;
  symptoms: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgressLogInput {
  energy_level?: number;
  mood_level?: number;
  sleep_quality?: number;
  symptoms?: string[];
  notes?: string;
}

/**
 * Get today's progress log for the current user
 */
export async function getTodayProgress(userId: string): Promise<ProgressLog | null> {
  const supabase = createClient();
  const today = getLocalDateString();

  const { data, error } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error('Error fetching today progress:', error);
    return null;
  }

  return data;
}

/**
 * Create or update today's progress log
 */
export async function upsertProgress(
  userId: string,
  input: ProgressLogInput
): Promise<ProgressLog | null> {
  const supabase = createClient();
  const today = getLocalDateString();

  const { data, error } = await supabase
    .from('progress_logs')
    .upsert(
      {
        user_id: userId,
        date: today,
        ...input,
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (error) {
    logger.error('Error upserting progress:', error);
    return null;
  }

  return data;
}

/**
 * Get progress logs for a date range
 */
export async function getProgressRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<ProgressLog[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    logger.error('Error fetching progress range:', error);
    return [];
  }

  return data || [];
}

/**
 * Get the last N days of progress logs
 */
export async function getRecentProgress(
  userId: string,
  days: number = 7
): Promise<ProgressLog[]> {
  const supabase = createClient();
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .order('date', { ascending: true });

  if (error) {
    logger.error('Error fetching recent progress:', error);
    return [];
  }

  return data || [];
}

/**
 * Delete a progress log
 */
export async function deleteProgressLog(userId: string, date: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('progress_logs')
    .delete()
    .eq('user_id', userId)
    .eq('date', date);

  if (error) {
    logger.error('Error deleting progress log:', error);
    return false;
  }

  return true;
}
