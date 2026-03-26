import { Metadata } from 'next';
import { QuizzesContent } from './QuizzesContent';

export const metadata: Metadata = {
  title: 'Health Quizzes | NatureScripts',
  description: 'Take quick health assessments to discover personalized natural wellness recommendations.',
};

export default function QuizzesPage() {
  return <QuizzesContent />;
}
