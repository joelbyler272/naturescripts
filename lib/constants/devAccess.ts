// Emails allowed to see Dev Tools in Settings.
// Configure via DEV_EMAILS environment variable (comma-separated list)
// Example: DEV_EMAILS=admin@example.com,dev@example.com
//
// IMPORTANT: Uses server-only env var (no NEXT_PUBLIC_ prefix).
// The isDev check must be done server-side and passed as a prop.

function getDevEmails(): string[] {
  const envEmails = process.env.DEV_EMAILS;
  if (!envEmails) return [];

  return envEmails
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
}

export function isDevUser(email: string | undefined | null): boolean {
  if (!email) return false;

  const devEmails = getDevEmails();
  if (devEmails.length === 0) return false;

  return devEmails.includes(email.toLowerCase());
}
