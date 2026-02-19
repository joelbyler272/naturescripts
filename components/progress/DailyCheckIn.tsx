'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthContext';
import { getTodayProgress, upsertProgress, ProgressLogInput } from '@/lib/supabase/progress';
import { Battery, Brain, Moon, Plus, X, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const COMMON_SYMPTOMS = [
  'Fatigue', 'Headache', 'Bloating', 'Brain Fog', 'Anxiety',
  'Joint Pain', 'Insomnia', 'Nausea', 'Muscle Tension', 'Low Mood'
];

interface RatingInputProps {
  value: number | null;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  label: string;
}

function RatingInput({ value, onChange, icon, label }: RatingInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={cn(
              'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
              value === rating
                ? 'bg-accent text-white'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            )}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}

export function DailyCheckIn() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [energy, setEnergy] = useState<number | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');

  useEffect(() => {
    async function loadTodayProgress() {
      if (!user) return;
      setLoading(true);
      const progress = await getTodayProgress(user.id);
      if (progress) {
        setEnergy(progress.energy_level);
        setMood(progress.mood_level);
        setSleep(progress.sleep_quality);
        setSymptoms(progress.symptoms || []);
        setNotes(progress.notes || '');
      }
      setLoading(false);
    }
    loadTodayProgress();
  }, [user]);

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    const input: ProgressLogInput = {
      energy_level: energy || undefined,
      mood_level: mood || undefined,
      sleep_quality: sleep || undefined,
      symptoms,
      notes: notes || undefined,
    };

    const result = await upsertProgress(user.id, input);
    setSaving(false);
    if (result) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Daily Check-In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ratings */}
        <div className="grid gap-6 sm:grid-cols-3">
          <RatingInput
            value={energy}
            onChange={setEnergy}
            icon={<Battery className="w-4 h-4 text-amber-500" />}
            label="Energy"
          />
          <RatingInput
            value={mood}
            onChange={setMood}
            icon={<Brain className="w-4 h-4 text-blue-500" />}
            label="Mood"
          />
          <RatingInput
            value={sleep}
            onChange={setSleep}
            icon={<Moon className="w-4 h-4 text-purple-500" />}
            label="Sleep Quality"
          />
        </div>

        {/* Symptoms */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Symptoms Today</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.map((symptom) => (
              <Badge
                key={symptom}
                variant={symptoms.includes(symptom) ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-colors',
                  symptoms.includes(symptom) && 'bg-accent hover:bg-accent/90'
                )}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </Badge>
            ))}
            {symptoms.filter(s => !COMMON_SYMPTOMS.includes(s)).map((symptom) => (
              <Badge
                key={symptom}
                className="bg-accent hover:bg-accent/90 cursor-pointer gap-1"
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Add custom symptom..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-transparent"
              onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
            />
            <Button variant="outline" size="sm" onClick={addCustomSymptom}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? Any observations?"
            className="w-full min-h-[80px] px-3 py-2 text-sm rounded-lg border border-input bg-transparent resize-none"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-accent hover:bg-accent/90"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="w-4 h-4 mr-2" /> Saved!</>
          ) : (
            'Save Check-In'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
