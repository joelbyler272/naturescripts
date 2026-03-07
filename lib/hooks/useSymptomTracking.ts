'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  logSymptom as logSymptomAPI,
  getSymptomLogsForDate,
  getSymptomLogs,
  deleteSymptomLog as deleteSymptomLogAPI,
  getDistinctSymptoms,
  SymptomLog,
} from '@/lib/supabase/symptoms';
import { getLocalDateString } from '@/lib/utils/date';
import { logger } from '@/lib/utils/logger';

export interface ChartDataPoint {
  date: string;
  [symptomName: string]: string | number;
}

export function useSymptomTracking() {
  const { user } = useAuth();
  const [todayLogs, setTodayLogs] = useState<SymptomLog[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [distinctSymptoms, setDistinctSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const endDate = getLocalDateString();
      const start = new Date();
      start.setDate(start.getDate() - 14);
      const startDate = start.toLocaleDateString('en-CA');

      const [todayData, rangeData, symptoms] = await Promise.all([
        getSymptomLogsForDate(user.id),
        getSymptomLogs(user.id, startDate, endDate),
        getDistinctSymptoms(user.id),
      ]);

      setTodayLogs(todayData);
      setDistinctSymptoms(symptoms);

      // Pivot range data into chart format: { date, symptom1: severity, symptom2: severity }
      const byDate = new Map<string, Map<string, number>>();
      for (const log of rangeData) {
        if (!byDate.has(log.date)) {
          byDate.set(log.date, new Map());
        }
        const dateMap = byDate.get(log.date)!;
        // Use max severity when multiple entries for same symptom on same day
        const current = dateMap.get(log.symptom_name) || 0;
        dateMap.set(log.symptom_name, Math.max(current, log.severity));
      }

      const pivoted: ChartDataPoint[] = [];
      byDate.forEach((symptoms, date) => {
        const point: ChartDataPoint = { date };
        symptoms.forEach((severity, name) => {
          point[name] = severity;
        });
        pivoted.push(point);
      });
      pivoted.sort((a, b) => (a.date as string).localeCompare(b.date as string));
      setChartData(pivoted);
    } catch (err) {
      logger.error('Error loading symptom data:', err);
      setError('Failed to load symptom data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const logSymptom = useCallback(async (input: {
    symptom_name: string;
    severity: number;
    notes?: string;
  }) => {
    if (!user?.id) return null;
    const result = await logSymptomAPI(user.id, input);
    if (result) {
      await loadData();
    }
    return result;
  }, [user?.id, loadData]);

  const deleteLog = useCallback(async (logId: string) => {
    if (!user?.id) return false;
    const success = await deleteSymptomLogAPI(user.id, logId);
    if (success) {
      await loadData();
    }
    return success;
  }, [user?.id, loadData]);

  return {
    todayLogs,
    chartData,
    distinctSymptoms,
    loading,
    error,
    logSymptom,
    deleteLog,
    refresh: loadData,
  };
}
