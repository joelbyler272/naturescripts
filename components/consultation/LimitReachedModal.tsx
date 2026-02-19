'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/constants/routes';
import { useRouter } from 'next/navigation';
import { Crown, Infinity, FileText, TrendingUp, RefreshCw, Calendar } from 'lucide-react';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount: number;
  weeklyLimit: number;
}

const PRO_BENEFITS = [
  { icon: Infinity, label: 'Unlimited consultations' },
  { icon: RefreshCw, label: 'Adjust existing protocols' },
  { icon: FileText, label: 'Download PDF protocols' },
  { icon: TrendingUp, label: 'Progress tracking & charts' },
];

export function LimitReachedModal({ isOpen, onClose, currentCount, weeklyLimit }: LimitReachedModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push(routes.upgrade);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-amber-500" />
            Weekly Limit Reached
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Usage indicator */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <p className="text-amber-800 font-medium">
              You&apos;ve used all {currentCount} of {weeklyLimit} free consultations this week.
            </p>
            <p className="text-amber-600 text-sm mt-1">
              Resets Monday at midnight
            </p>
          </div>

          {/* Pro benefits */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Upgrade to Pro for:</p>
            <div className="grid gap-2">
              {PRO_BENEFITS.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <benefit.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground">{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="text-center py-2">
            <span className="text-3xl font-bold text-foreground">$12.99</span>
            <span className="text-muted-foreground">/month</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleUpgrade}
              className="w-full bg-accent hover:bg-accent/90 gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-muted-foreground"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
