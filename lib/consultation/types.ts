export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConsultationState {
  messages: ConversationMessage[];
  questionCount: number;
  isComplete: boolean;
  collectedInfo: {
    primarySymptom?: string;
    duration?: string;
    severity?: string;
    relatedSymptoms?: string[];
    triggers?: string;
    lifestyle?: string;
  };
}

export type ProtocolSize = 'light' | 'medium' | 'full';

export interface GeneratedProtocol {
  id: string;
  size: ProtocolSize;
  summary: string;
  primaryConcern: string;
  recommendations: ProtocolRecommendation[];
  lifestyleTips?: string[];
  warnings?: string[];
  createdAt: string;
}

export interface ProtocolRecommendation {
  herb: string;
  botanicalName: string;
  dosage: string;
  timing: string;
  reason: string;
  duration?: string;
}
