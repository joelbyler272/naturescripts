'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  upsertSupplementLog,
  getSupplementLogsForDate,
  getSupplementAdherence,
  SupplementLog,
  SupplementAdherence,
} from '@/lib/supabase/supplements';
import { getLocalDateString } from '@/lib/utils/date';
import { logger } from '@/lib/utils/logger';

export function useSupplementTracking(protocolId?: string | null) {
  const { user } = useAuth();
  const [todayLogs, setTodayLogs] = useState<SupplementLog[]>([]);
  const [adherence, setAdherence] = useState<SupplementAdherence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [todayData, adherenceData] = await Promise.all([
        getSupplementLogsForDate(user.id),
        getSupplementAdherence(user.id, 14),
      ]);

      setTodayLogs(todayData);
      setAdherence(adherenceData);
    } catch (err) {
      logger.error('Error loading supplement data:', err);
      setError('Failed to load supplement data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Toggle a supplement's taken status for today. Uses optimistic update.
   */
  const toggleSupplement = useCallback(async (supplementName: string, taken: boolean) => {
    if (!user?.id) return;

    const today = getLocalDateString();

    // Optimistic update
    setTodayLogs(prev => {
      const existing = prev.find(l => l.supplement_name === supplementName);
      if (existing) {
        return prev.map(l =>
          l.supplement_name === supplementName ? { ...l, taken } : l
        );
      }
      // Add new entry optimistically
      return [...prev, {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        date: today,
        supplement_name: supplementName,
        taken,
        protocol_id: protocolId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }];
    });

    const result = await upsertSupplementLog(user.id, {
      supplement_name: supplementName,
      taken,
      protocol_id: protocolId || undefined,
    });

    if (!result) {
      // Revert on failure
      await loadData();
    }
  }, [user?.id, protocolId, loadData]);

  return {
    todayLogs,
    adherence,
    loading,
    error,
    toggleSupplement,
    refresh: loadData,
  };
}
