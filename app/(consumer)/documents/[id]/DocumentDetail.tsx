'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDocument, getDocumentUrl, deleteDocument } from '@/lib/documents/storage';
import { UserDocument, DOCUMENT_TYPE_LABELS, DocumentType, DocumentInterpretation } from '@/lib/documents/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, FileText, Loader2, Sparkles, AlertTriangle,
  CheckCircle, ChevronDown, ChevronUp, ExternalLink, Trash2
} from 'lucide-react';

interface Props {
  documentId: string;
}

export function DocumentDetail({ documentId }: Props) {
  const router = useRouter();
  const [doc, setDoc] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [interpreting, setInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState<DocumentInterpretation | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showText, setShowText] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const document = await getDocument(documentId);
      if (!document) {
        router.push('/documents');
        return;
      }
      setDoc(document);
      if (document.ai_interpretation_data && Object.keys(document.ai_interpretation_data).length > 0) {
        setInterpretation(document.ai_interpretation_data as unknown as DocumentInterpretation);
      }
      if (document.parsed_text) {
        setTextInput(document.parsed_text);
      }
      // Get file URL for preview
      const url = await getDocumentUrl(document.file_path);
      setFileUrl(url);
      setLoading(false);
    }
    load();
  }, [documentId, router]);

  const handleDelete = async () => {
    if (!doc) return;
    if (!confirm(`Permanently delete "${doc.file_name}"? This will remove the file, AI interpretation, and any extracted lab markers. This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteDocument(doc.id, doc.file_path);
      router.push('/documents');
    } catch {
      alert('Failed to delete the document. Please try again.');
      setDeleting(false);
    }
  };

  const handleInterpret = async () => {
    if (!doc || !textInput.trim()) return;
    setInterpreting(true);
    try {
      const res = await fetch('/api/documents/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: doc.id,
          documentText: textInput,
          documentType: doc.document_type,
        }),
      });

      if (!res.ok) throw new Error('Interpretation failed');

      const data = await res.json();
      setInterpretation(data.interpretation);

      // Reload doc to get updated status
      const updated = await getDocument(documentId);
      if (updated) setDoc(updated);
    } catch {
      alert('Failed to interpret document. Please try again.');
    } finally {
      setInterpreting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!doc) return null;

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10">
      {/* Back link */}
      <Link
        href="/documents"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        All Documents
      </Link>

      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">{doc.file_name}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
            <span>{DOCUMENT_TYPE_LABELS[doc.document_type as DocumentType]}</span>
            <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 inline-flex items-center gap-1">
                View file <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${doc.file_name}`}
          className="gap-2 text-muted-foreground hover:text-destructive"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>

      {/* Text Input for Interpretation */}
      {!interpretation && (
        <div className="mb-8">
          <div className="bg-white border border-border/40 rounded-xl p-5">
            <h2 className="text-sm font-medium text-foreground mb-2">Document Text</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Paste or type the text from your document below. For PDFs, you can copy the text content. For images, type in the key values and information.
            </p>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your lab report or medical document text here..."
              rows={10}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleInterpret}
                disabled={!textInput.trim() || interpreting}
                className="gap-2 bg-accent hover:bg-accent/90 text-white"
              >
                {interpreting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {interpreting ? 'Interpreting...' : 'Interpret with AI'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Interpretation Results */}
      {interpretation && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-white border border-border/40 rounded-xl p-5">
            <h2 className="text-sm font-medium text-accent uppercase tracking-wide mb-2">Summary</h2>
            <p className="text-sm text-foreground leading-relaxed">{interpretation.summary}</p>
          </div>

          {/* Key Findings */}
          {interpretation.keyFindings && interpretation.keyFindings.length > 0 && (
            <div className="bg-white border border-border/40 rounded-xl p-5">
              <h2 className="text-sm font-medium text-foreground mb-3">Key Findings</h2>
              <ul className="space-y-2">
                {interpretation.keyFindings.map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Concerns */}
          {interpretation.concerns && interpretation.concerns.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-5">
              <h2 className="text-sm font-medium text-amber-800 mb-3">Items to Discuss with Your Doctor</h2>
              <ul className="space-y-2">
                {interpretation.concerns.map((concern, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lab Markers */}
          {interpretation.markers && interpretation.markers.length > 0 && (
            <div className="bg-white border border-border/40 rounded-xl p-5">
              <h2 className="text-sm font-medium text-foreground mb-3">Lab Markers</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-2 font-medium text-muted-foreground">Marker</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Value</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Range</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interpretation.markers.map((marker, i) => (
                      <tr key={i} className="border-b border-border/20 last:border-0">
                        <td className="py-2 text-foreground">{marker.name}</td>
                        <td className="py-2 text-foreground">{marker.value} {marker.unit}</td>
                        <td className="py-2 text-muted-foreground">
                          {marker.referenceLow != null && marker.referenceHigh != null
                            ? `${marker.referenceLow}-${marker.referenceHigh}`
                            : '-'}
                        </td>
                        <td className="py-2">
                          <span className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full',
                            marker.status === 'normal' && 'bg-green-100 text-green-700',
                            marker.status === 'low' && 'bg-blue-100 text-blue-700',
                            marker.status === 'high' && 'bg-amber-100 text-amber-700',
                            marker.status === 'critical' && 'bg-red-100 text-red-700',
                          )}>
                            {marker.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {interpretation.recommendations && interpretation.recommendations.length > 0 && (
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
              <h2 className="text-sm font-medium text-accent mb-3">Wellness Suggestions</h2>
              <ul className="space-y-2">
                {interpretation.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Sparkles className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Source Text Toggle */}
          <button
            onClick={() => setShowText(!showText)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showText ? 'Hide' : 'Show'} source text
          </button>
          {showText && (
            <div className="bg-secondary/30 border border-border/30 rounded-lg p-4">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{textInput || doc.parsed_text}</pre>
            </div>
          )}

          {/* Re-interpret button */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInterpretation(null)}
              className="text-sm"
            >
              Re-interpret document
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground italic">
            This AI interpretation is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider for medical decisions.
          </p>
        </div>
      )}
    </div>
  );
}
