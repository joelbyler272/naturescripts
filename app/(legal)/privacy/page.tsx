export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
        <p className="text-sm">Last updated: January 22, 2025</p>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly, including email address, name, and health information you share during consultations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide personalized health protocols</li>
            <li>To improve our services</li>
            <li>To communicate with you about your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Contact</h2>
          <p>For questions, contact us at <a href="mailto:privacy@naturescripts.com" className="text-accent hover:underline">privacy@naturescripts.com</a></p>
        </section>
      </div>
    </main>
  );
}
