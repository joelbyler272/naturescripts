'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  date: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  disableFuture?: boolean;
}

export function DateSelector({ date, onChange, disableFuture = true }: DateSelectorProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const current = new Date(date + 'T00:00:00');
  const isToday = date === today.toLocaleDateString('en-CA');
  const isFutureBlocked = disableFuture && current >= today;

  const shift = (days: number) => {
    const d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const newDate = d.toLocaleDateString('en-CA');
    if (disableFuture) {
      const todayStr = today.toLocaleDateString('en-CA');
      if (newDate > todayStr) return;
    }
    onChange(newDate);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => shift(-1)}
        className="p-1.5 rounded-lg hover:bg-secondary/80 transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-sm font-medium min-w-[120px] text-center">
        {isToday ? 'Today' : new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </span>

      <button
        onClick={() => shift(1)}
        disabled={isFutureBlocked}
        className="p-1.5 rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
