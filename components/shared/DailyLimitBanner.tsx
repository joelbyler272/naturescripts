import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyLimitBannerProps {
  consultationsUsed: number;
  consultationsLimit: number;
}

export function DailyLimitBanner({
  consultationsUsed,
  consultationsLimit,
}: DailyLimitBannerProps) {
  const remaining = consultationsLimit - consultationsUsed;
  const isAtLimit = remaining <= 0;

  return (
    <div className={`rounded-lg p-4 ${isAtLimit ? 'bg-destructive/10' : 'bg-primary/10'} border ${isAtLimit ? 'border-destructive/20' : 'border-primary/20'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertCircle className={`w-5 h-5 mt-0.5 ${isAtLimit ? 'text-destructive' : 'text-primary'}`} />
          <div>
            <p className="font-medium text-sm text-charcoal">
              {isAtLimit
                ? 'Daily consultation limit reached'
                : `${remaining} of ${consultationsLimit} consultations remaining today`}
            </p>
            <p className="text-xs text-charcoal/60 mt-1">
              {isAtLimit
                ? 'Upgrade to Pro for unlimited consultations'
                : 'Free tier resets daily at midnight'}
            </p>
          </div>
        </div>
        {isAtLimit && (
          <Link href="/upgrade">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Upgrade
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
