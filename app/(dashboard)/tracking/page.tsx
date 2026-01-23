'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProBadge } from '@/components/shared/ProBadge';
import { SymptomChart } from '@/components/tracking/SymptomChart';
import { MOCK_SYMPTOM_DATA } from '@/lib/data/hardcoded';
import { Plus, TrendingDown, Activity } from 'lucide-react';

export default function TrackingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <h1 className="text-3xl font-bold text-charcoal">Progress Tracking</h1>
          <ProBadge />
        </div>
        <p className="text-charcoal/60">
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
            <h2 className="text-xl font-semibold text-charcoal">Symptom Tracking</h2>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Log Symptoms
            </Button>
          </div>

          {/* Chart */}
          <SymptomChart data={MOCK_SYMPTOM_DATA} />

          {/* Insights Card */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-900">
                <TrendingDown className="w-5 h-5 text-green-600 mr-2" />
                Progress Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-green-900">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Your fatigue has improved by 50% over the past week
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Bloating shows a consistent downward trend since starting Gentian Root
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Sleep quality has increased from 4/10 to 8/10
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplements Tab */}
        <TabsContent value="supplements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-charcoal">Supplement Adherence</h2>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Log Supplement
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Supplements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Ashwagandha 300mg', 'Gentian Root Tincture'].map((supplement, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-cream rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{supplement}</p>
                        <p className="text-sm text-charcoal/60">7-day streak</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">100%</p>
                      <p className="text-xs text-charcoal/60">adherence</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-charcoal">Lifestyle Habits</h2>
            <Button className="bg-primary hover:bg-primary/90">
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
                    <h3 className="font-semibold text-charcoal">{item.habit}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {item.streak}-day streak
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/60">
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
