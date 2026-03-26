import { Metadata } from 'next';
import { DocumentDetail } from './DocumentDetail';

export const metadata: Metadata = {
  title: 'Document Detail | NatureScripts',
  description: 'View your health document analysis and AI interpretation.',
};

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocumentDetail documentId={id} />;
}
