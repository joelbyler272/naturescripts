import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation isAuthenticated={false} />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cream">
        {children}
      </main>
      <Footer />
    </div>
  );
}
