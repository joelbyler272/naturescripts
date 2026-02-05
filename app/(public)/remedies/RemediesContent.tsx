'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllRemedies, searchRemedies } from '@/lib/remedies/data';
import { Search, Leaf, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RemediesContent() {
  const [query, setQuery] = useState('');
  const allRemedies = getAllRemedies();

  const filteredRemedies = useMemo(() => {
    if (!query.trim()) return allRemedies;
    return searchRemedies(query);
  }, [query, allRemedies]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3 sm:mb-4">
          Remedy Database
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Evidence-based information on natural remedies, herbs, and supplements.
          Search for anything from specific remedies to symptoms and conditions.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search remedies, symptoms, or questions..."
            className={cn(
              'w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border bg-white',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
              'transition-all text-sm sm:text-base'
            )}
          />
        </div>
        {query && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {filteredRemedies.length} result{filteredRemedies.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Results */}
      {filteredRemedies.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {filteredRemedies.map((remedy) => (
            <Link
              key={remedy.id}
              href={`/remedies/${remedy.slug}`}
              className="block p-4 sm:p-6 bg-white border border-border/50 rounded-xl hover:border-accent/50 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                        {remedy.name}
                      </h2>
                      <span className="px-2 py-0.5 bg-secondary text-xs text-foreground rounded-full">
                        {remedy.category}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground italic mb-2">
                      {remedy.botanicalName}
                    </p>
                    <p className="text-xs sm:text-sm text-foreground/70 line-clamp-2">
                      {remedy.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base sm:text-lg font-bold text-accent">{remedy.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">evidence</span>
                      </div>
                      <div className="hidden sm:flex gap-1">
                        {remedy.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1 sm:mt-2" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-2">No remedies found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Try a different search term or browse all remedies
          </p>
          <button
            onClick={() => setQuery('')}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Evidence Rating Info */}
      <div className="mt-12 sm:mt-16 p-4 sm:p-6 bg-secondary/30 rounded-xl">
        <h3 className="font-semibold text-foreground mb-2">About Our Evidence Ratings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Each remedy is rated from 1.0 to 10.0 based on the quality and quantity of scientific research
          supporting its traditional uses. A higher rating means stronger research backing.
        </p>
        <Link
          href="/remedies/evidence-rating"
          className="text-sm text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1"
        >
          Learn more about our rating system
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
