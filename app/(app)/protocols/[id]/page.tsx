import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MOCK_CONSULTATIONS } from '@/lib/data/hardcoded';
import { routes } from '@/lib/constants/routes';
import { ArrowLeft, Download, Share2, Leaf, Apple, Activity, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function ProtocolDetailPage({ params }: { params: { id: string } }) {
  const consultation = MOCK_CONSULTATIONS[0];
  const protocol = consultation.protocol_data;
  const date = format(new Date(consultation.created_at), 'MMMM dd, yyyy');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href={routes.dashboard}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{date}</p>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Protocol</h1>
            <p className="text-muted-foreground">{consultation.initial_input}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Analysis */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {protocol.analysis.patterns.map((pattern, idx) => (
              <Badge key={idx} variant="secondary">{pattern}</Badge>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed">{protocol.analysis.explanation}</p>
        </CardContent>
      </Card>

      {/* Herbal Recommendations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
              <Leaf className="w-5 h-5 text-accent" />
            </div>
            Herbal Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {protocol.phase1.herbs.map((herb, idx) => (
            <div key={idx}>
              {idx > 0 && <Separator className="my-6" />}
              <div>
                <h3 className="font-semibold text-lg text-foreground">{herb.name}</h3>
                <p className="text-sm italic text-muted-foreground mb-2">{herb.botanical_name}</p>
                <p className="text-muted-foreground mb-3">{herb.why}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium">Dosage:</span> {herb.dosage}</div>
                  <div><span className="font-medium">Timing:</span> {herb.timing}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Diet Recommendations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
              <Apple className="w-5 h-5 text-accent" />
            </div>
            Dietary Shifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Add
              </h4>
              <ul className="space-y-2">
                {protocol.phase1.diet.add.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Remove
              </h4>
              <ul className="space-y-2">
                {protocol.phase1.diet.remove.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          <strong>Disclaimer:</strong> This protocol is for educational purposes only.
          Consult a qualified healthcare provider before starting any new supplement.
        </p>
      </div>
    </div>
  );
}
