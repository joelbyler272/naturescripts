'use client';

import Link from 'next/link';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useConsultations } from '@/lib/hooks/useConsultations';
import { routes } from '@/lib/constants/routes';
import { Plus, Loader2, Sparkles, ArrowRight } from 'lucide-react';

export function ProtocolsContent() {
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
        <div className="text-center py-16 sm:py-20 bg-gradient-to-b from-white/80 to-white/40 rounded-2xl border-2 border-dashed border-border/50">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No protocols yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Complete a consultation to receive your first personalized natural health protocol.
          </p>
          <Link
            href={routes.consultation}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-medium"
          >
            Start your first consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
