import { createClient } from './client';
import { Consultation, Message, Protocol } from '@/types';
import { logger } from '@/lib/utils/logger';
import { getLocalDateString } from '@/lib/utils/date';

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
    logger.error('Error fetching profile:', error);
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
    logger.error('Error updating profile:', error);
    return null;
  }

  return data;
}

// ============================================
// HEALTH PROFILE FUNCTIONS
// ============================================

interface MedicationEntry {
  name: string;
  dosage: string;
  frequency: string;
}

interface SupplementEntry {
  name: string;
  dosage: string;
  frequency: string;
}

export async function updateHealthProfile(userId: string, updates: {
  health_conditions?: string[];
  medications?: MedicationEntry[];
  supplements?: SupplementEntry[];
  health_notes?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Error updating health profile:', error);
    return null;
  }

  return data;
}

export async function getHealthContext(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc('get_user_health_context', { p_user_id: userId });

  if (error) {
    logger.error('Error fetching health context:', error);
    return null;
  }

  return data;
}

export async function getConsultationHistory(userId: string, limit: number = 5) {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc('get_consultation_history', { p_user_id: userId, p_limit: limit });

  if (error) {
    logger.error('Error fetching consultation history:', error);
    return [];
  }

  return data || [];
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
    logger.error('Error creating consultation:', error);
    return null;
  }

  return data;
}

export async function updateConsultation(
  consultationId: string,
  updates: {
    conversation_log?: Message[];
    protocol_data?: Protocol | Record<string, unknown>;
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
    logger.error('Error updating consultation:', error);
    return null;
  }

  return data;
}

export async function getConsultation(consultationId: string, userId: string) {
  const supabase = createClient();

  const query = supabase
    .from('consultations')
    .select('*')
    .eq('id', consultationId)
    .eq('user_id', userId);

  const { data, error } = await query.single();

  if (error) {
    logger.error('Error fetching consultation:', error);
    return null;
  }

  return data as Consultation;
}

/**
 * Fetch user consultations with pagination support.
 * Only fetches completed consultations with protocol_data.
 *
 * @param userId - The user's ID
 * @param limit - Maximum number of consultations to fetch (default: 50)
 * @param offset - Number of records to skip for pagination (default: 0)
 */
export async function getUserConsultations(
  userId: string,
  limit = 50,
  offset = 0
) {
  const supabase = createClient();

  // Only select fields needed for protocol list display to reduce payload size
  // The full protocol_data is only needed when viewing a single protocol
  const { data, error } = await supabase
    .from('consultations')
    .select('id, initial_input, protocol_data, tier_at_creation, status, created_at, updated_at, user_id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .not('protocol_data', 'is', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Error fetching consultations:', error);
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
    logger.error('Error fetching active consultation:', error);
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
    logger.error('Error checking usage:', error);
    // SECURITY: On DB failure, deny access to prevent bypassing daily limits
    // This is a fail-closed approach - users can retry when DB is back up
    return { canConsult: false, currentCount: 0, dailyLimit: 3, tier: 'free' };
  }

  // Validate that we got a valid response
  const result = data?.[0];
  if (!result) {
    logger.error('No data returned from check_can_consult RPC');
    // SECURITY: On empty response, deny access
    return { canConsult: false, currentCount: 0, dailyLimit: 3, tier: 'free' };
  }

  return {
    canConsult: result.can_consult ?? false,
    currentCount: result.current_count ?? 0,
    dailyLimit: result.daily_limit ?? 3,
    tier: result.tier ?? 'free',
  };
}

export async function incrementDailyUsage(userId: string): Promise<{
  count: number;
  canConsult: boolean;
  success: boolean;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc('increment_daily_usage', { p_user_id: userId });

  if (error) {
    logger.error('Error incrementing usage:', error);
    // Return failure state so caller knows to handle the error
    return { count: 0, canConsult: false, success: false };
  }

  const result = data?.[0];
  if (!result) {
    logger.error('No data returned from increment_daily_usage RPC');
    return { count: 0, canConsult: false, success: false };
  }

  return {
    count: result.consultation_count ?? 1,
    canConsult: result.can_consult ?? true,
    success: true,
  };
}

export async function getDailyUsage(userId: string): Promise<number> {
  const supabase = createClient();

  // Use local date so daily limit resets at user's midnight, not UTC midnight
  const today = getLocalDateString();

  const { data, error } = await supabase
    .from('daily_usage')
    .select('consultation_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error('Error fetching daily usage:', error);
    return 0;
  }

  return data?.consultation_count ?? 0;
}


// ============================================
// DEV TOOLS
// ============================================

// Reset uses UPDATE (not DELETE) because daily_usage has no DELETE RLS policy.
export async function resetDailyUsage(userId: string): Promise<boolean> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Dev tools are only available in development mode');
  }
  const supabase = createClient();

  // Use local date so reset applies to user's current day
  const today = getLocalDateString();

  const { error } = await supabase
    .from('daily_usage')
    .update({ consultation_count: 0 })
    .eq('user_id', userId)
    .eq('date', today);

  if (error) {
    logger.error('Error resetting daily usage:', error);
    return false;
  }

  return true;
}

// Delete all consultations for a user (for testing fresh flows).
// Uses UPDATE to mark as abandoned since there may not be a DELETE policy.
export async function clearAllConsultations(userId: string): Promise<boolean> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Dev tools are only available in development mode');
  }
  const supabase = createClient();

  const { error } = await supabase
    .from('consultations')
    .update({ status: 'abandoned', protocol_data: null })
    .eq('user_id', userId);

  if (error) {
    logger.error('Error clearing consultations:', error);
    return false;
  }

  return true;
}

// Toggle tier between free and pro.
export async function toggleUserTier(userId: string, currentTier: 'free' | 'pro'): Promise<'free' | 'pro' | null> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Dev tools are only available in development mode');
  }
  const newTier = currentTier === 'free' ? 'pro' : 'free';
  const result = await updateUserProfile(userId, { tier: newTier });
  return result ? newTier : null;
}
