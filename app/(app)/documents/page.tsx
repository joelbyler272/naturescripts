import { Metadata } from 'next';
import { DocumentsContent } from './DocumentsContent';

export const metadata: Metadata = {
  title: 'Health Documents | NatureScripts',
  description: 'Upload and manage your health documents, lab reports, and medical records.',
};

export default function DocumentsPage() {
  return <DocumentsContent />;
}
