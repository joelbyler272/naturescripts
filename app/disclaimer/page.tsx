import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation isAuthenticated={false} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-3 mb-8">
          <AlertTriangle className="w-10 h-10 text-amber-600" />
          <h1 className="text-4xl font-bold text-charcoal">Medical Disclaimer</h1>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-8">
          <p className="text-lg font-semibold text-amber-900 mb-2">
            IMPORTANT: Please Read Carefully
          </p>
          <p className="text-amber-900">
            The information provided by NatureScripts is for educational and informational purposes only. It is NOT intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6 text-charcoal/80">
          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">1. Not Medical Advice</h2>
            <p>
              NatureScripts uses artificial intelligence to provide educational information about herbal medicine and natural health approaches. The protocols and recommendations generated are based on traditional herbal medicine principles and available research, but they are NOT medical advice.
            </p>
            <p>
              <strong>You should ALWAYS:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consult with a qualified healthcare provider before starting any new supplement or making health changes</li>
              <li>Disclose all herbs and supplements to your doctor and pharmacist</li>
              <li>Never stop prescribed medications without consulting your healthcare provider</li>
              <li>Seek emergency medical attention for serious or worsening symptoms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">2. AI Limitations</h2>
            <p>
              While our AI is trained on extensive research and traditional herbal medicine knowledge, it:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cannot diagnose medical conditions</li>
              <li>Cannot replace individualized care from a licensed practitioner</li>
              <li>May not account for all individual health factors, allergies, or contraindications</li>
              <li>Should not be relied upon as the sole source of health information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">3. Herb Safety</h2>
            <p>
              Herbal supplements can have powerful effects and potential risks:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Drug Interactions:</strong> Herbs can interact with prescription and over-the-counter medications</li>
              <li><strong>Side Effects:</strong> Natural does not mean safe; herbs can cause adverse reactions</li>
              <li><strong>Quality Varies:</strong> Herbal supplement quality and purity varies widely between manufacturers</li>
              <li><strong>Contraindications:</strong> Some herbs are not safe during pregnancy, for certain medical conditions, or before surgery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">4. Individual Variation</h2>
            <p>
              Every person is unique. What works for one person may not work for another, and individual responses to herbs vary greatly. Professional guidance is essential for personalized care.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">5. No Warranties</h2>
            <p>
              NatureScripts makes no warranties or guarantees about the accuracy, completeness, or adequacy of the information provided. Use of this service is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">6. Licensing</h2>
            <p>
              NatureScripts is not a licensed healthcare provider. We do not provide medical, nursing, or other licensed healthcare services. Our service is strictly educational.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">7. Emergency Situations</h2>
            <p className="text-lg font-semibold text-destructive">
              If you are experiencing a medical emergency, call 911 (or your local emergency number) immediately. Do not use NatureScripts for emergency situations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-4">8. Assumption of Risk</h2>
            <p>
              By using NatureScripts, you acknowledge that you understand these limitations and assume all risks associated with using the information provided. You agree to consult with qualified healthcare professionals before implementing any protocols or recommendations.
            </p>
          </section>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mt-8">
          <p className="text-center text-amber-900 font-semibold">
            When in doubt, always seek professional medical guidance. Your health and safety are paramount.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
