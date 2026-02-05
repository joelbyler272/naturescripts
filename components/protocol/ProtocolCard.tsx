import { memo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight } from 'lucide-react';
import { Consultation } from '@/types';
import { getProtocolLabel, getRecommendationCount } from '@/lib/utils/typeGuards';
import { format } from 'date-fns';

interface ProtocolCardProps {
  consultation: Consultation;
}

export const ProtocolCard = memo(function ProtocolCard({ consultation }: ProtocolCardProps) {
  const date = format(new Date(consultation.created_at), 'MMM dd, yyyy');

  // Use centralized type guards for protocol data extraction
  const label = getProtocolLabel(
    consultation.protocol_data,
    consultation.initial_input.slice(0, 60)
  );
  const recCount = getRecommendationCount(consultation.protocol_data);

  return (
    <Link href={`/protocols/${consultation.id}`}>
      <div className="bg-white border border-border/50 rounded-xl px-4 py-3 hover:border-accent/30 transition-colors cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm truncate">
              {label}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{date}</span>
              {recCount > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {recCount} rec{recCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-3" />
        </div>
      </div>
    </Link>
  );
});
