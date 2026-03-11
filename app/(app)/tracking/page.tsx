'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProBadge } from '@/components/app/ProBadge';
import { ProGate } from '@/components/shared/ProGate';
import { SymptomChart } from '@/components/tracking/SymptomChart';
import { SymptomLogger } from '@/components/tracking/SymptomLogger';
import { SupplementTracker } from '@/components/tracking/SupplementTracker';
import { HabitTracker } from '@/components/tracking/HabitTracker';
import { useProtocolItems } from '@/lib/hooks/useProtocolItems';
import { useSymptomTracking } from '@/lib/hooks/useSymptomTracking';
import { useSupplementTracking } from '@/lib/hooks/useSupplementTracking';
import { useHabitTracking } from '@/lib/hooks/useHabitTracking';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TrackingPage() {
  const [loggerOpen, setLoggerOpen] = useState(false);
  const { isPro, loading } = useUsageLimits();

  const { supplements: protocolSupplements, habits: protocolHabits, suggestedSymptoms, protocolId } = useProtocolItems();
  const { todayLogs: symptomLogs, chartData, distinctSymptoms, loading: symptomsLoading, logSymptom, deleteLog } = useSymptomTracking();
  const { todayLogs: supplementLogs, adherence, loading: supplementsLoading, toggleSupplement } = useSupplementTracking(protocolId);
  const { todayLogs: habitLogs, streaks, loading: habitsLoading, toggleHabit } = useHabitTracking();

  // Combine protocol suggestions with user's historical symptoms for autocomplete
  const allSuggestions = Array.from(new Set([...suggestedSymptoms, ...distinctSymptoms]));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  // Show Pro gate for free users
  if (!isPro) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
            <ProBadge />
          </div>
          <p className="text-muted-foreground">
            Monitor your symptoms, supplements, and lifestyle changes over time
          </p>
        </div>

        <ProGate
          feature="Progress Tracking"
          description="Track your energy, mood, sleep, and symptoms over time. See trends and insights to optimize your wellness protocol."
          source="tracking_page"
        >
          {/* This won't render for free users */}
          <div />
        </ProGate>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
          <ProBadge />
        </div>
        <p className="text-muted-foreground">
          Monitor your symptoms, supplements, and lifestyle changes over time
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="symptoms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        {/* Symptoms Tab */}
        <TabsContent value="symptoms" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Symptom Tracking</h2>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setLoggerOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Log Symptom
            </Button>
          </div>

          <SymptomChart data={chartData} loading={symptomsLoading} />

          {/* Today's logs */}
          {symptomLogs.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Today&apos;s Entries</h3>
                <div className="space-y-2">
                  {symptomLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <span className="font-medium text-sm">{log.symptom_name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          Severity: {log.severity}/10
                        </span>
                        {log.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">{log.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <SymptomLogger
            open={loggerOpen}
            onOpenChange={setLoggerOpen}
            onSubmit={logSymptom}
            suggestions={allSuggestions}
          />
        </TabsContent>

        {/* Supplements Tab */}
        <TabsContent value="supplements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Supplement Adherence</h2>
          </div>
          <SupplementTracker
            todayLogs={supplementLogs}
            adherence={adherence}
            protocolSupplements={protocolSupplements}
            loading={supplementsLoading}
            onToggle={toggleSupplement}
          />
        </TabsContent>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lifestyle Habits</h2>
          </div>
          <HabitTracker
            todayLogs={habitLogs}
            streaks={streaks}
            protocolHabits={protocolHabits}
            loading={habitsLoading}
            onToggle={toggleHabit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
