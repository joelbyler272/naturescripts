export const CHAT_LIMITS = {
  MAX_MESSAGE_LENGTH: 5000,
  MAX_HISTORY_LENGTH: 30,
  VALID_ROLES: ['user', 'assistant'] as const,
} as const;

export function validateConversationMessage(
  msg: unknown
): msg is { role: 'user' | 'assistant'; content: string } {
  if (!msg || typeof msg !== 'object') return false;
  const m = msg as Record<string, unknown>;
  if (typeof m.role !== 'string') return false;
  if (!CHAT_LIMITS.VALID_ROLES.includes(m.role as (typeof CHAT_LIMITS.VALID_ROLES)[number])) return false;
  if (typeof m.content !== 'string') return false;
  if (m.content.length > CHAT_LIMITS.MAX_MESSAGE_LENGTH) return false;
  return true;
}

export function validateConversationHistory(
  history: unknown
): { role: 'user' | 'assistant'; content: string }[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(validateConversationMessage)
    .slice(0, CHAT_LIMITS.MAX_HISTORY_LENGTH);
}
