// Emails allowed to access the Admin Dashboard.
// Configure via ADMIN_EMAILS environment variable (comma-separated list)
// Example: ADMIN_EMAILS=admin@example.com,owner@example.com
// Falls back to DEV_EMAILS if ADMIN_EMAILS is not set
//
// IMPORTANT: These use server-only env vars (no NEXT_PUBLIC_ prefix)
// so admin emails are never exposed in the client-side JS bundle.
// This file must only be imported from server components or API routes.

function getAdminEmails(): string[] {
  // First check for dedicated admin emails (server-only)
  const adminEmails = process.env.ADMIN_EMAILS;
  if (adminEmails) {
    return adminEmails
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0);
  }

  // Fall back to dev emails (server-only)
  const devEmails = process.env.DEV_EMAILS;
  if (devEmails) {
    return devEmails
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0);
  }

  return [];
}

export function isAdminUser(email: string | undefined | null): boolean {
  if (!email) return false;

  const adminEmails = getAdminEmails();
  
  // In development with no admin emails configured, allow access
  if (adminEmails.length === 0 && process.env.NODE_ENV === 'development') {
    return true;
  }

  return adminEmails.includes(email.toLowerCase());
}
