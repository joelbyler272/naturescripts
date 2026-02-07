'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/constants/routes';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocolTitle?: string;
}

const PRO_BENEFITS = [
  'Unlimited consultations per day',
  'More comprehensive protocols (2-4 recommendations)',
  'Dietary shift recommendations',
  'Lifestyle practice suggestions',
  'Progress tracking tools',
  'Access to consultation history',
];

export function UpgradeModal({ isOpen, onClose, protocolTitle }: UpgradeModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push(routes.upgrade);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-accent to-accent/80 px-6 py-8 text-white text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Your protocol is ready!
            </h2>
            <p className="text-white/80 text-sm">
              Want even better results? Upgrade to Pro.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Pro includes
            </h3>
            <ul className="space-y-3">
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
