'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/routes';
import { FileDown, RefreshCw, Lock, Loader2 } from 'lucide-react';
import { trackUpgradeClicked } from '@/lib/analytics/events';

interface ProtocolActionsProps {
  consultationId: string;
  protocolTitle?: string;
}

export function ProtocolActions({ consultationId, protocolTitle }: ProtocolActionsProps) {
  const { isPro } = useUsageLimits();
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch(`/api/protocol/pdf?id=${consultationId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = protocolTitle
        ? `naturescripts-${protocolTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : `naturescripts-protocol-${consultationId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleAdjustProtocol = () => {
    if (!isPro) {
      trackUpgradeClicked('protocol_adjust');
      router.push(routes.upgrade);
      return;
    }

    router.push(`${routes.consultation}?adjust=${consultationId}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Download PDF */}
      <Button
        variant="outline"
        onClick={handleDownloadPdf}
        disabled={downloading}
        className="gap-2"
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        Download PDF
      </Button>

      {/* Adjust Protocol */}
      <Button
        variant="outline"
        onClick={handleAdjustProtocol}
        className="gap-2"
      >
        {isPro ? (
          <RefreshCw className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        {isPro ? 'Adjust Protocol' : 'Adjust (Pro)'}
      </Button>

      {downloadError && (
        <p className="w-full text-sm text-destructive mt-1">{downloadError}</p>
      )}
    </div>
  );
}
