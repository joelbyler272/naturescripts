'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export function ExportButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (format: 'jsonl' | 'json') => {
    setLoading(format);
    
    try {
      const response = await fetch(`/api/admin/export/training-data?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob and create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `naturescripts-training-data-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => handleExport('jsonl')}
        disabled={loading !== null}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading === 'jsonl' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Download JSONL
      </button>
      
      <button
        onClick={() => handleExport('json')}
        disabled={loading !== null}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading === 'json' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Download JSON
      </button>
    </div>
  );
}
