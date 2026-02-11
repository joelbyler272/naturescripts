// Onboarding State Machine
// Hardcoded questions with 2 strategic API calls to minimize costs
// Total cost target: ~$0.03 per onboarding

export type OnboardingStep = 
  | 'initial'           // User shares their concern
  | 'ask_name'          // Ask for first name
  | 'ask_duration'      // Ask how long + other symptoms
  | 'clarifying'        // ONE API call for a smart follow-up question
  | 'ask_conditions'    // Ask about prior health conditions
  | 'ask_medications'   // Ask about medications/supplements
  | 'ask_email'         // Ask for email
  | 'ready'             // Ready to generate protocol
  | 'complete';         // Protocol generated

export interface OnboardingState {
  step: OnboardingStep;
  firstName: string | null;
  primaryConcern: string | null;
  duration: string | null;
  otherSymptoms: string | null;
  clarifyingAnswer: string | null;
  healthConditions: string | null;
  medications: string | null;
  email: string | null;
}

export interface OnboardingTransition {
  message: string;           // User's message
  state: OnboardingState;    // Current state
}

export interface OnboardingResponse {
  reply: string;             // Bot's reply
  newState: OnboardingState; // Updated state
  needsApiCall: boolean;     // Whether this needs a Claude API call
  apiCallType?: 'clarifying' | 'protocol';
}

// Initial state
export function createInitialState(): OnboardingState {
  return {
    step: 'initial',
    firstName: null,
    primaryConcern: null,
    duration: null,
    otherSymptoms: null,
    clarifyingAnswer: null,
    healthConditions: null,
    medications: null,
    email: null,
  };
}

