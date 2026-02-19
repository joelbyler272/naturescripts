'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUsageLimits } from '@/lib/hooks/useUsageLimits';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/routes';
import { FileDown, RefreshCw, Lock, Loader2, Crown } from 'lucide-react';
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
    if (!isPro) {
      trackUpgradeClicked('protocol_pdf_download');
      router.push(routes.upgrade);
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch(`/api/protocol/pdf?id=${consultationId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download PDF');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `naturescripts-protocol-${consultationId.slice(0, 8)}.pdf`;
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

    // Navigate to consultation with adjustment context
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
        ) : isPro ? (
          <FileDown className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        {isPro ? 'Download PDF' : 'PDF (Pro)'}
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

      {/* Upgrade hint for free users */}
      {!isPro && (
        <Button
          variant="ghost"
          onClick={() => {
            trackUpgradeClicked('protocol_actions_upgrade');
            router.push(routes.upgrade);
          }}
          className="gap-2 text-accent hover:text-accent/80"
        >
          <Crown className="w-4 h-4" />
          Upgrade to Pro
        </Button>
      )}

      {downloadError && (
        <p className="w-full text-sm text-destructive mt-1">{downloadError}</p>
      )}
    </div>
  );
}
