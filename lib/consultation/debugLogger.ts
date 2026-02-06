// Consultation Debug Logger with Cost Tracking
// Saves logs to files in development mode

import fs from 'fs';
import path from 'path';

const DEV_MODE = process.env.NODE_ENV === 'development';
const LOG_DIR = path.join(process.cwd(), 'logs');

// Claude API Pricing (as of 2024)
// https://www.anthropic.com/pricing
const CLAUDE_PRICING = {
  'claude-sonnet-4-20250514': {
    input: 3.00 / 1_000_000,  // $3.00 per 1M input tokens
    output: 15.00 / 1_000_000, // $15.00 per 1M output tokens
  },
  'claude-3-5-sonnet-20241022': {
    input: 3.00 / 1_000_000,
    output: 15.00 / 1_000_000,
  },
  'claude-3-opus-20240229': {
    input: 15.00 / 1_000_000,
    output: 75.00 / 1_000_000,
  },
  'claude-3-haiku-20240307': {
    input: 0.25 / 1_000_000,
    output: 1.25 / 1_000_000,
  },
};

// Rough token estimation (4 chars ≈ 1 token)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

interface UsageEntry {
  timestamp: string;
  endpoint: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  userId?: string;
  consultationId?: string;
}

interface DailyUsageSummary {
  date: string;
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  byEndpoint: Record<string, { requests: number; cost: number }>;
}

