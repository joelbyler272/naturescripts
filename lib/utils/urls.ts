/**
 * URL helpers for subdomain-based routing
 */

function getRootDomain(): string {
  return process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
}

function getProtocol(): string {
  return getRootDomain().includes('localhost') ? 'http' : 'https';
}

export function getAppUrl(path: string = ''): string {
  return `${getProtocol()}://app.${getRootDomain()}${path}`;
}

export function getPractitionerUrl(path: string = '', subdomain?: string): string {
  if (subdomain && subdomain !== 'practitioner') {
    return `${getProtocol()}://${subdomain}.${getRootDomain()}${path}`;
  }
  return `${getProtocol()}://practitioner.${getRootDomain()}${path}`;
}

export function getMarketingUrl(path: string = ''): string {
  const root = getRootDomain();
  return `${getProtocol()}://${root}${path}`;
}

export function getAdminUrl(path: string = ''): string {
  return `${getProtocol()}://admin.${getRootDomain()}${path}`;
}
