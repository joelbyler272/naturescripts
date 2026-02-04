'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  getUserConsultations, 
  getConsultation,
  createConsultation,
  updateConsultation,
} from '@/lib/supabase/database';
import { Consultation, Message } from '@/types';

export function useConsultations() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setConsultations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserConsultations(user.id);
      setConsultations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // All completed consultations are "past protocols" — there is no "active" concept
  // A protocol is simply a completed consultation that has protocol_data
  const pastProtocols = consultations.filter(c => 
    c.status === 'completed' && c.protocol_data != null
  );

  return {
    consultations,
    pastProtocols,
    loading,
    error,
    refresh,
  };
}

export function useConsultation(consultationId?: string) {
  const { user } = useAuth();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!consultationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getConsultation(consultationId);
      setConsultation(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching consultation:', err);
      setError('Failed to load consultation');
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = useCallback(async (initialInput: string): Promise<Consultation | null> => {
    if (!user?.id) {
      setError('Must be logged in');
      return null;
    }

    try {
      const tier = (user.user_metadata?.tier as 'free' | 'pro') || 'free';
      const data = await createConsultation(user.id, initialInput, tier);
      if (data) {
        setConsultation(data);
      }
      return data;
    } catch (err) {
      console.error('Error creating consultation:', err);
      setError('Failed to create consultation');
      return null;
    }
  }, [user?.id, user?.user_metadata?.tier]);

  const addMessage = useCallback(async (message: Message): Promise<boolean> => {
    if (!consultation?.id) {
      setError('No active consultation');
      return false;
    }

    try {
      const updatedLog = [...(consultation.conversation_log || []), message];
      const data = await updateConsultation(consultation.id, {
        conversation_log: updatedLog,
      });
      
      if (data) {
        setConsultation(data);
      }
      return true;
    } catch (err) {
      console.error('Error adding message:', err);
      setError('Failed to save message');
      return false;
    }
  }, [consultation]);

  const abandon = useCallback(async (): Promise<boolean> => {
    if (!consultation?.id) return false;

    try {
      await updateConsultation(consultation.id, { status: 'abandoned' });
      setConsultation(null);
      return true;
    } catch (err) {
      console.error('Error abandoning consultation:', err);
      return false;
    }
  }, [consultation]);

  return {
    consultation,
    loading,
    error,
    fetch,
    create,
    addMessage,
    abandon,
  };
}
