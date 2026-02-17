import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAnonymizedConsultation } from '@/lib/admin/queries';
import { ConversationViewer } from '@/components/admin/ConversationViewer';
import { ProtocolViewer } from '@/components/admin/ProtocolViewer';
import { ArrowLeft, MessageSquare, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Consultation Details - Admin',
};

const statusConfig: Record<string, { icon: typeof CheckCircle; label: string; className: string }> = {
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    className: 'bg-green-100 text-green-700',
  },
  in_progress: {
    icon: Clock,
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-700',
  },
  abandoned: {
    icon: XCircle,
    label: 'Abandoned',
    className: 'bg-gray-100 text-gray-700',
  },
};

const defaultStatus = {
  icon: Clock,
  label: 'Unknown',
  className: 'bg-gray-100 text-gray-500',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const consultation = await getAnonymizedConsultation(id);

  if (!consultation) {
    notFound();
  }

  const status = statusConfig[consultation.status] || defaultStatus;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/consultations"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Consultations
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Consultation Details</h1>
          <p className="text-gray-500 mt-1">Anonymized view - no personal data shown</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
            status.className
          )}
        >
          <StatusIcon className="w-4 h-4" />
          {status.label}
        </span>
      </div>

      {/* Meta Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Consultation ID</p>
            <p className="text-sm font-mono text-gray-900 mt-1">
              {consultation.id.slice(0, 8)}...
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tier at Creation</p>
            <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
              {consultation.tier_at_creation}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-sm text-gray-900 mt-1">
              {new Date(consultation.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Messages</p>
            <p className="text-sm text-gray-900 mt-1">
              {consultation.conversation_log?.length || 0} messages
            </p>
          </div>
        </div>
      </div>

      {/* Initial Input */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          Initial Concern
        </h2>
        <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
          {consultation.initial_input}
        </p>
      </div>

      {/* Conversation Log */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          Conversation
        </h2>
        <ConversationViewer messages={consultation.conversation_log || []} />
      </div>

      {/* Protocol (if generated) */}
      {consultation.protocol_data && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Generated Protocol
          </h2>
          <ProtocolViewer protocol={consultation.protocol_data} />
        </div>
      )}
    </div>
  );
}
