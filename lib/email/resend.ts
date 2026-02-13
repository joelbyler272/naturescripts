// Resend email client for NatureScripts
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

if (!fromEmail && process.env.NODE_ENV === 'production') {
  console.warn('[RESEND] RESEND_FROM_EMAIL not set — emails will use sandbox address in non-production');
}

const resolvedFromEmail = fromEmail || 'onboarding@resend.dev';

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Sanitize a URL to prevent javascript: and data: URI injection */
function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '#';
    }
    return url;
  } catch {
    return '#';
  }
}

/** Strip newlines from a string to prevent email header injection */
function sanitizeHeaderValue(str: string): string {
  return str.replace(/[\r\n]/g, '');
}

// Initialize Resend client (lazy to allow for missing API key in dev)
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(resendApiKey);
  }
  return resendClient;
}

export interface SendVerificationEmailParams {
  to: string;
  firstName: string;
  verificationUrl: string;
  protocolSummary?: string;
}

/**
 * Send verification email with protocol preview
 */
export async function sendVerificationEmail({
  to,
  firstName,
  verificationUrl,
  protocolSummary
}: SendVerificationEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();

    const safeFirstName = sanitizeHeaderValue(firstName);
    const safeUrl = sanitizeUrl(verificationUrl);

    const { error } = await resend.emails.send({
      from: `NatureScripts <${resolvedFromEmail}>`,
      to: [to],
      subject: `${safeFirstName}, your personalized protocol is ready`,
      html: generateVerificationEmailHtml({ firstName, verificationUrl: safeUrl, protocolSummary }),
      text: generateVerificationEmailText({ firstName, verificationUrl: safeUrl, protocolSummary }),
    });

    if (error) {
      console.error('[RESEND] Failed to send email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[RESEND] Error sending verification email:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}

/**
 * Generate HTML email template with NatureScripts branding
 */
function generateVerificationEmailHtml({
  firstName,
  verificationUrl,
  protocolSummary
}: Omit<SendVerificationEmailParams, 'to'>): string {
  const safeFirstName = escapeHtml(firstName);
  const safeUrl = sanitizeUrl(verificationUrl);
  const safeSummary = protocolSummary ? escapeHtml(protocolSummary) : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Protocol is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafaf8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafaf8;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 0 0 32px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 8px;">
                    <div style="width: 28px; height: 28px; background-color: #408d59; border-radius: 8px; text-align: center; line-height: 28px;">
                      <span style="color: #ffffff; font-size: 16px;">&#9752;</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: #18181b; font-weight: 600;">Nature</span><span style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: #408d59; font-weight: 300;">Scripts</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7;">

                <!-- Green accent bar -->
                <tr>
                  <td style="height: 4px; background-color: #408d59; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 36px 16px 36px;">
                    <h1 style="margin: 0 0 8px 0; color: #18181b; font-size: 24px; font-weight: 600; line-height: 1.3;">
                      Your protocol is ready, ${safeFirstName}!
                    </h1>
                    <p style="margin: 0 0 28px 0; color: #71717a; font-size: 15px; line-height: 1.6;">
                      We've created a personalized natural health plan based on what you shared with us. Set your password to view your full protocol.
                    </p>
                  </td>
                </tr>

                ${safeSummary ? `
                <!-- Protocol Preview -->
                <tr>
                  <td style="padding: 0 36px 28px 36px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8faf8; border-radius: 12px; border: 1px solid #d1e7d8;">
                      <tr>
                        <td style="padding: 20px 24px;">
                          <p style="margin: 0 0 6px 0; color: #408d59; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Protocol Preview
                          </p>
                          <p style="margin: 0; color: #3f3f46; font-size: 14px; line-height: 1.6;">
                            ${safeSummary}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}

                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 36px 12px 36px;" align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                      <tr>
                        <td align="center" style="border-radius: 12px; background-color: #408d59;">
                          <a href="${safeUrl}" style="display: block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; text-align: center;">
                            Set Password &amp; View Protocol &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 36px 36px 36px;">
                    <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.5; text-align: center;">
                      This link expires in 24 hours. If you didn't request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 16px 0 16px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #a1a1aa; font-size: 12px;">
                &copy; ${new Date().getFullYear()} NatureScripts &middot; Personalized natural health protocols
              </p>
              <p style="margin: 0; color: #a1a1aa; font-size: 11px;">
                This is not medical advice. Always consult a healthcare provider before starting any new supplement regimen.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email (fallback)
 */
function generateVerificationEmailText({
  firstName,
  verificationUrl,
  protocolSummary
}: Omit<SendVerificationEmailParams, 'to'>): string {
  const safeUrl = sanitizeUrl(verificationUrl);
  let text = `Hi ${firstName},\n\n`;
  text += `Your personalized natural health protocol is ready!\n\n`;

  if (protocolSummary) {
    text += `Protocol Preview: ${protocolSummary}\n\n`;
  }

  text += `To access your full protocol and save it to your account, please set up your password:\n\n`;
  text += `${safeUrl}\n\n`;
  text += `This link will expire in 24 hours.\n\n`;
  text += `---\n`;
  text += `NatureScripts - Personalized natural health protocols\n`;
  text += `This is not medical advice. Always consult a healthcare provider.`;
  
  return text;
}
