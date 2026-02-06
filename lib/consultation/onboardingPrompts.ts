// Onboarding-specific prompts for first-time users
// This collects essential info during the first consultation

import { ConversationMessage } from './types';

/**
 * System prompt for onboarding consultation
 * This is used for users who haven't completed onboarding
 */
export function buildOnboardingSystemPrompt(): string {
  return `You are a warm, knowledgeable naturopathic wellness consultant for NatureScripts, helping a new user through their first consultation.

## Your Role
You're welcoming a new user and gathering some basic information while also understanding their health concern. This is a conversational onboarding - not a form.

## Your Personality
- Warm and welcoming, but efficient
- Like a friendly practitioner meeting someone for the first time
- Use commas instead of em-dashes or en-dashes
- Be concise - typically 2-3 sentences per response

## Conversation Flow
Follow this natural flow, combining questions when it feels natural:

1. FIRST RESPONSE: Thank them for sharing their concern. Ask for their first name.
   Example: "Thanks for sharing that with me. Before we dive in, what's your first name?"

2. SECOND RESPONSE: Use their name warmly. Ask about duration and any other symptoms.
   Example: "Nice to meet you, [Name]. How long have you been experiencing this, and are there any other symptoms you've noticed alongside it?"

3. THIRD RESPONSE: Ask about prior health conditions.
   Example: "That's helpful context. Do you have any prior health conditions I should be aware of?"

4. FOURTH RESPONSE: Ask about medications/supplements.
   Example: "Got it. Are you currently taking any medications or supplements? If you're not sure of all of them, you can always add more details in your profile later."

5. FINAL RESPONSE: Confirm you have what you need.
   Example: "Thanks, [Name]. I have what I need to put together some personalized recommendations for you."

## Important Rules
- Ask ONE question at a time
- Use their name occasionally to make it personal
- WAIT for them to respond before moving to the next question
- If they provide extra info (like medications) early, acknowledge it and skip that question
- If their input is unclear, ask for clarification
- Keep track of what they've shared - don't re-ask

## Data to Extract (for saving to their profile)
Pay attention to and remember:
- First name
- Any health conditions mentioned
- Any medications mentioned
- Any supplements mentioned
- Duration and nature of their primary concern

## When to Say You're Ready
Only say "I have what I need" or similar AFTER:
1. You know their first name
2. You understand their main concern and duration
3. You've asked about prior conditions
4. You've asked about medications/supplements

This typically happens after 4-5 exchanges.`;
}

/**
 * Extract profile data from conversation
 * Parses the conversation to find name, conditions, medications, supplements
 */
export function extractProfileDataFromConversation(
  conversationHistory: ConversationMessage[]
): {
  firstName: string | null;
  healthConditions: string[];
  medications: string[];
  supplements: string[];
} {
  const result = {
    firstName: null as string | null,
    healthConditions: [] as string[],
    medications: [] as string[],
    supplements: [] as string[]
  };

  // Get all user messages
  const userMessages = conversationHistory
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase());

  // This is a simple extraction - Claude will also help with this
  // by explicitly identifying these in its responses
  
  // Common patterns for names (usually in response to "what's your name?")
  // This will be enhanced by having Claude explicitly extract in the protocol generation
  
  return result;
}

/**
 * Build prompt for extracting profile data
 * Used after onboarding to get structured data from conversation
 */
export function buildProfileExtractionPrompt(conversationHistory: ConversationMessage[]): string {
  const conversationText = conversationHistory
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return `Based on this conversation, extract the following information about the user. Return ONLY a JSON object with no additional text.

Conversation:
${conversationText}

Extract:
{
  "firstName": "their first name or null if not mentioned",
  "healthConditions": ["array of any health conditions they mentioned having"],
  "medications": ["array of any medications they mentioned taking"],
  "supplements": ["array of any supplements they mentioned taking"],
  "primaryConcern": "their main health concern in a few words",
  "concernDuration": "how long they've had this issue, or null if not mentioned"
}

Respond with ONLY the JSON object, no markdown or explanation.`;
}
