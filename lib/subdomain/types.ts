export type SubdomainType = 'marketing' | 'app' | 'practitioner' | 'custom' | 'admin';

export interface SubdomainInfo {
  type: SubdomainType;
  subdomain: string | null;
}

export interface PractitionerBranding {
  businessName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  practitionerId: string | null;
}

// Reserved subdomains that cannot be claimed by practitioners
export const RESERVED_SUBDOMAINS = new Set([
  'app', 'www', 'admin', 'api', 'practitioner',
  'mail', 'smtp', 'ftp', 'staging', 'dev', 'test',
  'blog', 'help', 'support', 'status', 'docs',
]);
