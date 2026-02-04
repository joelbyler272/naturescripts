'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WelcomeHeader } from '@/components/app/WelcomeHeader';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useAuth } from '@/lib/auth/AuthContext';
import { useConsultations } from '@/lib/hooks/useConsultations';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { HEALTH_SUGGESTIONS } from '@/lib/constants/suggestions';
import { routes } from '@/lib/constants/routes';
import { ArrowRight, Lightbulb, Send, AlertCircle, Loader2, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIPS = [
  "Ashwagandha is best absorbed when taken with food",
  "Consistency matters more than perfection with herbal protocols",
  "Most herbs take 2-4 weeks to show their full effects",
  "Keeping a symptom journal helps track what's working",
  "Adaptogens work best when cycled: 6 weeks on, 1 week off",
  "Take iron-containing herbs away from tea and coffee",
  "Probiotics are most effective when taken on an empty stomach",
  "Chamomile tea before bed can improve sleep onset by 15 minutes",
  "Turmeric absorption increases 2000% when paired with black pepper",
  "Magnesium glycinate is the gentlest form on the stomach",
  "Ginger tea can ease nausea within 20 minutes",
  "Valerian root works better after 2 weeks of consistent use",
  "Omega-3 supplements are best taken with a meal containing fat",
  "Holy basil can help lower cortisol levels during stressful periods",
  "Elderberry syrup is most effective taken at the first sign of illness",
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let m = copy.length;
  let s = seed;
  while (m) {
    s = (s * 9301 + 49297) % 233280;
    const i = Math.floor((s / 233280) * m--);
    [copy[m], copy[i]] = [copy[i], copy[m]];
  }
  return copy;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { pastProtocols, loading: consultationsLoading } = useConsultations();
  const { usage, loading: usageLoading, isAtLimit, isPro } = useUsageLimits();

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [visibleSuggestions, setVisibleSuggestions] = useState<string[]>([]);

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there';

  // Pick 3 random suggestions client-side only (changes on refresh)
  useEffect(() => {
    const seed = Math.floor(Date.now() / 1000);
    const shuffled = seededShuffle(HEALTH_SUGGESTIONS, seed);
    setVisibleSuggestions(shuffled.slice(0, 3));
  }, []);

  // Pick 1 random tip client-side only (changes on refresh, no rotation)
  useEffect(() => {
    const index = Math.floor(Date.now() / 1000) % TIPS.length;
    setCurrentTip(TIPS[index]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isAtLimit) {
      const query = encodeURIComponent(inputValue.trim());
      router.push(`${routes.consultation}?q=${query}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isAtLimit) {
      const query = encodeURIComponent(suggestion);
      router.push(`${routes.consultation}?q=${query}`);
    }
  };

  const isLoading = consultationsLoading || usageLoading;

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
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
                    {usage.currentCount}/{usage.dailyLimit} today
                  </p>
                  <Link
                    href={routes.upgrade}
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
            <p className="text-sm font-medium text-amber-800">Daily limit reached</p>
            <p className="text-sm text-amber-700 mt-1">
              You&apos;ve used all 3 free consultations for today.
              <Link href={routes.upgrade} className="underline ml-1">Upgrade to Pro</Link> for unlimited.
            </p>
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="mb-4">
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
              placeholder={isAtLimit ? "Daily limit reached" : "Describe how you're feeling..."}
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

        {/* Suggestions — static 3, change on page refresh only */}
        {visibleSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {visibleSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isAtLimit}
                className={cn(
                  "px-3 py-1.5 text-xs sm:text-sm bg-white border rounded-full transition-colors",
                  isAtLimit
                    ? "text-muted-foreground border-border/30 cursor-not-allowed opacity-50"
                    : "text-muted-foreground border-border/50 hover:border-accent/50 hover:text-foreground"
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      )}

      {/* Tip — static, changes on page refresh only */}
      {!isLoading && currentTip && (
        <div className="mb-5 flex items-center gap-3 px-3 sm:px-4 py-2.5 bg-white/60 border border-border/30 rounded-lg">
          <Lightbulb className="w-4 h-4 text-accent flex-shrink-0" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> {currentTip}
          </p>
        </div>
      )}

      {/* Past Protocols — show last 2, always show View All */}
      {!isLoading && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Your Protocols
            </h2>
            <Link
              href={routes.protocols}
              className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {pastProtocols.length > 0 ? (
            <div className="space-y-3">
              {pastProtocols.slice(0, 2).map((consultation) => (
                <ProtocolCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10 bg-white/60 rounded-xl border border-dashed border-border/50">
              <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">No protocols yet</p>
              <p className="text-sm text-muted-foreground mt-1 px-4">
                Start your first consultation above to get a personalized herbal protocol
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
