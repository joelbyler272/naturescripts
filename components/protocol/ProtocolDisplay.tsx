'use client';

import { GeneratedProtocol, DietaryShift, LifestylePractice, TrackingSuggestion } from '@/lib/consultation/types';
import { RecommendationCard } from './RecommendationCard';
import { 
  FileText, UtensilsCrossed, Heart, BarChart3, 
  AlertTriangle, Plus, Minus, Ban, Clock, Calendar 
} from 'lucide-react';

interface ProtocolDisplayProps {
  protocol: GeneratedProtocol;
  showTitle?: boolean;
}

// Dietary shift action icons
const dietaryActionIcons = {
  add: <Plus className="w-4 h-4 text-green-600" />,
  reduce: <Minus className="w-4 h-4 text-amber-600" />,
  avoid: <Ban className="w-4 h-4 text-red-600" />,
};

const dietaryActionColors = {
  add: 'bg-green-50 border-green-200',
  reduce: 'bg-amber-50 border-amber-200',
  avoid: 'bg-red-50 border-red-200',
};

function DietaryShiftCard({ shift }: { shift: DietaryShift }) {
  const icon = dietaryActionIcons[shift.action];
  const colors = dietaryActionColors[shift.action];

  return (
    <div className={`p-4 rounded-lg border ${colors}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium text-foreground capitalize">{shift.action}</span>
        <span className="font-semibold text-foreground">{shift.item}</span>
      </div>
      <p className="text-sm text-muted-foreground">{shift.rationale}</p>
    </div>
  );
}

function LifestylePracticeCard({ practice }: { practice: LifestylePractice }) {
  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-accent/10 rounded-lg shrink-0">
          <Heart className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground mb-1">{practice.practice}</h4>
          {practice.timing && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Clock className="w-3 h-3" />
              <span>{practice.timing}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground">{practice.rationale}</p>
        </div>
      </div>
    </div>
  );
}

function TrackingSuggestionCard({ suggestion }: { suggestion: TrackingSuggestion }) {
  return (
    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/50">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
          <BarChart3 className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{suggestion.metric}</h4>
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {suggestion.frequency}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
        </div>
      </div>
    </div>
  );
}

export function ProtocolDisplay({ protocol, showTitle = true }: ProtocolDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Summary */}
      {showTitle && (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent" />
            Your Wellness Protocol
          </h1>
          <p className="text-muted-foreground">
            Created on {new Date(protocol.created_at || Date.now()).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      {/* Protocol Summary */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
        <p className="text-foreground leading-relaxed">{protocol.summary}</p>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Recommendations ({protocol.recommendations.length})
        </h2>
        <div className="grid gap-4">
          {protocol.recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>

      {/* Dietary Shifts (Pro only) */}
      {protocol.dietary_shifts && protocol.dietary_shifts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-accent" />
            Dietary Shifts
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {protocol.dietary_shifts.map((shift) => (
              <DietaryShiftCard key={shift.id} shift={shift} />
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Practices (Pro only) */}
      {protocol.lifestyle_practices && protocol.lifestyle_practices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent" />
            Lifestyle Practices
          </h2>
          <div className="grid gap-3">
            {protocol.lifestyle_practices.map((practice) => (
              <LifestylePracticeCard key={practice.id} practice={practice} />
            ))}
          </div>
        </div>
      )}

      {/* Tracking Suggestions (Pro only) */}
      {protocol.tracking_suggestions && protocol.tracking_suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            What to Track
          </h2>
          <div className="grid gap-3">
            {protocol.tracking_suggestions.map((suggestion) => (
              <TrackingSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">{protocol.disclaimer}</p>
      </div>
    </div>
  );
}
