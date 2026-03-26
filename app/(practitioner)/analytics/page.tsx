import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'Practice Analytics',
};

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your practice performance</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="font-medium text-foreground mb-1">Coming Soon</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Practice analytics including client engagement, protocol completion rates,
            and wellness outcome tracking will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
