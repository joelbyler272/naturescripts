import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation isAuthenticated={false} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-charcoal mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-charcoal/80">
          <p className="text-sm text-charcoal/60">Last updated: January 22, 2025</p>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using NatureScripts, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">2. Educational Purpose Only</h2>
            <p>
              NatureScripts provides educational information about natural health approaches and herbal medicine. This service is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">3. User Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing accurate health information during consultations</li>
              <li>Consulting with qualified healthcare providers before implementing protocols</li>
              <li>Disclosing all medications and health conditions to your healthcare providers</li>
              <li>Not using this service in place of emergency medical care</li>
              <li>Keeping your account credentials secure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">4. Subscription and Payments</h2>
            <p>
              Pro subscriptions are billed monthly at $9/month. You may cancel at any time, and your access will continue until the end of your billing period. No refunds for partial months except as required by law or within our 7-day satisfaction guarantee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">5. Limitation of Liability</h2>
            <p>
              NatureScripts and its operators shall not be liable for any damages arising from the use or inability to use this service, including but not limited to adverse reactions to herbs, failure to seek appropriate medical care, or reliance on information provided.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">6. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">7. Contact</h2>
            <p>
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@naturescripts.com" className="text-primary hover:underline">
                legal@naturescripts.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
