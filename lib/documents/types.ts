// Document Intelligence Types

export type DocumentType = 'lab_report' | 'medical_record' | 'prescription' | 'imaging' | 'other';
export type DocumentStatus = 'uploaded' | 'processing' | 'parsed' | 'interpreted' | 'error';

export interface UserDocument {
  id: string;
  user_id: string;
  document_type: DocumentType;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  provider?: string;
  test_date?: string;
  notes?: string;
  tags: string[];
  parsed_text?: string;
  parsed_data: Record<string, unknown>;
  ai_interpretation?: string;
  ai_interpretation_data: Record<string, unknown>;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
}

export interface LabResult {
  id: string;
  user_id: string;
  document_id?: string;
  test_date?: string;
  marker_name: string;
  value: number;
  unit: string;
  reference_low?: number;
  reference_high?: number;
  status?: 'normal' | 'low' | 'high' | 'critical';
  interpretation?: string;
  created_at: string;
}

export interface LabMarker {
  name: string;
  value: number;
  unit: string;
  referenceLow?: number;
  referenceHigh?: number;
  status: 'normal' | 'low' | 'high' | 'critical';
}

export interface DocumentInterpretation {
  summary: string;
  keyFindings: string[];
  concerns: string[];
  recommendations: string[];
  markers?: LabMarker[];
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  lab_report: 'Lab Report',
  medical_record: 'Medical Record',
  prescription: 'Prescription',
  imaging: 'Imaging Report',
  other: 'Other Document',
};
