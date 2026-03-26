'use client';

import { IntakeData, WELLNESS_GOAL_OPTIONS } from '@/lib/intake/types';
import { cn } from '@/lib/utils';

interface Props {
  data: IntakeData;
  onChange: (updates: Partial<IntakeData>) => void;
}

export function GoalsStep({ data, onChange }: Props) {
  const toggleGoal = (goal: string) => {
    const current = data.wellness_goals;
    if (current.includes(goal)) {
      onChange({ wellness_goals: current.filter((g) => g !== goal) });
    } else {
      onChange({ wellness_goals: [...current, goal] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">Wellness Goals</h3>
        <p className="text-sm text-muted-foreground">
          Select the areas where you want the most support. This helps us prioritize your protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {WELLNESS_GOAL_OPTIONS.map((goal) => (
          <button
            key={goal}
            type="button"
            onClick={() => toggleGoal(goal)}
            className={cn(
              'px-4 py-3 text-sm rounded-lg border text-left transition-colors',
              data.wellness_goals.includes(goal)
                ? 'bg-accent/10 text-accent border-accent/40 font-medium'
                : 'bg-white text-muted-foreground border-border hover:border-accent/30'
            )}
          >
            {goal}
          </button>
        ))}
      </div>

      {data.wellness_goals.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {data.wellness_goals.length} goal{data.wellness_goals.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
