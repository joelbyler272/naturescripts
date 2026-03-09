export interface RemedyBenefit {
  name: string;
  description: string;
  evidenceLevel: number; // 1-5 dots
}

export interface RemedyDosage {
  form: string;
  amount: string;
  timing: string;
  notes?: string;
}

export interface RemedyInteraction {
  substance: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface RemedyFAQ {
  question: string;
  answer: string;
}

export interface RemedyProduct {
  name: string;
  brand: string;
  form: string;
  size: string;
  affiliateUrl: string;
  note?: string;
}

export type RemedyGroup = 'Herbs' | 'Oils' | 'Tinctures' | 'Remedies' | 'Food';

export const REMEDY_GROUPS: RemedyGroup[] = ['Herbs', 'Oils', 'Tinctures', 'Remedies', 'Food'];

export interface Remedy {
  id: string;
  slug: string;
  name: string;
  botanicalName: string;
  aliases: string[];
  category: string;
  group?: RemedyGroup;
  tags: string[];
  rating: number; // 1.0 - 10.0
  summary: string;
  overview: string;
  howItWorks: string;
  benefits: RemedyBenefit[];
  dosages: RemedyDosage[];
  bestTimeToTake: string;
  howLongToWork: string;
  sideEffects: string[];
  whoShouldAvoid: string[];
  interactions: RemedyInteraction[];
  faqs: RemedyFAQ[];
  qualityMarkers: string[];
  products: RemedyProduct[];
  relatedRemedies: string[]; // slugs
  oftenPairedWith: string[]; // slugs
  lastUpdated: string;
}
