// User Types
export type UserTier = 'free' | 'pro';

export interface User {
  id: string;
  email: string;
  first_name: string;
  email_verified: boolean;
  tier: UserTier;
  stripe_customer_id?: string;
  created_at: string;
}

// Consultation Types
export interface Consultation {
  id: string;
  user_id: string;
  initial_input: string;
  conversation_log: Message[];
  protocol_data: Protocol;
  protocol_version: number;
  parent_consultation_id?: string;
  tier_at_creation: UserTier;
  created_at: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Protocol Types
export interface Protocol {
  analysis: {
    patterns: string[];
    explanation: string;
  };
  phase1: Phase;
  phase2?: Phase;
  phase3?: Phase;
  testing_recommendations?: string[];
  red_flags: string[];
}

export interface Phase {
  herbs: Herb[];
  diet: {
    add: string[];
    remove: string[];
  };
  lifestyle: string[];
}

export interface Herb {
  name: string;
  botanical_name: string;
  why: string;
  dosage: string;
  timing: string;
  safety: string;
  product_link?: string;
}

// Herbal Database Types
export interface HerbDatabase {
  id: string;
  name: string;
  botanical_name: string;
  overview: string;
  benefits: string[];
  dosage: string;
  contraindications: string[];
  drug_interactions: string[];
  side_effects: string[];
  evidence_level: 1 | 2 | 3 | 4 | 5;
  image_url: string;
}

// Tracking Types (Pro Feature)
export interface SymptomTracking {
  id: string;
  user_id: string;
  date: string;
  symptom_name: string;
  severity: number; // 1-10
  notes?: string;
}

export interface SupplementTracking {
  id: string;
  user_id: string;
  date: string;
  supplement_name: string;
  taken: boolean;
  time_taken?: string;
}

export interface HabitTracking {
  id: string;
  user_id: string;
  date: string;
  habit_name: string;
  completed: boolean;
  notes?: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  cancel_at_period_end: boolean;
}

// Daily Usage Types (Free Tier)
export interface DailyUsage {
  user_id: string;
  date: string;
  consultation_count: number;
}
