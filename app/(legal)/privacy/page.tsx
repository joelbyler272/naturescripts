import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | NatureScripts",
  description: "How NatureScripts collects, uses, and protects your personal and health information.",
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">Legal</p>
      <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-2 tracking-[-0.02em]">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 22, 2025</p>

      <div className="space-y-8 text-foreground/80">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">1. Information We Collect</h2>
          <p className="text-sm leading-relaxed mb-3">We collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed">
            <li><strong>Account information:</strong> Email address and name when you create an account</li>
            <li><strong>Health information:</strong> Symptoms, medications, and health goals you share during consultations</li>
            <li><strong>Usage data:</strong> How you interact with our service (pages visited, features used)</li>
            <li><strong>Device information:</strong> Browser type, operating system, and IP address</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed">
            <li>To generate personalized health protocols</li>
            <li>To check for herb-drug interactions and safety concerns</li>
            <li>To improve our services and recommendation accuracy</li>
            <li>To communicate with you about your account and service updates</li>
            <li>To provide customer support</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">3. Data Sharing</h2>
          <p className="text-sm leading-relaxed">
            We do not sell your personal or health information to third parties. We may share limited data with service providers who help us operate (e.g., hosting, analytics), but only under strict data processing agreements. We will disclose information if required by law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">4. Data Security</h2>
          <p className="text-sm leading-relaxed">
            We implement industry-standard security measures including encryption in transit (TLS) and at rest. Health information is stored securely with access limited to essential service operations. However, no method of transmission or storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">5. Data Retention</h2>
          <p className="text-sm leading-relaxed">
            We retain your data for as long as your account is active or as needed to provide services. Consultation data may be retained in anonymized form for service improvement. You can request deletion of your data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">6. Your Rights</h2>
          <p className="text-sm leading-relaxed mb-3">You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">7. Cookies & Analytics</h2>
          <p className="text-sm leading-relaxed">
            We use essential cookies for authentication and session management. We use privacy-respecting analytics (PostHog) to understand how our service is used. You can opt out of analytics through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">8. Contact</h2>
          <p className="text-sm leading-relaxed">
            For privacy questions or data requests, contact us at{" "}
            <a href="mailto:privacy@naturescripts.com" className="text-accent hover:text-accent/80 transition-colors">
              privacy@naturescripts.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
