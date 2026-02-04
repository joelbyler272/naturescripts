'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Sparkles, Loader2 } from 'lucide-react';

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
    }
  };

  const features = {
    free: [
      '3 consultations per day',
      'Basic herbal protocols',
      'Remedy database access',
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
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Limited Time: First month 50% off</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Upgrade to Pro</h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock unlimited consultations and advanced features for your natural health journey
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
        {/* Free Tier */}
        <Card className="border-2 border-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.free.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className="border-2 border-accent relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 text-sm font-medium">
            RECOMMENDED
          </div>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              Pro
              <Crown className="w-6 h-6 text-amber-500 ml-2" />
            </CardTitle>
            <CardDescription>For serious health optimization</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-muted-foreground">/month</span>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="line-through">$18</span> - 50% off first month
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.pro.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-lg py-6"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Redirecting to Checkout...</>
              ) : (
                'Upgrade to Pro'
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Cancel anytime. No questions asked.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
