// Wellness Score Algorithm
// Calculates an aggregate wellness score (0-100) from intake data, tracking data, and adherence

export interface WellnessBreakdown {
  nutrition: number;     // 0-100
  activity: number;      // 0-100
  sleep: number;         // 0-100
  stress: number;        // 0-100
  mindfulness: number;   // 0-100
  hydration: number;     // 0-100
  overall: number;       // 0-100 (weighted average)
}

export interface ProfileData {
  diet_type?: string;
  food_sensitivities?: string[];
  caffeine_intake?: string;
  sugar_consumption?: string;
  water_intake?: string;
  alcohol_use?: string;
  tobacco_use?: string;
  activity_level?: string;
  exercise_frequency?: string;
  sleep_hours?: number;
  stress_level?: number;
  mood_patterns?: string;
  focus_ability?: number;
  meditation_practice?: boolean;
  sunlight_exposure?: string;
  intake_completed?: boolean;
}

// Category weights (must sum to 1)
const WEIGHTS = {
  nutrition: 0.20,
  activity: 0.20,
  sleep: 0.20,
  stress: 0.20,
  mindfulness: 0.10,
  hydration: 0.10,
};

/**
 * Calculate wellness score from profile data
 */
export function calculateWellnessScore(profile: ProfileData): WellnessBreakdown {
  const nutrition = calculateNutritionScore(profile);
  const activity = calculateActivityScore(profile);
  const sleep = calculateSleepScore(profile);
  const stress = calculateStressScore(profile);
  const mindfulness = calculateMindfulnessScore(profile);
  const hydration = calculateHydrationScore(profile);

  const overall = Math.round(
    nutrition * WEIGHTS.nutrition +
    activity * WEIGHTS.activity +
    sleep * WEIGHTS.sleep +
    stress * WEIGHTS.stress +
    mindfulness * WEIGHTS.mindfulness +
    hydration * WEIGHTS.hydration
  );

  return { nutrition, activity, sleep, stress, mindfulness, hydration, overall };
}

function calculateNutritionScore(p: ProfileData): number {
  let score = 50; // baseline

  // Diet type bonuses
  const dietScores: Record<string, number> = {
    'mediterranean': 20, 'vegetarian': 15, 'vegan': 15,
    'paleo': 10, 'keto': 5, 'omnivore': 5, 'other': 5,
  };
  score += dietScores[p.diet_type || ''] || 0;

  // Sugar consumption
  if (p.sugar_consumption === 'low') score += 15;
  else if (p.sugar_consumption === 'moderate') score += 5;
  else if (p.sugar_consumption === 'high') score -= 10;

  // Caffeine (moderate is fine)
  if (p.caffeine_intake === 'none' || p.caffeine_intake === 'low') score += 5;
  else if (p.caffeine_intake === 'high') score -= 5;

  // Alcohol
  if (p.alcohol_use === 'none') score += 10;
  else if (p.alcohol_use === 'occasional') score += 5;
  else if (p.alcohol_use === 'frequent') score -= 15;

  // Tobacco
  if (p.tobacco_use === 'none') score += 10;
  else if (p.tobacco_use === 'former') score += 5;
  else if (p.tobacco_use === 'regular') score -= 20;

  return clamp(score);
}

function calculateActivityScore(p: ProfileData): number {
  let score = 30;

  const activityScores: Record<string, number> = {
    'sedentary': 0, 'light': 15, 'moderate': 30, 'active': 45, 'very-active': 55,
  };
  score += activityScores[p.activity_level || ''] || 0;

  const exerciseScores: Record<string, number> = {
    'none': 0, '1-2x': 10, '3-4x': 20, '5-plus': 25,
  };
  score += exerciseScores[p.exercise_frequency || ''] || 0;

  // Sunlight exposure
  if (p.sunlight_exposure === 'plenty') score += 10;
  else if (p.sunlight_exposure === 'moderate') score += 5;

  return clamp(score);
}

function calculateSleepScore(p: ProfileData): number {
  if (!p.sleep_hours) return 50;

  // Optimal: 7-9 hours
  const hours = p.sleep_hours;
  if (hours >= 7 && hours <= 9) return 90;
  if (hours >= 6 && hours < 7) return 70;
  if (hours > 9 && hours <= 10) return 70;
  if (hours >= 5 && hours < 6) return 50;
  if (hours > 10) return 50;
  return 30; // less than 5 hours
}

function calculateStressScore(p: ProfileData): number {
  if (!p.stress_level) return 50;

  // Invert: low stress = high score
  // stress_level is 1-10, where 10 is highest stress
  return clamp(Math.round(100 - (p.stress_level - 1) * 11.1));
}

function calculateMindfulnessScore(p: ProfileData): number {
  let score = 40;

  if (p.meditation_practice) score += 30;

  const moodScores: Record<string, number> = {
    'stable': 25, 'mostly-good': 20, 'variable': 5, 'mostly-low': -10,
  };
  score += moodScores[p.mood_patterns || ''] || 0;

  if (p.focus_ability) {
    score += Math.round((p.focus_ability / 10) * 15);
  }

  return clamp(score);
}

function calculateHydrationScore(p: ProfileData): number {
  const waterScores: Record<string, number> = {
    'less-than-4': 30,
    '4-6': 55,
    '6-8': 80,
    'more-than-8': 95,
  };
  return waterScores[p.water_intake || ''] || 50;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Get a label for a score
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 35) return 'Needs Improvement';
  return 'Getting Started';
}

/**
 * Get color for a score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 65) return 'text-accent';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-500';
}
