'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getConsultation } from '@/lib/supabase/database';
import { useAuth } from '@/lib/auth/AuthContext';
import { Consultation, Protocol } from '@/types';
import { GeneratedProtocol, ProtocolRecommendation } from '@/lib/consultation/types';
import { routes } from '@/lib/constants/routes';

// Type guard for new protocol shape (GeneratedProtocol)
function isNewProtocolShape(data: unknown): data is GeneratedProtocol {
  return (
    typeof data === 'object' &&
    data !== null &&
    'primaryConcern' in data &&
    typeof (data as GeneratedProtocol).primaryConcern === 'string'
  );
}

// Type guard for old protocol shape (Protocol)
function isOldProtocolShape(data: unknown): data is Protocol {
  return (
    typeof data === 'object' &&
    data !== null &&
    'analysis' in data &&
    typeof (data as Protocol).analysis === 'object'
  );
}

// Normalized recommendation for display
interface DisplayRecommendation {
  herb: string;
  botanicalName: string;
  dosage: string;
  timing: string;
  reason: string;
  duration?: string;
}
import {
  ArrowLeft,
  Leaf,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function ProtocolPage() {
  const params = useParams();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const loadProtocol = useCallback(async () => {
    if (!params.id || typeof params.id !== 'string') {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      // Pass userId to verify ownership (security)
      const data = await getConsultation(params.id, user?.id);
      setConsultation(data);
    } catch (err) {
      setError('Failed to load protocol. Please try again.');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [params.id, user?.id]);

  useEffect(() => {
    loadProtocol();
  }, [loadProtocol]);

  const handleRetry = () => {
    setRetrying(true);
    setLoading(true);
    loadProtocol();
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-24 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground">Loading protocol...</p>
      </div>
    );
  }

  // Show error with retry option
  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Failed to Load Protocol</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={handleRetry} disabled={retrying} className="bg-accent hover:bg-accent/90">
            {retrying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
          <Link href={routes.dashboard}>
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const protocolData = consultation?.protocol_data;

  if (!consultation || !protocolData) {
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

  // Determine protocol shape and extract data with proper type safety
  const isNewShape = isNewProtocolShape(protocolData);
  const isOldShape = isOldProtocolShape(protocolData);

  // Safely extract title with fallbacks
  let title: string;
  if (isNewShape) {
    title = protocolData.primaryConcern;
  } else if (isOldShape && protocolData.analysis?.patterns?.[0]) {
    title = protocolData.analysis.patterns[0];
  } else {
    title = consultation.initial_input?.slice(0, 60) ?? 'Health Protocol';
  }

  // Safely extract summary
  let summary = '';
  if (isNewShape) {
    summary = protocolData.summary ?? '';
  } else if (isOldShape) {
    summary = protocolData.analysis?.explanation ?? '';
  }

  // Safely extract recommendations/tips/warnings
  let recommendations: ProtocolRecommendation[] = [];
  let lifestyleTips: string[] = [];
  let warnings: string[] = [];

  if (isNewShape) {
    recommendations = protocolData.recommendations ?? [];
    lifestyleTips = protocolData.lifestyleTips ?? [];
    warnings = protocolData.warnings ?? [];
  } else if (isOldShape) {
    warnings = protocolData.red_flags ?? [];
  }

  // Determine size label
  const sizeLabelMap: Record<string, string> = {
    light: 'Quick Recommendation',
    medium: 'Standard Protocol',
    full: 'Comprehensive Protocol',
  };
  const sizeLabel = isNewShape
    ? sizeLabelMap[protocolData.size] ?? 'Protocol'
    : 'Protocol';

  // Convert old herbs format to display format
  const oldHerbs: DisplayRecommendation[] = [];
  if (isOldShape && protocolData.phase1?.herbs) {
    for (const herb of protocolData.phase1.herbs) {
      oldHerbs.push({
        herb: herb.name,
        botanicalName: herb.botanical_name,
        dosage: herb.dosage,
        timing: herb.timing,
        reason: herb.why,
        duration: '',
      });
    }
  }

  // Unified recommendations for display
  const allRecs: DisplayRecommendation[] = isNewShape ? recommendations : oldHerbs;

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
            &middot; {new Date(consultation.created_at).toLocaleDateString()}
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
            {allRecs.map((rec, index) => (
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
              {lifestyleTips.map((tip, index) => (
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
              {warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="text-amber-500">&bull;</span>
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
