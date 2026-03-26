'use client';

import { WellnessBreakdown, getScoreLabel, getScoreColor } from '@/lib/wellness/score';
import { cn } from '@/lib/utils';

interface Props {
  breakdown: WellnessBreakdown;
}

export function WellnessScore({ breakdown }: Props) {
  const { overall } = breakdown;
  const label = getScoreLabel(overall);
  const colorClass = getScoreColor(overall);

  // SVG ring parameters
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overall / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-secondary"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={colorClass}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', colorClass)}>{overall}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div>
        <p className={cn('text-sm font-medium', colorClass)}>{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">Wellness Score</p>
      </div>
    </div>
  );
}
