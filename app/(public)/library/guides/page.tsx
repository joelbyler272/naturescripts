import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/lib/constants/routes';
import { ArrowLeft } from 'lucide-react';

const guides = [
  { title: 'Understanding Adaptogens', readTime: '8 min', slug: 'understanding-adaptogens' },
  { title: 'Natural Support for Stress', readTime: '6 min', slug: 'natural-stress-support' },
  { title: 'Digestive Health Guide', readTime: '10 min', slug: 'digestive-health' },
  { title: 'Sleep Optimization', readTime: '7 min', slug: 'sleep-optimization' },
  { title: 'Immune System Support', readTime: '9 min', slug: 'immune-support' },
  { title: 'Hormone Balance Naturally', readTime: '11 min', slug: 'hormone-balance' },
];

export default function GuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={routes.library}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Library
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Health Guides</h1>
        <p className="text-muted-foreground">
          Comprehensive guides on natural health topics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/library/${guide.slug}`}>
            <Card className="h-full hover:border-accent/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <Badge variant="outline" className="mb-3">Guide</Badge>
                <h3 className="text-lg font-semibold text-foreground mb-2">{guide.title}</h3>
                <p className="text-sm text-muted-foreground">{guide.readTime} read</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
