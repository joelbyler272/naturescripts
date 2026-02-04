import type { Metadata } from 'next';
import { UpgradeContent } from './UpgradeContent';

export const metadata: Metadata = {
  title: 'Upgrade to Pro',
  description: 'Unlock unlimited consultations and premium features with NatureScripts Pro.',
};

export default function UpgradePage() {
  return <UpgradeContent />;
}
