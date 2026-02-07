// Consultation Types for Claude AI Integration

export interface HealthContext {
  health_conditions: string[];
  medications: Medication[];
  supplements: Supplement[];
  health_notes: string;
  tier: 'free' | 'pro';
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface Supplement {
  name: string;
  dosage: string;
  frequency: string;
}

export interface ConsultationHistory {
  id: string;
  initial_input: string;
  protocol_summary?: string;
  recommendations?: RecommendationSummary[];
  created_at: string;
}

export interface RecommendationSummary {
  name: string;
  type: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConsultationState {
  messages: ConversationMessage[];
  exchangeCount: number;
  questionCount: number;
  isReadyToGenerate: boolean;
  category?: string;
}

// Legacy template-based protocol types (used by generateProtocol.ts fallback)

export type ProtocolSize = 'light' | 'medium' | 'full';

export interface ProtocolRecommendation {
  herb: string;
  botanicalName: string;
  dosage: string;
  timing: string;
  reason: string;
  duration: string;
}

// Legacy protocol shape (returned by template-based generateProtocol fallback)
export interface LegacyGeneratedProtocol {
  id: string;
  size: ProtocolSize;
  summary: string;
  primaryConcern: string;
  recommendations: ProtocolRecommendation[];
  lifestyleTips: string[];
  warnings: string[];
  createdAt: string;
}

// Protocol Types

export interface GeneratedProtocol {
  id?: string;
  title?: string; // 1-4 word title like "Sleep Support" or "Knee Pain Relief"
  summary: string;
  recommendations: Recommendation[];
  dietary_shifts?: DietaryShift[];
  lifestyle_practices?: LifestylePractice[];
  tracking_suggestions?: TrackingSuggestion[];
  disclaimer: string;
  created_at?: string;
}

export interface Recommendation {
  id?: string;
  name: string;
  type: 'herb' | 'vitamin' | 'mineral' | 'supplement' | 'essential_oil' | 'other';
  dosage: string;
  timing: string;
  rationale: string;
  cautions?: string;
  products: ProductLink[];
}

export interface ProductLink {
  name: string;
  brand: string;
  url?: string;
  price?: string;
  source: 'amazon' | 'iherb' | 'other';
}

export interface DietaryShift {
  id?: string;
  action: 'add' | 'reduce' | 'avoid';
  item: string;
  rationale: string;
}

export interface LifestylePractice {
  id?: string;
  practice: string;
  timing?: string;
  rationale: string;
}

export interface TrackingSuggestion {
  id?: string;
  metric: string;
  frequency: 'daily' | 'weekly';
  description: string;
}

// API Request/Response Types

export interface ChatRequest {
  message: string;
  conversationHistory: ConversationMessage[];
  consultationId?: string;
}

export interface ChatResponse {
  message: string;
  isReadyToGenerate: boolean;
  exchangeCount: number;
}

export interface GenerateProtocolRequest {
  conversationHistory: ConversationMessage[];
  consultationId: string;
}

export interface GenerateProtocolResponse {
  protocol: GeneratedProtocol;
  consultationId: string;
}
