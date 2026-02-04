import { Skeleton } from '@/components/ui/skeleton';

export default function RemediesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
