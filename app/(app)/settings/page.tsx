import type { Metadata } from 'next';
import { SettingsContent } from './SettingsContent';
import { createClient } from '@/lib/supabase/server';
import { isDevUser } from '@/lib/constants/devAccess';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings, subscription, and preferences.',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isDev = isDevUser(user?.email);

  return <SettingsContent isDev={isDev} />;
}
