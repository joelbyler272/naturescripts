'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

export default function SignInPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signin logic in Phase 2
    console.log('Sign in form submitted');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="w-7 h-7 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your NatureScripts account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-charcoal">
              Email
            </label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-charcoal">
                Password
              </label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-charcoal/60">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
