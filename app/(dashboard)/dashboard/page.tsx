import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DailyLimitBanner } from '@/components/shared/DailyLimitBanner';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { MOCK_USER, MOCK_CONSULTATIONS } from '@/lib/data/hardcoded';
import { Plus, Search } from 'lucide-react';

export default function DashboardPage() {
  const consultationsUsed = 2; // Hardcoded for skeleton
  const consultationsLimit = 3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Welcome back, {MOCK_USER.first_name}
        </h1>
        <p className="text-charcoal/60">
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
        <Link href="/consultation">
          <div className="bg-primary hover:bg-primary/90 transition-colors rounded-xl p-8 text-white cursor-pointer">
            <Plus className="w-10 h-10 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start New Consultation</h2>
            <p className="text-white/90">
              Describe your symptoms and get a personalized herbal protocol
            </p>
          </div>
        </Link>

        <Link href="/herbs">
          <div className="bg-white hover:border-primary/30 transition-colors border-2 border-primary/10 rounded-xl p-8 cursor-pointer">
            <Search className="w-10 h-10 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-charcoal mb-2">Explore Herb Database</h2>
            <p className="text-charcoal/70">
              Browse our comprehensive database of medicinal herbs
            </p>
          </div>
        </Link>
      </div>

      {/* Past Consultations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-charcoal">Past Consultations</h2>
          {MOCK_USER.tier === 'free' && (
            <Link href="/upgrade">
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
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-primary/20">
            <p className="text-charcoal/60">No consultations yet. Start your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
