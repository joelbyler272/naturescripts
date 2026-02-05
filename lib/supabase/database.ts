import { createClient } from './client';
import { Consultation, Message, Protocol } from '@/types';

// ============================================
// PROFILE FUNCTIONS
// ============================================

export async function getUserProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: {
  first_name?: string;
  last_name?: string;
  tier?: 'free' | 'pro';
  stripe_customer_id?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}


// ============================================
// CONSULTATION FUNCTIONS
// ============================================

export async function createConsultation(
  userId: string,
  initialInput: string,
  tierAtCreation: 'free' | 'pro' = 'free'
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('consultations')
    .insert({
      user_id: userId,
      initial_input: initialInput,
      tier_at_creation: tierAtCreation,
      status: 'in_progress',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating consultation:', error);
    return null;
  }

  return data;
}

export async function updateConsultation(
  consultationId: string,
  updates: {
    conversation_log?: Message[];
    protocol_data?: Protocol;
    status?: 'in_progress' | 'completed' | 'abandoned';
  }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('consultations')
    .update(updates)
    .eq('id', consultationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating consultation:', error);
    return null;
  }

  return data;
}

export async function getConsultation(consultationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('id', consultationId)
    .single();

  if (error) {
    console.error('Error fetching consultation:', error);
    return null;
  }

  return data as Consultation;
}

export async function getUserConsultations(userId: string, limit = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching consultations:', error);
    return [];
  }

  return data as Consultation[];
}

export async function getActiveConsultation(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching active consultation:', error);
    return null;
  }

  return data as Consultation | null;
}


// ============================================
// USAGE LIMIT FUNCTIONS
// ============================================

export interface UsageStatus {
  canConsult: boolean;
  currentCount: number;
  dailyLimit: number;
  tier: 'free' | 'pro';
}

export async function checkCanConsult(userId: string): Promise<UsageStatus> {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc('check_can_consult', { p_user_id: userId });

  if (error) {
    console.error('Error checking usage:', error);
    return { canConsult: true, currentCount: 0, dailyLimit: 3, tier: 'free' };
  }

  const result = data?.[0];
  return {
    canConsult: result?.can_consult ?? true,
    currentCount: result?.current_count ?? 0,
    dailyLimit: result?.daily_limit ?? 3,
    tier: result?.tier ?? 'free',
  };
}

export async function incrementDailyUsage(userId: string): Promise<{
  count: number;
  canConsult: boolean;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc('increment_daily_usage', { p_user_id: userId });

  if (error) {
    console.error('Error incrementing usage:', error);
    return { count: 0, canConsult: true };
  }

  const result = data?.[0];
  return {
    count: result?.consultation_count ?? 1,
    canConsult: result?.can_consult ?? true,
  };
}

export async function getDailyUsage(userId: string): Promise<number> {
  const supabase = createClient();

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_usage')
    .select('consultation_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching daily usage:', error);
    return 0;
  }

  return data?.consultation_count ?? 0;
}


// ============================================
// DEV TOOLS
// ============================================

// Reset uses UPDATE (not DELETE) because daily_usage has no DELETE RLS policy.
export async function resetDailyUsage(userId: string): Promise<boolean> {
  const supabase = createClient();

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('daily_usage')
    .update({ consultation_count: 0 })
    .eq('user_id', userId)
    .eq('date', today);

  if (error) {
    console.error('Error resetting daily usage:', error);
    return false;
  }

  return true;
}

// Delete all consultations for a user (for testing fresh flows).
// Uses UPDATE to mark as abandoned since there may not be a DELETE policy.
export async function clearAllConsultations(userId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('consultations')
    .update({ status: 'abandoned', protocol_data: null })
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing consultations:', error);
    return false;
  }

  return true;
}

// Toggle tier between free and pro.
export async function toggleUserTier(userId: string, currentTier: 'free' | 'pro'): Promise<'free' | 'pro' | null> {
  const newTier = currentTier === 'free' ? 'pro' : 'free';
  const result = await updateUserProfile(userId, { tier: newTier });
  return result ? newTier : null;
}
