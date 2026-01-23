import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HerbDatabase } from '@/types';
import { Leaf } from 'lucide-react';

interface HerbCardProps {
  herb: HerbDatabase;
}

export function HerbCard({ herb }: HerbCardProps) {
  const slug = herb.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="pt-6">
        {/* Herb Icon/Image Placeholder */}
        <div className="w-full h-32 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <Leaf className="w-12 h-12 text-primary" />
        </div>

        {/* Herb Info */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-charcoal mb-1">{herb.name}</h3>
          <p className="text-sm italic text-charcoal/60 mb-3">{herb.botanical_name}</p>

          {/* Evidence Level */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs text-charcoal/60">Evidence Level:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-2 rounded-full ${
                    level <= herb.evidence_level ? 'bg-primary' : 'bg-charcoal/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Benefits Preview */}
          <div className="space-y-1">
            {herb.benefits.slice(0, 3).map((benefit, idx) => (
              <p key={idx} className="text-sm text-charcoal/70 flex items-start">
                <span className="text-primary mr-1">•</span>
                {benefit}
              </p>
            ))}
          </div>
        </div>

        {/* Learn More Button */}
        <Link href={`/herbs/${slug}`}>
          <Button variant="outline" className="w-full">
            Learn More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
