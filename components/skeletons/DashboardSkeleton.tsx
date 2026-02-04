import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* Welcome header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-3 w-24 mt-1 ml-auto" />
          </div>
        </div>
      </div>

      {/* Chat input */}
      <div className="mb-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
      </div>

      {/* Tip */}
      <Skeleton className="h-12 w-full rounded-lg mb-5" />

      {/* Protocols section */}
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}
