import { type SubdomainInfo, RESERVED_SUBDOMAINS } from './types';

/**
 * Extract subdomain info from a hostname.
 * Handles both local development and production domains.
 */
export function getSubdomainInfo(hostname: string): SubdomainInfo {
  // Remove port for local development
  const host = hostname.split(':')[0];

  // Local development: *.localhost
  if (host === 'localhost' || host.endsWith('.localhost')) {
    const parts = host.split('.');
    if (parts.length === 1 || parts[0] === 'www') {
      return { type: 'marketing', subdomain: null };
    }
    const sub = parts[0];
    if (sub === 'app') return { type: 'app', subdomain: 'app' };
    if (sub === 'practitioner') return { type: 'practitioner', subdomain: 'practitioner' };
    if (sub === 'admin') return { type: 'admin', subdomain: 'admin' };
    return { type: 'custom', subdomain: sub };
  }

  // Production: naturescripts.io
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'naturescripts.io';
  const baseDomain = rootDomain.split(':')[0]; // strip port if present

  if (host === baseDomain || host === `www.${baseDomain}`) {
    return { type: 'marketing', subdomain: null };
  }

  if (host.endsWith(`.${baseDomain}`)) {
    const sub = host.replace(`.${baseDomain}`, '');
    if (sub === 'app') return { type: 'app', subdomain: 'app' };
    if (sub === 'practitioner') return { type: 'practitioner', subdomain: 'practitioner' };
    if (sub === 'admin') return { type: 'admin', subdomain: 'admin' };
    if (RESERVED_SUBDOMAINS.has(sub)) {
      return { type: 'marketing', subdomain: null };
    }
    return { type: 'custom', subdomain: sub };
  }

  // Fallback: treat as marketing
  return { type: 'marketing', subdomain: null };
}

// Route matchers for subdomain enforcement
const CONSUMER_PREFIXES = [
  '/dashboard', '/consultation', '/protocols', '/tracking',
  '/documents', '/settings', '/intake', '/upgrade', '/quizzes',
];

const PRACTITIONER_PREFIXES = [
  '/clients', '/analytics', '/practice-settings',
];

export function isConsumerRoute(pathname: string): boolean {
  return CONSUMER_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`));
}

export function isPractitionerRoute(pathname: string): boolean {
  return PRACTITIONER_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`));
}
