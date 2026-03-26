-- Practitioner settings for custom subdomains and branding
CREATE TABLE IF NOT EXISTS public.practitioner_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subdomain TEXT UNIQUE CHECK (
    subdomain ~ '^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$' AND
    subdomain NOT IN ('app', 'www', 'admin', 'api', 'practitioner', 'mail', 'smtp', 'ftp', 'staging', 'dev', 'test', 'blog', 'help', 'support', 'status', 'docs')
  ),
  business_name TEXT CHECK (char_length(business_name) <= 100),
  logo_url TEXT,
  primary_color TEXT CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(practitioner_id)
);

ALTER TABLE public.practitioner_settings ENABLE ROW LEVEL SECURITY;

-- Practitioners can manage their own settings
CREATE POLICY "Users can read own practitioner_settings"
  ON public.practitioner_settings FOR SELECT USING (auth.uid() = practitioner_id);
CREATE POLICY "Users can insert own practitioner_settings"
  ON public.practitioner_settings FOR INSERT WITH CHECK (auth.uid() = practitioner_id);
CREATE POLICY "Users can update own practitioner_settings"
  ON public.practitioner_settings FOR UPDATE USING (auth.uid() = practitioner_id);

-- Public read for subdomain lookup (needed by middleware, no auth)
CREATE POLICY "Public can read subdomain info"
  ON public.practitioner_settings FOR SELECT USING (true);

CREATE INDEX idx_practitioner_settings_subdomain ON public.practitioner_settings(subdomain);

-- Trigger for updated_at
CREATE TRIGGER update_practitioner_settings_updated_at
  BEFORE UPDATE ON public.practitioner_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Practitioner-client relationship table
CREATE TABLE IF NOT EXISTS public.practitioner_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_email TEXT NOT NULL,
  invite_token TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'inactive')),
  share_intake BOOLEAN DEFAULT true,
  share_progress BOOLEAN DEFAULT true,
  share_documents BOOLEAN DEFAULT false,
  share_self_protocols BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(practitioner_id, client_email)
);

ALTER TABLE public.practitioner_clients ENABLE ROW LEVEL SECURITY;

-- Practitioners can manage their clients
CREATE POLICY "Practitioners can read own clients"
  ON public.practitioner_clients FOR SELECT USING (auth.uid() = practitioner_id);
CREATE POLICY "Practitioners can insert clients"
  ON public.practitioner_clients FOR INSERT WITH CHECK (auth.uid() = practitioner_id);
CREATE POLICY "Practitioners can update own clients"
  ON public.practitioner_clients FOR UPDATE USING (auth.uid() = practitioner_id);

-- Clients can see their own record
CREATE POLICY "Clients can read own record"
  ON public.practitioner_clients FOR SELECT USING (auth.uid() = client_id);

CREATE INDEX idx_practitioner_clients_practitioner ON public.practitioner_clients(practitioner_id);
CREATE INDEX idx_practitioner_clients_client ON public.practitioner_clients(client_id);
CREATE INDEX idx_practitioner_clients_token ON public.practitioner_clients(invite_token);

CREATE TRIGGER update_practitioner_clients_updated_at
  BEFORE UPDATE ON public.practitioner_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Add role to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'consumer' CHECK (role IN ('consumer', 'practitioner', 'admin'));

COMMENT ON COLUMN public.profiles.role IS 'User role: consumer (default), practitioner, or admin';
