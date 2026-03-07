import { createClient } from './client';
import { logger } from '@/lib/utils/logger';
import { getLocalDateString } from '@/lib/utils/date';

export interface SupplementLog {
  id: string;
  user_id: string;
  date: string;
  supplement_name: string;
  taken: boolean;
  protocol_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplementAdherence {
  supplement_name: string;
  taken_days: number;
  total_days: number;
  adherence_pct: number;
  current_streak: number;
}

/**
 * Upsert a single supplement log (toggle taken status).
 * Uses UNIQUE(user_id, date, supplement_name) for conflict resolution.
 */
export async function upsertSupplementLog(
  userId: string,
  input: { date?: string; supplement_name: string; taken: boolean; protocol_id?: string }
): Promise<SupplementLog | null> {
  if (!input.supplement_name.trim() || input.supplement_name.length > 100) {
    logger.error('Invalid supplement name');
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('supplement_logs')
    .upsert(
      {
        user_id: userId,
        date: input.date || getLocalDateString(),
        supplement_name: input.supplement_name.trim(),
        taken: input.taken,
        protocol_id: input.protocol_id || null,
      },
      { onConflict: 'user_id,date,supplement_name' }
    )
    .select()
    .single();

  if (error) {
    logger.error('Error upserting supplement log:', error);
    return null;
  }
  return data;
}

/**
 * Get all supplement logs for a specific date.
 */
export async function getSupplementLogsForDate(
  userId: string,
  date?: string
): Promise<SupplementLog[]> {
  const supabase = createClient();
  const targetDate = date || getLocalDateString();

  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', targetDate)
    .order('supplement_name');

  if (error) {
    logger.error('Error fetching supplement logs:', error);
    return [];
  }
  return data || [];
}

/**
 * Get supplement logs for a date range.
 */
export async function getSupplementLogsRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<SupplementLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    logger.error('Error fetching supplement logs range:', error);
    return [];
  }
  return data || [];
}

/**
 * Calculate supplement adherence over the last N days.
 */
export async function getSupplementAdherence(
  userId: string,
  days: number = 14
): Promise<SupplementAdherence[]> {
  const endDate = getLocalDateString();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toLocaleDateString('en-CA');

  const logs = await getSupplementLogsRange(userId, startDateStr, endDate);
  if (logs.length === 0) return [];

  // Group by supplement name
  const byName = new Map<string, SupplementLog[]>();
  for (const log of logs) {
    const existing = byName.get(log.supplement_name) || [];
    existing.push(log);
    byName.set(log.supplement_name, existing);
  }

  const results: SupplementAdherence[] = [];
  byName.forEach((supplementLogs, name) => {
    const takenDays = supplementLogs.filter((l: SupplementLog) => l.taken).length;
    const totalDays = supplementLogs.length;

    // Current streak: consecutive taken=true from most recent
    const sortedByDate = [...supplementLogs].sort(
      (a, b) => b.date.localeCompare(a.date)
    );
    let streak = 0;
    for (const log of sortedByDate) {
      if (log.taken) streak++;
      else break;
    }

    results.push({
      supplement_name: name,
      taken_days: takenDays,
      total_days: totalDays,
      adherence_pct: totalDays > 0 ? Math.round((takenDays / totalDays) * 100) : 0,
      current_streak: streak,
    });
  });

  return results.sort((a, b) => a.supplement_name.localeCompare(b.supplement_name));
}
