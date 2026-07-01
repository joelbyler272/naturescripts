'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { WelcomeHeader } from '@/components/app/WelcomeHeader';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useAuth } from '@/lib/auth/AuthContext';
import { useConsultations } from '@/lib/hooks/useConsultations';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { routes } from '@/lib/constants/routes';
import { ArrowRight, Send, AlertCircle, Loader2, Sparkles, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackUpgradeClicked, trackLimitReached } from '@/lib/analytics/events';
import { getUserProfile } from '@/lib/supabase/database';

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { pastProtocols, loading: consultationsLoading } = useConsultations();
  const { usage, loading: usageLoading, isAtLimit, isPro } = useUsageLimits();

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasCheckedWelcome, setHasCheckedWelcome] = useState(false);
  const [intakeCompleted, setIntakeCompleted] = useState<boolean | null>(null);

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there';
  const isWelcome = searchParams.get('welcome') === 'true';

  useEffect(() => {
    if (isWelcome && !consultationsLoading && !hasCheckedWelcome && pastProtocols.length > 0) {
      setHasCheckedWelcome(true);
      const latestProtocol = pastProtocols[0];
      if (latestProtocol?.id) {
        router.replace(`/protocols/${latestProtocol.id}?welcome=true`);
      }
    } else if (isWelcome && !consultationsLoading && pastProtocols.length === 0) {
      setHasCheckedWelcome(true);
      router.replace('/dashboard');
    }
  }, [isWelcome, consultationsLoading, pastProtocols, hasCheckedWelcome, router]);

  useEffect(() => {
    async function checkIntake() {
      if (!user?.id) return;
      const profile = await getUserProfile(user.id);
      setIntakeCompleted(profile?.intake_completed ?? false);
    }
    checkIntake();
  }, [user?.id]);

  useEffect(() => {
    if (isAtLimit && !usageLoading) {
      trackLimitReached(usage.tier, usage.currentCount);
    }
  }, [isAtLimit, usageLoading, usage.tier, usage.currentCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isAtLimit) {
      const query = encodeURIComponent(inputValue.trim());
      router.push(`${routes.consultation}?q=${query}`);
    }
  };

  const isLoading = consultationsLoading || usageLoading;

  if (isWelcome && !hasCheckedWelcome) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading your protocol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:pr-14">
          <div>
            <WelcomeHeader firstName={firstName} />
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              What&apos;s on your mind today?
            </p>
          </div>

          {!isPro && (
            <div className="text-left sm:text-right">
              {usageLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className={cn(
                    "text-sm",
                    isAtLimit ? "text-destructive font-medium" : "text-muted-foreground"
                  )}>
                    {usage.currentCount}/{usage.weeklyLimit} this week
                  </p>
                  <Link
                    href={routes.upgrade}
                    onClick={() => trackUpgradeClicked('dashboard_usage_counter')}
                    className="text-xs text-accent hover:text-accent/80 transition-colors"
                  >
                    Go unlimited &rarr;
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Limit Reached Banner */}
      {isAtLimit && (
        <div className="mb-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Weekly limit reached</p>
            <p className="text-sm text-amber-700 mt-1">
              You&apos;ve used all {usage.weeklyLimit} free consultations for this week.
              <Link href={routes.upgrade} onClick={() => trackUpgradeClicked('dashboard_limit_banner')} className="underline ml-1">Upgrade to Pro</Link> for unlimited.
            </p>
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <div
            className={cn(
              "relative flex items-center bg-white rounded-2xl border transition-all duration-200",
              isAtLimit && "opacity-50 cursor-not-allowed",
              isFocused && !isAtLimit
                ? "border-accent shadow-[0_0_0_3px_rgba(107,142,127,0.1)]"
                : "border-border/50 hover:border-border"
            )}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isAtLimit}
              placeholder={isAtLimit ? "Weekly limit reached" : "Describe how you're feeling..."}
              className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm sm:text-base disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isAtLimit}
              className={cn(
                "mr-2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all",
                inputValue.trim() && !isAtLimit
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "bg-secondary/50 text-muted-foreground"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      )}

      {/* Intake CTA */}
      {!isLoading && intakeCompleted === false && (
        <Link
          href={routes.intake}
          className="block mb-5 p-4 bg-accent/5 border border-accent/20 rounded-xl hover:bg-accent/10 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-4.5 h-4.5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                Complete your wellness intake
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Answer a few questions about your health, diet, and lifestyle to get more personalized protocols.
              </p>
              <span className="text-xs text-accent flex items-center gap-1 mt-2">
                Take 3-minute assessment <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Past Protocols */}
      {!isLoading && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Your Protocols
            </h2>
            {pastProtocols.length > 3 && (
              <Link
                href={routes.protocols}
                className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {pastProtocols.length > 0 ? (
            <div className="space-y-3">
              {pastProtocols.slice(0, 3).map((consultation) => (
                <ProtocolCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-14 bg-gradient-to-b from-white/80 to-white/40 rounded-2xl border border-dashed border-border/50">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">Your wellness journey starts here</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                Describe what you&apos;re experiencing above and get a personalized natural health protocol in minutes.
              </p>
              <Link
                href={routes.consultation}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Start your first consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
