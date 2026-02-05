// Emails allowed to see Dev Tools in Settings.
// Configure via DEV_EMAILS environment variable (comma-separated list)
// Example: DEV_EMAILS=admin@example.com,dev@example.com

function getDevEmails(): string[] {
  const envEmails = process.env.NEXT_PUBLIC_DEV_EMAILS;
  if (!envEmails) return [];

  return envEmails
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
}

export function isDevUser(email: string | undefined | null): boolean {
  if (!email) return false;

  const devEmails = getDevEmails();
  // In development, allow dev tools if no DEV_EMAILS are configured
  if (devEmails.length === 0 && process.env.NODE_ENV === 'development') {
    return true;
  }

  return devEmails.includes(email.toLowerCase());
}
