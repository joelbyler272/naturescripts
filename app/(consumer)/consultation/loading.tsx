import { Loader2 } from 'lucide-react';

export default function ConsultationLoading() {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-center py-24">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Preparing your consultation...</p>
      </div>
    </div>
  );
}
