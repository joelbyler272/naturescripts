'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyUsage } from '@/lib/admin/apiUsage';

interface UsageBreakdownProps {
  data: DailyUsage[];
}

export function UsageBreakdown({ data }: UsageBreakdownProps) {
  // Get last 14 days for cleaner bar chart
  const chartData = [...data].slice(0, 14).reverse().map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    chat: d.chatRequests,
    protocol: d.protocolRequests,
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
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
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
          />
          <Legend />
          <Bar 
            dataKey="chat" 
            fill="#6366f1" 
            name="Chat Requests"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="protocol" 
            fill="#10b981" 
            name="Protocol Requests"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
