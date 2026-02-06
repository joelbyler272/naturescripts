import { Metadata } from 'next';
import { getAdminStats } from '@/lib/admin/queries';
import { ExportButtons } from '@/components/admin/ExportButtons';
import { Download, Database, FileJson, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Export Data - Admin',
};

export default async function AdminExportPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Export Data</h1>
        <p className="text-gray-500 mt-1">Download anonymized data for AI training</p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-medium text-blue-800">Privacy-Safe Exports</h2>
            <p className="text-blue-700 text-sm mt-1">
              All exports are <strong>fully anonymized</strong>. User IDs, emails, names, and any 
              identifying information are automatically stripped. Only conversation content and 
              protocol data are included.
            </p>
          </div>
        </div>
      </div>

      {/* Available Data */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-400" />
          Available Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-3xl font-semibold text-gray-900">{stats.protocolsGenerated}</p>
            <p className="text-sm text-gray-500 mt-1">Completed consultations with protocols</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-3xl font-semibold text-gray-900">{stats.totalConsultations}</p>
            <p className="text-sm text-gray-500 mt-1">Total consultations (all statuses)</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-3xl font-semibold text-gray-900">
              {stats.totalConsultations > 0 
                ? Math.round((stats.protocolsGenerated / stats.totalConsultations) * 100) 
                : 0}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Completion rate</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-gray-400" />
          Export Options
        </h2>
        
        <div className="space-y-6">
          {/* JSONL Export */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileJson className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Training Data (JSONL)</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Conversation pairs in JSONL format - ready for fine-tuning OpenAI, Anthropic, or open-source models.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Includes: conversation messages, generated protocols, tier info
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <ExportButtons />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Using the Training Data</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>OpenAI Fine-tuning:</strong> Upload the JSONL file directly to the OpenAI fine-tuning API.
          </p>
          <p>
            <strong>Anthropic:</strong> Use the conversations to create prompt examples for Claude.
          </p>
          <p>
            <strong>Open Source (Llama, Mistral):</strong> Convert to your preferred format using the JSON structure.
          </p>
        </div>
      </div>
    </div>
  );
}
