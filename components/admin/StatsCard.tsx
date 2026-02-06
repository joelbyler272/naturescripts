import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  subtext?: string;
  color?: 'blue' | 'green' | 'purple' | 'sage' | 'amber';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    trend: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    trend: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    trend: 'text-purple-600',
  },
  sage: {
    bg: 'bg-sage-50',
    icon: 'text-sage-600',
    trend: 'text-sage-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    trend: 'text-amber-600',
  },
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  subtext,
  color = 'blue',
}: StatsCardProps) {
  const styles = colorStyles[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className={cn('text-sm mt-2', styles.trend)}>{trend}</p>
          )}
          {subtext && (
            <p className="text-sm text-gray-500 mt-2">{subtext}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', styles.bg)}>
          <Icon className={cn('w-6 h-6', styles.icon)} />
        </div>
      </div>
    </div>
  );
}
