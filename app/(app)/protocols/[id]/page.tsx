'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getConsultation } from '@/lib/supabase/database';
import { useAuth } from '@/lib/auth/AuthContext';
import { Consultation, Protocol } from '@/types';
import { GeneratedProtocol as NewGeneratedProtocol, Recommendation, ProductLink, DietaryShift, LifestylePractice } from '@/lib/consultation/types';
import { routes } from '@/lib/constants/routes';
import {
  ArrowLeft,
  Leaf,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RefreshCw,
  ExternalLink,
  Utensils,
  Activity,
  ShoppingCart,
} from 'lucide-react';

// Type guard for Claude-generated protocol (new format)
function isClaudeProtocol(data: unknown): data is NewGeneratedProtocol {
  return (
    typeof data === 'object' &&
    data !== null &&
    'summary' in data &&
    'recommendations' in data &&
    Array.isArray((data as NewGeneratedProtocol).recommendations) &&
    (data as NewGeneratedProtocol).recommendations.length > 0 &&
    'products' in (data as NewGeneratedProtocol).recommendations[0]
  );
}

// Type guard for old template-based protocol
function isLegacyProtocol(data: unknown): data is { primaryConcern: string; summary?: string; recommendations?: unknown[]; lifestyleTips?: string[]; warnings?: string[] } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'primaryConcern' in data
  );
}

// Type guard for very old protocol shape
function isOldProtocolShape(data: unknown): data is Protocol {
  return (
    typeof data === 'object' &&
    data !== null &&
    'analysis' in data &&
    typeof (data as Protocol).analysis === 'object'
  );
}

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

  // Check if it's a Claude-generated protocol (new format with products)
  if (isClaudeProtocol(protocolData)) {
    return <ClaudeProtocolView consultation={consultation} protocol={protocolData} />;
  }

  // Fall back to legacy display for old protocols
  return <LegacyProtocolView consultation={consultation} protocolData={protocolData} />;
}

