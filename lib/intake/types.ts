// Intake Wizard Types

export interface IntakeData {
  // Step 1: Personal Info
  age: number | null;
  gender: string;
  height_cm: number | null;
  weight_kg: number | null;
  blood_type: string;

  // Step 2: Diet & Nutrition
  diet_type: string;
  food_sensitivities: string[];
  caffeine_intake: string;
  sugar_consumption: string;
  water_intake: string;
  alcohol_use: string;
  tobacco_use: string;

  // Step 3: Lifestyle
  activity_level: string;
  exercise_frequency: string;
  sleep_hours: number | null;
  stress_level: number | null;
  sunlight_exposure: string;

  // Step 4: Mental & Emotional
  mood_patterns: string;
  focus_ability: number | null;
  meditation_practice: boolean;

  // Step 5: Goals
  wellness_goals: string[];
}

export const INTAKE_STEPS = [
  { id: 'personal', label: 'Personal', description: 'Basic information' },
  { id: 'diet', label: 'Diet', description: 'Nutrition habits' },
  { id: 'lifestyle', label: 'Lifestyle', description: 'Activity and sleep' },
  { id: 'mental', label: 'Mental', description: 'Emotional wellness' },
  { id: 'goals', label: 'Goals', description: 'Wellness priorities' },
] as const;

export type IntakeStepId = typeof INTAKE_STEPS[number]['id'];

export const DEFAULT_INTAKE_DATA: IntakeData = {
  age: null,
  gender: '',
  height_cm: null,
  weight_kg: null,
  blood_type: '',
  diet_type: '',
  food_sensitivities: [],
  caffeine_intake: '',
  sugar_consumption: '',
  water_intake: '',
  alcohol_use: '',
  tobacco_use: '',
  activity_level: '',
  exercise_frequency: '',
  sleep_hours: null,
  stress_level: null,
  sunlight_exposure: '',
  mood_patterns: '',
  focus_ability: null,
  meditation_practice: false,
  wellness_goals: [],
};

// Options for select fields

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const BLOOD_TYPE_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'unknown', label: "I don't know" },
];

export const DIET_OPTIONS = [
  { value: 'omnivore', label: 'Omnivore' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'other', label: 'Other' },
];

export const CAFFEINE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low (1 cup/day)' },
  { value: 'moderate', label: 'Moderate (2-3 cups/day)' },
  { value: 'high', label: 'High (4+ cups/day)' },
];

export const SUGAR_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
];

export const WATER_OPTIONS = [
  { value: 'less-than-4', label: 'Less than 4 glasses' },
  { value: '4-6', label: '4-6 glasses' },
  { value: '6-8', label: '6-8 glasses' },
  { value: 'more-than-8', label: 'More than 8 glasses' },
];

export const ALCOHOL_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'occasional', label: 'Occasional' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'frequent', label: 'Frequent' },
];

export const TOBACCO_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'former', label: 'Former' },
  { value: 'occasional', label: 'Occasional' },
  { value: 'regular', label: 'Regular' },
];

export const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'active', label: 'Active' },
  { value: 'very-active', label: 'Very Active' },
];

export const EXERCISE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: '1-2x', label: '1-2x per week' },
  { value: '3-4x', label: '3-4x per week' },
  { value: '5-plus', label: '5+ per week' },
];

export const SUNLIGHT_OPTIONS = [
  { value: 'minimal', label: 'Minimal (mostly indoors)' },
  { value: 'some', label: 'Some (short walks)' },
  { value: 'moderate', label: 'Moderate (regular outdoor time)' },
  { value: 'plenty', label: 'Plenty (outdoor work/activities)' },
];

export const MOOD_OPTIONS = [
  { value: 'stable', label: 'Stable and balanced' },
  { value: 'mostly-good', label: 'Mostly good' },
  { value: 'variable', label: 'Variable / up and down' },
  { value: 'mostly-low', label: 'Mostly low' },
];

export const COMMON_SENSITIVITIES = [
  'Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy', 'Shellfish',
  'Corn', 'Nightshades', 'Histamine', 'FODMAPs',
];

export const WELLNESS_GOAL_OPTIONS = [
  'Better sleep',
  'Reduce stress',
  'More energy',
  'Weight management',
  'Digestive health',
  'Pain relief',
  'Immune support',
  'Mental clarity',
  'Hormone balance',
  'Heart health',
  'Skin health',
  'Athletic performance',
];
