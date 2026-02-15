'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

const FREE_FEATURES = [
  '1 consultation per day',
  'Basic supplement protocol',
  'Product shopping links',
];

const PRO_FEATURES = [
  'Unlimited consultations',
  'Comprehensive protocols',
  'Dietary shift recommendations',
  'Lifestyle practice guidance',
  'Progress tracking',
  'Full consultation history',
];

export function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
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
    if (onUpgrade) {
      onUpgrade();
    } else {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header with NS Logo */}
        <div className="text-center pt-6 pb-4 px-6">
          <div className="w-10 h-10 mx-auto mb-3 rounded-lg overflow-hidden border border-border/50">
            <Image src="/icon.svg" alt="NatureScripts" width={40} height={40} />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Choose your plan
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Get the most out of your health journey.
          </p>
        </div>

        {/* Plans side by side */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Free Plan */}
            <div className="border border-border/50 rounded-xl p-4">
              <h3 className="text-base font-semibold text-foreground mb-1">Free</h3>
              <p className="text-xs text-muted-foreground mb-4">The essentials</p>

              <ul className="space-y-2.5 mb-5">
                {FREE_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-9 text-xs"
              >
                Stay on Free
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-accent rounded-xl p-4 relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                Recommended
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Pro</h3>
              <p className="text-xs text-muted-foreground mb-4">$9.99/month</p>

              <ul className="space-y-2.5 mb-5">
                {PRO_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleUpgrade}
                className="w-full bg-accent hover:bg-accent/90 h-9 text-xs"
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
