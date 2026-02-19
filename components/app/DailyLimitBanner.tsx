'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { routes } from '@/lib/constants/routes';

interface DailyLimitBannerProps {
  consultationsUsed: number;
  consultationsLimit: number;
}

export function DailyLimitBanner({ consultationsUsed, consultationsLimit }: DailyLimitBannerProps) {
  const remaining = consultationsLimit - consultationsUsed;
  const isAtLimit = remaining <= 0;

  if (isAtLimit) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-900">Weekly limit reached</p>
            <p className="text-sm text-amber-700">
              You've used all {consultationsLimit} free consultations this week.
            </p>
          </div>
        </div>
        <Link
          href={routes.upgrade}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Upgrade for Unlimited
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{remaining}</span> of {consultationsLimit} free consultations remaining this week
        </p>
      </div>
      <Link
        href={routes.upgrade}
        className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
      >
        Get Unlimited →
      </Link>
    </div>
  );
}
