'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getUserConsultations } from '@/lib/supabase/database';
import { isClaudeProtocol, GeneratedProtocol } from '@/lib/consultation/types';
import { logger } from '@/lib/utils/logger';

export interface ProtocolSupplement {
  name: string;
  dosage: string;
  timing: string;
}

export interface ProtocolHabit {
  practice: string;
  timing?: string;
}

interface ProtocolItems {
  supplements: ProtocolSupplement[];
  habits: ProtocolHabit[];
  suggestedSymptoms: string[];
  protocolId: string | null;
  loading: boolean;
}

/**
 * Extracts trackable items (supplements, habits, symptoms) from
 * the user's most recent completed consultation protocol.
 */
export function useProtocolItems(): ProtocolItems {
  const { user } = useAuth();
  const [supplements, setSupplements] = useState<ProtocolSupplement[]>([]);
  const [habits, setHabits] = useState<ProtocolHabit[]>([]);
  const [suggestedSymptoms, setSuggestedSymptoms] = useState<string[]>([]);
  const [protocolId, setProtocolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const consultations = await getUserConsultations(user.id, 1);
        if (consultations.length === 0) {
          setLoading(false);
          return;
        }

        const latest = consultations[0];
        setProtocolId(latest.id);

        const protocolData = latest.protocol_data;
        if (!protocolData || !isClaudeProtocol(protocolData)) {
          setLoading(false);
          return;
        }

        const protocol = protocolData as GeneratedProtocol;

        // Extract supplements from recommendations
        const extractedSupplements: ProtocolSupplement[] = (protocol.recommendations || []).map(r => ({
          name: r.name,
          dosage: r.dosage,
          timing: r.timing,
        }));
        setSupplements(extractedSupplements);

        // Extract habits from lifestyle_practices
        const extractedHabits: ProtocolHabit[] = (protocol.lifestyle_practices || []).map(lp => ({
          practice: lp.practice,
          timing: lp.timing,
        }));
        setHabits(extractedHabits);

        // Extract suggested symptoms from tracking_suggestions
        const symptoms: string[] = (protocol.tracking_suggestions || []).map(ts => ts.metric);
        setSuggestedSymptoms(symptoms);
      } catch (err) {
        logger.error('Error loading protocol items:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.id]);

  return { supplements, habits, suggestedSymptoms, protocolId, loading };
}
