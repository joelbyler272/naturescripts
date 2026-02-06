'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConsultationListItem } from '@/lib/admin/queries';
import { Search, CheckCircle, Clock, XCircle, FileText, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsultationsTableProps {
  consultations: ConsultationListItem[];
}

const statusConfig = {
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

export function ConsultationsTable({ consultations }: ConsultationsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      c.initial_input.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by concern or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="abandoned">Abandoned</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Initial Concern
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Tier
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Protocol
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Created
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredConsultations.map((consultation) => {
              const status = statusConfig[consultation.status];
              const StatusIcon = status.icon;
              
              return (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 max-w-xs truncate">
                      {consultation.initial_input}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {consultation.id.slice(0, 8)}...
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                        status.className
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 capitalize">
                      {consultation.tier_at_creation}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {consultation.has_protocol ? (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600">
                        <FileText className="w-4 h-4" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/consultations/${consultation.id}`}
                      className="inline-flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No consultations found
          </div>
        )}
      </div>
    </div>
  );
}
