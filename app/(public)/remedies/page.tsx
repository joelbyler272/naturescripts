'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { HerbCard } from '@/components/consultation/HerbCard';
import { MOCK_HERBS } from '@/lib/data/hardcoded';
import { Search } from 'lucide-react';

export default function RemediesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRemedies = MOCK_HERBS.filter((herb) =>
    herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.botanical_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Remedy Database</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive collection of natural remedies with evidence-based information
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search remedies by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Remedies Grid */}
      {filteredRemedies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRemedies.map((herb) => (
            <HerbCard key={herb.id} herb={herb} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No remedies found matching your search</p>
        </div>
      )}
    </div>
  );
}
