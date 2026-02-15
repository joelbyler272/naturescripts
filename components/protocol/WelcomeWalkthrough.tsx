'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronLeft, Leaf, Clock, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WelcomeWalkthroughProps {
  firstName: string;
  onComplete: () => void;
}

interface TourStep {
  id: string;
  icon: typeof Leaf;
  title: string;
  description: string;
  targetSelector?: string; // data-tour-section value to highlight
}

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    icon: Leaf,
    title: 'Welcome to your protocol!',
    description: "We've created a personalized natural health plan based on what you shared with us. Let me show you around.",
  },
  {
    id: 'recommendations',
    icon: Leaf,
    title: 'Your Recommendations',
    description: 'These are your personalized supplement recommendations. Each one includes the supplement name, why it helps with your concern, and exactly how much to take.',
    targetSelector: 'recommendations',
  },
  {
    id: 'timing',
    icon: Clock,
    title: 'Dosage & Timing',
    description: 'Each recommendation includes specific dosage and when to take it. Taking supplements at the right time can make them more effective.',
    targetSelector: 'dosage-timing',
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
    title: 'Shopping Links',
    description: 'Click to purchase from trusted sources like Amazon and iHerb. We\'ve handpicked quality products for each recommendation.',
    targetSelector: 'shopping-links',
  },
  {
    id: 'complete',
    icon: CheckCircle2,
    title: "You're all set!",
    description: "Your protocol is saved to your account. Come back anytime to review it or start a new consultation.",
  },
];

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function WelcomeWalkthrough({ firstName, onComplete }: WelcomeWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;
  const isModalStep = !step.targetSelector;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Calculate spotlight and tooltip position when step changes
  useEffect(() => {
    if (!step.targetSelector) {
      setSpotlight(null);
      return;
    }

    const el = document.querySelector(`[data-tour-section="${step.targetSelector}"]`);
    if (!el) {
      setSpotlight(null);
      return;
    }

    // Scroll element into view first
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait for scroll, then calculate position
    const positionTimeout = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const padding = 8;
      const spotlightRect: SpotlightRect = {
        top: rect.top + window.scrollY - padding,
        left: rect.left + window.scrollX - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      };
      setSpotlight(spotlightRect);

      // Position tooltip to the right of the element, or left if no room
      const tooltipWidth = 320;
      const tooltipHeight = 200; // approximate
      const gap = 16;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Vertically center tooltip against the highlighted element
      const tooltipTop = Math.max(
        16,
        Math.min(
          rect.top + rect.height / 2 - tooltipHeight / 2,
          vh - tooltipHeight - 16
        )
      );

      const spaceRight = vw - rect.right;
      const spaceLeft = rect.left;

      if (spaceRight >= tooltipWidth + gap + 16) {
        // Place to the right
        setTooltipStyle({
          position: 'fixed',
          top: `${tooltipTop}px`,
          left: `${rect.right + gap}px`,
          width: `${tooltipWidth}px`,
        });
      } else if (spaceLeft >= tooltipWidth + gap + 16) {
        // Place to the left
        setTooltipStyle({
          position: 'fixed',
          top: `${tooltipTop}px`,
          left: `${rect.left - tooltipWidth - gap}px`,
          width: `${tooltipWidth}px`,
        });
      } else {
        // Not enough side room — fallback to bottom, centered
        const tooltipLeft = Math.max(
          16,
          Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, vw - tooltipWidth - 16)
        );
        setTooltipStyle({
          position: 'fixed',
          top: `${rect.bottom + gap}px`,
          left: `${tooltipLeft}px`,
          width: `${tooltipWidth}px`,
        });
      }
    }, 400);

    return () => clearTimeout(positionTimeout);
  }, [currentStep, step.targetSelector]);

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
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      onComplete();
      // Scroll to the top of the protocol page after overlay is gone
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }, 300);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isVisible) return null;

  // Modal step (welcome & complete)
  if (isModalStep) {
    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300",
          isExiting ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className={cn(
          "relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-300 transition-all",
          isExiting && "opacity-0 scale-95"
        )}>
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {step.id === 'welcome' ? `Welcome to your protocol, ${firstName}!` : step.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </div>

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
            <Button onClick={handleNext} className="bg-accent hover:bg-accent/90">
              {isLastStep ? "View My Protocol" : (
                <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </div>

          {/* Skip tour only on non-last modal steps */}
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tour
            </button>
          )}
        </div>
      </div>,
      document.body
    );
  }

  // Highlight step — overlay with spotlight cutout
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[9999] transition-opacity duration-300",
        isExiting ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Semi-transparent overlay with spotlight cutout */}
      <svg
        className="fixed inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlight && (
              <rect
                x={spotlight.left}
                y={spotlight.top}
                width={spotlight.width}
                height={spotlight.height}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#tour-spotlight-mask)"
          style={{ pointerEvents: 'auto' }}
        />
      </svg>

      {/* Spotlight border highlight */}
      {spotlight && (
        <div
          className="fixed rounded-xl border-2 border-accent/60 transition-all duration-300"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            pointerEvents: 'none',
            boxShadow: '0 0 0 4px rgba(64, 141, 89, 0.15)',
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        className="bg-white rounded-xl shadow-2xl p-5 transition-all duration-300 z-[10000]"
        style={tooltipStyle}
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                index === currentStep ? "bg-accent" : index < currentStep ? "bg-accent/40" : "bg-border"
              )}
            />
          ))}
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{step.title}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tour
            </button>
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-accent hover:bg-accent/90 text-xs h-8 px-4"
            >
              {isLastStep ? "Done" : "Next"}
              {!isLastStep && <ChevronRight className="w-3 h-3 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