// Ensure log directory exists
function ensureLogDir() {
  if (DEV_MODE && !fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

// Get today's date string for file naming
function getDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get current timestamp
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Log a consultation API call with full details
 */
export function logConsultationCall(params: {
  endpoint: 'chat' | 'protocol';
  userId: string;
  consultationId?: string;
  request: {
    systemPrompt: string;
    messages: { role: string; content: string }[];
    userMessage?: string;
  };
  response: {
    content: string;
    model?: string;
  };
  healthContext?: unknown;
  metadata?: Record<string, unknown>;
}) {
  if (!DEV_MODE) return;

  ensureLogDir();

  const { endpoint, userId, consultationId, request, response, healthContext, metadata } = params;
  const timestamp = getTimestamp();
  const dateString = getDateString();
  
  // Calculate tokens and cost
  const model = response.model || 'claude-sonnet-4-20250514';
  const pricing = CLAUDE_PRICING[model as keyof typeof CLAUDE_PRICING] || CLAUDE_PRICING['claude-sonnet-4-20250514'];
  
  const systemTokens = estimateTokens(request.systemPrompt);
  const messageTokens = request.messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
  const inputTokens = systemTokens + messageTokens;
  const outputTokens = estimateTokens(response.content);
  
  const inputCost = inputTokens * pricing.input;
  const outputCost = outputTokens * pricing.output;
  const totalCost = inputCost + outputCost;

  // Build detailed log entry
  const logEntry = {
    timestamp,
    endpoint: `consultation/${endpoint}`,
    userId: userId.substring(0, 8) + '...', // Partial ID for privacy
    consultationId,
    model,
    tokens: {
      systemPrompt: systemTokens,
      messages: messageTokens,
      totalInput: inputTokens,
      output: outputTokens,
    },
    cost: {
      input: `$${inputCost.toFixed(6)}`,
      output: `$${outputCost.toFixed(6)}`,
      total: `$${totalCost.toFixed(6)}`,
    },
    healthContext,
    request: {
      systemPrompt: request.systemPrompt,
      messages: request.messages,
      userMessage: request.userMessage,
    },
    response: {
      content: response.content,
    },
    metadata,
  };

  // Write detailed log
  const detailLogFile = path.join(LOG_DIR, `consultation-${dateString}.log`);
  const logLine = '\n' + '='.repeat(80) + '\n' + 
    JSON.stringify(logEntry, null, 2) + '\n' + 
    '='.repeat(80) + '\n';
  
  fs.appendFileSync(detailLogFile, logLine);

  // Update usage tracking
  trackUsage({
    timestamp,
    endpoint: `consultation/${endpoint}`,
    model,
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost,
    userId: userId.substring(0, 8) + '...',
    consultationId,
  });

  // Console output
  console.log('\n' + '='.repeat(60));
  console.log(`[${endpoint.toUpperCase()}] ${timestamp}`);
  console.log('='.repeat(60));
  console.log(`Tokens: ${inputTokens} in / ${outputTokens} out`);
  console.log(`Cost: $${totalCost.toFixed(6)} ($${inputCost.toFixed(6)} in + $${outputCost.toFixed(6)} out)`);
  console.log(`Log saved to: ${detailLogFile}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Track usage in a separate file for cost analysis
 */
function trackUsage(entry: UsageEntry) {
  if (!DEV_MODE) return;

  ensureLogDir();
  
  const dateString = getDateString();
  const usageFile = path.join(LOG_DIR, `usage-${dateString}.json`);
  
  let usageData: { entries: UsageEntry[]; summary: DailyUsageSummary } = {
    entries: [],
    summary: {
      date: dateString,
      totalRequests: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalCost: 0,
      byEndpoint: {},
    },
  };

  // Load existing data if file exists
  if (fs.existsSync(usageFile)) {
    try {
      usageData = JSON.parse(fs.readFileSync(usageFile, 'utf-8'));
    } catch (e) {
      // Start fresh if file is corrupted
    }
  }

  // Add new entry
  usageData.entries.push(entry);

  // Update summary
  usageData.summary.totalRequests++;
  usageData.summary.totalInputTokens += entry.inputTokens;
  usageData.summary.totalOutputTokens += entry.outputTokens;
  usageData.summary.totalCost += entry.totalCost;

  if (!usageData.summary.byEndpoint[entry.endpoint]) {
    usageData.summary.byEndpoint[entry.endpoint] = { requests: 0, cost: 0 };
  }
  usageData.summary.byEndpoint[entry.endpoint].requests++;
  usageData.summary.byEndpoint[entry.endpoint].cost += entry.totalCost;

  // Save updated data
  fs.writeFileSync(usageFile, JSON.stringify(usageData, null, 2));
}

/**
 * Get usage summary for today
 */
export function getTodayUsageSummary(): DailyUsageSummary | null {
  if (!DEV_MODE) return null;

  ensureLogDir();
  
  const dateString = getDateString();
  const usageFile = path.join(LOG_DIR, `usage-${dateString}.json`);
  
  if (!fs.existsSync(usageFile)) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(usageFile, 'utf-8'));
    return data.summary;
  } catch (e) {
    return null;
  }
}

/**
 * Print usage summary to console
 */
export function printUsageSummary() {
  const summary = getTodayUsageSummary();
  
  if (!summary) {
    console.log('\n[USAGE] No usage data for today yet.\n');
    return;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`[USAGE SUMMARY] ${summary.date}`);
  console.log('='.repeat(60));
  console.log(`Total Requests: ${summary.totalRequests}`);
  console.log(`Total Tokens: ${summary.totalInputTokens.toLocaleString()} in / ${summary.totalOutputTokens.toLocaleString()} out`);
  console.log(`Total Cost: $${summary.totalCost.toFixed(4)}`);
  console.log('\nBy Endpoint:');
  for (const [endpoint, data] of Object.entries(summary.byEndpoint)) {
    console.log(`  ${endpoint}: ${data.requests} requests, $${data.cost.toFixed(4)}`);
  }
  console.log('='.repeat(60) + '\n');
}

/**
 * Simple dev log helper (prints to console and optionally to file)
 */
export function devLog(label: string, data: unknown, saveToFile = true) {
  if (!DEV_MODE) return;

  const timestamp = getTimestamp();
  const output = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  console.log('\n' + '-'.repeat(60));
  console.log(`[${label}] ${timestamp}`);
  console.log('-'.repeat(60));
  console.log(output);
  console.log('-'.repeat(60) + '\n');

  if (saveToFile) {
    ensureLogDir();
    const dateString = getDateString();
    const debugFile = path.join(LOG_DIR, `debug-${dateString}.log`);
    fs.appendFileSync(debugFile, `\n[${label}] ${timestamp}\n${output}\n`);
  }
}
