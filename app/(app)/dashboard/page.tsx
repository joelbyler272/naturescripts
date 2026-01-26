import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WelcomeHeader } from '@/components/app/WelcomeHeader';
import { DailyLimitBanner } from '@/components/app/DailyLimitBanner';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { MOCK_USER, MOCK_CONSULTATIONS } from '@/lib/data/hardcoded';
import { routes } from '@/lib/constants/routes';
import { Plus, BookOpen, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const consultationsUsed = 2;
  const consultationsLimit = 3;

  // Find active protocol (if any)
  const activeProtocol = MOCK_CONSULTATIONS.find(c => {
    const createdDate = new Date(c.created_at);
    const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCreation < 14; // Consider protocols less than 14 days old as "active"
  });

  return (
    <div className="max-w-5xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <WelcomeHeader firstName={MOCK_USER.first_name} />
        <p className="text-muted-foreground mt-1">
          {activeProtocol 
            ? "Your protocol is in progress. Keep up the great work!"
            : "Ready for your next consultation?"
          }
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

      {/* Active Protocol Card */}
      {activeProtocol && (
        <div className="mb-8">
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-accent uppercase tracking-wide">Active Protocol</span>
                <h3 className="text-xl font-semibold text-foreground mt-1">
                  {activeProtocol.protocol_data?.analysis?.patterns?.[0] || 'Your Protocol'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Started {new Date(activeProtocol.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <Link href={`${routes.protocols}/${activeProtocol.id}`}>
                <Button variant="outline" size="sm">
                  View Protocol
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link href={routes.consultation}>
          <div className="bg-accent hover:bg-accent/90 transition-colors rounded-xl p-6 text-white cursor-pointer group">
            <Plus className="w-8 h-8 mb-3" />
            <h2 className="text-xl font-semibold mb-1">Start New Consultation</h2>
            <p className="text-white/80 text-sm">
              Describe your symptoms and get a personalized protocol
            </p>
          </div>
        </Link>

        <Link href={routes.remedies}>
          <div className="bg-white hover:bg-secondary/30 transition-colors border border-border/50 rounded-xl p-6 cursor-pointer group">
            <BookOpen className="w-8 h-8 text-accent mb-3" />
            <h2 className="text-xl font-semibold text-foreground mb-1">Browse Library</h2>
            <p className="text-muted-foreground text-sm">
              Explore our database of natural remedies
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Consultations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Consultations</h2>
          <Link 
            href={routes.protocols}
            className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {MOCK_CONSULTATIONS.length > 0 ? (
          <div className="space-y-3">
            {MOCK_CONSULTATIONS.slice(0, 5).map((consultation) => (
              <ProtocolCard key={consultation.id} consultation={consultation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-border/50">
            <p className="text-muted-foreground">No consultations yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Start your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
