import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';

// ============================================
// ADMIN STATISTICS QUERIES
// These use service role or admin-specific queries
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
  const supabase = await createClient();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // New users today
    const { count: newUsersToday } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfToday);

    // New users this week
    const { count: newUsersThisWeek } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfWeek);

    // New users this month
    const { count: newUsersThisMonth } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth);

    // Total consultations
    const { count: totalConsultations } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true });

    // Consultations today
    const { count: consultationsToday } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfToday);

    // Consultations this week
    const { count: consultationsThisWeek } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfWeek);

    // Protocols generated (completed consultations with protocol_data)
    const { count: protocolsGenerated } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .not('protocol_data', 'is', null);

    // Users by tier
    const { count: freeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tier', 'free');

    const { count: proUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('tier', 'pro');

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
  const supabase = await createClient();

  try {
    // Get profiles with user email from auth.users
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, tier, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Error fetching users:', error);
      return [];
    }

    // Get consultation counts for each user
    const usersWithCounts = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { count } = await supabase
          .from('consultations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        return {
          ...profile,
          email: '', // We'll need to get this from auth admin API or store in profiles
          consultation_count: count ?? 0,
        } as UserListItem;
      })
    );

    return usersWithCounts;
  } catch (error) {
    logger.error('Error fetching users:', error);
    return [];
  }
}

export interface ConsultationListItem {
  id: string;
  user_id: string;
  initial_input: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  tier_at_creation: 'free' | 'pro';
  created_at: string;
  has_protocol: boolean;
}

export async function getConsultations(limit = 50, offset = 0): Promise<ConsultationListItem[]> {
  const supabase = await createClient();

  try {
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
