import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRemedyBySlug, getAllRemedies } from '@/lib/remedies/data';
import { routes } from '@/lib/constants/routes';
import { 
  ArrowLeft, 
  Leaf, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  HelpCircle,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  const remedies = getAllRemedies();
  return remedies.map((remedy) => ({
    slug: remedy.slug,
  }));
}

function EvidenceDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            'w-2 h-2 rounded-full',
            i <= level ? 'bg-accent' : 'bg-border'
          )}
        />
      ))}
    </div>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <Link 
      href="/remedies/evidence-rating"
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors group"
    >
      <span className="text-2xl font-bold text-accent">{rating.toFixed(1)}</span>
      <div className="text-left">
        <p className="text-xs font-medium text-foreground">Evidence Rating</p>
        <p className="text-xs text-muted-foreground group-hover:text-accent transition-colors">What's this?</p>
      </div>
    </Link>
  );
}

function SeverityBadge({ severity }: { severity: 'mild' | 'moderate' | 'severe' }) {
  const styles = {
    mild: 'bg-blue-50 text-blue-700 border-blue-200',
    moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    severe: 'bg-red-50 text-red-700 border-red-200',
  };
  
  return (
    <span className={cn('text-xs px-2 py-0.5 rounded border', styles[severity])}>
      {severity}
    </span>
  );
}

export default function RemedyDetailPage({ params }: { params: { slug: string } }) {
  const remedy = getRemedyBySlug(params.slug);
  
  if (!remedy) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href={routes.remedies}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Remedy Database
      </Link>

      {/* Hero Section */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-secondary text-foreground text-xs font-medium rounded-full">
                {remedy.category}
              </span>
              {remedy.aliases.slice(0, 2).map((alias) => (
                <span key={alias} className="text-xs text-muted-foreground">
                  {alias}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
              {remedy.name}
            </h1>
            
            <p className="text-lg text-muted-foreground italic mb-4">
              {remedy.botanicalName}
            </p>
            
            <p className="text-foreground/80 leading-relaxed max-w-2xl">
              {remedy.summary}
            </p>
          </div>
          
          <RatingBadge rating={remedy.rating} />
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-xl mb-10">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Primary Use</p>
          <p className="text-sm font-medium text-foreground">{remedy.benefits[0]?.name || 'General wellness'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Common Forms</p>
          <p className="text-sm font-medium text-foreground">
            {remedy.dosages.map(d => d.form.split(' ')[0]).slice(0, 2).join(', ')}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Typical Dose</p>
          <p className="text-sm font-medium text-foreground">{remedy.dosages[0]?.amount}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Time to Effect</p>
          <p className="text-sm font-medium text-foreground">2-4 weeks</p>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
        <div className="prose prose-neutral max-w-none">
          {remedy.overview.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-foreground/80 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">How It Works</h2>
        <div className="prose prose-neutral max-w-none">
          {remedy.howItWorks.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-foreground/80 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">What It's Used For</h2>
        <div className="space-y-4">
          {remedy.benefits.map((benefit, i) => (
            <div 
              key={i}
              className="p-4 bg-white border border-border/50 rounded-xl hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-medium text-foreground">{benefit.name}</h3>
                <EvidenceDots level={benefit.evidenceLevel} />
              </div>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Dots indicate strength of research evidence (5 = strongest)
        </p>
      </section>

      {/* Dosage */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">How to Take It</h2>
        <div className="space-y-4 mb-6">
          {remedy.dosages.map((dosage, i) => (
            <div 
              key={i}
              className="p-4 bg-white border border-border/50 rounded-xl"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground">{dosage.form}</h3>
                <span className="text-sm text-accent font-medium">{dosage.amount}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <Clock className="w-3 h-3 inline mr-1" />
                {dosage.timing}
              </p>
              {dosage.notes && (
                <p className="text-xs text-foreground/60 mt-2 pt-2 border-t border-border/30">
                  {dosage.notes}
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-3">
          <div>
            <h4 className="text-sm font-medium text-foreground">Best time to take</h4>
            <p className="text-sm text-muted-foreground">{remedy.bestTimeToTake}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">How long until it works</h4>
            <p className="text-sm text-muted-foreground">{remedy.howLongToWork}</p>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Safety Information
        </h2>
        
        <div className="space-y-6">
          {/* Side Effects */}
          <div className="p-4 bg-white border border-border/50 rounded-xl">
            <h3 className="font-medium text-foreground mb-3">Possible Side Effects</h3>
            <ul className="space-y-2">
              {remedy.sideEffects.map((effect, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-foreground/40">•</span>
                  {effect}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Who Should Avoid */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="font-medium text-amber-900 mb-3">Who Should Avoid This</h3>
            <ul className="space-y-2">
              {remedy.whoShouldAvoid.map((item, i) => (
                <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Interactions */}
          <div className="p-4 bg-white border border-border/50 rounded-xl">
            <h3 className="font-medium text-foreground mb-3">Drug and Supplement Interactions</h3>
            <div className="space-y-3">
              {remedy.interactions.map((interaction, i) => (
                <div key={i} className="flex items-start justify-between gap-4 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{interaction.substance}</p>
                    <p className="text-xs text-muted-foreground mt-1">{interaction.description}</p>
                  </div>
                  <SeverityBadge severity={interaction.severity} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {remedy.faqs.map((faq, i) => (
            <details 
              key={i} 
              className="group p-4 bg-white border border-border/50 rounded-xl hover:border-accent/30 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/30">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Quality & Buying */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-accent" />
          Quality and Buying Guide
        </h2>
        
        <div className="p-4 bg-white border border-border/50 rounded-xl mb-6">
          <h3 className="font-medium text-foreground mb-3">What to Look For</h3>
          <ul className="space-y-2">
            {remedy.qualityMarkers.map((marker, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                {marker}
              </li>
            ))}
          </ul>
        </div>
        
        <h3 className="font-medium text-foreground mb-3">Recommended Products</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {remedy.products.map((product, i) => (
            <a
              key={i}
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white border border-border/50 rounded-xl hover:border-accent/50 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {product.form} · {product.size}
              </p>
              {product.note && (
                <p className="text-xs text-accent">{product.note}</p>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* Related */}
      {(remedy.relatedRemedies.length > 0 || remedy.oftenPairedWith.length > 0) && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Related Remedies</h2>
          <div className="flex flex-wrap gap-2">
            {remedy.relatedRemedies.map((slug) => (
              <Link
                key={slug}
                href={`/remedies/${slug}`}
                className="px-3 py-1.5 bg-secondary text-foreground text-sm rounded-full hover:bg-accent hover:text-white transition-colors"
              >
                {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </Link>
            ))}
            {remedy.oftenPairedWith.map((slug) => (
              <Link
                key={slug}
                href={`/remedies/${slug}`}
                className="px-3 py-1.5 bg-accent/10 text-accent text-sm rounded-full hover:bg-accent hover:text-white transition-colors"
              >
                Often paired: {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-secondary/50 rounded-xl">
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This information is for educational purposes only and is not intended 
          as medical advice. Always consult with a qualified healthcare provider before starting any new 
          supplement, especially if you have a medical condition or take medications.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date(remedy.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
