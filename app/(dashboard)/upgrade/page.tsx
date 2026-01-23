import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles } from 'lucide-react';

export default function UpgradePage() {
  const features = {
    free: [
      '3 consultations per day',
      'Basic herbal protocols',
      'Herb database access',
      'Community support',
    ],
    pro: [
      'Unlimited consultations',
      'Advanced protocols with multiple phases',
      'Progress tracking & charts',
      'Personalized insights from your history',
      'Priority support',
      'Export protocols as PDF',
      'Early access to new features',
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Limited Time: First month 50% off</span>
        </div>
        <h1 className="text-4xl font-bold text-charcoal mb-4">Upgrade to Pro</h1>
        <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
          Unlock unlimited consultations and advanced features to optimize your natural health journey
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Free Tier */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold text-charcoal">$0</span>
              <span className="text-charcoal/60">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.free.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal/80">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className="border-2 border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium">
            RECOMMENDED
          </div>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              Pro
              <Crown className="w-6 h-6 text-earth ml-2" />
            </CardTitle>
            <CardDescription>For serious health optimization</CardDescription>
            <div className="mt-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-charcoal">$9</span>
                <span className="text-charcoal/60">/month</span>
              </div>
              <p className="text-sm text-charcoal/60 mt-1">
                <span className="line-through">$18</span> - 50% off first month
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.pro.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal/80">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
              Upgrade to Pro
            </Button>
            <p className="text-xs text-center text-charcoal/60 mt-3">
              Cancel anytime. No questions asked.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-charcoal mb-6 text-center">Common Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-charcoal mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-charcoal/70">
                Yes! You can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-charcoal mb-2">
                What happens to my data if I downgrade?
              </h3>
              <p className="text-sm text-charcoal/70">
                All your consultations and protocols are saved. You'll just lose access to Pro features like tracking and unlimited consultations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-charcoal mb-2">Do you offer refunds?</h3>
              <p className="text-sm text-charcoal/70">
                Yes. If you're not satisfied within the first 7 days, we'll provide a full refund, no questions asked.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
