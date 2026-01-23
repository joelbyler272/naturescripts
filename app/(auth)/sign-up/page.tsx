'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

export default function SignUpPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic in Phase 2
    console.log('Sign up form submitted');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="w-7 h-7 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Start your natural health journey today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-charcoal">
              First Name
            </label>
            <Input id="firstName" type="text" placeholder="Jordan" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-charcoal">
              Email
            </label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-charcoal">
              Password
            </label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-charcoal/60">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-xs text-center text-charcoal/60">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  );
}
