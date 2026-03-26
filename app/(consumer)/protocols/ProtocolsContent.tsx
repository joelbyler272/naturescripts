'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { useConsultations } from '@/lib/hooks/useConsultations';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { routes } from '@/lib/constants/routes';
import { USAGE_LIMITS } from '@/lib/constants/limits';
import { Plus, Loader2, Sparkles, ArrowRight, ChevronLeft, ChevronRight, Lock, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackUpgradeClicked } from '@/lib/analytics/events';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

export function ProtocolsContent() {
  const router = useRouter();
  const { pastProtocols, loading } = useConsultations();
  const { isPro, loading: usageLoading } = useUsageLimits();
  const [currentPage, setCurrentPage] = useState(1);

  // Apply free tier limit
  const accessibleProtocols = useMemo(() => {
    if (isPro) return pastProtocols;
    return pastProtocols.slice(0, USAGE_LIMITS.FREE_TIER_PROTOCOL_HISTORY);
  }, [pastProtocols, isPro]);

  const lockedCount = pastProtocols.length - USAGE_LIMITS.FREE_TIER_PROTOCOL_HISTORY;
  const hasLockedProtocols = !isPro && lockedCount > 0;

  // Calculate paginated protocols
  const { paginatedProtocols, totalPages } = useMemo(() => {
    const total = accessibleProtocols.length;
    const pages = Math.ceil(total / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      paginatedProtocols: accessibleProtocols.slice(startIndex, endIndex),
      totalPages: pages,
    };
  }, [accessibleProtocols, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgrade = () => {
    trackUpgradeClicked('protocols_history_limit');
    router.push(routes.upgrade);
  };

  const isLoading = loading || usageLoading;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">My Protocols</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Your personalized health protocols from past consultations
            {pastProtocols.length > 0 && (
              isPro 
                ? ` (${pastProtocols.length} total)`
                : ` (${accessibleProtocols.length} of ${pastProtocols.length})`
            )}
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
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      )}

      {/* Protocols List */}
      {!isLoading && paginatedProtocols.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-3">
            {paginatedProtocols.map((consultation) => (
              <ProtocolCard key={consultation.id} consultation={consultation} />
            ))}
          </div>

          {/* Locked Protocols Banner for Free Users */}
          {hasLockedProtocols && (
            <div className="mt-4 p-4 bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {lockedCount} older {lockedCount === 1 ? 'protocol' : 'protocols'} hidden
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Free accounts can view their 3 most recent protocols. Upgrade to Pro for full history access.
                  </p>
                </div>
                <Button 
                  onClick={handleUpgrade}
                  className="bg-accent hover:bg-accent/90 gap-2 flex-shrink-0"
                >
                  <Crown className="w-4 h-4" />
                  Unlock All
                </Button>
              </div>
            </div>
          )}

          {/* Pagination - only show for Pro users with multiple pages */}
          {isPro && totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-2 mt-8"
              aria-label="Protocols pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  currentPage === 1
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-foreground hover:bg-secondary'
                )}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      'min-w-[2.5rem] h-10 rounded-lg text-sm font-medium transition-colors',
                      page === currentPage
                        ? 'bg-accent text-white'
                        : 'text-foreground hover:bg-secondary'
                    )}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  currentPage === totalPages
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-foreground hover:bg-secondary'
                )}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && pastProtocols.length === 0 && (
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
