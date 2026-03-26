'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { getUserDocuments, uploadDocument, deleteDocument } from '@/lib/documents/storage';
import { UserDocument, DocumentType, DOCUMENT_TYPE_LABELS } from '@/lib/documents/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FileText, Upload, Trash2, Loader2, FileImage, Clock,
  CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.webp';

export function DocumentsContent() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('lab_report');

  const loadDocuments = useCallback(async () => {
    if (!user?.id) return;
    const docs = await getUserDocuments(user.id);
    setDocuments(docs);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !user?.id) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(user.id, file, selectedType);
      }
      await loadDocuments();
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (doc: UserDocument) => {
    if (!confirm(`Delete "${doc.file_name}"?`)) return;
    await deleteDocument(doc.id, doc.file_path);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'interpreted': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Health Documents</h1>
        <p className="text-sm text-muted-foreground">
          Upload lab reports and medical documents for AI-powered interpretation.
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm font-medium text-foreground">Document Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as DocumentType)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
          >
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-8 text-center transition-colors',
            dragOver ? 'border-accent bg-accent/5' : 'border-border/50 hover:border-border',
            uploading && 'opacity-50 pointer-events-none'
          )}
        >
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground" />
            )}
            <p className="text-sm font-medium text-foreground">
              {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, JPG, PNG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-border/50 rounded-xl">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-sm font-medium text-foreground mb-1">No documents yet</h3>
          <p className="text-xs text-muted-foreground">
            Upload a lab report or medical document to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Your Documents ({documents.length})
          </h2>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 bg-white border border-border/40 rounded-lg hover:border-border transition-colors group"
            >
              <div className="w-9 h-9 bg-secondary/50 rounded-lg flex items-center justify-center flex-shrink-0">
                {doc.mime_type?.startsWith('image/') ? (
                  <FileImage className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              <Link
                href={`/documents/${doc.id}`}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                  {doc.file_name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {DOCUMENT_TYPE_LABELS[doc.document_type as DocumentType] || doc.document_type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                {statusIcon(doc.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(doc)}
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <Link href={`/documents/${doc.id}`}>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
