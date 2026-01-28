import { ConsultationState, ConversationMessage } from './types';
import { getNextQuestion, hasEnoughInfo, getReadyMessage, detectSymptomCategory } from './questionFlow';

/**
 * Simulate AI response delay (feels more natural)
 */
export function getResponseDelay(): number {
  return 1000 + Math.random() * 1000; // 1-2 seconds
}

/**
 * Get the first follow-up question based on initial user input
 */
export function getFirstQuestion(userInput: string): string {
  const category = detectSymptomCategory(userInput);
  
  // Category-specific first questions that feel natural
  const firstQuestions: Record<string, string> = {
    sleep: "Thanks for sharing that. Is it more trouble falling asleep, staying asleep, or both? And how long has this been going on?",
    digestive: "I'd like to help with that. When do you notice the discomfort most - before eating, right after meals, or later in the day?",
    anxiety: "I understand, that can be really challenging. Does the anxiety feel constant throughout the day, or does it come in waves? Are there specific triggers you've noticed?",
    energy: "Let's figure this out together. Is the fatigue constant, or do you notice it's worse at certain times of day? How's your sleep been?",
    pain: "I'm sorry you're dealing with that. Can you tell me more about where the pain is located and whether it's constant or comes and goes?",
    immune: "Let's get you feeling better. How long have you been experiencing these symptoms, and have you noticed anything that makes them better or worse?",
  };
  
  if (category && firstQuestions[category]) {
    return firstQuestions[category];
  }
  
  // Generic first question
  return "Thanks for sharing. Can you tell me a bit more about when this started and how it's been affecting your day-to-day life?";
}

/**
 * Generate mock AI response based on conversation state
 */
export function generateMockResponse(state: ConsultationState): {
  message: string;
  isReadyToGenerate: boolean;
} {
  // Check if we have enough info (2+ exchanges)
  if (hasEnoughInfo(state)) {
    return {
      message: getReadyMessage(state),
      isReadyToGenerate: true,
    };
  }
  
  // Get next question
  const nextQuestion = getNextQuestion(state);
  
  if (nextQuestion) {
    return {
      message: nextQuestion,
      isReadyToGenerate: false,
    };
  }
  
  // Fallback
  return {
    message: getReadyMessage(state),
    isReadyToGenerate: true,
  };
}

/**
 * Create a new message object
 */
export function createMessage(role: 'user' | 'assistant', content: string): ConversationMessage {
  return {
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}
