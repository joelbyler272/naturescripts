import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medical Disclaimer | NatureScripts",
  description: "NatureScripts medical disclaimer. Our service provides educational information only and is not a substitute for professional medical advice.",
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="text-sm font-medium tracking-wider text-accent uppercase mb-3">Legal</p>
      <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-2 tracking-[-0.02em]">
        Medical Disclaimer
      </h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 22, 2025</p>

      {/* Warning banner */}
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-5 mb-10">
        <p className="text-sm text-amber-900 font-medium">
          The information provided by NatureScripts is for educational purposes only and is not intended as medical advice, diagnosis, or treatment.
        </p>
      </div>

      <div className="space-y-8 text-foreground/80">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Not Medical Advice</h2>
          <p className="text-sm leading-relaxed">
            NatureScripts is not a healthcare provider. The protocols, recommendations, and information provided through our service are for educational purposes only and should not be considered medical advice, diagnosis, or treatment. Our service does not establish a doctor-patient relationship.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Consult Healthcare Providers</h2>
          <p className="text-sm leading-relaxed mb-3">
            Always consult with qualified healthcare professionals before starting any new supplement, herb, or health regimen. This is especially important if you:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed">
            <li>Are pregnant or nursing</li>
            <li>Have existing health conditions</li>
            <li>Take prescription medications</li>
            <li>Are scheduled for surgery</li>
            <li>Have a history of allergies to herbs or supplements</li>
            <li>Are under the age of 18</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Interaction Checking Limitations</h2>
          <p className="text-sm leading-relaxed">
            While we check for known herb-drug interactions, our database may not include every possible interaction. New interactions are discovered regularly, and individual responses to herbs and supplements can vary. Always verify with your pharmacist or physician.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">No Guarantees</h2>
          <p className="text-sm leading-relaxed">
            Individual results may vary significantly. We make no guarantees about the effectiveness of any protocol, recommendation, or remedy. The scientific evidence for natural health approaches varies widely, and what works for one person may not work for another.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Emergency Situations</h2>
          <p className="text-sm leading-relaxed">
            NatureScripts is not an emergency service. If you are experiencing a medical emergency, call 911 (or your local emergency number) or go to the nearest emergency room immediately. Do not use NatureScripts as a substitute for emergency medical care.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-foreground mb-3">Contact</h2>
          <p className="text-sm leading-relaxed">
            For questions about this disclaimer, contact us at{" "}
            <a href="mailto:legal@naturescripts.com" className="text-accent hover:text-accent/80 transition-colors">
              legal@naturescripts.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
