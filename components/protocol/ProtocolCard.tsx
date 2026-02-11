'use client';

import Link from 'next/link';
import { Consultation } from '@/types';
import { routes } from '@/lib/constants/routes';
import { ChevronRight, Leaf } from 'lucide-react';
import { isClaudeProtocol } from '@/lib/consultation/types';

interface ProtocolCardProps {
  consultation: Consultation;
}

export function ProtocolCard({ consultation }: ProtocolCardProps) {
  const protocolData = consultation.protocol_data;
  
  // Get title from protocol_data or generate from initial_input
  let title = 'Health Protocol';
  let recommendationCount = 0;
  
  if (isClaudeProtocol(protocolData)) {
    // New format with title
    const input = consultation.initial_input;
    title = protocolData.title || (input && input.length > 40 ? input.slice(0, 40) + '...' : input) || 'Health Protocol';
    recommendationCount = protocolData.recommendations?.length || 0;
  } else if (protocolData && typeof protocolData === 'object') {
    // Legacy format
    const legacy = protocolData as { primaryConcern?: string; recommendations?: unknown[] };
    const input = consultation.initial_input;
    title = legacy.primaryConcern || (input && input.length > 40 ? input.slice(0, 40) + '...' : input) || 'Health Protocol';
    recommendationCount = Array.isArray(legacy.recommendations) ? legacy.recommendations.length : 0;
  }
  
  // Truncate title if too long
  if (title.length > 50) {
    title = title.slice(0, 47) + '...';
  }

  const formattedDate = new Date(consultation.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`${routes.protocols}/${consultation.id}`}
      className="group block bg-white border border-border/50 rounded-xl p-4 hover:border-accent/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-accent" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formattedDate} · {recommendationCount} recommendation{recommendationCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}