// New Claude Protocol View with Product Cards
function ClaudeProtocolView({ consultation, protocol }: { consultation: Consultation; protocol: NewGeneratedProtocol }) {
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
          <span className="text-xs font-medium text-accent uppercase tracking-wide">
            {consultation.tier_at_creation === 'pro' ? 'Comprehensive Protocol' : 'Quick Protocol'}
          </span>
          <span className="text-xs text-muted-foreground">
            · {new Date(consultation.created_at).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-3">Your Personalized Protocol</h1>
        <p className="text-muted-foreground">{protocol.summary}</p>
      </div>

      {/* Original concern */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-border/30">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Your concern</p>
        <p className="text-sm text-foreground">{consultation.initial_input}</p>
      </div>

      {/* Recommendations with Product Cards */}
      {protocol.recommendations && protocol.recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-accent" />
            Recommendations
          </h2>
          <div className="space-y-4">
            {protocol.recommendations.map((rec: Recommendation, index: number) => (
              <RecommendationCard key={rec.id || index} recommendation={rec} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Dietary Shifts (Pro only) */}
      {protocol.dietary_shifts && protocol.dietary_shifts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-accent" />
            Dietary Shifts
          </h2>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
            <div className="space-y-4">
              {protocol.dietary_shifts.map((shift: DietaryShift, index: number) => (
                <div key={shift.id || index} className="flex items-start gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    shift.action === 'add' ? 'bg-green-100 text-green-700' :
                    shift.action === 'reduce' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {shift.action.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{shift.item}</p>
                    <p className="text-sm text-muted-foreground">{shift.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lifestyle Practices (Pro only) */}
      {protocol.lifestyle_practices && protocol.lifestyle_practices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Lifestyle Practices
          </h2>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
            <ul className="space-y-4">
              {protocol.lifestyle_practices.map((practice: LifestylePractice, index: number) => (
                <li key={practice.id || index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{practice.practice}</p>
                    {practice.timing && (
                      <p className="text-xs text-accent">{practice.timing}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{practice.rationale}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {protocol.disclaimer && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">{protocol.disclaimer}</p>
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

// Recommendation Card with Product Links
function RecommendationCard({ recommendation, index }: { recommendation: Recommendation; index: number }) {
  const typeLabels: Record<string, string> = {
    herb: '🌿 Herb',
    vitamin: '💊 Vitamin',
    mineral: '⚪ Mineral',
    supplement: '💚 Supplement',
    essential_oil: '🫒 Essential Oil',
    other: '✨ Other',
  };

  return (
    <div className="bg-white border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{recommendation.name}</h3>
          <p className="text-xs text-muted-foreground">
            {typeLabels[recommendation.type] || recommendation.type}
          </p>
        </div>
        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">#{index + 1}</span>
      </div>

      <p className="text-sm text-foreground/80 mb-4">{recommendation.rationale}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Dosage</p>
            <p className="text-muted-foreground">{recommendation.dosage}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-accent mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Timing</p>
            <p className="text-muted-foreground">{recommendation.timing}</p>
          </div>
        </div>
      </div>

      {recommendation.cautions && (
        <p className="text-xs text-amber-600 mb-4 flex items-start gap-1">
          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          {recommendation.cautions}
        </p>
      )}

      {/* Product Links */}
      {recommendation.products && recommendation.products.length > 0 && (
        <div className="pt-4 border-t border-border/30">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            Shop Now
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recommendation.products.map((product: ProductLink, pIndex: number) => (
              <a
                key={pIndex}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{product.brand}</p>
                  <p className="text-xs text-muted-foreground truncate">{product.name}</p>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    product.source === 'amazon' ? 'bg-orange-100 text-orange-700' :
                    product.source === 'iherb' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {product.source === 'amazon' ? 'Amazon' : product.source === 'iherb' ? 'iHerb' : product.source}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Legacy Protocol View for backwards compatibility
function LegacyProtocolView({ consultation, protocolData }: { consultation: Consultation; protocolData: unknown }) {
  const isLegacy = isLegacyProtocol(protocolData);
  const isOld = isOldProtocolShape(protocolData);

  // Extract data based on format
  let title = consultation.initial_input?.slice(0, 60) || 'Health Protocol';
  let summary = '';
  let recommendations: { herb: string; botanicalName?: string; dosage: string; timing: string; reason: string }[] = [];
  let lifestyleTips: string[] = [];
  let warnings: string[] = [];

  if (isLegacy) {
    title = protocolData.primaryConcern || title;
    summary = protocolData.summary || '';
    recommendations = (protocolData.recommendations || []).map((rec: unknown) => {
      const r = rec as { herb?: string; botanicalName?: string; dosage?: string; timing?: string; reason?: string };
      return {
        herb: r.herb || 'Unknown',
        botanicalName: r.botanicalName,
        dosage: r.dosage || '',
        timing: r.timing || '',
        reason: r.reason || '',
      };
    });
    lifestyleTips = protocolData.lifestyleTips || [];
    warnings = protocolData.warnings || [];
  } else if (isOld) {
    summary = protocolData.analysis?.explanation || '';
    warnings = protocolData.red_flags || [];
    if (protocolData.phase1?.herbs) {
      recommendations = protocolData.phase1.herbs.map((herb) => ({
        herb: herb.name,
        botanicalName: herb.botanical_name,
        dosage: herb.dosage,
        timing: herb.timing,
        reason: herb.why,
      }));
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Link
        href={routes.protocols}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        All Protocols
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-accent uppercase tracking-wide">Protocol</span>
          <span className="text-xs text-muted-foreground">
            · {new Date(consultation.created_at).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">{title} Protocol</h1>
        {summary && <p className="text-muted-foreground">{summary}</p>}
      </div>

      <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-border/30">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Your concern</p>
        <p className="text-sm text-foreground">{consultation.initial_input}</p>
      </div>

      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-accent" />
            Recommendations
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white border border-border/50 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{rec.herb}</h3>
                    {rec.botanicalName && (
                      <p className="text-sm text-muted-foreground italic">{rec.botanicalName}</p>
                    )}
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
              </div>
            ))}
          </div>
        </div>
      )}

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
                  <span className="text-amber-500">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
