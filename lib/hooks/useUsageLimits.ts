'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { checkCanConsult, incrementDailyUsage, UsageStatus } from '@/lib/supabase/database';

const FREE_TIER_LIMIT = 5;

export function useUsageLimits() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageStatus>({
    canConsult: true,
    currentCount: 0,
    weeklyLimit: FREE_TIER_LIMIT,
    tier: 'free',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current usage status
  const refreshUsage = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const status = await checkCanConsult(user.id);
      setUsage(status);
      setError(null);
    } catch (err) {
      console.error('Error fetching usage:', err);
      setError('Failed to check usage limits');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Increment usage when starting a consultation
  const useConsultation = useCallback(async (): Promise<boolean> => {
    if (!user?.id) {
      setError('Must be logged in');
      return false;
    }

    // Check if user can consult before incrementing
    if (!usage.canConsult) {
      setError('Weekly limit reached');
      return false;
    }

    try {
      const result = await incrementDailyUsage(user.id);

      setUsage(prev => ({
        ...prev,
        currentCount: result.count,
        canConsult: result.canConsult,
      }));

      return result.canConsult;
    } catch (err) {
      console.error('Error incrementing usage:', err);
      setError('Failed to record usage');
      return false;
    }
  }, [user?.id, usage.canConsult]);

  // Load usage on mount and when user changes
  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  // Computed values
  const remainingConsultations = Math.max(0, usage.weeklyLimit - usage.currentCount);
  const isPro = usage.tier === 'pro';
  const isAtLimit = !usage.canConsult && !isPro;

  return {
    // State
    usage,
    loading,
    error,

    // Computed
    remainingConsultations,
    isPro,
    isAtLimit,

    // Actions
    refreshUsage,
    useConsultation,
  };
}
