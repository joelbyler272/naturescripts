import { Navigation } from '@/components/app/Navigation';
import { Footer } from '@/components/shared/Footer';
import { AppShell } from '@/components/app/AppShell';
import { createClient } from '@/lib/supabase/server';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If authenticated, use the app shell (sidebar, no footer, avatar)
  if (user) {
    return <AppShell maxWidth="max-w-6xl">{children}</AppShell>;
  }

  // If not authenticated, use the public layout (top nav, footer)
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation isAuthenticated={false} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
