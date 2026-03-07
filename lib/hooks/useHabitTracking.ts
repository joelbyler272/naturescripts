'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  upsertHabitLog,
  getHabitLogsForDate,
  getHabitStreaks,
  HabitLog,
  HabitStreak,
} from '@/lib/supabase/habits';
import { getLocalDateString } from '@/lib/utils/date';
import { logger } from '@/lib/utils/logger';

export function useHabitTracking() {
  const { user } = useAuth();
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [todayData, streakData] = await Promise.all([
        getHabitLogsForDate(user.id),
        getHabitStreaks(user.id, 14),
      ]);

      setTodayLogs(todayData);
      setStreaks(streakData);
    } catch (err) {
      logger.error('Error loading habit data:', err);
      setError('Failed to load habit data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Toggle a habit's completed status for today. Uses optimistic update.
   */
  const toggleHabit = useCallback(async (habitName: string, completed: boolean) => {
    if (!user?.id) return;

    const today = getLocalDateString();

    // Optimistic update
    setTodayLogs(prev => {
      const existing = prev.find(l => l.habit_name === habitName);
      if (existing) {
        return prev.map(l =>
          l.habit_name === habitName ? { ...l, completed } : l
        );
      }
      return [...prev, {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        date: today,
        habit_name: habitName,
        completed,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }];
    });

    const result = await upsertHabitLog(user.id, {
      habit_name: habitName,
      completed,
    });

    if (!result) {
      // Revert on failure
      await loadData();
    }
  }, [user?.id, loadData]);

  return {
    todayLogs,
    streaks,
    loading,
    error,
    toggleHabit,
    refresh: loadData,
  };
}
