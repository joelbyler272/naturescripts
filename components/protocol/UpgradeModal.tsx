'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Check, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/constants/routes';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRO_BENEFITS = [
  'Unlimited consultations per day',
  'Comprehensive protocols with 2-4 recommendations',
  'Personalized dietary shift recommendations',
  'Lifestyle practice suggestions',
  'Progress tracking tools',
  'Full consultation history access',
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
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
    router.push(routes.upgrade);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header with gradient — no X close button */}
        <div className="bg-gradient-to-br from-accent to-accent/80 px-6 py-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Get more from your protocol
            </h2>
            <p className="text-white/80 text-sm">
              Unlock deeper insights and personalized guidance with Pro.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Video placeholder */}
          <div className="aspect-video bg-gray-50 rounded-xl flex flex-col items-center justify-center mb-6 border border-border/30">
            <Leaf className="w-12 h-12 text-gray-200 mb-2" />
            <span className="text-gray-400 text-xs">Pro Feature Preview Coming Soon</span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Everything in Pro
            </h3>
            <ul className="space-y-2.5">
              {PRO_BENEFITS.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-sm text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing hint */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Starting at <span className="text-foreground font-semibold">$9.99/month</span>
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              className="w-full bg-accent hover:bg-accent/90 h-12 text-base"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
            <button
              onClick={onClose}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
