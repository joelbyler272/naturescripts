'use client';

import { IntakeData, DIET_OPTIONS, CAFFEINE_OPTIONS, SUGAR_OPTIONS, WATER_OPTIONS, ALCOHOL_OPTIONS, TOBACCO_OPTIONS, COMMON_SENSITIVITIES } from '@/lib/intake/types';
import { cn } from '@/lib/utils';

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

export function DietStep({ data, onChange }: Props) {
  const toggleSensitivity = (item: string) => {
    const current = data.food_sensitivities;
    if (current.includes(item)) {
      onChange({ food_sensitivities: current.filter((s) => s !== item) });
    } else {
      onChange({ food_sensitivities: [...current, item] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">Diet & Nutrition</h3>
        <p className="text-sm text-muted-foreground">
          Understanding your dietary habits helps us recommend compatible remedies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="Diet Type" value={data.diet_type} options={DIET_OPTIONS} onChangeValue={(v) => onChange({ diet_type: v })} />
        <SelectField label="Caffeine Intake" value={data.caffeine_intake} options={CAFFEINE_OPTIONS} onChangeValue={(v) => onChange({ caffeine_intake: v })} />
        <SelectField label="Sugar Consumption" value={data.sugar_consumption} options={SUGAR_OPTIONS} onChangeValue={(v) => onChange({ sugar_consumption: v })} />
        <SelectField label="Water Intake (daily)" value={data.water_intake} options={WATER_OPTIONS} onChangeValue={(v) => onChange({ water_intake: v })} />
        <SelectField label="Alcohol Use" value={data.alcohol_use} options={ALCOHOL_OPTIONS} onChangeValue={(v) => onChange({ alcohol_use: v })} />
        <SelectField label="Tobacco Use" value={data.tobacco_use} options={TOBACCO_OPTIONS} onChangeValue={(v) => onChange({ tobacco_use: v })} />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Food Sensitivities</label>
        <p className="text-xs text-muted-foreground mb-3">Select any that apply</p>
        <div className="flex flex-wrap gap-2">
          {COMMON_SENSITIVITIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleSensitivity(item)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full border transition-colors',
                data.food_sensitivities.includes(item)
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-muted-foreground border-border hover:border-accent/50'
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
