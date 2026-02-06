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
  isReadyToGenerate: boolean;
  category?: string;
}

// Protocol Types

export interface GeneratedProtocol {
  id: string;
  summary: string;
  recommendations: Recommendation[];
  dietary_shifts?: DietaryShift[];
  lifestyle_practices?: LifestylePractice[];
  tracking_suggestions?: TrackingSuggestion[];
  disclaimer: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
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
  url: string;
  price?: string;
  source: 'amazon' | 'iherb' | 'other';
}

export interface DietaryShift {
  id: string;
  action: 'add' | 'reduce' | 'avoid';
  item: string;
  rationale: string;
}

export interface LifestylePractice {
  id: string;
  practice: string;
  timing?: string;
  rationale: string;
}

export interface TrackingSuggestion {
  id: string;
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
