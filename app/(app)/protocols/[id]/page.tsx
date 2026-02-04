'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getConsultation } from '@/lib/supabase/database';
import { Consultation } from '@/types';
import { routes } from '@/lib/constants/routes';
import { 
  ArrowLeft, 
  Leaf, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  Loader2,
} from 'lucide-react';

export default function ProtocolPage() {
  const params = useParams();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!params.id || typeof params.id !== 'string') {
        setLoading(false);
        return;
      }
      try {
        const data = await getConsultation(params.id);
        setConsultation(data);
      } catch (err) {
        console.error('Error loading protocol:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  // protocol_data can be the GeneratedProtocol shape or the old Protocol shape
  const protocol = consultation?.protocol_data as any;

  if (!consultation || !protocol) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Protocol Not Found</h1>
        <p className="text-muted-foreground mb-6">This protocol may not exist or is still in progress.</p>
        <Link href={routes.dashboard}>
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Support both shapes: GeneratedProtocol (new) and Protocol (old schema)
  const isNewShape = !!protocol.primaryConcern;
  const title = isNewShape
    ? protocol.primaryConcern
    : protocol.analysis?.patterns?.[0] || consultation.initial_input.slice(0, 60);
  const summary = isNewShape
    ? protocol.summary
    : protocol.analysis?.explanation || '';
  const recommendations = isNewShape ? (protocol.recommendations || []) : [];
  const lifestyleTips = isNewShape ? (protocol.lifestyleTips || []) : [];
  const warnings = isNewShape
    ? (protocol.warnings || [])
    : (protocol.red_flags || []);
  const sizeLabel = isNewShape
    ? ({ light: 'Quick Recommendation', medium: 'Standard Protocol', full: 'Comprehensive Protocol' }[protocol.size as string] || 'Protocol')
    : 'Protocol';
  // For old shape, extract herb info from phase1
  const oldHerbs = !isNewShape && protocol.phase1?.herbs
    ? protocol.phase1.herbs.map((h: any) => ({
        herb: h.name,
        botanicalName: h.botanical_name,
        dosage: h.dosage,
        timing: h.timing,
        reason: h.why,
        duration: '',
      }))
    : [];
  const allRecs = isNewShape ? recommendations : oldHerbs;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Link
        href={routes.protocols}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        All Protocols
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-accent uppercase tracking-wide">{sizeLabel}</span>
          <span className="text-xs text-muted-foreground">
            \u00b7 {new Date(consultation.created_at).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">{title} Protocol</h1>
        {summary && <p className="text-muted-foreground">{summary}</p>}
      </div>

      {/* Original concern */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-border/30">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Your concern</p>
        <p className="text-sm text-foreground">{consultation.initial_input}</p>
      </div>

      {/* Recommendations */}
      {allRecs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-accent" />
            Recommendations
          </h2>
          <div className="space-y-4">
            {allRecs.map((rec: any, index: number) => (
              <div key={index} className="bg-white border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{rec.herb}</h3>
                    <p className="text-sm text-muted-foreground italic">{rec.botanicalName}</p>
                  </div>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">#{index + 1}</span>
                </div>
                <p className="text-sm text-foreground/80 mb-4">{rec.reason}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">Duration: {rec.duration}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Tips */}
      {lifestyleTips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            Lifestyle Tips
          </h2>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
            <ul className="space-y-3">
              {lifestyleTips.map((tip: string, index: number) => (
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
      {warnings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Important Notes
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <ul className="space-y-2">
              {warnings.map((warning: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="text-amber-500">\u2022</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-border/30">
        <Link href={routes.consultation}>
          <Button className="bg-accent hover:bg-accent/90">Start New Consultation</Button>
        </Link>
        <Link href={routes.dashboard}>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
