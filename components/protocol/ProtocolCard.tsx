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
  const patterns = consultation.protocol_data?.analysis?.patterns?.slice(0, 3) || [];

  return (
    <Link href={`/protocols/${consultation.id}`}>
      <Card className="hover:border-primary/30 transition-colors cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-charcoal/60" />
                <span className="text-sm text-charcoal/60">{date}</span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2">
                {consultation.initial_input.slice(0, 60)}
                {consultation.initial_input.length > 60 ? '...' : ''}
              </h3>
              <div className="flex flex-wrap gap-2">
                {patterns.length > 0 ? (
                  patterns.map((pattern, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {pattern}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    In progress
                  </Badge>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-charcoal/40 flex-shrink-0 ml-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
