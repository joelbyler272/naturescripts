import { ConsultationState, LegacyGeneratedProtocol, ProtocolRecommendation, ProtocolSize } from './types';
import { detectSymptomCategory } from './questionFlow';

// Protocol templates by symptom category
const PROTOCOL_TEMPLATES: Record<string, {
  recommendations: ProtocolRecommendation[];
  lifestyleTips: string[];
  summary: string;
}> = {
  sleep: {
    summary: "Your sleep protocol focuses on calming the nervous system and supporting natural melatonin production.",
    recommendations: [
      {
        herb: "Magnesium Glycinate",
        botanicalName: "Mg (glycinate form)",
        dosage: "300-400mg",
        timing: "1 hour before bed",
        reason: "Promotes muscle relaxation and supports GABA activity for calmer sleep",
        duration: "Ongoing - safe for long-term use",
      },
      {
        herb: "Passionflower",
        botanicalName: "Passiflora incarnata",
        dosage: "500mg extract or 1 cup tea",
        timing: "30-60 minutes before bed",
        reason: "Quiets racing thoughts and promotes relaxation without morning grogginess",
        duration: "2-4 weeks, then assess",
      },
    ],
    lifestyleTips: [
      "Dim lights 1-2 hours before bed to support natural melatonin",
      "Keep bedroom cool (65-68°F) for optimal sleep",
      "Avoid screens 1 hour before bed, or use blue light blocking",
    ],
  },
  digestive: {
    summary: "Your digestive protocol aims to support healthy digestion and reduce discomfort.",
    recommendations: [
      {
        herb: "Ginger",
        botanicalName: "Zingiber officinale",
        dosage: "500mg or 1 inch fresh root in tea",
        timing: "15-20 minutes before meals",
        reason: "Stimulates digestive enzymes and reduces bloating and nausea",
        duration: "As needed, safe for ongoing use",
      },
      {
        herb: "Peppermint",
        botanicalName: "Mentha piperita",
        dosage: "1-2 capsules enteric-coated, or tea",
        timing: "Between meals for discomfort, after meals for digestion",
        reason: "Relaxes digestive muscles and reduces gas and bloating",
        duration: "2-4 weeks",
      },
    ],
    lifestyleTips: [
      "Eat slowly and chew thoroughly - digestion starts in the mouth",
      "Avoid drinking large amounts of liquid with meals",
      "Take a 10-minute walk after meals to aid digestion",
    ],
  },
  anxiety: {
    summary: "Your anxiety protocol focuses on nervous system support and stress resilience.",
    recommendations: [
      {
        herb: "Ashwagandha",
        botanicalName: "Withania somnifera",
        dosage: "300-500mg standardized extract",
        timing: "Morning and/or early afternoon",
        reason: "Adaptogen that helps regulate cortisol and build stress resilience over time",
        duration: "8-12 weeks for full benefits",
      },
      {
        herb: "L-Theanine",
        botanicalName: "From Camellia sinensis",
        dosage: "200mg",
        timing: "As needed for acute anxiety, or daily for maintenance",
        reason: "Promotes calm alertness and alpha brain waves without sedation",
        duration: "Safe for ongoing use",
      },
    ],
    lifestyleTips: [
      "Practice 4-7-8 breathing: inhale 4 counts, hold 7, exhale 8",
      "Limit caffeine, especially after noon",
      "Regular movement helps metabolize stress hormones",
    ],
  },
  energy: {
    summary: "Your energy protocol addresses fatigue from multiple angles - adrenal support, cellular energy, and sustainable vitality.",
    recommendations: [
      {
        herb: "Rhodiola",
        botanicalName: "Rhodiola rosea",
        dosage: "200-400mg standardized extract",
        timing: "Morning, before breakfast",
        reason: "Adaptogen that enhances mental and physical energy without the crash",
        duration: "6-8 weeks, then take 1 week break",
      },
      {
        herb: "B-Complex",
        botanicalName: "Various B vitamins",
        dosage: "1 capsule containing B1, B2, B3, B5, B6, B12, Folate",
        timing: "Morning with food",
        reason: "Essential for cellular energy production (ATP)",
        duration: "Ongoing",
      },
    ],
    lifestyleTips: [
      "Prioritize protein at breakfast to stabilize blood sugar",
      "Get morning sunlight within 30 min of waking",
      "Consider a 20-min afternoon rest (not too late)",
    ],
  },
  pain: {
    summary: "Your pain protocol combines natural anti-inflammatories with support for tissue healing.",
    recommendations: [
      {
        herb: "Turmeric/Curcumin",
        botanicalName: "Curcuma longa",
        dosage: "500-1000mg curcumin with piperine/black pepper",
        timing: "With meals, divided doses",
        reason: "Powerful anti-inflammatory that works on multiple pathways",
        duration: "4-8 weeks to assess, safe for ongoing use",
      },
      {
        herb: "Boswellia",
        botanicalName: "Boswellia serrata",
        dosage: "300-500mg standardized extract",
        timing: "2-3 times daily with food",
        reason: "Reduces inflammation particularly effective for joint pain",
        duration: "4-8 weeks",
      },
    ],
    lifestyleTips: [
      "Apply heat or cold depending on pain type (cold for acute, heat for chronic)",
      "Gentle movement often helps more than complete rest",
      "Anti-inflammatory diet: reduce sugar, processed foods, excess omega-6",
    ],
  },
  immune: {
    summary: "Your immune protocol supports your body's natural defenses and recovery.",
    recommendations: [
      {
        herb: "Elderberry",
        botanicalName: "Sambucus nigra",
        dosage: "500-1000mg extract daily, or 1 tbsp syrup",
        timing: "Daily for prevention, 3-4x daily when sick",
        reason: "Antiviral properties and rich in immune-supporting antioxidants",
        duration: "During illness + 1 week after",
      },
      {
        herb: "Vitamin C + Zinc",
        botanicalName: "Ascorbic acid + Zn",
        dosage: "1000mg Vitamin C + 15-30mg Zinc",
        timing: "With food, divided doses",
        reason: "Essential nutrients for immune cell function",
        duration: "During illness, reduce to maintenance after",
      },
    ],
    lifestyleTips: [
      "Rest is medicine - your body heals during sleep",
      "Stay well hydrated with water, broth, and herbal teas",
      "Reduce sugar intake - it suppresses immune function",
    ],
  },
};

