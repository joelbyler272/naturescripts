import { createClient } from './client';
import { logger } from '@/lib/utils/logger';
import { getLocalDateString } from '@/lib/utils/date';

export interface HabitLog {
  id: string;
  user_id: string;
  date: string;
  habit_name: string;
  completed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitStreak {
  habit_name: string;
  completed_days: number;
  total_days: number;
  completion_pct: number;
  current_streak: number;
}

/**
 * Upsert a single habit log (toggle completed).
 * Uses UNIQUE(user_id, date, habit_name) for conflict resolution.
 */
export async function upsertHabitLog(
  userId: string,
  input: { date?: string; habit_name: string; completed: boolean; notes?: string }
): Promise<HabitLog | null> {
  if (!input.habit_name.trim() || input.habit_name.length > 100) {
    logger.error('Invalid habit name');
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      {
        user_id: userId,
        date: input.date || getLocalDateString(),
        habit_name: input.habit_name.trim(),
        completed: input.completed,
        notes: input.notes?.trim() || null,
      },
      { onConflict: 'user_id,date,habit_name' }
    )
    .select()
    .single();

  if (error) {
    logger.error('Error upserting habit log:', error);
    return null;
  }
  return data;
}

/**
 * Get all habit logs for a specific date.
 */
export async function getHabitLogsForDate(
  userId: string,
  date?: string
): Promise<HabitLog[]> {
  const supabase = createClient();
  const targetDate = date || getLocalDateString();

  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', targetDate)
    .order('habit_name');

  if (error) {
    logger.error('Error fetching habit logs:', error);
    return [];
  }
  return data || [];
}

/**
 * Get habit logs for a date range.
 */
export async function getHabitLogsRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<HabitLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    logger.error('Error fetching habit logs range:', error);
    return [];
  }
  return data || [];
}

/**
 * Calculate habit streaks over the last N days.
 */
export async function getHabitStreaks(
  userId: string,
  days: number = 14
): Promise<HabitStreak[]> {
  const endDate = getLocalDateString();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toLocaleDateString('en-CA');

  const logs = await getHabitLogsRange(userId, startDateStr, endDate);
  if (logs.length === 0) return [];

  // Group by habit name
  const byName = new Map<string, HabitLog[]>();
  for (const log of logs) {
    const existing = byName.get(log.habit_name) || [];
    existing.push(log);
    byName.set(log.habit_name, existing);
  }

  const results: HabitStreak[] = [];
  byName.forEach((habitLogs, name) => {
    const completedDays = habitLogs.filter((l: HabitLog) => l.completed).length;
    const totalDays = habitLogs.length;

    // Current streak: consecutive completed=true from most recent
    const sortedByDate = [...habitLogs].sort(
      (a, b) => b.date.localeCompare(a.date)
    );
    let streak = 0;
    for (const log of sortedByDate) {
      if (log.completed) streak++;
      else break;
    }

    results.push({
      habit_name: name,
      completed_days: completedDays,
      total_days: totalDays,
      completion_pct: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
      current_streak: streak,
    });
  });

  return results.sort((a, b) => a.habit_name.localeCompare(b.habit_name));
}
