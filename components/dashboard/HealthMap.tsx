'use client';

import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer
} from 'recharts';
import { WellnessBreakdown } from '@/lib/wellness/score';

interface Props {
  breakdown: WellnessBreakdown;
}

const CATEGORIES = [
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'activity', label: 'Activity' },
  { key: 'sleep', label: 'Sleep' },
  { key: 'stress', label: 'Stress' },
  { key: 'mindfulness', label: 'Mind' },
  { key: 'hydration', label: 'Hydration' },
] as const;

export function HealthMap({ breakdown }: Props) {
  const data = CATEGORIES.map(({ key, label }) => ({
    category: label,
    score: breakdown[key],
    fullMark: 100,
  }));

  return (
    <div className="w-full" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Wellness"
            dataKey="score"
            stroke="#6b8e7b"
            fill="#6b8e7b"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
