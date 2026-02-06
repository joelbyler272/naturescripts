import { Transaction } from '@/lib/admin/revenue';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const statusConfig = {
  succeeded: {
    icon: CheckCircle,
    label: 'Succeeded',
    className: 'text-green-600',
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    className: 'text-red-600',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'text-amber-600',
  },
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
              Amount
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
              Customer
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
              Status
            </th>
            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map((txn) => {
            const status = statusConfig[txn.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <tr key={txn.id}>
                <td className="py-3">
                  <span className="text-sm font-medium text-gray-900">
                    ${txn.amount.toFixed(2)} {txn.currency}
                  </span>
                </td>
                <td className="py-3">
                  <span className="text-sm text-gray-600">
                    {txn.customerEmail || 'Unknown'}
                  </span>
                </td>
                <td className="py-3">
                  <span className={cn('inline-flex items-center gap-1 text-sm', status.className)}>
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-500">
                  {txn.created.toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
