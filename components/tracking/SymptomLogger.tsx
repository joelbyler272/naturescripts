'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface SymptomLoggerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { symptom_name: string; severity: number; notes?: string }) => Promise<unknown>;
  suggestions?: string[];
}

export function SymptomLogger({ open, onOpenChange, onSubmit, suggestions = [] }: SymptomLoggerProps) {
  const [symptomName, setSymptomName] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(symptomName.toLowerCase()) && s.toLowerCase() !== symptomName.toLowerCase()
  );

  const handleSubmit = async () => {
    if (!symptomName.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        symptom_name: symptomName.trim(),
        severity,
        notes: notes.trim() || undefined,
      });
      // Reset form
      setSymptomName('');
      setSeverity(5);
      setNotes('');
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const severityLabel = severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : severity <= 8 ? 'Severe' : 'Very Severe';
  const severityColor = severity <= 3 ? 'text-green-600' : severity <= 6 ? 'text-amber-600' : 'text-red-600';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Symptom</DialogTitle>
          <DialogDescription>
            Track how you&apos;re feeling today
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Symptom Name */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium">Symptom</label>
            <Input
              value={symptomName}
              onChange={(e) => {
                setSymptomName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g. Headache, Fatigue, Bloating"
              maxLength={100}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-32 overflow-y-auto">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/50 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSymptomName(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Severity Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Severity</label>
              <span className={`text-sm font-medium ${severityColor}`}>
                {severity}/10 — {severityLabel}
              </span>
            </div>
            <Slider
              value={[severity]}
              onValueChange={(v) => setSeverity(v[0])}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mild</span>
              <span>Severe</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details about timing, triggers, etc."
              maxLength={500}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!symptomName.trim() || submitting}
            className="bg-accent hover:bg-accent/90"
          >
            {submitting ? 'Logging...' : 'Log Symptom'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
