'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/routes';
import { trackUpgradeClicked } from '@/lib/analytics/events';

interface ProGateProps {
  children: ReactNode;
  feature: string;
  description?: string;
  /** If true, shows a compact inline lock instead of full card */
  compact?: boolean;
  /** Analytics source for tracking */
  source?: string;
}

/**
 * ProGate - Wraps content that should only be accessible to Pro users.
 * Free users see an upgrade prompt instead of the children.
 */
export function ProGate({ 
  children, 
  feature, 
  description,
  compact = false,
  source 
}: ProGateProps) {
  const { isPro, loading } = useUsageLimits();
  const router = useRouter();

  const handleUpgrade = () => {
    trackUpgradeClicked(source || `pro_gate_${feature.toLowerCase().replace(/\s+/g, '_')}`);
    router.push(routes.upgrade);
  };

  // While loading, show nothing to prevent flash
  if (loading) {
    return null;
  }

  // Pro users see the content
  if (isPro) {
    return <>{children}</>;
  }

  // Free users see upgrade prompt
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-dashed">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground flex-1">
          {feature} is a Pro feature
        </span>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleUpgrade}
          className="gap-1.5"
        >
          <Crown className="w-3.5 h-3.5" />
          Upgrade
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-accent/30 bg-accent/5">
      <CardContent className="py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
          <Crown className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {feature}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description || `${feature} is available with NatureScripts Pro. Upgrade to unlock this feature and get the most out of your wellness journey.`}
        </p>
        <Button 
          onClick={handleUpgrade}
          className="bg-accent hover:bg-accent/90 gap-2"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          $12.99/month • Cancel anytime
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Hook version for conditional rendering in complex components
 */
export function useProGate() {
  const { isPro, loading } = useUsageLimits();
  return { isPro, loading, isFree: !isPro && !loading };
}
