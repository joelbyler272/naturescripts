// Consultation Logger - Saves detailed logs and tracks API usage/costs
// Logs are saved to: /logs/consultations/YYYY-MM-DD.log

import fs from 'fs';
import path from 'path';

// Claude pricing (as of 2024) - Sonnet 3.5
const PRICING = {
  'claude-sonnet-4-20250514': {
    input: 3.00 / 1_000_000,  // $3 per 1M input tokens
    output: 15.00 / 1_000_000, // $15 per 1M output tokens
  }
};

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  model: string;
}

export interface LogEntry {
  timestamp: string;
  type: 'chat' | 'protocol';
  userId: string;
  consultationId?: string;
  tier: string;
  request: {
    systemPrompt: string;
    messages: { role: string; content: string }[];
    healthContext?: unknown;
  };
  response: {
    content: string;
    usage?: TokenUsage;
    cost?: {
      input: number;
      output: number;
      total: number;
    };
  };
  duration: number;
  error?: string;
}

// Daily usage tracker (in-memory, resets on server restart)
// For production, you'd want to store this in a database
const dailyUsage = {
  date: new Date().toISOString().split('T')[0],
  totalInputTokens: 0,
  totalOutputTokens: 0,
  totalCost: 0,
  requestCount: 0,
};

function getLogDir(): string {
  const logDir = path.join(process.cwd(), 'logs', 'consultations');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
}

function getLogFilePath(): string {
  const date = new Date().toISOString().split('T')[0];
  return path.join(getLogDir(), `${date}.log`);
}

function getSummaryFilePath(): string {
  return path.join(getLogDir(), 'usage-summary.json');
}

export function calculateCost(usage: TokenUsage): { input: number; output: number; total: number } {
  const pricing = PRICING[usage.model as keyof typeof PRICING] || PRICING['claude-sonnet-4-20250514'];
  const inputCost = usage.inputTokens * pricing.input;
  const outputCost = usage.outputTokens * pricing.output;
  return {
    input: inputCost,
    output: outputCost,
    total: inputCost + outputCost,
  };
}

export function logConsultation(entry: LogEntry): void {
  if (process.env.NODE_ENV !== 'development') return;

  const logPath = getLogFilePath();
  
  // Format the log entry
  const separator = '='.repeat(80);
  const logLines = [
    '',
    separator,
    `[${entry.timestamp}] ${entry.type.toUpperCase()} - User: ${entry.userId.substring(0, 8)}...`,
    separator,
    '',
    `Consultation ID: ${entry.consultationId || 'N/A'}`,
    `Tier: ${entry.tier}`,
    `Duration: ${entry.duration}ms`,
    '',
    '--- SYSTEM PROMPT ---',
    entry.request.systemPrompt,
    '',
    '--- CONVERSATION SENT TO CLAUDE ---',
    ...entry.request.messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`),
    '',
    '--- CLAUDE RESPONSE ---',
    entry.response.content,
    '',
  ];

  // Add usage/cost if available
  if (entry.response.usage) {
    const cost = entry.response.cost || calculateCost(entry.response.usage);
    logLines.push(
      '--- TOKEN USAGE & COST ---',
      `Model: ${entry.response.usage.model}`,
      `Input Tokens: ${entry.response.usage.inputTokens.toLocaleString()}`,
      `Output Tokens: ${entry.response.usage.outputTokens.toLocaleString()}`,
      `Input Cost: $${cost.input.toFixed(6)}`,
      `Output Cost: $${cost.output.toFixed(6)}`,
      `Total Cost: $${cost.total.toFixed(6)}`,
      ''
    );

    // Update daily tracker
    updateDailyUsage(entry.response.usage, cost.total);
  }

  if (entry.error) {
    logLines.push('--- ERROR ---', entry.error, '');
  }

  logLines.push(separator, '');

  // Append to log file
  try {
    fs.appendFileSync(logPath, logLines.join('\n'));
  } catch (err) {
    console.error('[LOGGER] Failed to write to log file:', err);
  }

  // Also log to console in dev mode
  if (process.env.NODE_ENV === 'development') {
    console.log(logLines.join('\n'));
  }
}

function updateDailyUsage(usage: TokenUsage, cost: number): void {
  const today = new Date().toISOString().split('T')[0];
  
  // Reset if new day
  if (dailyUsage.date !== today) {
    dailyUsage.date = today;
    dailyUsage.totalInputTokens = 0;
    dailyUsage.totalOutputTokens = 0;
    dailyUsage.totalCost = 0;
    dailyUsage.requestCount = 0;
  }

  dailyUsage.totalInputTokens += usage.inputTokens;
  dailyUsage.totalOutputTokens += usage.outputTokens;
  dailyUsage.totalCost += cost;
  dailyUsage.requestCount += 1;

  // Save summary to file
  saveDailySummary();
}

function saveDailySummary(): void {
  const summaryPath = getSummaryFilePath();
  
  let allSummaries: Record<string, typeof dailyUsage> = {};
  
  // Load existing summaries
  try {
    if (fs.existsSync(summaryPath)) {
      allSummaries = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
    }
  } catch (err) {
    console.error('[LOGGER] Failed to read summary file:', err);
  }

  // Update today's summary
  allSummaries[dailyUsage.date] = { ...dailyUsage };

  // Save back
  try {
    fs.writeFileSync(summaryPath, JSON.stringify(allSummaries, null, 2));
  } catch (err) {
    console.error('[LOGGER] Failed to write summary file:', err);
  }
}

export function getDailyUsage(): typeof dailyUsage {
  return { ...dailyUsage };
}

export function getAllUsageSummaries(): Record<string, typeof dailyUsage> {
  const summaryPath = getSummaryFilePath();
  try {
    if (fs.existsSync(summaryPath)) {
      return JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
    }
  } catch (err) {
    console.error('[LOGGER] Failed to read summary file:', err);
  }
  return {};
}

// Quick console log for dev mode
export function devLog(label: string, data: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('\n' + '='.repeat(60));
    console.log(`[DEV] ${label}`);
    console.log('='.repeat(60));
    if (typeof data === 'string') {
      console.log(data);
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
    console.log('='.repeat(60) + '\n');
  }
}
