'use client';

import { IntakeData, MOOD_OPTIONS } from '@/lib/intake/types';
import { cn } from '@/lib/utils';

interface Props {
  data: IntakeData;
  onChange: (updates: Partial<IntakeData>) => void;
}

export function MentalStep({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">Mental & Emotional Wellness</h3>
        <p className="text-sm text-muted-foreground">
          Your mental state directly influences which herbs and practices we recommend.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mood Patterns</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ mood_patterns: opt.value })}
                className={cn(
                  'px-4 py-3 text-sm rounded-lg border text-left transition-colors',
                  data.mood_patterns === opt.value
                    ? 'bg-accent/10 text-accent border-accent/40 font-medium'
                    : 'bg-white text-muted-foreground border-border hover:border-accent/30'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Focus Ability</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={10}
              value={data.focus_ability ?? 5}
              onChange={(e) => onChange({ focus_ability: Number(e.target.value) })}
              className="flex-1 accent-accent"
            />
            <span className="text-sm font-medium text-foreground w-8 text-center">
              {data.focus_ability ?? 5}/10
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Easily distracted</span>
            <span>Very focused</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Meditation / Mindfulness Practice</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange({ meditation_practice: true })}
              className={cn(
                'flex-1 px-4 py-3 text-sm rounded-lg border transition-colors',
                data.meditation_practice
                  ? 'bg-accent/10 text-accent border-accent/40 font-medium'
                  : 'bg-white text-muted-foreground border-border hover:border-accent/30'
              )}
            >
              Yes, I practice
            </button>
            <button
              type="button"
              onClick={() => onChange({ meditation_practice: false })}
              className={cn(
                'flex-1 px-4 py-3 text-sm rounded-lg border transition-colors',
                !data.meditation_practice
                  ? 'bg-accent/10 text-accent border-accent/40 font-medium'
                  : 'bg-white text-muted-foreground border-border hover:border-accent/30'
              )}
            >
              Not currently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
