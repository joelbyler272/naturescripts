'use client';

import { Pill, Utensils, Heart, BarChart3 } from 'lucide-react';

interface Recommendation {
  id: string;
  name: string;
  type: string;
  dosage?: string;
  timing?: string;
  rationale?: string;
}

interface DietaryShift {
  id: string;
  action: 'add' | 'reduce' | 'avoid';
  item: string;
  rationale?: string;
}

interface LifestylePractice {
  id: string;
  practice: string;
  timing?: string;
  rationale?: string;
}

interface TrackingSuggestion {
  id: string;
  metric: string;
  frequency: 'daily' | 'weekly';
  description?: string;
}

interface Protocol {
  id?: string;
  summary?: string;
  recommendations?: Recommendation[];
  dietary_shifts?: DietaryShift[];
  lifestyle_practices?: LifestylePractice[];
  tracking_suggestions?: TrackingSuggestion[];
  disclaimer?: string;
}

interface ProtocolViewerProps {
  protocol: Protocol | Record<string, unknown>;
}

export function ProtocolViewer({ protocol }: ProtocolViewerProps) {
  const p = protocol as Protocol;
  
  return (
    <div className="space-y-6">
      {/* Summary */}
      {p.summary && (
        <div className="bg-sage-50 rounded-lg p-4">
          <p className="text-gray-800">{p.summary}</p>
        </div>
      )}

      {/* Recommendations */}
      {p.recommendations && p.recommendations.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Pill className="w-4 h-4 text-sage-600" />
            Recommendations ({p.recommendations.length})
          </h3>
          <div className="space-y-3">
            {p.recommendations.map((rec, index) => (
              <div key={rec.id || index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{rec.name}</p>
                    <p className="text-sm text-gray-500">
                      {rec.dosage} {rec.timing && `• ${rec.timing}`}
                    </p>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded capitalize">
                    {rec.type}
                  </span>
                </div>
                {rec.rationale && (
                  <p className="text-sm text-gray-600 mt-2">{rec.rationale}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dietary Shifts */}
      {p.dietary_shifts && p.dietary_shifts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-sage-600" />
            Dietary Shifts ({p.dietary_shifts.length})
          </h3>
          <div className="space-y-2">
            {p.dietary_shifts.map((ds, index) => (
              <div key={ds.id || index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    ds.action === 'add'
                      ? 'bg-green-100 text-green-700'
                      : ds.action === 'reduce'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {ds.action.toUpperCase()}
                </span>
                <span className="text-gray-900">{ds.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Practices */}
      {p.lifestyle_practices && p.lifestyle_practices.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-sage-600" />
            Lifestyle Practices ({p.lifestyle_practices.length})
          </h3>
          <div className="space-y-2">
            {p.lifestyle_practices.map((lp, index) => (
              <div key={lp.id || index} className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900">{lp.practice}</p>
                {lp.timing && (
                  <p className="text-sm text-gray-500 mt-1">{lp.timing}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking Suggestions */}
      {p.tracking_suggestions && p.tracking_suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sage-600" />
            Tracking Suggestions ({p.tracking_suggestions.length})
          </h3>
          <div className="space-y-2">
            {p.tracking_suggestions.map((ts, index) => (
              <div key={ts.id || index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-gray-900">{ts.metric}</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded capitalize">
                  {ts.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {p.disclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">{p.disclaimer}</p>
        </div>
      )}

      {/* Fallback for unknown structure */}
      {!p.summary && !p.recommendations && (
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(protocol, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
