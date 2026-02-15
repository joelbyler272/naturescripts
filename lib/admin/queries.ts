import { createServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/utils/logger';

// ============================================
// ADMIN STATISTICS QUERIES
// These use service role to bypass RLS
// ============================================

export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalConsultations: number;
  consultationsToday: number;
  consultationsThisWeek: number;
  protocolsGenerated: number;
  freeUsers: number;
  proUsers: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const supabase = createServiceClient();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Run all count queries in parallel instead of sequentially
    const [
      { count: totalUsers },
      { count: newUsersToday },
      { count: newUsersThisWeek },
      { count: newUsersThisMonth },
      { count: totalConsultations },
      { count: consultationsToday },
      { count: consultationsThisWeek },
      { count: protocolsGenerated },
      { count: freeUsers },
      { count: proUsers },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfWeek),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      supabase.from('consultations').select('*', { count: 'exact', head: true }),
      supabase.from('consultations').select('*', { count: 'exact', head: true }).gte('created_at', startOfToday),
      supabase.from('consultations').select('*', { count: 'exact', head: true }).gte('created_at', startOfWeek),
      supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('status', 'completed').not('protocol_data', 'is', null),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('tier', 'free'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('tier', 'pro'),
    ]);

    return {
      totalUsers: totalUsers ?? 0,
      newUsersToday: newUsersToday ?? 0,
      newUsersThisWeek: newUsersThisWeek ?? 0,
      newUsersThisMonth: newUsersThisMonth ?? 0,
      totalConsultations: totalConsultations ?? 0,
      consultationsToday: consultationsToday ?? 0,
      consultationsThisWeek: consultationsThisWeek ?? 0,
      protocolsGenerated: protocolsGenerated ?? 0,
      freeUsers: freeUsers ?? 0,
      proUsers: proUsers ?? 0,
    };
  } catch (error) {
    logger.error('Error fetching admin stats:', error);
    return {
      totalUsers: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      newUsersThisMonth: 0,
      totalConsultations: 0,
      consultationsToday: 0,
      consultationsThisWeek: 0,
      protocolsGenerated: 0,
      freeUsers: 0,
      proUsers: 0,
    };
  }
}

export interface UserListItem {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  tier: 'free' | 'pro';
  created_at: string;
  consultation_count: number;
}

export async function getUsers(limit = 50, offset = 0): Promise<UserListItem[]> {
  try {
    const supabase = createServiceClient();

    // Run profile fetch and consultation count aggregation in parallel
    const [profilesResult, consultationCountsResult, authResult] = await Promise.all([
      // Get profiles
      supabase
        .from('profiles')
        .select('id, first_name, last_name, tier, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      // Get all consultation counts grouped by user_id in a single query
      supabase
        .from('consultations')
        .select('user_id'),
      // Get emails from auth.users (paginate to handle > 50 users)
      supabase.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    if (profilesResult.error) {
      logger.error('Error fetching users:', profilesResult.error);
      return [];
    }

    // Build email map from auth data
    const emailMap = new Map<string, string>();
    if (authResult.data?.users) {
      authResult.data.users.forEach(u => emailMap.set(u.id, u.email || ''));
    }

    // Build consultation count map from aggregated query
    const countMap = new Map<string, number>();
    if (consultationCountsResult.data) {
      consultationCountsResult.data.forEach((row: { user_id: string }) => {
        countMap.set(row.user_id, (countMap.get(row.user_id) || 0) + 1);
      });
    }

    // Combine profiles with email and consultation counts (no N+1 queries)
    return (profilesResult.data || []).map((profile) => ({
      ...profile,
      email: emailMap.get(profile.id) || '',
      consultation_count: countMap.get(profile.id) || 0,
    } as UserListItem));
  } catch (error) {
    logger.error('Error fetching users:', error);
    return [];
  }
}

export interface ConsultationListItem {
  id: string;
  user_id: string;
  user_email?: string;
  initial_input: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  tier_at_creation: 'free' | 'pro';
  created_at: string;
  has_protocol: boolean;
}

export async function getConsultations(limit = 50, offset = 0): Promise<ConsultationListItem[]> {
  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('consultations')
      .select('id, user_id, initial_input, status, tier_at_creation, created_at, protocol_data')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Error fetching consultations:', error);
      return [];
    }

    return (data || []).map(c => ({
      id: c.id,
      user_id: c.user_id,
      initial_input: c.initial_input,
      status: c.status,
      tier_at_creation: c.tier_at_creation,
      created_at: c.created_at,
      has_protocol: c.protocol_data !== null,
    }));
  } catch (error) {
    logger.error('Error fetching consultations:', error);
    return [];
  }
}

// ============================================
// ANONYMIZED CONSULTATION VIEWER
// Returns consultation data WITHOUT user identifying info
// ============================================

export interface AnonymizedConsultation {
  id: string;
  initial_input: string;
  conversation_log: Array<{
    role: 'user' | 'assistant';
    content: string;
    id?: string;
    timestamp?: string;
  }>;
  protocol_data: Record<string, unknown> | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  tier_at_creation: 'free' | 'pro';
  created_at: string;
  updated_at: string;
}

export async function getAnonymizedConsultation(consultationId: string): Promise<AnonymizedConsultation | null> {
  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('consultations')
      .select('id, initial_input, conversation_log, protocol_data, status, tier_at_creation, created_at, updated_at')
      .eq('id', consultationId)
      .single();

    if (error || !data) {
      logger.error('Error fetching consultation:', error);
      return null;
    }

    // Return without user_id - completely anonymized
    return {
      id: data.id,
      initial_input: data.initial_input,
      conversation_log: data.conversation_log || [],
      protocol_data: data.protocol_data,
      status: data.status,
      tier_at_creation: data.tier_at_creation,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    logger.error('Error fetching anonymized consultation:', error);
    return null;
  }
}

// ============================================
// EXPORT CONSULTATIONS FOR AI TRAINING
// Returns anonymized data in training-friendly format
// ============================================

export interface TrainingDataEntry {
  conversation: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  protocol: Record<string, unknown> | null;
  tier: 'free' | 'pro';
  completed: boolean;
}

export async function getTrainingData(limit = 1000): Promise<TrainingDataEntry[]> {
  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('consultations')
      .select('conversation_log, protocol_data, tier_at_creation, status')
      .eq('status', 'completed')
      .not('protocol_data', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.error('Error fetching training data:', error);
      return [];
    }

    return (data || []).map(c => ({
      conversation: (c.conversation_log || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      protocol: c.protocol_data,
      tier: c.tier_at_creation,
      completed: c.status === 'completed',
    }));
  } catch (error) {
    logger.error('Error fetching training data:', error);
    return [];
  }
}
