// Anthropic Claude API Client

import Anthropic from '@anthropic-ai/sdk';

// Initialize the client (uses ANTHROPIC_API_KEY env var automatically)
const anthropic = new Anthropic();

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeChatOptions {
  systemPrompt: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface ClaudeResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    model: string;
  };
}

async function callClaude(
  options: ClaudeChatOptions,
  defaults: { maxTokens: number; temperature: number }
): Promise<ClaudeResponse> {
  const {
    systemPrompt,
    messages,
    maxTokens = defaults.maxTokens,
    temperature = defaults.temperature,
  } = options;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return {
      content: textContent.text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        model: MODEL,
      }
    };
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.error('Claude API error:', { message: err.message, status: err.status });
    throw error;
  }
}

/**
 * Send a chat message to Claude and get a response with usage info
 */
export async function chatWithClaude(options: ClaudeChatOptions): Promise<ClaudeResponse> {
  return callClaude(options, { maxTokens: 1024, temperature: 0.7 });
}

/**
 * Generate a protocol using Claude (expects JSON response)
 */
export async function generateProtocolWithClaude(options: ClaudeChatOptions): Promise<ClaudeResponse> {
  return callClaude(options, { maxTokens: 2048, temperature: 0.3 });
}
