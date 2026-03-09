'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Pencil, Trash2, Leaf, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface RemedyRow {
  id: string;
  slug: string;
  name: string;
  botanical_name: string;
  category: string;
  remedy_group: string;
  rating: number;
  last_updated: string;
  created_at: string;
}

interface RemediesTableProps {
  remedies: RemedyRow[];
}

interface UploadResult {
  message: string;
  success: string[];
  errors: { name: string; error: string }[];
}

export function RemediesTable({ remedies }: RemediesTableProps) {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('All');
  const [deleting, setDeleting] = useState<string | null>(null);
  const groups = ['All', 'Herbs', 'Oils', 'Tinctures', 'Remedies', 'Food'];
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [jsonPreview, setJsonPreview] = useState<string | null>(null);
  const [remedyCount, setRemedyCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredRemedies = (() => {
    // Step 1: filter by active group tab
    let grouped = remedies;
    if (activeGroup !== 'All') {
      grouped = remedies.filter(r => r.remedy_group === activeGroup);
    }

    // Step 2: if no search query, return group-filtered results
    const s = search.toLowerCase().trim();
    if (!s) return grouped;

    // Step 3: name matches first, then category/botanical name matches
    const nameMatches: RemedyRow[] = [];
    const otherMatches: RemedyRow[] = [];

    for (const r of grouped) {
      if (r.name.toLowerCase().includes(s)) {
        nameMatches.push(r);
      } else if (
        r.category.toLowerCase().includes(s) ||
        r.botanical_name.toLowerCase().includes(s)
      ) {
        otherMatches.push(r);
      }
    }

    return [...nameMatches, ...otherMatches];
  })();

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const items = Array.isArray(parsed) ? parsed : [parsed];

        for (const item of items) {
          if (!item.name || !item.slug) {
            setUploadError(`Invalid remedy: "${item.name || '(unnamed)'}". Each remedy needs at least "name" and "slug".`);
            setJsonPreview(null);
            setRemedyCount(0);
            return;
          }
        }

        setRemedyCount(items.length);
        setJsonPreview(
          items.length <= 3
            ? JSON.stringify(items, null, 2).slice(0, 2000)
            : JSON.stringify(items.map((r: RemedyRow) => ({ name: r.name, slug: r.slug, category: r.category })), null, 2)
        );
        setUploadError(null);
      } catch {
        setUploadError('Invalid JSON file. Please check the format.');
        setJsonPreview(null);
        setRemedyCount(0);
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch('/api/admin/remedies/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok && !data.success) {
        setUploadError(data.error || 'Upload failed');
      } else {
        setUploadResult(data);
        router.refresh();
      }
    } catch {
      setUploadError('Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setShowUpload(false);
    setUploadError(null);
    setUploadResult(null);
    setJsonPreview(null);
    setRemedyCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header with search and buttons */}
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Upload className="w-4 h-4" /> Upload JSON
            </button>
            <Link
              href="/admin/remedies/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Remedy
            </Link>
          </div>
        </div>

        {/* Group Tabs */}
        <div className="px-4 pt-3 border-b border-gray-200 flex gap-1 overflow-x-auto">
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap -mb-px ${
                activeGroup === g
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {g}
              <span className="ml-1.5 text-xs text-gray-400">
                ({g === 'All'
                  ? remedies.length
                  : remedies.filter(r => r.remedy_group === g).length})
              </span>
            </button>
          ))}
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

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={resetUpload}>
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upload Remedies JSON</h2>
              <button onClick={resetUpload} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Instructions */}
              <div className="text-sm text-gray-600 space-y-2">
                <p>Upload a JSON file containing one remedy or an array of remedies. Existing remedies with the same slug will be updated.</p>
                <p className="text-xs text-gray-400">
                  Tip: Use the AI prompt and template to generate remedy JSON files quickly without touching code.
                </p>
              </div>

              {/* File Input */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer"
                />
              </div>

              {/* Preview */}
              {jsonPreview && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    {remedyCount} {remedyCount === 1 ? 'remedy' : 'remedies'} found
                  </p>
                  <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 overflow-auto max-h-48">
                    {jsonPreview}
                  </pre>
                </div>
              )}

              {/* Error */}
              {uploadError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {uploadError}
                </div>
              )}

              {/* Success Result */}
              {uploadResult && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {uploadResult.message}
                  </div>
                  {uploadResult.errors.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm">
                      <p className="font-medium mb-1">Failed:</p>
                      <ul className="list-disc list-inside text-xs">
                        {uploadResult.errors.map((err, i) => (
                          <li key={i}>{err.name}: {err.error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={resetUpload}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {uploadResult ? 'Close' : 'Cancel'}
              </button>
              {!uploadResult && (
                <button
                  onClick={handleUpload}
                  disabled={uploading || !jsonPreview || !!uploadError}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : `Upload ${remedyCount} ${remedyCount === 1 ? 'Remedy' : 'Remedies'}`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
