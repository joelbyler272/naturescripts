'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SymptomChartProps {
  data: any[];
}

export function SymptomChart({ data }: SymptomChartProps) {
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
            <Line type="monotone" dataKey="fatigue" stroke="#6B8E7F" strokeWidth={2} name="Fatigue" />
            <Line type="monotone" dataKey="bloating" stroke="#C9A66B" strokeWidth={2} name="Bloating" />
            <Line type="monotone" dataKey="sleep" stroke="#2F4F4F" strokeWidth={2} name="Sleep Quality" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-charcoal/60 mt-4">
          Scale: 1 (minimal) to 10 (severe). Lower is better for symptoms, higher is better for sleep quality.
        </p>
      </CardContent>
    </Card>
  );
}
