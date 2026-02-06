import { Metadata } from 'next';
import { getConsultations, getAdminStats } from '@/lib/admin/queries';
import { ConsultationsTable } from '@/components/admin/ConsultationsTable';

export const metadata: Metadata = {
  title: 'Consultations - Admin',
};

export default async function AdminConsultationsPage() {
  const [consultations, stats] = await Promise.all([
    getConsultations(100),
    getAdminStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Consultations</h1>
        <p className="text-gray-500 mt-1">
          {stats.totalConsultations} total ({stats.protocolsGenerated} with protocols)
        </p>
      </div>

      {/* Consultations Table */}
      <ConsultationsTable consultations={consultations} />
    </div>
  );
}
