'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Clock, Sparkles, FileText, TrendingUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/routes';
import { trackUpgradeClicked } from '@/lib/analytics/events';
import Image from 'next/image';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingDays?: number;
}

const PRO_BENEFITS = [
  { icon: Sparkles, text: 'Unlimited consultations' },
  { icon: FileText, text: 'Download protocols as PDF' },
  { icon: TrendingUp, text: 'Progress tracking & insights' },
];

export function LimitReachedModal({ isOpen, onClose, remainingDays = 7 }: LimitReachedModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    trackUpgradeClicked('limit_reached_modal');
    router.push(routes.upgrade);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="limit-modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-b from-amber-50 to-white pt-8 pb-4 px-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl overflow-hidden border border-border/50">
            <Image src="/icon.svg" alt="NatureScripts" width={48} height={48} />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3">
            <Clock className="w-4 h-4" />
            Weekly limit reached
          </div>
          
          <h2 id="limit-modal-title" className="text-xl font-semibold text-foreground">
            You&apos;ve used your 5 free consultations
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Your limit resets in {remainingDays} {remainingDays === 1 ? 'day' : 'days'}, or upgrade now for unlimited access.
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 py-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Pro includes
          </p>
          <ul className="space-y-3">
            {PRO_BENEFITS.map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-accent hover:bg-accent/90 gap-2 py-5"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Pro — $12.99/mo
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-muted-foreground"
          >
            Wait for reset
          </Button>
        </div>
      </div>
    </div>
  );
}
