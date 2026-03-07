import { AlertTriangle } from 'lucide-react';

interface AdminErrorProps {
  title?: string;
  message: string;
}

export function AdminError({ title = 'Configuration Error', message }: AdminErrorProps) {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-6 mx-auto max-w-2xl mt-8">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
