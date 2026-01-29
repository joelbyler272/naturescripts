'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GeneratedProtocol } from '@/lib/consultation/types';
import { routes } from '@/lib/constants/routes';
import { 
  ArrowLeft, 
  Leaf, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  Share2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProtocolPage() {
  const params = useParams();
  const [protocol, setProtocol] = useState<GeneratedProtocol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get protocol from sessionStorage (just generated)
    const stored = sessionStorage.getItem('generated-protocol');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.id === params.id) {
        setProtocol(parsed);
        setLoading(false);
        return;
      }
    }
    
    // In a real app, we'd fetch from database here
    // For now, show not found
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary/50 rounded w-1/3" />
          <div className="h-4 bg-secondary/50 rounded w-2/3" />
          <div className="h-64 bg-secondary/50 rounded" />
        </div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Protocol Not Found</h1>
        <p className="text-muted-foreground mb-6">This protocol may have expired or doesn't exist.</p>
        <Link href={routes.dashboard}>
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const sizeLabel = {
    light: 'Quick Recommendation',
    medium: 'Standard Protocol',
    full: 'Comprehensive Protocol',
  }[protocol.size];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        href={routes.dashboard}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-accent uppercase tracking-wide">
            {sizeLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            • Created {new Date(protocol.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {protocol.primaryConcern} Protocol
        </h1>
        <p className="text-muted-foreground">{protocol.summary}</p>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-accent" />
          Recommendations
        </h2>
        
        <div className="space-y-4">
          {protocol.recommendations.map((rec, index) => (
            <div 
              key={index}
              className="bg-white border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{rec.herb}</h3>
                  <p className="text-sm text-muted-foreground italic">{rec.botanicalName}</p>
                </div>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>
              
              <p className="text-sm text-foreground/80 mb-4">{rec.reason}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Dosage</p>
                    <p className="text-muted-foreground">{rec.dosage}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Timing</p>
                    <p className="text-muted-foreground">{rec.timing}</p>
                  </div>
                </div>
              </div>
              
              {rec.duration && (
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">
                  Duration: {rec.duration}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle Tips */}
      {protocol.lifestyleTips && protocol.lifestyleTips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            Lifestyle Tips
          </h2>
          
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
            <ul className="space-y-3">
              {protocol.lifestyleTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Warnings */}
      {protocol.warnings && protocol.warnings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Important Notes
          </h2>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <ul className="space-y-2">
              {protocol.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="text-amber-500">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/30">
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <div className="flex-1" />
        <Link href={routes.consultation}>
          <Button variant="outline" size="sm">
            Start New Consultation
          </Button>
        </Link>
      </div>
    </div>
  );
}
