export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
        <p className="text-sm">Last updated: January 22, 2025</p>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using NatureScripts, you agree to be bound by these Terms of Service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Educational Purpose Only</h2>
          <p>NatureScripts provides educational information about natural health approaches. This service is NOT a substitute for professional medical advice.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing accurate health information during consultations</li>
            <li>Consulting with qualified healthcare providers</li>
            <li>Disclosing all medications and health conditions</li>
            <li>Not using this service in place of emergency medical care</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Contact</h2>
          <p>For questions, contact us at <a href="mailto:legal@naturescripts.com" className="text-accent hover:underline">legal@naturescripts.com</a></p>
        </section>
      </div>
    </main>
  );
}
