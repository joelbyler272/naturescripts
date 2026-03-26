'use client';

import { Input } from '@/components/ui/input';
import { IntakeData, GENDER_OPTIONS, BLOOD_TYPE_OPTIONS } from '@/lib/intake/types';

interface Props {
  data: IntakeData;
  onChange: (updates: Partial<IntakeData>) => void;
}

export function PersonalStep({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          This helps us tailor recommendations to your body and biology.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Age</label>
          <Input
            type="number"
            min={1}
            max={120}
            placeholder="e.g., 35"
            value={data.age ?? ''}
            onChange={(e) => onChange({ age: e.target.value ? Number(e.target.value) : null })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
          <select
            value={data.gender}
            onChange={(e) => onChange({ gender: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Select...</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Height (cm)</label>
          <Input
            type="number"
            min={50}
            max={250}
            placeholder="e.g., 175"
            value={data.height_cm ?? ''}
            onChange={(e) => onChange({ height_cm: e.target.value ? Number(e.target.value) : null })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Weight (kg)</label>
          <Input
            type="number"
            min={20}
            max={300}
            step={0.1}
            placeholder="e.g., 70"
            value={data.weight_kg ?? ''}
            onChange={(e) => onChange({ weight_kg: e.target.value ? Number(e.target.value) : null })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-1.5">Blood Type</label>
          <select
            value={data.blood_type}
            onChange={(e) => onChange({ blood_type: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Select...</option>
            {BLOOD_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
