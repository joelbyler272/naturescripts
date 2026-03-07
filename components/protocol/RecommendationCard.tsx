'use client';

import { Recommendation, ProductLink } from '@/lib/consultation/types';
import { getProductUrl } from '@/lib/utils/urlValidation';
import { ExternalLink, Clock, AlertCircle, Leaf, Pill, Droplets } from 'lucide-react';
import { trackAffiliateClick } from '@/lib/analytics/events';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

// Icon mapping for recommendation types
const typeIcons: Record<string, React.ReactNode> = {
  herb: <Leaf className="w-5 h-5 text-green-600" />,
  vitamin: <Pill className="w-5 h-5 text-orange-500" />,
  mineral: <Pill className="w-5 h-5 text-blue-500" />,
  supplement: <Pill className="w-5 h-5 text-purple-500" />,
  essential_oil: <Droplets className="w-5 h-5 text-amber-500" />,
  other: <Leaf className="w-5 h-5 text-muted-foreground" />,
};

// Source logo/icon for product links
const sourceLabels: Record<string, { label: string; color: string }> = {
  amazon: { label: 'Amazon', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  iherb: { label: 'iHerb', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  other: { label: 'Shop', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
};

function ProductButton({ product }: { product: ProductLink }) {
  const source = sourceLabels[product.source] || sourceLabels.other;
  const href = getProductUrl(product);

  if (href === '#') return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackAffiliateClick(product.source, product.name)}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${source.color}`}
    >
      <span>{source.label}</span>
      {product.brand && (
        <span className="text-xs opacity-75">• {product.brand}</span>
      )}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const icon = typeIcons[recommendation.type] || typeIcons.other;

  return (
    <div className="bg-white rounded-xl border border-border/50 p-5 space-y-4 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-muted/50 rounded-lg shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg">
            {recommendation.name}
          </h3>
          <p className="text-sm text-muted-foreground capitalize">
            {recommendation.type.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Dosage & Timing */}
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full">
          <Pill className="w-4 h-4" />
          <span className="font-medium">{recommendation.dosage}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-full">
          <Clock className="w-4 h-4" />
          <span>{recommendation.timing}</span>
        </div>
      </div>

      {/* Rationale */}
      <p className="text-sm text-foreground/80 leading-relaxed">
        {recommendation.rationale}
      </p>

      {/* Cautions */}
      {recommendation.cautions && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200/50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            {recommendation.cautions}
          </p>
        </div>
      )}

      {/* Product Links */}
      {recommendation.products && recommendation.products.length > 0 && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Shop this product:</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.products.map((product, index) => (
              <ProductButton key={index} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
