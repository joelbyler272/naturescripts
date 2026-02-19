'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/AuthContext';
import { getRecentProgress, ProgressLog } from '@/lib/supabase/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formatDateShort } from '@/lib/utils/date';

interface ChartDataPoint {
  date: string;
  dateDisplay: string;
  energy: number | null;
  mood: number | null;
  sleep: number | null;
}

export function ProgressChart() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgress() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const logs = await getRecentProgress(user.id, 14);

        // Transform to chart data
        const chartData: ChartDataPoint[] = logs.map((log: ProgressLog) => ({
          date: log.date,
          dateDisplay: formatDateShort(log.date),
          energy: log.energy_level,
          mood: log.mood_level,
          sleep: log.sleep_quality,
        }));

        setData(chartData);
      } catch {
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <p>No progress data yet.</p>
            <p className="text-sm mt-1">Start logging your daily check-ins to see trends.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="dateDisplay" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              domain={[1, 5]} 
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 0 }}
              name="Energy"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 0 }}
              name="Mood"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="sleep"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 0 }}
              name="Sleep"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
