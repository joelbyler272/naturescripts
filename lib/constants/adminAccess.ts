// Emails allowed to access the Admin Dashboard.
// Configure via ADMIN_EMAILS environment variable (comma-separated list)
// Example: ADMIN_EMAILS=admin@example.com,owner@example.com
// Falls back to DEV_EMAILS if ADMIN_EMAILS is not set

function getAdminEmails(): string[] {
  // First check for dedicated admin emails
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (adminEmails) {
    return adminEmails
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0);
  }

  // Fall back to dev emails
  const devEmails = process.env.NEXT_PUBLIC_DEV_EMAILS;
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
