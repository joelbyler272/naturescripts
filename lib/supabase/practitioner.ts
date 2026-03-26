import { createClient } from '@/lib/supabase/server';
import type { PractitionerBranding } from '@/lib/subdomain/types';

/**
 * Look up practitioner branding by custom subdomain.
 * Used in root layout to provide branding context.
 */
export async function getPractitionerBrandingBySubdomain(
  subdomain: string
): Promise<PractitionerBranding | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('practitioner_settings')
    .select('practitioner_id, business_name, logo_url, primary_color')
    .eq('subdomain', subdomain)
    .single();

  if (error || !data) return null;

  return {
    practitionerId: data.practitioner_id,
    businessName: data.business_name,
    logoUrl: data.logo_url,
    primaryColor: data.primary_color,
  };
}

/**
 * Get practitioner settings for the current user.
 */
export async function getMyPractitionerSettings() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('practitioner_settings')
    .select('*')
    .eq('practitioner_id', user.id)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Update or create practitioner settings.
 */
export async function upsertPractitionerSettings(settings: {
  subdomain?: string;
  business_name?: string;
  logo_url?: string;
  primary_color?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('practitioner_settings')
    .upsert(
      { practitioner_id: user.id, ...settings },
      { onConflict: 'practitioner_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get clients for a practitioner.
 */
export async function getPractitionerClients() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('practitioner_clients')
    .select('*')
    .eq('practitioner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

/**
 * Invite a client by email.
 */
export async function inviteClient(email: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const token = crypto.randomUUID();

  const { data, error } = await supabase
    .from('practitioner_clients')
    .insert({
      practitioner_id: user.id,
      client_email: email,
      invite_token: token,
      status: 'invited',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Accept a client invitation by token.
 */
export async function acceptInvite(token: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('practitioner_clients')
    .update({ client_id: user.id, status: 'active', invite_token: null })
    .eq('invite_token', token)
    .select()
    .single();

  if (error) throw error;
  return data;
}
