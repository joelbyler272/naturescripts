import { Metadata } from 'next';
import { RemedyForm } from '@/components/admin/RemedyForm';

export const metadata: Metadata = { title: 'Add Remedy - Admin' };

export default function NewRemedyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New Remedy</h1>
        <p className="text-gray-500 mt-1">Create a new entry in the remedy database</p>
      </div>
      <RemedyForm mode="create" />
    </div>
  );
}
