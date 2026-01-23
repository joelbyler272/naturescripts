import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MOCK_HERBS } from '@/lib/data/hardcoded';
import { ArrowLeft, Leaf, AlertTriangle, Beaker, PillBottle } from 'lucide-react';

export default function HerbDetailPage({ params }: { params: { slug: string } }) {
  // Find the herb (in skeleton, just use Ashwagandha)
  const herb = MOCK_HERBS[0]; // Ashwagandha

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/herbs"
        className="inline-flex items-center text-sm text-charcoal/60 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Herb Database
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-charcoal mb-2">{herb.name}</h1>
            <p className="text-lg italic text-charcoal/60 mb-3">{herb.botanical_name}</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-charcoal/60">Evidence Level:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-full ${
                      level <= herb.evidence_level ? 'bg-primary' : 'bg-charcoal/20'
                    }`}
                  />
                ))}
              </div>
              <Badge variant="secondary" className="ml-2">
                {herb.evidence_level}/5
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-charcoal/80 leading-relaxed">{herb.overview}</p>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Beaker className="w-5 h-5 text-primary mr-2" />
            Key Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {herb.benefits.map((benefit, idx) => (
              <li key={idx} className="text-charcoal/80 flex items-start">
                <span className="text-primary mr-2 flex-shrink-0">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Dosage */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PillBottle className="w-5 h-5 text-primary mr-2" />
            Dosage & Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-charcoal/80">{herb.dosage}</p>
        </CardContent>
      </Card>

      {/* Safety Information */}
      <Card className="mb-6 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
            Safety Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contraindications */}
          <div>
            <h4 className="font-semibold text-charcoal mb-2">Contraindications</h4>
            <ul className="space-y-1">
              {herb.contraindications.map((item, idx) => (
                <li key={idx} className="text-sm text-charcoal/80 flex items-start">
                  <span className="mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Drug Interactions */}
          <div>
            <h4 className="font-semibold text-charcoal mb-2">Drug Interactions</h4>
            <ul className="space-y-1">
              {herb.drug_interactions.map((item, idx) => (
                <li key={idx} className="text-sm text-charcoal/80 flex items-start">
                  <span className="mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Side Effects */}
          <div>
            <h4 className="font-semibold text-charcoal mb-2">Possible Side Effects</h4>
            <ul className="space-y-1">
              {herb.side_effects.map((item, idx) => (
                <li key={idx} className="text-sm text-charcoal/80 flex items-start">
                  <span className="mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          <strong>Disclaimer:</strong> This information is for educational purposes only. Always
          consult with a qualified healthcare provider before using any herbal supplement,
          especially if you have health conditions or take medications.
        </p>
      </div>
    </div>
  );
}