// Default protocol for unrecognized symptoms
const DEFAULT_PROTOCOL = {
  summary: "This general wellness protocol supports your body's natural balance and resilience.",
  recommendations: [
    {
      herb: "Ashwagandha",
      botanicalName: "Withania somnifera",
      dosage: "300mg standardized extract",
      timing: "Morning and evening",
      reason: "Adaptogen that helps the body handle stress and supports overall vitality",
      duration: "8-12 weeks",
    },
  ],
  lifestyleTips: [
    "Prioritize 7-9 hours of sleep",
    "Include movement you enjoy daily",
    "Stay hydrated throughout the day",
  ],
};

/**
 * Determine protocol size based on conversation complexity
 */
function determineProtocolSize(state: ConsultationState): ProtocolSize {
  const userMessages = state.messages.filter(m => m.role === 'user');
  const totalUserWords = userMessages.reduce((acc, m) => acc + m.content.split(' ').length, 0);
  
  // Simple heuristic: more words = more complex situation
  if (totalUserWords < 30) return 'light';
  if (totalUserWords < 80) return 'medium';
  return 'full';
}

/**
 * Extract primary concern from conversation
 */
function extractPrimaryConcern(state: ConsultationState): string {
  const firstUserMessage = state.messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'General wellness';
  
  const category = detectSymptomCategory(firstUserMessage.content);
  
  const categoryNames: Record<string, string> = {
    sleep: 'Sleep Support',
    digestive: 'Digestive Health',
    anxiety: 'Stress & Anxiety',
    energy: 'Energy & Fatigue',
    pain: 'Pain & Inflammation',
    immune: 'Immune Support',
  };
  
  return category ? categoryNames[category] : 'General Wellness';
}

/**
 * Generate a unique protocol ID
 */
function generateProtocolId(): string {
  return `protocol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a protocol based on the consultation conversation
 */
export function generateProtocol(state: ConsultationState): LegacyGeneratedProtocol {
  const firstUserMessage = state.messages.find(m => m.role === 'user');
  const category = firstUserMessage ? detectSymptomCategory(firstUserMessage.content) : null;
  
  const template = category && PROTOCOL_TEMPLATES[category] 
    ? PROTOCOL_TEMPLATES[category] 
    : DEFAULT_PROTOCOL;
  
  const size = determineProtocolSize(state);
  const primaryConcern = extractPrimaryConcern(state);
  
  // For light protocols, only include first recommendation
  const recommendations = size === 'light' 
    ? template.recommendations.slice(0, 1)
    : template.recommendations;
  
  // For light protocols, fewer lifestyle tips
  const lifestyleTips = size === 'light'
    ? template.lifestyleTips.slice(0, 1)
    : template.lifestyleTips;
  
  return {
    id: generateProtocolId(),
    size,
    summary: template.summary,
    primaryConcern,
    recommendations,
    lifestyleTips,
    warnings: [
      "This protocol is for educational purposes only and is not medical advice.",
      "Consult with a healthcare provider before starting any new supplement.",
      "If you take medications, check for interactions before use.",
    ],
    createdAt: new Date().toISOString(),
  };
}
