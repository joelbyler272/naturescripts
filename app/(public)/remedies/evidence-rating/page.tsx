import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { routes } from '@/lib/constants/routes';

export default function EvidenceRatingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href={routes.remedies}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Remedy Database
      </Link>

      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-4">
        Evidence Rating System
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8">
        Every remedy in our database is rated on a scale from 1.0 to 10.0. This rating reflects 
        how strongly the scientific research supports the traditional and claimed uses of that remedy.
      </p>

      <div className="space-y-8">
        {/* Rating Scale */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">The Rating Scale</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-accent">8.0 - 10.0</span>
                <span className="px-2 py-0.5 bg-accent text-white text-xs rounded-full">Strong Evidence</span>
              </div>
              <p className="text-sm text-foreground/80">
                Multiple high-quality clinical trials, systematic reviews, or meta-analyses support 
                the primary uses. The research is consistent, well-designed, and conducted on humans. 
                These remedies have the strongest scientific backing.
              </p>
            </div>
            
            <div className="p-4 bg-white border border-border/50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-foreground">6.0 - 7.9</span>
                <span className="px-2 py-0.5 bg-secondary text-foreground text-xs rounded-full">Good Evidence</span>
              </div>
              <p className="text-sm text-foreground/80">
                Several clinical trials show positive results, though the research may have some 
                limitations in size, design, or consistency. Traditional use is well-documented 
                and aligns with the research findings.
              </p>
            </div>
            
            <div className="p-4 bg-white border border-border/50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-foreground">4.0 - 5.9</span>
                <span className="px-2 py-0.5 bg-secondary text-foreground text-xs rounded-full">Moderate Evidence</span>
              </div>
              <p className="text-sm text-foreground/80">
                Some clinical evidence exists, often from smaller studies or preliminary trials. 
                Traditional use provides additional support, and the mechanism of action is 
                reasonably understood. More research would strengthen the case.
              </p>
            </div>
            
            <div className="p-4 bg-white border border-border/50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-foreground">2.0 - 3.9</span>
                <span className="px-2 py-0.5 bg-secondary text-foreground text-xs rounded-full">Limited Evidence</span>
              </div>
              <p className="text-sm text-foreground/80">
                Evidence is primarily from traditional use, animal studies, or very preliminary 
                human research. The remedy may be promising, but solid clinical evidence is lacking. 
                Use is based more on historical practice than proven results.
              </p>
            </div>
            
            <div className="p-4 bg-white border border-border/50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-foreground">1.0 - 1.9</span>
                <span className="px-2 py-0.5 bg-secondary text-foreground text-xs rounded-full">Minimal Evidence</span>
              </div>
              <p className="text-sm text-foreground/80">
                Very little scientific research exists. Claims are largely theoretical, based on 
                limited traditional use, or extrapolated from related compounds. These remedies 
                require significantly more research.
              </p>
            </div>
          </div>
        </section>

        {/* How We Rate */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">How We Determine Ratings</h2>
          
          <p className="text-foreground/80 mb-4">
            Our ratings consider multiple factors, weighted by their reliability:
          </p>
          
          <ul className="space-y-3">
            {[
              'Number and quality of randomized controlled trials (RCTs)',
              'Systematic reviews and meta-analyses',
              'Size and duration of clinical studies',
              'Consistency of results across different studies',
              'Quality of study design and methodology',
              'Documented traditional and historical use',
              'Understanding of mechanism of action',
              'Safety profile and adverse event reporting',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground/80">
                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Important Notes */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Important Notes</h2>
          
          <div className="p-4 bg-secondary/30 rounded-xl space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-1">Ratings are not medical recommendations</h3>
              <p className="text-sm text-foreground/80">
                A high rating means strong research support, not that a remedy is right for you. 
                Individual responses vary, and you should always consult a healthcare provider.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-foreground mb-1">Low ratings do not mean ineffective</h3>
              <p className="text-sm text-foreground/80">
                Many remedies with lower ratings simply have not been studied extensively. 
                Traditional use over centuries suggests real benefits, even when clinical trials 
                are lacking.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-foreground mb-1">Ratings are updated regularly</h3>
              <p className="text-sm text-foreground/80">
                As new research is published, we update our ratings to reflect the current 
                state of evidence. Science evolves, and so do our assessments.
              </p>
            </div>
          </div>
        </section>

        {/* Per-Benefit Ratings */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Per-Benefit Evidence Dots</h2>
          
          <p className="text-foreground/80 mb-4">
            On each remedy page, you will also see evidence dots (1-5) for specific benefits. 
            This shows that while a remedy might have strong overall evidence, the strength 
            varies by use case.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-accent" />
                ))}
              </div>
              <span className="text-sm text-foreground">Strong evidence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i <= 3 ? 'bg-accent' : 'bg-border'}`} />
                ))}
              </div>
              <span className="text-sm text-foreground">Moderate evidence</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i <= 1 ? 'bg-accent' : 'bg-border'}`} />
                ))}
              </div>
              <span className="text-sm text-foreground">Limited evidence</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
