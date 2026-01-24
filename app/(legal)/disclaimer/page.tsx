export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Medical Disclaimer</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <p className="text-amber-900 font-medium">
            The information provided by NatureScripts is for educational purposes only and is not intended as medical advice.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Not Medical Advice</h2>
          <p>NatureScripts is not a healthcare provider. The protocols, recommendations, and information provided are for educational purposes only and should not be considered medical advice, diagnosis, or treatment.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Consult Healthcare Providers</h2>
          <p>Always consult with qualified healthcare professionals before starting any new supplement, herb, or health regimen, especially if you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Are pregnant or nursing</li>
            <li>Have existing health conditions</li>
            <li>Take prescription medications</li>
            <li>Are scheduled for surgery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">No Guarantees</h2>
          <p>Individual results may vary. We make no guarantees about the effectiveness of any protocol or recommendation.</p>
        </section>
      </div>
    </main>
  );
}
