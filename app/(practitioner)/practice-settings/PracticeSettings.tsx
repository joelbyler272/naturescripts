'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Globe, Palette, Building, Save } from 'lucide-react';

export function PracticeSettings() {
  const [subdomain, setSubdomain] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2D5A27');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('practitioner_settings')
        .select('*')
        .eq('practitioner_id', user.id)
        .single();

      if (data) {
        setSubdomain(data.subdomain || '');
        setBusinessName(data.business_name || '');
        setPrimaryColor(data.primary_color || '#2D5A27');
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: upsertError } = await supabase
        .from('practitioner_settings')
        .upsert(
          {
            practitioner_id: user.id,
            subdomain: subdomain.toLowerCase().trim() || null,
            business_name: businessName.trim() || null,
            primary_color: primaryColor || null,
          },
          { onConflict: 'practitioner_id' }
        );

      if (upsertError) {
        if (upsertError.code === '23505') {
          setError('This subdomain is already taken.');
        } else if (upsertError.code === '23514') {
          setError('Invalid subdomain format. Use only lowercase letters, numbers, and hyphens.');
        } else {
          throw upsertError;
        }
      } else {
        setSaved(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="h-64 bg-secondary/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Practice Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your branding and custom subdomain</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Custom Subdomain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="yourpractice"
                maxLength={63}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">.naturescripts.io</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Lowercase letters, numbers, and hyphens only. Must be 3-63 characters.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Business Name</label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Practice Name"
                maxLength={100}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-14 rounded border border-input cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#2D5A27"
                  maxLength={7}
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {saved && (
          <p className="text-sm text-green-600">Settings saved successfully.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
