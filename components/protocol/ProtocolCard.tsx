import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight } from 'lucide-react';
import { Consultation } from '@/types';
import { format } from 'date-fns';

interface ProtocolCardProps {
  consultation: Consultation;
}

export function ProtocolCard({ consultation }: ProtocolCardProps) {
  const date = format(new Date(consultation.created_at), 'MMM dd, yyyy');
  const protocol = consultation.protocol_data as any;

  // Support both protocol shapes
  const label = protocol?.primaryConcern
    || protocol?.analysis?.patterns?.[0]
    || consultation.initial_input.slice(0, 60);

  const recCount = protocol?.recommendations?.length
    || protocol?.phase1?.herbs?.length
    || 0;

  return (
    <Link href={`/protocols/${consultation.id}`}>
      <Card className="hover:border-accent/30 transition-colors cursor-pointer">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 truncate">
                {label}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {recCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {recCount} recommendation{recCount > 1 ? 's' : ''}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs text-accent border-accent/30">
                  Completed
                </Badge>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
