import type { Metadata } from 'next';
import { DashboardContent } from './DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personalized health dashboard. Start consultations, view protocols, and track your wellness journey.',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