// Extract first name from response
function extractFirstName(message: string): string {
  const cleaned = message.trim();
  const prefixes = [/^my name is\s+/i, /^i'?m\s+/i, /^it'?s\s+/i, /^call me\s+/i, /^i am\s+/i];
  let name = cleaned;
  for (const prefix of prefixes) {
    name = name.replace(prefix, '');
  }
  const firstName = name.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
  if (!firstName) return 'Friend';
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

// Check if message contains an email
function extractEmail(message: string): string | null {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const match = message.match(emailPattern);
  return match ? match[0].toLowerCase() : null;
}

// Check for skip/none responses
function isSkipResponse(message: string): boolean {
  const skipPatterns = [
    /^(no|none|nope|nothing|n\/a|na|not really|don'?t have any|i don'?t|skip)$/i,
    /^(no,?\s)?(none|nothing|not really)/i,
    /don'?t (have|take|use) (any|none)/i,
    /^not? (that i know|sure|certain)/i,
  ];
  return skipPatterns.some(p => p.test(message.trim()));
}

// Main state machine transition function
export function processOnboardingMessage(
  { message, state }: OnboardingTransition
): OnboardingResponse {
  const msg = message.trim();
  
  switch (state.step) {
    case 'initial': {
      return {
        reply: "I'd love to help with that. Before we dive in, what's your first name?",
        newState: { ...state, step: 'ask_name', primaryConcern: msg },
        needsApiCall: false,
      };
    }
    
    case 'ask_name': {
      const firstName = extractFirstName(msg);
      return {
        reply: `Nice to meet you, ${firstName}! How long have you been dealing with this? And are there any other symptoms you've noticed alongside it?`,
        newState: { ...state, step: 'ask_duration', firstName },
        needsApiCall: false,
      };
    }
    
    case 'ask_duration': {
      // Store the full response as duration context — the clarifying question
      // API call will help tease out more specific details
      return {
        reply: '', // Will be replaced by API response
        newState: { ...state, step: 'clarifying', duration: msg },
        needsApiCall: true,
        apiCallType: 'clarifying',
      };
    }
    
    case 'clarifying': {
      return {
        reply: `That's really helpful to know, ${state.firstName}. Do you have any prior health conditions I should be aware of? (If you're not sure, you can always add these later in your profile.)`,
        newState: { ...state, step: 'ask_conditions', clarifyingAnswer: msg },
        needsApiCall: false,
      };
    }
    
    case 'ask_conditions': {
      const conditions = isSkipResponse(msg) ? 'None mentioned' : msg;
      return {
        reply: `Got it. Are you currently taking any medications or supplements? (If you're not sure, you can always add these later in your profile.)`,
        newState: { ...state, step: 'ask_medications', healthConditions: conditions },
        needsApiCall: false,
      };
    }
    
    case 'ask_medications': {
      const medications = isSkipResponse(msg) ? 'None mentioned' : msg;
      return {
        reply: `Perfect! What's your email so I can send your protocol to you?`,
        newState: { ...state, step: 'ask_email', medications },
        needsApiCall: false,
      };
    }
    
    case 'ask_email': {
      const email = extractEmail(msg);
      if (!email) {
        return {
          reply: `I didn't catch that. Could you please share your email address?`,
          newState: state,
          needsApiCall: false,
        };
      }
      return {
        reply: `Thanks, ${state.firstName}! I have everything I need to create your personalized protocol.`,
        newState: { ...state, step: 'ready', email },
        needsApiCall: false,
      };
    }
    
    case 'ready': {
      return {
        reply: `Click the button above to generate your protocol!`,
        newState: state,
        needsApiCall: false,
      };
    }
    
    case 'complete': {
      return {
        reply: `Your protocol has been created! Check your email to set your password and access it.`,
        newState: state,
        needsApiCall: false,
      };
    }
    
    default: {
      return {
        reply: `I'm not sure what happened. Let's start over - what health concern can I help you with today?`,
        newState: createInitialState(),
        needsApiCall: false,
      };
    }
  }
}

// Build prompt for the ONE clarifying question API call
export function buildClarifyingQuestionPrompt(state: OnboardingState): string {
  return `You are a naturopathic wellness consultant gathering information for a personalized health protocol.

The user's situation:
- Name: ${state.firstName}
- Primary concern: ${state.primaryConcern}
- Duration/symptoms: ${state.duration}

Your task: Ask ONE short, specific follow-up question that will help you create a better protocol. Focus on:
- Patterns (when does it happen? what makes it better/worse?)
- Related factors (diet, stress, sleep habits, lifestyle)
- Severity or frequency

Rules:
- Ask only ONE question
- Keep it conversational and warm
- Use their name once
- 1-2 sentences max
- Don't repeat what they already told you`;
}

// Build summary of collected data for protocol generation
export function buildProtocolContext(state: OnboardingState): string {
  return `User Profile for Protocol Generation:

Name: ${state.firstName || 'Unknown'}
Primary Concern: ${state.primaryConcern || 'Not specified'}
Duration & Other Symptoms: ${state.duration || 'Not specified'}
Additional Details: ${state.clarifyingAnswer || 'None provided'}
Health Conditions: ${state.healthConditions || 'None mentioned'}
Current Medications/Supplements: ${state.medications || 'None mentioned'}

Please generate a personalized natural health protocol addressing their ${state.primaryConcern || 'health concern'}.`;
}

// Validate if state is ready for protocol generation
export function isReadyForProtocol(state: OnboardingState): boolean {
  return state.step === 'ready' && state.firstName !== null && state.primaryConcern !== null && state.email !== null;
}

// Get collected profile data for saving
export function getProfileData(state: OnboardingState) {
  return {
    firstName: state.firstName || 'Friend',
    email: state.email || '',
    primaryConcern: state.primaryConcern || '',
    duration: state.duration || '',
    clarifyingAnswer: state.clarifyingAnswer || '',
    healthConditions: state.healthConditions === 'None mentioned' ? [] : [state.healthConditions || ''].filter(Boolean),
    medications: state.medications === 'None mentioned' ? [] : [state.medications || ''].filter(Boolean),
  };
}
