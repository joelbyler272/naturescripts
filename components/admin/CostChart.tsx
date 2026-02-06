'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyUsage } from '@/lib/admin/apiUsage';

interface CostChartProps {
  data: DailyUsage[];
}

export function CostChart({ data }: CostChartProps) {
  // Format data for chart (reverse to show oldest first)
  const chartData = [...data].reverse().map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cost: Number(d.totalCost.toFixed(4)),
    requests: d.totalRequests,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available yet
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            yAxisId="left"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'cost') return [`$${value.toFixed(4)}`, 'Cost'];
              return [value, 'Requests'];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="cost"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5 }}
            name="Cost ($)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="requests"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5 }}
            name="Requests"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
