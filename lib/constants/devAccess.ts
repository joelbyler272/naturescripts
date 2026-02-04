// Emails allowed to see Dev Tools in Settings.
// Add your own email here during development.
export const DEV_EMAILS: string[] = [
  'joelbyler272@gmail.com',
];

export function isDevUser(email: string | undefined | null): boolean {
  if (!email) return false;
  return DEV_EMAILS.includes(email.toLowerCase());
}
