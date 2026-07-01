'use client';

import { useState } from 'react';
import { IntakeData, DIET_OPTIONS, CAFFEINE_OPTIONS, SUGAR_OPTIONS, WATER_OPTIONS, WATER_GLASS_OZ, ALCOHOL_OPTIONS, TOBACCO_OPTIONS, COMMON_SENSITIVITIES } from '@/lib/intake/types';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

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
  const [customSensitivity, setCustomSensitivity] = useState('');

  const toggleSensitivity = (item: string) => {
    const current = data.food_sensitivities;
    if (current.includes(item)) {
      onChange({ food_sensitivities: current.filter((s) => s !== item) });
    } else {
      onChange({ food_sensitivities: [...current, item] });
    }
  };

  const addCustomSensitivity = () => {
    const trimmed = customSensitivity.trim();
    if (trimmed && !data.food_sensitivities.includes(trimmed)) {
      onChange({ food_sensitivities: [...data.food_sensitivities, trimmed] });
    }
    setCustomSensitivity('');
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
        <SelectField label={`Water Intake (daily, 1 glass = ${WATER_GLASS_OZ} oz)`} value={data.water_intake} options={WATER_OPTIONS} onChangeValue={(v) => onChange({ water_intake: v })} />
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
          {data.food_sensitivities
            .filter((s) => !COMMON_SENSITIVITIES.includes(s))
            .map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleSensitivity(item)}
                className="px-3 py-1.5 text-sm rounded-full border transition-colors bg-accent text-white border-accent"
              >
                {item} &times;
              </button>
            ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={customSensitivity}
            onChange={(e) => setCustomSensitivity(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSensitivity(); } }}
            placeholder="Add other..."
            className="flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground/50"
          />
          <button
            type="button"
            onClick={addCustomSensitivity}
            disabled={!customSensitivity.trim()}
            className={cn(
              'h-9 px-3 rounded-md border text-sm font-medium transition-colors flex items-center gap-1',
              customSensitivity.trim()
                ? 'border-accent text-accent hover:bg-accent/10'
                : 'border-border text-muted-foreground cursor-not-allowed'
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
