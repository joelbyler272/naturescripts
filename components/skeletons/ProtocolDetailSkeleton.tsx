import { Skeleton } from '@/components/ui/skeleton';

export function ProtocolDetailSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Back link */}
      <Skeleton className="h-4 w-24 mb-6" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-5 w-full" />
      </div>

      {/* Original concern */}
      <Skeleton className="h-24 w-full rounded-xl mb-6" />

      {/* Recommendations */}
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="space-y-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border/30">
        <Skeleton className="h-10 w-44 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
    </div>
  );
}
