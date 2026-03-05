'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SupplementLog, SupplementAdherence } from '@/lib/supabase/supplements';
import { ProtocolSupplement } from '@/lib/hooks/useProtocolItems';
import { Check, Plus, Flame } from 'lucide-react';

interface SupplementTrackerProps {
  todayLogs: SupplementLog[];
  adherence: SupplementAdherence[];
  protocolSupplements: ProtocolSupplement[];
  loading: boolean;
  onToggle: (name: string, taken: boolean) => void;
}

export function SupplementTracker({
  todayLogs,
  adherence,
  protocolSupplements,
  loading,
  onToggle,
}: SupplementTrackerProps) {
  const [customName, setCustomName] = useState('');

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // Build display list: protocol supplements + any custom ones from today's logs
  const protocolNames = new Set(protocolSupplements.map(s => s.name));
  const customLogs = todayLogs.filter(l => !protocolNames.has(l.supplement_name));

  const items: { name: string; dosage?: string; timing?: string; isProtocol: boolean }[] = [
    ...protocolSupplements.map(s => ({ name: s.name, dosage: s.dosage, timing: s.timing, isProtocol: true })),
    ...customLogs.map(l => ({ name: l.supplement_name, isProtocol: false })),
  ];

  const isTaken = (name: string) => {
    const log = todayLogs.find(l => l.supplement_name === name);
    return log?.taken ?? false;
  };

  const getAdherence = (name: string) => {
    return adherence.find(a => a.supplement_name === name);
  };

  const handleAddCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed || trimmed.length > 100) return;
    // Check if already exists
    if (items.some(i => i.name.toLowerCase() === trimmed.toLowerCase())) return;
    onToggle(trimmed, true);
    setCustomName('');
  };

  if (items.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p className="mb-2">No supplements in your protocol yet.</p>
          <p className="text-sm">Complete a consultation to get personalized supplement recommendations, or add custom supplements below.</p>
          <div className="flex gap-2 mt-4 max-w-sm mx-auto">
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Add a supplement..."
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
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {items.map((item) => {
              const taken = isTaken(item.name);
              const adherenceData = getAdherence(item.name);

              return (
                <button
                  key={item.name}
                  onClick={() => onToggle(item.name, !taken)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors text-left ${
                    taken ? 'bg-green-50 border border-green-200' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      taken ? 'bg-green-500 border-green-500' : 'border-muted-foreground/30'
                    }`}>
                      {taken && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${taken ? 'text-green-900' : ''}`}>
                        {item.name}
                      </p>
                      {item.dosage && (
                        <p className="text-xs text-muted-foreground">{item.dosage} · {item.timing}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    {adherenceData && adherenceData.current_streak > 0 && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Flame className="w-3 h-3" />
                        {adherenceData.current_streak}d
                      </span>
                    )}
                    {adherenceData && (
                      <span className={`text-xs font-medium ${
                        adherenceData.adherence_pct >= 80 ? 'text-green-600' :
                        adherenceData.adherence_pct >= 50 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {adherenceData.adherence_pct}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add custom supplement */}
      <div className="flex gap-2">
        <Input
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Add custom supplement..."
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
