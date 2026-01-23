import Link from 'next/link';
import { ProtocolCard } from '@/components/protocol/ProtocolCard';
import { MOCK_CONSULTATIONS } from '@/lib/data/hardcoded';
import { routes } from '@/lib/constants/routes';
import { Plus } from 'lucide-react';

export default function ProtocolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Protocols</h1>
          <p className="text-muted-foreground">
            View and manage all your personalized health protocols
          </p>
        </div>
        <Link
          href={routes.consultation}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {/* Protocols List */}
      {MOCK_CONSULTATIONS.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {MOCK_CONSULTATIONS.map((consultation) => (
            <ProtocolCard key={consultation.id} consultation={consultation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-accent/20">
          <p className="text-muted-foreground mb-4">No protocols yet.</p>
          <Link
            href={routes.consultation}
            className="text-accent hover:text-accent/80 font-medium"
          >
            Start your first consultation
          </Link>
        </div>
      )}
    </div>
  );
}
