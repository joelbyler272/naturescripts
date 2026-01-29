'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/40 via-background to-accent/5 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/50 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-10 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Check your email</h2>
            <p className="text-muted-foreground mb-8">
              We sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click the link to activate your account.
            </p>
            <Link
              href="/sign-in"
              className="text-accent hover:text-accent/80 font-semibold transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/40 via-background to-accent/5 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/50 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl font-bold tracking-tight">
                  <span className="text-foreground">Nature</span>
                  <span className="text-accent">Scripts</span>
                </span>
                <span className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
                  Protocol
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground">Create your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className={cn(
              'w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl',
              'border-2 border-border/50 bg-white hover:bg-secondary/30 hover:border-border',
              'text-foreground font-medium transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className={cn(
                      'w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border/50',
                      'bg-white text-foreground placeholder:text-muted-foreground',
                      'focus:outline-none focus:ring-0 focus:border-accent',
                      'transition-colors'
                    )}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className={cn(
                    'w-full px-4 py-3.5 rounded-xl border-2 border-border/50',
                    'bg-white text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-0 focus:border-accent',
                    'transition-colors'
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={cn(
                    'w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border/50',
                    'bg-white text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-0 focus:border-accent',
                    'transition-colors'
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={cn(
                    'w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border/50',
                    'bg-white text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-0 focus:border-accent',
                    'transition-colors'
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl',
                'bg-accent hover:bg-accent/90 text-white font-semibold text-lg',
                'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                'shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30'
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-accent hover:text-accent/80">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-accent hover:text-accent/80">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Login link */}
        <p className="text-center mt-8 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-accent hover:text-accent/80 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
