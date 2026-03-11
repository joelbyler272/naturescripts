import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | NatureScripts",
  description: "NatureScripts terms of service covering usage, responsibilities, subscriptions, and policies.",
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">Legal</p>
      <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-2 tracking-[-0.02em]">
        Terms of Service
      </h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 22, 2025</p>

      <div className="space-y-8 text-foreground/80">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed">
            By accessing or using NatureScripts, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">2. Educational Purpose Only</h2>
          <p className="text-sm leading-relaxed">
            NatureScripts provides educational information about natural health approaches. This service is NOT a substitute for professional medical advice, diagnosis, or treatment. Never disregard professional medical advice or delay seeking it because of information provided by NatureScripts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">3. User Responsibilities</h2>
          <p className="text-sm leading-relaxed mb-3">As a user of NatureScripts, you agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed">
            <li>Provide accurate health information during consultations</li>
            <li>Consult with qualified healthcare providers before starting any new health regimen</li>
            <li>Disclose all medications, supplements, and health conditions</li>
            <li>Not use this service in place of emergency medical care</li>
            <li>Not rely solely on NatureScripts for health decisions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">4. Account & Subscription</h2>
          <p className="text-sm leading-relaxed">
            Free accounts have limited consultation access. Pro subscriptions are billed monthly and can be cancelled at any time from your account settings. Upon cancellation, you retain access until the end of your current billing period. We reserve the right to modify pricing with 30 days notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">5. Intellectual Property</h2>
          <p className="text-sm leading-relaxed">
            All content, protocols, and materials provided by NatureScripts are protected by copyright. You may use your personal protocols for your own health purposes but may not redistribute, sell, or commercially exploit our content without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">6. Limitation of Liability</h2>
          <p className="text-sm leading-relaxed">
            NatureScripts is provided "as is" without warranties of any kind. We are not liable for any health outcomes resulting from the use of our service. Individual results vary, and we make no guarantees about the effectiveness of any protocol or recommendation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">7. Modifications</h2>
          <p className="text-sm leading-relaxed">
            We reserve the right to modify these terms at any time. Material changes will be communicated via email or through the service. Continued use after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">8. Contact</h2>
          <p className="text-sm leading-relaxed">
            For questions about these terms, contact us at{" "}
            <a href="mailto:legal@naturescripts.com" className="text-accent hover:text-accent/80 transition-colors">
              legal@naturescripts.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
