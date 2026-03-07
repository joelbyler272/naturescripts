'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Pencil, Trash2, Leaf } from 'lucide-react';

interface RemedyRow {
  id: string;
  slug: string;
  name: string;
  botanical_name: string;
  category: string;
  rating: number;
  last_updated: string;
  created_at: string;
}

interface RemediesTableProps {
  remedies: RemedyRow[];
}

export function RemediesTable({ remedies }: RemediesTableProps) {
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const filteredRemedies = remedies.filter(r => {
    const s = search.toLowerCase();
    return r.name.toLowerCase().includes(s) || r.category.toLowerCase().includes(s);
  });

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/remedies/${slug}`, { method: 'DELETE' });
      if (res.ok) router.refresh();
      else alert('Failed to delete');
    } catch {
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header with search and add button */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search remedies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <Link
          href="/admin/remedies/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Remedy
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Category</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Rating</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Updated</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRemedies.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.botanical_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{r.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-emerald-600">{Number(r.rating).toFixed(1)}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {r.last_updated || new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/remedies/${r.slug}/edit`}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(r.slug)}
                      disabled={deleting === r.slug}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRemedies.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No remedies found
          </div>
        )}
      </div>
    </div>
  );
}
