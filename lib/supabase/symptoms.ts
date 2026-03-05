import { createClient } from './client';
import { logger } from '@/lib/utils/logger';
import { getLocalDateString } from '@/lib/utils/date';

export interface SymptomLog {
  id: string;
  user_id: string;
  date: string;
  symptom_name: string;
  severity: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Log a single symptom entry.
 * No unique constraint — users can log the same symptom multiple times per day.
 */
export async function logSymptom(
  userId: string,
  input: { date?: string; symptom_name: string; severity: number; notes?: string }
): Promise<SymptomLog | null> {
  if (input.severity < 1 || input.severity > 10) {
    logger.error('Severity must be between 1 and 10');
    return null;
  }
  if (!input.symptom_name.trim() || input.symptom_name.length > 100) {
    logger.error('Invalid symptom name');
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('symptom_logs')
    .insert({
      user_id: userId,
      date: input.date || getLocalDateString(),
      symptom_name: input.symptom_name.trim(),
      severity: input.severity,
      notes: input.notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    logger.error('Error logging symptom:', error);
    return null;
  }
  return data;
}

/**
 * Get symptom logs for a date range (for charts).
 */
export async function getSymptomLogs(
  userId: string,
  startDate: string,
  endDate: string
): Promise<SymptomLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    logger.error('Error fetching symptom logs:', error);
    return [];
  }
  return data || [];
}

/**
 * Get symptom logs for a specific date.
 */
export async function getSymptomLogsForDate(
  userId: string,
  date?: string
): Promise<SymptomLog[]> {
  const supabase = createClient();
  const targetDate = date || getLocalDateString();

  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', targetDate)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching symptom logs for date:', error);
    return [];
  }
  return data || [];
}

/**
 * Delete a single symptom log entry.
 */
export async function deleteSymptomLog(
  userId: string,
  logId: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('symptom_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId);

  if (error) {
    logger.error('Error deleting symptom log:', error);
    return false;
  }
  return true;
}

/**
 * Get distinct symptom names the user has logged (for autocomplete).
 */
export async function getDistinctSymptoms(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('symptom_name')
    .eq('user_id', userId)
    .order('symptom_name');

  if (error) {
    logger.error('Error fetching distinct symptoms:', error);
    return [];
  }

  // Deduplicate client-side (Supabase doesn't support DISTINCT on single column easily)
  const unique = Array.from(new Set((data || []).map((d: { symptom_name: string }) => d.symptom_name)));
  return unique;
}
