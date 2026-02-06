// Onboarding-specific prompts for first-time users
// This collects essential info during the first consultation WITHOUT requiring signup first

import { ConversationMessage } from './types';

/**
 * System prompt for onboarding consultation
 * This is used for users who haven't completed onboarding (first-time visitors)
 * Collects: name, concern details, conditions, medications, email
 */
export function buildOnboardingSystemPrompt(): string {
  return `You are a warm, knowledgeable naturopathic wellness consultant for NatureScripts, helping a new visitor through their first consultation.

## Your Role
You're welcoming someone new and gathering information to create their personalized health protocol. This is a conversational onboarding - not a form. They don't have an account yet.

## Your Personality
- Warm and welcoming, but efficient
- Like a friendly practitioner meeting someone for the first time
- Use commas instead of em-dashes or en-dashes
- Be concise - typically 2-3 sentences per response
- Never start with "I'm sorry to hear that" or similar

## Conversation Flow
Follow this natural flow, asking ONE question at a time:

1. FIRST RESPONSE: Thank them for sharing their concern. Ask for their first name.
   Example: "I'd love to help with that. Before we dive in, what's your first name?"

2. SECOND RESPONSE: Use their name warmly. Ask about duration and any other symptoms.
   Example: "Nice to meet you, [Name]. How long have you been experiencing this, and when did it start? Are there any other symptoms you've noticed alongside it?"

3. THIRD RESPONSE: Ask about prior health conditions (with escape hatch).
   Example: "That context helps. Do you have any prior health conditions I should know about? (If you're not sure, you can always add these later in your profile.)"

4. FOURTH RESPONSE: Ask about medications/supplements (with escape hatch).
   Example: "Got it. Are you currently taking any medications or supplements? (If you're not sure, you can always add these later in your profile.)"

5. FIFTH RESPONSE: Ask for their email so you can send the protocol.
   Example: "Perfect! And before I create your protocol, what's your email so I can send it to you?"

6. FINAL RESPONSE: Confirm you have what you need.
   Example: "Thanks, [Name]. I have what I need to create your personalized protocol..."

## Important Rules
- Ask ONE question at a time - never combine multiple questions
- Use their name occasionally to make it personal (but not every message)
- WAIT for them to respond before moving to the next question
- If they provide extra info early, acknowledge it and adjust (don't re-ask)
- If input is unclear, ask for clarification politely
- Keep track of what they've shared

## Handling Edge Cases
- If they say "skip" or "I'll add later" for conditions/medications, accept it gracefully
- If the email looks invalid, politely ask them to double-check it
- If they seem hesitant about email, reassure them: "I'll only use this to send your protocol and you can set up your account."

## Data to Remember (for saving to their profile)
- First name
- Primary concern and duration
- Other symptoms mentioned
- Health conditions (or "none mentioned")
- Medications (or "none mentioned")  
- Supplements (or "none mentioned")
- Email address

## When to Say You're Ready
Only say "I have what I need" AFTER you have:
1. Their first name
2. Their concern, duration, and any other symptoms
3. Asked about prior conditions (even if they said none)
4. Asked about medications/supplements (even if they said none)
5. Their email address

This typically happens after 5-6 exchanges.`;
}

/**
 * System prompt for extracting structured data from onboarding conversation
 * Used after conversation to pull out profile data for saving
 */
export function buildProfileExtractionPrompt(conversationHistory: ConversationMessage[]): string {
  const conversationText = conversationHistory
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return `Based on this conversation, extract the user's information. Return ONLY a valid JSON object with no additional text or markdown.

Conversation:
${conversationText}

Extract this structure:
{
  "firstName": "their first name or null",
  "email": "their email address or null",
  "primaryConcern": "main health concern in a few words",
  "concernDuration": "how long they've had this issue or null",
  "otherSymptoms": ["array of other symptoms mentioned"],
  "healthConditions": ["array of health conditions, empty if none mentioned"],
  "medications": ["array of medications, empty if none mentioned"],
  "supplements": ["array of supplements, empty if none mentioned"]
}

Rules:
- Use null for missing/unknown values, not empty strings
- Use empty arrays [] for lists with no items
- Extract exact names for medications/supplements when possible
- Be conservative - only include what was clearly stated

Respond with ONLY the JSON object.`;
}

/**
 * Check if the conversation has collected all required onboarding data
 */
export function hasCollectedRequiredData(conversationHistory: ConversationMessage[]): {
  hasName: boolean;
  hasConcernDetails: boolean;
  hasAskedConditions: boolean;
  hasAskedMedications: boolean;
  hasEmail: boolean;
  isComplete: boolean;
} {
  const assistantMessages = conversationHistory
    .filter(m => m.role === 'assistant')
    .map(m => m.content.toLowerCase());
  
  const userMessages = conversationHistory
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase());

  // Check what's been asked/collected
  const hasAskedName = assistantMessages.some(m => 
    m.includes('first name') || m.includes('your name')
  );
  const hasName = hasAskedName && userMessages.length >= 2;

  const hasAskedDuration = assistantMessages.some(m =>
    m.includes('how long') || m.includes('when did')
  );
  const hasConcernDetails = hasAskedDuration && userMessages.length >= 3;

  const hasAskedConditions = assistantMessages.some(m =>
    m.includes('health condition') || m.includes('prior condition')
  );

  const hasAskedMedications = assistantMessages.some(m =>
    m.includes('medication') || m.includes('supplement')
  );

  const hasAskedEmail = assistantMessages.some(m =>
    m.includes('email')
  );
  
  // Check for email pattern in user messages
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const hasEmail = userMessages.some(m => emailPattern.test(m));

  const isComplete = hasName && hasConcernDetails && hasAskedConditions && hasAskedMedications && hasEmail;

  return {
    hasName,
    hasConcernDetails,
    hasAskedConditions,
    hasAskedMedications,
    hasEmail,
    isComplete
  };
}

/**
 * Extract email from conversation
 */
export function extractEmailFromConversation(conversationHistory: ConversationMessage[]): string | null {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  
  // Search user messages for email
  for (const msg of conversationHistory) {
    if (msg.role === 'user') {
      const match = msg.content.match(emailPattern);
      if (match) {
        return match[0].toLowerCase();
      }
    }
  }
  
  return null;
}

/**
 * Extract first name from conversation
 */
export function extractNameFromConversation(conversationHistory: ConversationMessage[]): string | null {
  // The name is typically in the second user message (after they share their concern)
  const userMessages = conversationHistory.filter(m => m.role === 'user');
  
  if (userMessages.length >= 2) {
    // Second message is usually just their name
    const nameResponse = userMessages[1].content.trim();
    
    // If it's short (likely just a name), use it
    if (nameResponse.length < 30 && !nameResponse.includes(' ') || nameResponse.split(' ').length <= 3) {
      // Take first word if multiple words, capitalize properly
      const firstName = nameResponse.split(' ')[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    }
  }
  
  return null;
}

/**
 * Legacy function for backwards compatibility
 */
export function extractProfileDataFromConversation(
  conversationHistory: ConversationMessage[]
): {
  firstName: string | null;
  healthConditions: string[];
  medications: string[];
  supplements: string[];
} {
  return {
    firstName: extractNameFromConversation(conversationHistory),
    healthConditions: [],
    medications: [],
    supplements: []
  };
}
