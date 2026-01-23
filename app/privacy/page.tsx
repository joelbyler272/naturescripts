import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation isAuthenticated={false} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-charcoal mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-charcoal/80">
          <p className="text-sm text-charcoal/60">Last updated: January 22, 2025</p>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email, name, password (encrypted)</li>
              <li><strong>Health Information:</strong> Symptoms, health concerns, and consultation history</li>
              <li><strong>Usage Data:</strong> How you interact with our service</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store full payment details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide personalized herbal protocols</li>
              <li>Track your progress (Pro members)</li>
              <li>Improve our AI recommendations</li>
              <li>Send service-related communications</li>
              <li>Process payments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption at rest and in transit, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">4. Data Sharing</h2>
            <p>We do NOT sell your personal health information. We only share data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Anthropic (AI), Stripe (payments), Supabase (database)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">6. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We do not use third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">7. Children's Privacy</h2>
            <p>
              NatureScripts is not intended for users under 18. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">8. Contact</h2>
            <p>
              For privacy concerns, contact us at{' '}
              <a href="mailto:privacy@naturescripts.com" className="text-primary hover:underline">
                privacy@naturescripts.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
