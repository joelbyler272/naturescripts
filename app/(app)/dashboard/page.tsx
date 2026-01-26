'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WelcomeHeader } from '@/components/app/WelcomeHeader';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { MOCK_USER, MOCK_CONSULTATIONS } from '@/lib/data/hardcoded';
import { routes } from '@/lib/constants/routes';
import { ArrowRight, Sparkles, Leaf, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tips that rotate - adds personality
const TIPS = [
  { text: "Ashwagandha is best absorbed when taken with food", icon: Leaf },
  { text: "Consistency matters more than perfection with herbal protocols", icon: Sparkles },
  { text: "Most herbs take 2-4 weeks to show their full effects", icon: Leaf },
  { text: "Keeping a symptom journal helps track what's working", icon: Sparkles },
];

// Placeholder suggestions
const SUGGESTIONS = [
  "I've been feeling fatigued lately",
  "Help with sleep issues",
  "Digestive discomfort after meals",
  "Stress and anxiety support",
];

export default function DashboardPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const consultationsUsed = 2;
  const consultationsLimit = 3;

  // Find active protocol (if any) - less than 14 days old
  const activeProtocol = MOCK_CONSULTATIONS.find(c => {
    const createdDate = new Date(c.created_at);
    const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCreation < 14;
  });

  // Past protocols (exclude active one)
  const pastProtocols = MOCK_CONSULTATIONS.filter(c => c.id !== activeProtocol?.id);

  // Get tip of the day based on date
  const todaysTip = TIPS[new Date().getDate() % TIPS.length];
  const TipIcon = todaysTip.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // In a real app, we'd pass the input to the consultation page
      router.push(routes.consultation);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Could auto-submit or just fill the input
  };

  return (
    <div className="w-full">
      {/* Welcome Header with inline usage indicator */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <WelcomeHeader firstName={MOCK_USER.first_name} />
            <p className="text-muted-foreground mt-1">
              {activeProtocol 
                ? "Your protocol is in progress. Keep up the great work!"
                : "What's on your mind today?"
              }
            </p>
          </div>
          
          {/* Subtle usage indicator for free tier */}
          {MOCK_USER.tier === 'free' && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {consultationsUsed}/{consultationsLimit} today
              </p>
              <Link 
                href={routes.upgrade}
                className="text-xs text-accent hover:text-accent/80 transition-colors"
              >
                Go unlimited →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="mb-6">
        <form onSubmit={handleSubmit}>
          <div 
            className={cn(
              "relative flex items-center bg-white rounded-2xl border transition-all duration-200",
              isFocused 
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
              placeholder="Describe how you're feeling or what you'd like help with..."
              className="flex-1 px-5 py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={cn(
                "mr-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                inputValue.trim()
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
              className="px-3 py-1.5 text-sm text-muted-foreground bg-white border border-border/50 rounded-full hover:border-accent/50 hover:text-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Active Protocol Card */}
      {activeProtocol && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Active Protocol
          </h2>
          <div className="bg-white border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {activeProtocol.protocol_data?.analysis?.patterns?.[0] || 'Your Protocol'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Started {new Date(activeProtocol.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' · '}
                    {Math.floor((Date.now() - new Date(activeProtocol.created_at).getTime()) / (1000 * 60 * 60 * 24))} days in
                  </p>
                </div>
              </div>
              <Link href={`${routes.protocols}/${activeProtocol.id}`}>
                <Button variant="outline" size="sm">
                  View
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tip of the Day */}
      <div className="mb-8 flex items-center gap-3 px-4 py-3 bg-white/60 border border-border/30 rounded-lg">
        <TipIcon className="w-4 h-4 text-accent flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Tip:</span> {todaysTip.text}
        </p>
      </div>

      {/* Past Protocols */}
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
          <div className="text-center py-12 bg-white/60 rounded-xl border border-dashed border-border/50">
            <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">No protocols yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start your first consultation above to get a personalized herbal protocol
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
