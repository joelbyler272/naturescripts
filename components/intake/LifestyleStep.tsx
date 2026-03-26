'use client';

import { Input } from '@/components/ui/input';
import { IntakeData, ACTIVITY_OPTIONS, EXERCISE_OPTIONS, SUNLIGHT_OPTIONS } from '@/lib/intake/types';

interface Props {
  data: IntakeData;
  onChange: (updates: Partial<IntakeData>) => void;
}

function SelectField({ label, value, options, onChangeValue }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChangeValue: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function LifestyleStep({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">Lifestyle</h3>
        <p className="text-sm text-muted-foreground">
          Your daily habits play a major role in which remedies will work best for you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="Activity Level" value={data.activity_level} options={ACTIVITY_OPTIONS} onChangeValue={(v) => onChange({ activity_level: v })} />
        <SelectField label="Exercise Frequency" value={data.exercise_frequency} options={EXERCISE_OPTIONS} onChangeValue={(v) => onChange({ exercise_frequency: v })} />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Sleep (hours/night)</label>
          <Input
            type="number"
            min={0}
            max={24}
            step={0.5}
            placeholder="e.g., 7"
            value={data.sleep_hours ?? ''}
            onChange={(e) => onChange({ sleep_hours: e.target.value ? Number(e.target.value) : null })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Stress Level</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={10}
              value={data.stress_level ?? 5}
              onChange={(e) => onChange({ stress_level: Number(e.target.value) })}
              className="flex-1 accent-accent"
            />
            <span className="text-sm font-medium text-foreground w-8 text-center">
              {data.stress_level ?? 5}/10
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Low stress</span>
            <span>High stress</span>
          </div>
        </div>

        <SelectField label="Sunlight Exposure" value={data.sunlight_exposure} options={SUNLIGHT_OPTIONS} onChangeValue={(v) => onChange({ sunlight_exposure: v })} />
      </div>
    </div>
  );
}
