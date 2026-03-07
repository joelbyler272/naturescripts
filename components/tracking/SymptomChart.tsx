'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartDataPoint } from '@/lib/hooks/useSymptomTracking';

// Color palette for up to 8 symptom lines
const SYMPTOM_COLORS = [
  '#6B8E7F', // sage green
  '#C9A66B', // warm gold
  '#2F4F4F', // dark slate
  '#8B5E3C', // earth brown
  '#7B68EE', // medium slate blue
  '#CD5C5C', // indian red
  '#4682B4', // steel blue
  '#9ACD32', // yellow green
];

interface SymptomChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

export function SymptomChart({ data, loading }: SymptomChartProps) {
  // Dynamically determine which symptoms exist in the data
  const symptomNames = useMemo(() => {
    const names = new Set<string>();
    for (const point of data) {
      for (const key of Object.keys(point)) {
        if (key !== 'date') names.add(key);
      }
    }
    return Array.from(names).sort();
  }, [data]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Symptom Severity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            Loading chart data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Symptom Severity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            No symptom data yet. Log your symptoms to see trends over time.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Severity Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#6B8E7F" fontSize={12} />
            <YAxis stroke="#6B8E7F" fontSize={12} domain={[0, 10]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #6B8E7F',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {symptomNames.map((name, idx) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={SYMPTOM_COLORS[idx % SYMPTOM_COLORS.length]}
                strokeWidth={2}
                name={name}
                connectNulls
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-4">
          Scale: 1 (minimal) to 10 (severe). Lower is better.
        </p>
      </CardContent>
    </Card>
  );
}
