'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function AcceptInvite({ token }: { token: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'auth_required'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    async function accept() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setStatus('auth_required');
        return;
      }

      // Accept the invite
      const { error: updateError } = await supabase
        .from('practitioner_clients')
        .update({ client_id: user.id, status: 'active', invite_token: null })
        .eq('invite_token', token);

      if (updateError) {
        setError('This invitation is invalid or has already been used.');
        setStatus('error');
      } else {
        setStatus('success');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    }
    accept();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/10">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-12">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="font-medium text-foreground">Accepting invitation...</h3>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="font-medium text-foreground mb-1">Invitation Accepted</h3>
              <p className="text-sm text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="font-medium text-foreground mb-1">Invalid Invitation</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </>
          )}

          {status === 'auth_required' && (
            <>
              <h3 className="font-medium text-foreground mb-1">Sign In Required</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please sign in or create an account to accept this invitation.
              </p>
              <a
                href={`/sign-up?invite=${token}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </a>
              <a
                href={`/sign-in?invite=${token}`}
                className="text-sm text-primary hover:underline mt-2"
              >
                Already have an account? Sign in
              </a>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
