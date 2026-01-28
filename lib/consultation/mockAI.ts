import { ConsultationState, ConversationMessage } from './types';
import { getNextQuestion, hasEnoughInfo, getReadyMessage } from './questionFlow';

/**
 * Simulate AI response delay (feels more natural)
 */
export function getResponseDelay(): number {
  return 1000 + Math.random() * 1000; // 1-2 seconds
}

/**
 * Generate the initial greeting when consultation starts
 */
export function getInitialGreeting(prefilledSymptom?: string): string {
  if (prefilledSymptom) {
    return `I see you're dealing with ${prefilledSymptom.toLowerCase().includes('i ') ? prefilledSymptom.slice(2) : prefilledSymptom}. I'd like to ask a couple of questions to make sure I give you the most helpful recommendations.`;
  }
  
  return "Hello! I'm here to help you create a personalized natural health protocol. What's been bothering you lately, or what would you like support with?";
}

/**
 * Generate mock AI response based on conversation state
 */
export function generateMockResponse(state: ConsultationState): {
  message: string;
  isReadyToGenerate: boolean;
} {
  // Check if we have enough info
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
