import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { UpgradeContent } from './UpgradeContent';

export const metadata: Metadata = {
  title: 'Upgrade to Pro',
  description: 'Unlock unlimited consultations and premium features with NatureScripts Pro.',
};

async function getCurrentTier(): Promise<'free' | 'pro'> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'free';
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single();
    return profile?.tier === 'pro' ? 'pro' : 'free';
  } catch {
    // If we can't determine tier, default to free so the upgrade card stays
    // visible rather than mistakenly showing "you're already Pro" to a free user.
    return 'free';
  }
}

export default async function UpgradePage() {
  const currentTier = await getCurrentTier();
  return <UpgradeContent currentTier={currentTier} />;
}
