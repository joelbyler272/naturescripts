'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ClientProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  conditions: string[] | null;
  medications: string[] | null;
}

export function ClientDetail({ clientId }: { clientId: string }) {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, age, gender, conditions, medications')
        .eq('id', clientId)
        .single();

      setProfile(data);
      setLoading(false);
    }
    load();
  }, [clientId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="h-64 bg-secondary/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {profile?.full_name || 'Client'}
          </h1>
          <p className="text-muted-foreground">
            {profile?.age ? `${profile.age} years old` : ''}
            {profile?.age && profile?.gender ? ' -- ' : ''}
            {profile?.gender || ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.conditions && profile.conditions.length > 0 ? (
              <ul className="space-y-1">
                {profile.conditions.map((c, i) => (
                  <li key={i} className="text-sm text-foreground">{c}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No conditions reported</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.medications && profile.medications.length > 0 ? (
              <ul className="space-y-1">
                {profile.medications.map((m, i) => (
                  <li key={i} className="text-sm text-foreground">{m}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No medications reported</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Protocols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              No protocols created for this client yet.
            </p>
            <Link
              href={`/clients/${clientId}/protocol/new`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Create Protocol
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
