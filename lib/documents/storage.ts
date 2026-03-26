import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import { UserDocument, DocumentType, DocumentStatus } from './types';

const BUCKET = 'health-documents';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadDocument(
  userId: string,
  file: File,
  documentType: DocumentType
): Promise<{ filePath: string; document: UserDocument } | null> {
  const supabase = createClient();

  // Create a unique file path: userId/timestamp-filename
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${userId}/${timestamp}-${safeName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    logger.error('Error uploading document:', uploadError);
    return null;
  }

  // Create metadata record
  const { data, error: dbError } = await supabase
    .from('user_documents')
    .insert({
      user_id: userId,
      document_type: documentType,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      status: 'uploaded' as DocumentStatus,
    })
    .select()
    .single();

  if (dbError) {
    logger.error('Error creating document record:', dbError);
    // Clean up uploaded file
    await supabase.storage.from(BUCKET).remove([filePath]);
    return null;
  }

  return { filePath, document: data as UserDocument };
}

/**
 * Get all documents for a user
 */
export async function getUserDocuments(userId: string): Promise<UserDocument[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_documents')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    logger.error('Error fetching documents:', error);
    return [];
  }

  return data as UserDocument[];
}

/**
 * Get a single document
 */
export async function getDocument(documentId: string): Promise<UserDocument | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (error) {
    logger.error('Error fetching document:', error);
    return null;
  }

  return data as UserDocument;
}

/**
 * Update document metadata and status
 */
export async function updateDocument(
  documentId: string,
  updates: Partial<Pick<UserDocument, 'notes' | 'tags' | 'provider' | 'test_date' | 'parsed_text' | 'parsed_data' | 'ai_interpretation' | 'ai_interpretation_data' | 'status'>>
): Promise<UserDocument | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_documents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', documentId)
    .select()
    .single();

  if (error) {
    logger.error('Error updating document:', error);
    return null;
  }

  return data as UserDocument;
}

/**
 * Delete a document and its storage file
 */
export async function deleteDocument(documentId: string, filePath: string): Promise<boolean> {
  const supabase = createClient();

  // Delete storage file
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([filePath]);

  if (storageError) {
    logger.error('Error deleting file from storage:', storageError);
  }

  // Delete metadata record (cascades to lab_results)
  const { error: dbError } = await supabase
    .from('user_documents')
    .delete()
    .eq('id', documentId);

  if (dbError) {
    logger.error('Error deleting document record:', dbError);
    return false;
  }

  return true;
}

/**
 * Get a temporary download URL for a document
 */
export async function getDocumentUrl(filePath: string): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 3600); // 1 hour

  if (error) {
    logger.error('Error creating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}
