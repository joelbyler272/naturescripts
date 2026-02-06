'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import { Heart, Plus, X, Loader2, Check, Pill, Leaf } from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface Supplement {
  name: string;
  dosage: string;
  frequency: string;
}

// Common health conditions for quick selection
const COMMON_CONDITIONS = [
  'Anxiety', 'Depression', 'Insomnia', 'Stress', 'Fatigue',
  'Digestive issues', 'IBS', 'Migraines', 'Allergies', 'Chronic pain',
  'High blood pressure', 'Diabetes', 'Thyroid issues', 'Arthritis'
];

export function HealthProfileCard() {
  const { user } = useAuth();
  const supabase = createClient();

  // Health profile state
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [healthNotes, setHealthNotes] = useState('');

  // UI state
  const [newCondition, setNewCondition] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // New medication/supplement forms
  const [newMed, setNewMed] = useState<Medication>({ name: '', dosage: '', frequency: '' });
  const [newSupp, setNewSupp] = useState<Supplement>({ name: '', dosage: '', frequency: '' });

  // Load health profile on mount
  useEffect(() => {
    if (!user?.id) return;

    const loadHealthProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('health_conditions, medications, supplements, health_notes')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setHealthConditions(data.health_conditions || []);
          setMedications(data.medications || []);
          setSupplements(data.supplements || []);
          setHealthNotes(data.health_notes || '');
        }
      } catch (err) {
        logger.error('Failed to load health profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHealthProfile();
  }, [user?.id, supabase]);

  // Save health profile
  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          health_conditions: healthConditions,
          medications: medications,
          supplements: supplements,
          health_notes: healthNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      logger.error('Failed to save health profile:', err);
    } finally {
      setSaving(false);
    }
  };

  // Add condition
  const addCondition = (condition: string) => {
    const trimmed = condition.trim();
    if (trimmed && !healthConditions.includes(trimmed)) {
      setHealthConditions([...healthConditions, trimmed]);
    }
    setNewCondition('');
  };

  // Remove condition
  const removeCondition = (condition: string) => {
    setHealthConditions(healthConditions.filter(c => c !== condition));
  };

  // Add medication
  const addMedication = () => {
    if (newMed.name.trim()) {
      setMedications([...medications, { ...newMed, name: newMed.name.trim() }]);
      setNewMed({ name: '', dosage: '', frequency: '' });
    }
  };

  // Remove medication
  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  // Add supplement
  const addSupplement = () => {
    if (newSupp.name.trim()) {
      setSupplements([...supplements, { ...newSupp, name: newSupp.name.trim() }]);
      setNewSupp({ name: '', dosage: '', frequency: '' });
    }
  };

  // Remove supplement
  const removeSupplement = (index: number) => {
    setSupplements(supplements.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="w-5 h-5 text-accent mr-2" />
          Health Profile
        </CardTitle>
        <CardDescription>
          This information helps personalize your consultations. All data is kept private.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Conditions */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Health Conditions & Concerns
          </label>
          
          {/* Current conditions */}
          <div className="flex flex-wrap gap-2">
            {healthConditions.map((condition) => (
              <Badge key={condition} variant="secondary" className="gap-1 pr-1">
                {condition}
                <button
                  onClick={() => removeCondition(condition)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Add new condition */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a condition..."
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCondition(newCondition)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => addCondition(newCondition)}
              disabled={!newCondition.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick add common conditions */}
          <div className="flex flex-wrap gap-1">
            {COMMON_CONDITIONS.filter(c => !healthConditions.includes(c)).slice(0, 6).map((condition) => (
              <button
                key={condition}
                onClick={() => addCondition(condition)}
                className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground transition-colors"
              >
                + {condition}
              </button>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div className="space-y-3 border-t pt-4">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Pill className="w-4 h-4 text-muted-foreground" />
            Current Medications
          </label>

          {/* List of medications */}
          {medications.length > 0 && (
            <div className="space-y-2">
              {medications.map((med, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                  <div>
                    <span className="font-medium text-sm">{med.name}</span>
                    {(med.dosage || med.frequency) && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {[med.dosage, med.frequency].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeMedication(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new medication */}
          <div className="grid grid-cols-12 gap-2">
            <Input
              placeholder="Medication name"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="col-span-5"
            />
            <Input
              placeholder="Dosage"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              className="col-span-3"
            />
            <Input
              placeholder="Frequency"
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              className="col-span-3"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={addMedication}
              disabled={!newMed.name.trim()}
              className="col-span-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Supplements */}
        <div className="space-y-3 border-t pt-4">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Leaf className="w-4 h-4 text-muted-foreground" />
            Current Supplements
          </label>

          {/* List of supplements */}
          {supplements.length > 0 && (
            <div className="space-y-2">
              {supplements.map((supp, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                  <div>
                    <span className="font-medium text-sm">{supp.name}</span>
                    {(supp.dosage || supp.frequency) && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {[supp.dosage, supp.frequency].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeSupplement(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new supplement */}
          <div className="grid grid-cols-12 gap-2">
            <Input
              placeholder="Supplement name"
              value={newSupp.name}
              onChange={(e) => setNewSupp({ ...newSupp, name: e.target.value })}
              className="col-span-5"
            />
            <Input
              placeholder="Dosage"
              value={newSupp.dosage}
              onChange={(e) => setNewSupp({ ...newSupp, dosage: e.target.value })}
              className="col-span-3"
            />
            <Input
              placeholder="Frequency"
              value={newSupp.frequency}
              onChange={(e) => setNewSupp({ ...newSupp, frequency: e.target.value })}
              className="col-span-3"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={addSupplement}
              disabled={!newSupp.name.trim()}
              className="col-span-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2 border-t pt-4">
          <label className="text-sm font-medium text-foreground">
            Additional Health Notes
          </label>
          <textarea
            placeholder="Allergies, sensitivities, health goals, or anything else you'd like us to know..."
            value={healthNotes}
            onChange={(e) => setHealthNotes(e.target.value)}
            className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent hover:bg-accent/90"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="w-4 h-4 mr-2" /> Saved</>
          ) : (
            'Save Health Profile'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
