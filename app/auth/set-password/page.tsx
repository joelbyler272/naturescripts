'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient();

// Common weak passwords to check against
const COMMON_PASSWORDS = ['123456', 'password', 'qwerty', '123456789', 'abc123', 'password1'];

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);

  // Verify the magic link token on mount
  useEffect(() => {
    async function verifySession() {
      try {
        // First, check if there are auth params in the URL hash (from magic link redirect)
        // Supabase magic links redirect with hash params like #access_token=...&type=magiclink
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');
          
          if (accessToken && (type === 'magiclink' || type === 'recovery')) {
            // Set the session from the hash params
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (sessionError) {
              console.error('Failed to set session from hash:', sessionError);
              setError('Your verification link has expired or is invalid. Please request a new one.');
              setIsVerifying(false);
              return;
            }
            
            if (data.session) {
              setUserEmail(data.session.user.email || null);
              setIsVerifying(false);
              // Clear the hash from URL for cleaner look
              window.history.replaceState(null, '', window.location.pathname);
              return;
            }
          }
        }

        // Check for existing session (in case user refreshed the page)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setError('Your verification link has expired or is invalid. Please request a new one.');
          setIsVerifying(false);
          return;
        }

        if (!session) {
          setError('Your verification link has expired or is invalid. Please request a new one.');
          setIsVerifying(false);
          return;
        }

        setUserEmail(session.user.email || null);
        setIsVerifying(false);
      } catch (err) {
        console.error('Session verification error:', err);
        setError('Failed to verify your account. Please try again.');
        setIsVerifying(false);
      }
    }

    verifySession();
  }, [searchParams]);

  const validatePassword = (): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
      return 'This password is too common. Please choose a stronger password.';
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Password must contain both letters and numbers.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      // Update profile to mark onboarding as complete
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        // Update user metadata
        await supabase.auth.updateUser({
          data: { onboarding_in_progress: false },
        });
      }

      setSuccess(true);

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard?welcome=true');
      }, 2000);

    } catch (err) {
      console.error('Password update error:', err);
      setError('Failed to set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    // We don't have the user's email in this case, so redirect to sign in
    // where they can request a password reset
    router.push('/sign-in?message=Please sign in or request a password reset');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your account...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            You're all set!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your password has been set. Redirecting to your dashboard...
          </p>
          <Loader2 className="w-5 h-5 animate-spin text-accent mx-auto" />
        </div>
      </div>
    );
  }

  if (error && !userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Link Expired
          </h1>
          <p className="text-muted-foreground mb-6">
            {error}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/sign-in">
              <Button className="w-full bg-accent hover:bg-accent/90">
                Go to Sign In
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              You can request a password reset from the sign in page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Set Your Password
            </h1>
            <p className="text-muted-foreground">
              Create a password for <span className="font-medium text-foreground">{userEmail}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full bg-accent hover:bg-accent/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting password...
                </>
              ) : (
                'Set Password & Continue'
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Your protocol is waiting for you on the dashboard!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
}
