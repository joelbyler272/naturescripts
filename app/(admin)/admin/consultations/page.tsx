import { Metadata } from 'next';
import { getConsultations, getAdminStats } from '@/lib/admin/queries';
import { ConsultationsTable } from '@/components/admin/ConsultationsTable';
import { AdminError } from '@/components/admin/AdminError';
import { ServiceClientError } from '@/lib/supabase/service';

export const metadata: Metadata = {
  title: 'Consultations - Admin',
};

export default async function AdminConsultationsPage() {
  try {
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
  } catch (error) {
    return <AdminError message={error instanceof ServiceClientError ? error.message : 'An unexpected error occurred loading admin data.'} />;
  }
}
