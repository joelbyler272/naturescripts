'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HabitLog, HabitStreak } from '@/lib/supabase/habits';
import { ProtocolHabit } from '@/lib/hooks/useProtocolItems';
import { Check, Plus, Flame } from 'lucide-react';

interface HabitTrackerProps {
  todayLogs: HabitLog[];
  streaks: HabitStreak[];
  protocolHabits: ProtocolHabit[];
  loading: boolean;
  onToggle: (name: string, completed: boolean) => void;
}

export function HabitTracker({
  todayLogs,
  streaks,
  protocolHabits,
  loading,
  onToggle,
}: HabitTrackerProps) {
  const [customName, setCustomName] = useState('');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  // Build display list: protocol habits + custom ones from logs
  const protocolPractices = new Set(protocolHabits.map(h => h.practice));
  const customLogs = todayLogs.filter(l => !protocolPractices.has(l.habit_name));

  const items: { name: string; timing?: string; isProtocol: boolean }[] = [
    ...protocolHabits.map(h => ({ name: h.practice, timing: h.timing, isProtocol: true })),
    ...customLogs.map(l => ({ name: l.habit_name, isProtocol: false })),
  ];

  const isCompleted = (name: string) => {
    const log = todayLogs.find(l => l.habit_name === name);
    return log?.completed ?? false;
  };

  const getStreak = (name: string) => {
    return streaks.find(s => s.habit_name === name);
  };

  const handleAddCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed || trimmed.length > 100) return;
    if (items.some(i => i.name.toLowerCase() === trimmed.toLowerCase())) return;
    onToggle(trimmed, true);
    setCustomName('');
  };

  if (items.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p className="mb-2">No habits in your protocol yet.</p>
          <p className="text-sm">Complete a consultation to get personalized lifestyle recommendations, or add custom habits below.</p>
          <div className="flex gap-2 mt-4 max-w-sm mx-auto">
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Add a habit..."
              maxLength={100}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            />
            <Button
              size="sm"
              onClick={handleAddCustom}
              disabled={!customName.trim()}
              className="bg-accent hover:bg-accent/90"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => {
          const completed = isCompleted(item.name);
          const streakData = getStreak(item.name);

          return (
            <Card
              key={item.name}
              className={`cursor-pointer transition-colors ${
                completed ? 'border-green-200 bg-green-50/50' : 'hover:bg-muted/50'
              }`}
              onClick={() => onToggle(item.name, !completed)}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      completed ? 'bg-green-500 border-green-500' : 'border-muted-foreground/30'
                    }`}>
                      {completed && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${completed ? 'text-green-900' : ''}`}>
                        {item.name}
                      </p>
                      {item.timing && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.timing}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {completed ? 'Done today' : 'Not yet'}
                      </p>
                    </div>
                  </div>

                  {streakData && streakData.current_streak > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                      <Flame className="w-3 h-3" />
                      {streakData.current_streak}d streak
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add custom habit */}
      <div className="flex gap-2">
        <Input
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Add custom habit..."
          maxLength={100}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
        />
        <Button
          size="sm"
          onClick={handleAddCustom}
          disabled={!customName.trim()}
          className="bg-accent hover:bg-accent/90"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
