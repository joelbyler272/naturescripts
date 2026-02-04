'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WelcomeHeader } from '@/components/app/WelcomeHeader';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useAuth } from '@/lib/auth/AuthContext';
import { useConsultations } from '@/lib/hooks/useConsultations';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { routes } from '@/lib/constants/routes';
import { ArrowRight, Sparkles, Leaf, Send, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIPS = [
  { text: "Ashwagandha is best absorbed when taken with food", icon: Leaf },
  { text: "Consistency matters more than perfection with herbal protocols", icon: Sparkles },
  { text: "Most herbs take 2-4 weeks to show their full effects", icon: Leaf },
  { text: "Keeping a symptom journal helps track what's working", icon: Sparkles },
];

const SUGGESTIONS = [
  "I've been feeling fatigued lately",
  "Help with sleep issues",
  "Digestive discomfort after meals",
  "Stress and anxiety support",
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeProtocol, pastProtocols, loading: consultationsLoading } = useConsultations();
  const { usage, loading: usageLoading, isAtLimit, isPro } = useUsageLimits();
  
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there';
  const todaysTip = TIPS[new Date().getDate() % TIPS.length];
  const TipIcon = todaysTip.icon;

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
      {/* Welcome Header with inline usage indicator */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <WelcomeHeader firstName={firstName} />
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {activeProtocol 
                ? "Your protocol is in progress. Keep up the great work!"
                : "What's on your mind today?"
              }
            </p>
          </div>
          
          {/* Usage indicator for free tier */}
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
                    Go unlimited →
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
            <p className="text-sm font-medium text-amber-800">
              Daily limit reached
            </p>
            <p className="text-sm text-amber-700 mt-1">
              You&apos;ve used all 3 free consultations for today. 
              <Link href={routes.upgrade} className="underline ml-1">
                Upgrade to Pro
              </Link> for unlimited consultations.
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
              placeholder={isAtLimit 
                ? "Daily limit reached"
                : "Describe how you're feeling..."
              }
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

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTIONS.map((suggestion) => (
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
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      )}

      {/* Active Protocol Card */}
      {!isLoading && activeProtocol && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Active Protocol
          </h2>
          <div className="bg-white border border-border/50 rounded-xl p-4 sm:p-5 hover:border-accent/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                    {activeProtocol.protocol_data?.analysis?.patterns?.[0] || 'Your Protocol'}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Started {new Date(activeProtocol.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' \u00b7 '}
                    {Math.floor((Date.now() - new Date(activeProtocol.created_at).getTime()) / (1000 * 60 * 60 * 24))} days in
                  </p>
                </div>
              </div>
              <Link href={`${routes.protocols}/${activeProtocol.id}`}>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <span className="hidden sm:inline">View</span>
                  <ArrowRight className="w-3 h-3 sm:ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tip of the Day */}
      {!isLoading && (
        <div className="mb-8 flex items-center gap-3 px-3 sm:px-4 py-3 bg-white/60 border border-border/30 rounded-lg">
          <TipIcon className="w-4 h-4 text-accent flex-shrink-0" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> {todaysTip.text}
          </p>
        </div>
      )}

      {/* Past Protocols */}
      {!isLoading && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Past Protocols
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
            <div className="space-y-2">
              {pastProtocols.slice(0, 3).map((consultation) => (
                <ProtocolCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-white/60 rounded-xl border border-dashed border-border/50">
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
