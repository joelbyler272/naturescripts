import { Metadata } from 'next';
import { IntakeWizard } from './IntakeWizard';

export const metadata: Metadata = {
  title: 'Wellness Intake | NatureScripts',
  description: 'Complete your wellness intake assessment for personalized natural health recommendations.',
};

export default function IntakePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <IntakeWizard />
    </div>
  );
}
