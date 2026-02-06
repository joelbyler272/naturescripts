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
  id: string;
  summary: string;
  recommendations?: Recommendation[];
  dietary_shifts?: DietaryShift[];
  lifestyle_practices?: LifestylePractice[];
  tracking_suggestions?: TrackingSuggestion[];
  disclaimer?: string;
}

interface ProtocolViewerProps {
  protocol: Protocol;
}

export function ProtocolViewer({ protocol }: ProtocolViewerProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-sage-50 rounded-lg p-4">
        <p className="text-gray-800">{protocol.summary}</p>
      </div>

      {/* Recommendations */}
      {protocol.recommendations && protocol.recommendations.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Pill className="w-4 h-4 text-sage-600" />
            Recommendations ({protocol.recommendations.length})
          </h3>
          <div className="space-y-3">
            {protocol.recommendations.map((rec) => (
              <div key={rec.id} className="bg-gray-50 rounded-lg p-3">
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
      {protocol.dietary_shifts && protocol.dietary_shifts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-sage-600" />
            Dietary Shifts ({protocol.dietary_shifts.length})
          </h3>
          <div className="space-y-2">
            {protocol.dietary_shifts.map((ds) => (
              <div key={ds.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
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
      {protocol.lifestyle_practices && protocol.lifestyle_practices.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-sage-600" />
            Lifestyle Practices ({protocol.lifestyle_practices.length})
          </h3>
          <div className="space-y-2">
            {protocol.lifestyle_practices.map((lp) => (
              <div key={lp.id} className="bg-gray-50 rounded-lg p-3">
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
      {protocol.tracking_suggestions && protocol.tracking_suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sage-600" />
            Tracking Suggestions ({protocol.tracking_suggestions.length})
          </h3>
          <div className="space-y-2">
            {protocol.tracking_suggestions.map((ts) => (
              <div key={ts.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
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
      {protocol.disclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">{protocol.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
