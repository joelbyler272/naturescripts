import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DailyLimitBanner } from '@/components/app/DailyLimitBanner';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { MOCK_USER, MOCK_CONSULTATIONS } from '@/lib/data/hardcoded';
import { routes } from '@/lib/constants/routes';
import { Plus, Search } from 'lucide-react';

export default function DashboardPage() {
  const consultationsUsed = 2;
  const consultationsLimit = 3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {MOCK_USER.first_name}
        </h1>
        <p className="text-muted-foreground">
          Ready for your next consultation? Start by sharing your health concerns.
        </p>
      </div>

      {/* Daily Limit Banner (Free Tier Only) */}
      {MOCK_USER.tier === 'free' && (
        <div className="mb-6">
          <DailyLimitBanner
            consultationsUsed={consultationsUsed}
            consultationsLimit={consultationsLimit}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link href={routes.consultation}>
          <div className="bg-accent hover:bg-accent/90 transition-colors rounded-xl p-8 text-white cursor-pointer">
            <Plus className="w-10 h-10 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start New Consultation</h2>
            <p className="text-white/90">
              Describe your symptoms and get a personalized protocol
            </p>
          </div>
        </Link>

        <Link href={routes.remedies}>
          <div className="bg-white hover:border-accent/30 transition-colors border-2 border-accent/10 rounded-xl p-8 cursor-pointer">
            <Search className="w-10 h-10 text-accent mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Explore Remedy Database</h2>
            <p className="text-muted-foreground">
              Browse our comprehensive database of natural remedies
            </p>
          </div>
        </Link>
      </div>

      {/* Past Consultations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Past Consultations</h2>
          {MOCK_USER.tier === 'free' && (
            <Link href={routes.upgrade}>
              <Button variant="outline" size="sm">
                Upgrade for Unlimited
              </Button>
            </Link>
          )}
        </div>

        {MOCK_CONSULTATIONS.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {MOCK_CONSULTATIONS.map((consultation) => (
              <ProtocolCard key={consultation.id} consultation={consultation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-accent/20">
            <p className="text-muted-foreground">No consultations yet. Start your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
