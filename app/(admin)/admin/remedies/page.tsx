import { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/service';
import { RemediesTable } from '@/components/admin/RemediesTable';
import { AdminError } from '@/components/admin/AdminError';
import { ServiceClientError } from '@/lib/supabase/service';

export const metadata: Metadata = { title: 'Remedies - Admin' };

export default async function AdminRemediesPage() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('remedies')
      .select('id, slug, name, botanical_name, category, remedy_group, rating, last_updated, created_at')
      .order('name');

    if (error) throw error;
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Remedy Database</h1>
          <p className="text-gray-500 mt-1">Manage your natural remedy entries</p>
        </div>
        <RemediesTable remedies={data || []} />
      </div>
    );
  } catch (error) {
    return <AdminError message={error instanceof ServiceClientError ? error.message : 'Failed to load remedies.'} />;
  }
}
