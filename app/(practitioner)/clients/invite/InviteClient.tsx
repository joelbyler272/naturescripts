'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Send, CheckCircle } from 'lucide-react';

export function InviteClient() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const token = crypto.randomUUID();

      const { error: insertError } = await supabase
        .from('practitioner_clients')
        .insert({
          practitioner_id: user.id,
          client_email: email.trim().toLowerCase(),
          invite_token: token,
          status: 'invited',
        });

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This email has already been invited.');
        } else {
          throw insertError;
        }
      } else {
        setSent(true);
        setEmail('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invite');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Invite a Client</h1>
        <p className="text-muted-foreground mt-1">
          Send an invitation to join your practice on NatureScripts.
        </p>
      </div>

      {sent ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="font-medium text-foreground mb-1">Invitation Created</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              The client will receive an email with instructions to join your practice.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-primary hover:underline"
            >
              Invite another client
            </button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Client Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={sending || !email.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {sending ? 'Sending...' : 'Send Invitation'}
              </button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
