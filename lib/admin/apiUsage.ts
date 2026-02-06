import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';

// Claude API Pricing (as of 2024)
const CLAUDE_PRICING: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-20250514': {
    input: 3.00 / 1_000_000,
    output: 15.00 / 1_000_000,
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

export interface ApiUsageEntry {
  userId?: string;
  consultationId?: string;
  endpoint: 'chat' | 'protocol';
  model: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Record API usage to the database
 */
export async function recordApiUsage(entry: ApiUsageEntry): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const pricing = CLAUDE_PRICING[entry.model] || CLAUDE_PRICING['claude-sonnet-4-20250514'];
    const inputCost = entry.inputTokens * pricing.input;
    const outputCost = entry.outputTokens * pricing.output;
    const totalCost = inputCost + outputCost;

    const { error } = await supabase.from('api_usage').insert({
      user_id: entry.userId || null,
      consultation_id: entry.consultationId || null,
      endpoint: entry.endpoint,
      model: entry.model,
      input_tokens: entry.inputTokens,
      output_tokens: entry.outputTokens,
      input_cost: inputCost,
      output_cost: outputCost,
      total_cost: totalCost,
    });

    if (error) {
      logger.error('Failed to record API usage:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error recording API usage:', error);
    return false;
  }
}

export interface DailyUsage {
  date: string;
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  chatRequests: number;
  protocolRequests: number;
}

export interface UsageSummary {
  today: {
    requests: number;
    cost: number;
    inputTokens: number;
    outputTokens: number;
  };
  thisWeek: {
    requests: number;
    cost: number;
  };
  thisMonth: {
    requests: number;
    cost: number;
  };
  allTime: {
    requests: number;
    cost: number;
  };
  dailyUsage: DailyUsage[];
}

/**
 * Get API usage statistics for admin dashboard
 */
export async function getApiUsageStats(): Promise<UsageSummary> {
  const supabase = await createClient();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    // Today's stats
    const { data: todayData } = await supabase
      .from('api_usage')
      .select('input_tokens, output_tokens, total_cost')
      .gte('created_at', startOfToday);

    const todayStats = (todayData || []).reduce(
      (acc, row) => ({
        requests: acc.requests + 1,
        cost: acc.cost + Number(row.total_cost),
        inputTokens: acc.inputTokens + row.input_tokens,
        outputTokens: acc.outputTokens + row.output_tokens,
      }),
      { requests: 0, cost: 0, inputTokens: 0, outputTokens: 0 }
    );

    // This week's stats
    const { data: weekData } = await supabase
      .from('api_usage')
      .select('total_cost')
      .gte('created_at', startOfWeek);

    const weekStats = (weekData || []).reduce(
      (acc, row) => ({
        requests: acc.requests + 1,
        cost: acc.cost + Number(row.total_cost),
      }),
      { requests: 0, cost: 0 }
    );

    // This month's stats
    const { data: monthData } = await supabase
      .from('api_usage')
      .select('total_cost')
      .gte('created_at', startOfMonth);

    const monthStats = (monthData || []).reduce(
      (acc, row) => ({
        requests: acc.requests + 1,
        cost: acc.cost + Number(row.total_cost),
      }),
      { requests: 0, cost: 0 }
    );

    // All time stats
    const { data: allTimeData } = await supabase
      .from('api_usage')
      .select('total_cost');

    const allTimeStats = (allTimeData || []).reduce(
      (acc, row) => ({
        requests: acc.requests + 1,
        cost: acc.cost + Number(row.total_cost),
      }),
      { requests: 0, cost: 0 }
    );

    // Daily usage for charts (last 30 days)
    const { data: dailyData } = await supabase.rpc('get_daily_api_usage', { days_back: 30 });

    const dailyUsage: DailyUsage[] = (dailyData || []).map((row: Record<string, unknown>) => ({
      date: String(row.date),
      totalRequests: Number(row.total_requests) || 0,
      totalInputTokens: Number(row.total_input_tokens) || 0,
      totalOutputTokens: Number(row.total_output_tokens) || 0,
      totalCost: Number(row.total_cost) || 0,
      chatRequests: Number(row.chat_requests) || 0,
      protocolRequests: Number(row.protocol_requests) || 0,
    }));

    return {
      today: todayStats,
      thisWeek: weekStats,
      thisMonth: monthStats,
      allTime: allTimeStats,
      dailyUsage,
    };
  } catch (error) {
    logger.error('Error fetching API usage stats:', error);
    return {
      today: { requests: 0, cost: 0, inputTokens: 0, outputTokens: 0 },
      thisWeek: { requests: 0, cost: 0 },
      thisMonth: { requests: 0, cost: 0 },
      allTime: { requests: 0, cost: 0 },
      dailyUsage: [],
    };
  }
}

export interface UserGrowthData {
  date: string;
  totalUsers: number;
  newUsers: number;
}

/**
 * Get user growth data for charts
 */
export async function getUserGrowthData(daysBack: number = 30): Promise<UserGrowthData[]> {
  const supabase = await createClient();

  try {
    // Get all users with their creation dates
    const { data: users } = await supabase
      .from('profiles')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (!users || users.length === 0) return [];

    // Group by date and calculate cumulative totals
    const usersByDate = new Map<string, number>();
    
    users.forEach(user => {
      const date = user.created_at.split('T')[0];
      usersByDate.set(date, (usersByDate.get(date) || 0) + 1);
    });

    // Generate data for the last N days
    const result: UserGrowthData[] = [];
    const today = new Date();
    let cumulativeTotal = 0;

    // First, count all users before our date range
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysBack);
    
    users.forEach(user => {
      const userDate = new Date(user.created_at);
      if (userDate < startDate) {
        cumulativeTotal++;
      }
    });

    // Now build the daily data
    for (let i = daysBack; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const newUsers = usersByDate.get(dateStr) || 0;
      cumulativeTotal += newUsers;
      
      result.push({
        date: dateStr,
        totalUsers: cumulativeTotal,
        newUsers,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error fetching user growth data:', error);
    return [];
  }
}

export interface ConsultationTrendData {
  date: string;
  total: number;
  completed: number;
  abandoned: number;
}

/**
 * Get consultation trends for charts
 */
export async function getConsultationTrends(daysBack: number = 30): Promise<ConsultationTrendData[]> {
  const supabase = await createClient();

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data: consultations } = await supabase
      .from('consultations')
      .select('created_at, status')
      .gte('created_at', startDate.toISOString());

    if (!consultations) return [];

    // Group by date
    const byDate = new Map<string, { total: number; completed: number; abandoned: number }>();

    consultations.forEach(c => {
      const date = c.created_at.split('T')[0];
      const existing = byDate.get(date) || { total: 0, completed: 0, abandoned: 0 };
      existing.total++;
      if (c.status === 'completed') existing.completed++;
      if (c.status === 'abandoned') existing.abandoned++;
      byDate.set(date, existing);
    });

    // Generate data for each day
    const result: ConsultationTrendData[] = [];
    const today = new Date();

    for (let i = daysBack; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const data = byDate.get(dateStr) || { total: 0, completed: 0, abandoned: 0 };
      
      result.push({
        date: dateStr,
        ...data,
      });
    }

    return result;
  } catch (error) {
    logger.error('Error fetching consultation trends:', error);
    return [];
  }
}
