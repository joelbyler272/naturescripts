'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth/AuthContext';
import { getUserProfile, updateHealthProfile } from '@/lib/supabase/database';
import { PersonalStep } from '@/components/intake/PersonalStep';
import { DietStep } from '@/components/intake/DietStep';
import { LifestyleStep } from '@/components/intake/LifestyleStep';
import { MentalStep } from '@/components/intake/MentalStep';
import { GoalsStep } from '@/components/intake/GoalsStep';
import { IntakeData, INTAKE_STEPS, DEFAULT_INTAKE_DATA } from '@/lib/intake/types';
import { routes } from '@/lib/constants/routes';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';

export function IntakeWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<IntakeData>(DEFAULT_INTAKE_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing profile data
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const profile = await getUserProfile(user.id);
        if (profile) {
          setData({
            age: profile.age ?? null,
            gender: profile.gender ?? '',
            height_cm: profile.height_cm ?? null,
            weight_kg: profile.weight_kg ? Number(profile.weight_kg) : null,
            blood_type: profile.blood_type ?? '',
            diet_type: profile.diet_type ?? '',
            food_sensitivities: profile.food_sensitivities ?? [],
            caffeine_intake: profile.caffeine_intake ?? '',
            sugar_consumption: profile.sugar_consumption ?? '',
            water_intake: profile.water_intake ?? '',
            alcohol_use: profile.alcohol_use ?? '',
            tobacco_use: profile.tobacco_use ?? '',
            activity_level: profile.activity_level ?? '',
            exercise_frequency: profile.exercise_frequency ?? '',
            sleep_hours: profile.sleep_hours ? Number(profile.sleep_hours) : null,
            stress_level: profile.stress_level ?? null,
            sunlight_exposure: profile.sunlight_exposure ?? '',
            mood_patterns: profile.mood_patterns ?? '',
            focus_ability: profile.focus_ability ?? null,
            meditation_practice: profile.meditation_practice ?? false,
            wellness_goals: profile.wellness_goals ?? [],
          });
        }
      } catch (err) {
        logger.error('Error loading profile for intake:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user?.id]);

  const handleChange = (updates: Partial<IntakeData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < INTAKE_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateHealthProfile(user.id, {
        age: data.age,
        gender: data.gender || null,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        blood_type: data.blood_type || null,
        diet_type: data.diet_type || null,
        food_sensitivities: data.food_sensitivities,
        caffeine_intake: data.caffeine_intake || null,
        sugar_consumption: data.sugar_consumption || null,
        water_intake: data.water_intake || null,
        alcohol_use: data.alcohol_use || null,
        tobacco_use: data.tobacco_use || null,
        activity_level: data.activity_level || null,
        exercise_frequency: data.exercise_frequency || null,
        sleep_hours: data.sleep_hours,
        stress_level: data.stress_level,
        sunlight_exposure: data.sunlight_exposure || null,
        mood_patterns: data.mood_patterns || null,
        focus_ability: data.focus_ability,
        meditation_practice: data.meditation_practice,
        wellness_goals: data.wellness_goals,
        intake_completed: true,
        intake_completed_at: new Date().toISOString(),
      });
      router.push(routes.dashboard);
    } catch (err) {
      logger.error('Error saving intake:', err);
    } finally {
      setSaving(false);
    }
  };

  const progress = ((currentStep + 1) / INTAKE_STEPS.length) * 100;
  const isLastStep = currentStep === INTAKE_STEPS.length - 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Wellness Intake</h1>
        <p className="text-sm text-muted-foreground">
          Complete this assessment to get more personalized recommendations. All fields are optional.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="mb-8">
        <div className="flex items-center gap-1 mb-3">
          {INTAKE_STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(i)}
              className={cn(
                'flex-1 text-center py-1.5 text-xs font-medium rounded transition-colors',
                i === currentStep
                  ? 'text-accent'
                  : i < currentStep
                    ? 'text-accent/60'
                    : 'text-muted-foreground'
              )}
            >
              {step.label}
            </button>
          ))}
        </div>
        <Progress value={progress} className="h-1.5 bg-secondary [&>div]:bg-accent" />
      </div>

      {/* Step Content */}
      <div className="bg-white border border-border/40 rounded-xl p-5 sm:p-6 mb-6">
        {currentStep === 0 && <PersonalStep data={data} onChange={handleChange} />}
        {currentStep === 1 && <DietStep data={data} onChange={handleChange} />}
        {currentStep === 2 && <LifestyleStep data={data} onChange={handleChange} />}
        {currentStep === 3 && <MentalStep data={data} onChange={handleChange} />}
        {currentStep === 4 && <GoalsStep data={data} onChange={handleChange} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="gap-2 bg-accent hover:bg-accent/90 text-white"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Complete Intake
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="gap-2 bg-accent hover:bg-accent/90 text-white"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Skip link */}
      <div className="text-center mt-4">
        <button
          onClick={() => router.push(routes.protocols)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
