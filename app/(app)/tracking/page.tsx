'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProBadge } from '@/components/app/ProBadge';
import { ProGate } from '@/components/shared/ProGate';
import { SymptomChart } from '@/components/tracking/SymptomChart';
import { DailyCheckIn } from '@/components/progress/DailyCheckIn';
import { ProgressChart } from '@/components/progress/ProgressChart';
import { MOCK_SYMPTOM_DATA } from '@/lib/data/hardcoded';
import { Plus, TrendingDown, Activity } from 'lucide-react';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { Loader2 } from 'lucide-react';

export default function TrackingPage() {
  const { isPro, loading } = useUsageLimits();

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

      {/* Daily Check-In and Progress Chart for Pro users */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <DailyCheckIn />
        <ProgressChart />
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
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Log Symptoms
            </Button>
          </div>
          <SymptomChart data={MOCK_SYMPTOM_DATA} />
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-900">
                <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
                Progress Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-green-900">
                <li>• Your fatigue has improved by 50% over the past week</li>
                <li>• Bloating shows a consistent downward trend</li>
                <li>• Sleep quality has increased from 4/10 to 8/10</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplements Tab */}
        <TabsContent value="supplements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Supplement Adherence</h2>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Log Supplement
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {['Ashwagandha 300mg', 'Gentian Root Tincture'].map((supplement, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">{supplement}</p>
                        <p className="text-sm text-muted-foreground">7-day streak</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">100%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lifestyle Habits</h2>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { habit: '10pm Bedtime', streak: 6, completed: true },
              { habit: 'Morning Sunlight', streak: 7, completed: true },
              { habit: 'Gentle Movement', streak: 4, completed: false },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.habit}</h3>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                      {item.streak}-day streak
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.completed ? 'Completed today' : 'Not yet completed'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
