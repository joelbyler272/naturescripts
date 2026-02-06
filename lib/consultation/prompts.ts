// Claude AI Prompts for NatureScripts Consultations

import { HealthContext, ConsultationHistory, ConversationMessage } from './types';

/**
 * System prompt for consultation chat
 */
export function buildChatSystemPrompt(
  tier: 'free' | 'pro',
  healthContext: HealthContext,
  consultationHistory?: ConsultationHistory[]
): string {
  const basePrompt = `You are a knowledgeable naturopathic wellness consultant for NatureScripts. Your role is to gather information about the user's health concern and prepare to recommend natural remedies.

## Your Personality
- Warm but direct, not overly empathetic
- Like a knowledgeable practitioner who respects the user's time
- Use commas instead of em-dashes or en-dashes
- Never start with "I'm sorry to hear that" or similar phrases
- Be concise and helpful

## User's Health Profile
${formatHealthContext(healthContext)}

## Conversation Guidelines
${tier === 'free' ? FREE_TIER_GUIDELINES : PRO_TIER_GUIDELINES}

## Important Rules
1. Focus on gathering information about their PRIMARY symptoms and duration
2. Ask ONE clear question at a time
3. When you have enough information, indicate you're ready to generate their protocol
4. Never diagnose conditions or replace medical advice
5. If symptoms sound serious (chest pain, difficulty breathing, severe pain, etc.), recommend they consult a healthcare provider
6. Keep responses concise, typically 2-3 sentences`;

  if (tier === 'pro' && consultationHistory && consultationHistory.length > 0) {
    return basePrompt + `\n\n## User's Consultation History\n${formatConsultationHistory(consultationHistory)}`;
  }

  return basePrompt;
}

const FREE_TIER_GUIDELINES = `- This is a FREE tier consultation
- Limit to 1-2 exchanges total (the user's first message + 1 follow-up question)
- After 1 follow-up question, you should have enough info to generate a protocol
- End your second response with: "I have what I need to put together some recommendations for you."`;

const PRO_TIER_GUIDELINES = `- This is a PRO tier consultation
- You can have 1-4 exchanges based on what you need
- Adapt based on complexity, ask more questions if the situation warrants it
- Reference their history if relevant to their current concern
- When ready, say: "I have what I need to put together a comprehensive protocol for you."`;

/**
 * System prompt for protocol generation
 */
export function buildProtocolSystemPrompt(
  tier: 'free' | 'pro',
  healthContext: HealthContext
): string {
  return `You are a naturopathic wellness consultant generating a personalized protocol for NatureScripts.

## User's Health Profile
${formatHealthContext(healthContext)}

## Protocol Requirements for ${tier.toUpperCase()} Tier
${tier === 'free' ? FREE_PROTOCOL_REQUIREMENTS : PRO_PROTOCOL_REQUIREMENTS}

## Product Recommendations
For each remedy, suggest 2 specific products:
1. One from Amazon (use format: "Amazon: [Brand] [Product Name]")
2. One from iHerb (use format: "iHerb: [Brand] [Product Name]")

Choose reputable brands like: NOW Foods, Nature's Way, Gaia Herbs, Pure Encapsulations, Thorne, Garden of Life, Jarrow Formulas, Life Extension, Source Naturals, Herb Pharm.

## Output Format
Respond with a valid JSON object matching this structure:
{
  "summary": "2-3 sentence explanation of their situation and approach",
  "recommendations": [
    {
      "name": "Remedy name",
      "type": "herb|vitamin|mineral|supplement|essential_oil|other",
      "dosage": "Specific dosage (e.g., 400mg)",
      "timing": "When to take (e.g., 30 minutes before bed)",
      "rationale": "Why this helps their specific situation",
      "cautions": "Any relevant cautions or interactions",
      "products": [
        {"name": "Product Name", "brand": "Brand", "source": "amazon"},
        {"name": "Product Name", "brand": "Brand", "source": "iherb"}
      ]
    }
  ],
  ${tier === 'pro' ? PRO_PROTOCOL_JSON_FIELDS : ''}
  "disclaimer": "A brief, light-touch reminder to consult a healthcare provider if symptoms persist or worsen."
}`;
}

const FREE_PROTOCOL_REQUIREMENTS = `- Summary: 2-3 sentences explaining their situation
- Recommendations: 1-2 remedies (herbs, vitamins, minerals, supplements, etc.)
- Each recommendation needs: name, type, dosage, timing, rationale, products
- Include a light disclaimer`;

const PRO_PROTOCOL_REQUIREMENTS = `- Summary: 2-3 sentences explaining their situation with more depth
- Recommendations: 2-4 remedies with comprehensive information
- Dietary shifts: 2-3 foods to add, reduce, or avoid
- Lifestyle practices: 2-3 actionable practices
- Tracking suggestions: 1-2 metrics to monitor
- Include a light disclaimer`;

const PRO_PROTOCOL_JSON_FIELDS = `"dietary_shifts": [
    {"action": "add|reduce|avoid", "item": "Food item", "rationale": "Why"}
  ],
  "lifestyle_practices": [
    {"practice": "What to do", "timing": "When", "rationale": "Why"}
  ],
  "tracking_suggestions": [
    {"metric": "What to track", "frequency": "daily|weekly", "description": "How to track"}
  ],`;

/**
 * Format health context for the prompt
 */
function formatHealthContext(context: HealthContext): string {
  const parts: string[] = [];

  if (context.health_conditions && context.health_conditions.length > 0) {
    parts.push(`Health Conditions: ${context.health_conditions.join(', ')}`);
  }

  if (context.medications && context.medications.length > 0) {
    const meds = context.medications.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ');
    parts.push(`Current Medications: ${meds}`);
  }

  if (context.supplements && context.supplements.length > 0) {
    const supps = context.supplements.map(s => `${s.name} (${s.dosage}, ${s.frequency})`).join(', ');
    parts.push(`Current Supplements: ${supps}`);
  }

  if (context.health_notes) {
    parts.push(`Additional Notes: ${context.health_notes}`);
  }

  if (parts.length === 0) {
    return 'No health profile information provided.';
  }

  return parts.join('\n');
}

/**
 * Format consultation history for Pro users
 */
function formatConsultationHistory(history: ConsultationHistory[]): string {
  if (!history || history.length === 0) {
    return 'No previous consultations.';
  }

  return history.map((h, i) => {
    const recommendations = h.recommendations 
      ? h.recommendations.map(r => r.name).join(', ')
      : 'None recorded';
    return `${i + 1}. ${h.created_at}: "${h.initial_input}" → Recommended: ${recommendations}`;
  }).join('\n');
}

/**
 * Build the messages array for Claude API
 */
export function buildClaudeMessages(
  conversationHistory: ConversationMessage[],
  systemPrompt: string
): { role: 'user' | 'assistant'; content: string }[] {
  return conversationHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}
