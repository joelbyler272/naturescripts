import { ConversationMessage, ConsultationState } from './types';

// Symptom categories and their follow-up questions
const SYMPTOM_CATEGORIES = {
  sleep: {
    keywords: ['sleep', 'insomnia', 'tired', 'wake up', 'rest', 'fatigue', 'exhausted'],
    questions: [
      "Is it more trouble falling asleep, or do you wake up during the night?",
      "How long has this been going on, and do you notice any patterns (stress, screens, caffeine)?",
    ],
  },
  digestive: {
    keywords: ['digest', 'bloat', 'stomach', 'gut', 'constipat', 'diarrhea', 'nausea', 'acid', 'reflux', 'gas'],
    questions: [
      "When do you notice these symptoms most - before meals, after eating, or throughout the day?",
      "Are there specific foods that seem to trigger it, or any changes in your diet recently?",
    ],
  },
  anxiety: {
    keywords: ['anxiety', 'anxious', 'stress', 'worry', 'panic', 'nervous', 'overwhelm', 'racing thoughts'],
    questions: [
      "Is this something you experience constantly, or does it come in waves? Any specific triggers?",
      "How is your sleep and energy level? These often connect to anxiety.",
    ],
  },
  energy: {
    keywords: ['energy', 'fatigue', 'tired', 'exhausted', 'sluggish', 'motivation', 'brain fog'],
    questions: [
      "Is the fatigue constant, or worse at certain times of day? How's your sleep quality?",
      "Any other symptoms alongside the fatigue - digestive issues, mood changes, or pain?",
    ],
  },
  pain: {
    keywords: ['pain', 'ache', 'sore', 'inflammation', 'joint', 'muscle', 'headache', 'migraine'],
    questions: [
      "Where exactly is the pain, and is it constant or does it come and go?",
      "How long have you had this, and have you noticed what makes it better or worse?",
    ],
  },
  immune: {
    keywords: ['cold', 'flu', 'sick', 'immune', 'infection', 'fever', 'throat', 'cough'],
    questions: [
      "How long have you had these symptoms? Is this a recurring issue or something new?",
      "Any other symptoms like fatigue, body aches, or changes in appetite?",
    ],
  },
};

const GENERAL_QUESTIONS = [
  "Can you tell me more about when this started and how it's affecting your daily life?",
  "Are there any other symptoms you're experiencing alongside this?",
  "Have you tried anything for this before, or are you currently taking any medications or supplements?",
];

/**
 * Detect the primary symptom category from user input
 */
export function detectSymptomCategory(input: string): string | null {
  const lowerInput = input.toLowerCase();
  
  for (const [category, data] of Object.entries(SYMPTOM_CATEGORIES)) {
    if (data.keywords.some(keyword => lowerInput.includes(keyword))) {
      return category;
    }
  }
  
  return null;
}

/**
 * Get the next question based on conversation state
 */
export function getNextQuestion(state: ConsultationState): string | null {
  const { messages, questionCount } = state;
  
  // Already asked enough questions
  if (questionCount >= 2) {
    return null;
  }
  
  // Get the initial user message to detect category
  const initialMessage = messages.find(m => m.role === 'user');
  if (!initialMessage) return GENERAL_QUESTIONS[0];
  
  const category = detectSymptomCategory(initialMessage.content);
  
  if (category && SYMPTOM_CATEGORIES[category as keyof typeof SYMPTOM_CATEGORIES]) {
    const categoryQuestions = SYMPTOM_CATEGORIES[category as keyof typeof SYMPTOM_CATEGORIES].questions;
    return categoryQuestions[questionCount] || GENERAL_QUESTIONS[questionCount];
  }
  
  return GENERAL_QUESTIONS[questionCount];
}

/**
 * Check if we have enough information to generate a protocol
 */
export function hasEnoughInfo(state: ConsultationState): boolean {
  return state.questionCount >= 2;
}

/**
 * Generate the "ready to create protocol" message
 */
export function getReadyMessage(state: ConsultationState): string {
  const category = state.messages.find(m => m.role === 'user')
    ? detectSymptomCategory(state.messages.find(m => m.role === 'user')!.content)
    : null;
    
  const categoryMessages: Record<string, string> = {
    sleep: "Based on what you've shared about your sleep challenges, I have a good understanding of what might help.",
    digestive: "Thank you for those details about your digestive symptoms. I can see a clear picture now.",
    anxiety: "I appreciate you sharing about your anxiety. This gives me what I need to help.",
    energy: "Thank you for explaining your fatigue patterns. I have a good sense of what's going on.",
    pain: "I understand your pain situation better now. Let me put together some recommendations.",
    immune: "Thanks for those details. I can create a targeted protocol for immune support.",
  };
  
  const intro = category && categoryMessages[category] 
    ? categoryMessages[category]
    : "Thank you for sharing those details. I have a good understanding of your situation.";
    
  return `${intro}\n\nI'm ready to create your personalized protocol. This will include specific herb recommendations with dosages, timing, and why each one may help you.`;
}
