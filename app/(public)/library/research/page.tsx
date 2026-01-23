import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/lib/constants/routes';
import { ArrowLeft } from 'lucide-react';

const research = [
  { title: 'Ashwagandha Clinical Studies', readTime: '15 min', slug: 'ashwagandha-studies' },
  { title: 'The Science of Adaptogens', readTime: '12 min', slug: 'science-adaptogens' },
  { title: 'Gut-Brain Connection Research', readTime: '18 min', slug: 'gut-brain-research' },
  { title: 'Herbal Medicine Efficacy', readTime: '14 min', slug: 'herbal-efficacy' },
];

export default function ResearchPage() {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Research</h1>
        <p className="text-muted-foreground">
          Scientific studies and clinical research on natural remedies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {research.map((item) => (
          <Link key={item.slug} href={`/library/${item.slug}`}>
            <Card className="h-full hover:border-accent/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <Badge variant="outline" className="mb-3">Research</Badge>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.readTime} read</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
