'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const COMMON_PASSWORDS = ['123456', 'password', 'qwerty', '123456789', 'abc123', 'password1'];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabase] = useState(() => createClient());
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  // Cleanup redirect timer on unmount
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function verifySession() {
      try {
        // Get consultation ID from URL params (passed from callback)
        const consultationFromParams = searchParams.get('consultation');
        if (consultationFromParams && UUID_REGEX.test(consultationFromParams)) {
          setConsultationId(consultationFromParams);
        }

        // Check if there are auth params in the URL hash
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              setError('Your verification link has expired or is invalid. Please request a new one.');
              setIsVerifying(false);
              return;
            }

            if (data.session) {
              setUserEmail(data.session.user.email || null);
              setIsVerifying(false);
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
              return;
            }
          }
        }

        // Check for existing user (server-verified)
        const { data: { user }, error: getUserError } = await supabase.auth.getUser();

        if (getUserError) {
          setError('Your verification link has expired or is invalid. Please request a new one.');
          setIsVerifying(false);
          return;
        }

        if (!user) {
          setError('Your verification link has expired or is invalid. Please request a new one.');
          setIsVerifying(false);
          return;
        }

        setUserEmail(user.email || null);
        setIsVerifying(false);
      } catch (err) {
        console.error('[SET PASSWORD] Unexpected error:', err);
        setError('Failed to verify your account. Please try again.');
        setIsVerifying(false);
      }
    }

    verifySession();
  }, [searchParams, supabase]);

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

        await supabase.auth.updateUser({
          data: { onboarding_in_progress: false },
        });
      }

      setSuccess(true);

      // Redirect to protocol page if we have the consultation ID
      redirectTimerRef.current = setTimeout(() => {
        if (consultationId) {
          router.push(`/protocols/${consultationId}?welcome=true`);
        } else {
          router.push('/dashboard?welcome=true');
        }
      }, 1500);

    } catch (err) {
      console.error('[SET PASSWORD] Password update error:', err);
      setError('Failed to set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            Taking you to your personalized protocol...
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
                'Set Password & View Protocol'
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Your personalized protocol is ready!
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
