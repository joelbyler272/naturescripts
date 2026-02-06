// Anthropic Claude API Client

import Anthropic from '@anthropic-ai/sdk';

// Initialize the client (uses ANTHROPIC_API_KEY env var automatically)
const anthropic = new Anthropic();

const MODEL = 'claude-sonnet-4-20250514';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeChatOptions {
  systemPrompt: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
}

export interface ClaudeResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    model: string;
  };
}

/**
 * Send a chat message to Claude and get a response with usage info
 */
export async function chatWithClaude(options: ClaudeChatOptions): Promise<ClaudeResponse> {
  const { systemPrompt, messages, maxTokens = 1024 } = options;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    // Extract text from response
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
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

/**
 * Generate a protocol using Claude (expects JSON response)
 */
export async function generateProtocolWithClaude(options: ClaudeChatOptions): Promise<ClaudeResponse> {
  const { systemPrompt, messages, maxTokens = 2048 } = options;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    // Extract text from response
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
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}
