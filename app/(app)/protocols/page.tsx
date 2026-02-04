'use client';

import Link from 'next/link';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useConsultations } from '@/lib/hooks/useConsultations';
import { routes } from '@/lib/constants/routes';
import { Plus, Loader2, Leaf } from 'lucide-react';

export default function ProtocolsPage() {
  const { pastProtocols, loading } = useConsultations();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">My Protocols</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Your personalized health protocols from past consultations
          </p>
        </div>
        <Link
          href={routes.consultation}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium self-start"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      )}

      {/* Protocols List */}
      {!loading && pastProtocols.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {pastProtocols.map((consultation) => (
            <ProtocolCard key={consultation.id} consultation={consultation} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && pastProtocols.length === 0 && (
        <div className="text-center py-16 bg-white/60 rounded-xl border-2 border-dashed border-border/50">
          <div className="w-14 h-14 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">No protocols yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Complete a consultation to get your first personalized protocol
          </p>
          <Link
            href={routes.consultation}
            className="text-accent hover:text-accent/80 font-medium text-sm"
          >
            Start your first consultation &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
