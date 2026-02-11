'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, ChevronLeft, Sparkles, Leaf, Clock, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WelcomeWalkthroughProps {
  firstName: string;
  onComplete: () => void;
}

const STEPS = [
  {
    id: 'welcome',
    icon: Sparkles,
    title: 'Welcome to your protocol!',
    description: "We've created a personalized natural health plan based on what you shared with us. Let me show you around.",
  },
  {
    id: 'recommendations',
    icon: Leaf,
    title: 'Your Recommendations',
    description: 'Each recommendation includes the supplement name, why it helps with your concern, and exactly how much to take.',
  },
  {
    id: 'timing',
    icon: Clock,
    title: 'Timing Matters',
    description: "Pay attention to the timing suggestions. Taking supplements at the right time can make them more effective.",
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
    title: 'Ready to Shop',
    description: "We've included links to quality products for each recommendation. You can shop from trusted sources like Amazon and iHerb.",
  },
  {
    id: 'complete',
    icon: CheckCircle2,
    title: "You're all set!",
    description: "Your protocol is saved to your account. Come back anytime to review it or start a new consultation.",
  },
];

export function WelcomeWalkthrough({ firstName, onComplete }: WelcomeWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsExiting(true);
    // Small delay for animation
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleSkip();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300",
        isExiting ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className={cn(
        "relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-300 transition-all",
        isExiting && "opacity-0 scale-95"
      )}>
        {/* Close button */}
        <button
          onClick={handleSkip}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentStep ? "bg-accent" : "bg-border"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-accent" />
          </div>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {step.id === 'welcome' ? `Welcome to your protocol, ${firstName}!` : step.title}
          </h2>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className={cn(
              "flex items-center gap-1 text-sm font-medium transition-colors",
              isFirstStep 
                ? "text-transparent cursor-default" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <Button
            onClick={handleNext}
            className="bg-accent hover:bg-accent/90"
          >
            {isLastStep ? (
              "View My Protocol"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Skip link */}
        <button
          onClick={handleSkip}
          className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip tour
        </button>
      </div>
    </div>
  );
}
