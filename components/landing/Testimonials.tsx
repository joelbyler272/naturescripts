import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_TESTIMONIALS } from '@/lib/data/hardcoded';
import { Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Trusted by Health Seekers
          </h2>
          <p className="text-lg text-charcoal/70">
            Real experiences from our community
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map((testimonial, index) => (
            <Card key={index} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-charcoal/80 mb-4 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal">{testimonial.initials}</p>
                    <p className="text-sm text-charcoal/60">{testimonial.condition}</p>
                  </div>
                  {testimonial.isPro && (
                    <Badge variant="secondary" className="text-xs">
                      Pro Member
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
