import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { MOCK_USER } from '@/lib/data/hardcoded';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // In skeleton, we assume user is logged in
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navigation isAuthenticated={true} userTier={MOCK_USER.tier} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
