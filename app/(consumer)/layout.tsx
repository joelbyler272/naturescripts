import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/app/AppShell';
import { getMarketingUrl } from '@/lib/utils/urls';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(getMarketingUrl('/sign-in'));
  }

  return <AppShell>{children}</AppShell>;
}
