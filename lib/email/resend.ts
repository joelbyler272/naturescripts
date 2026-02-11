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
 * Generate HTML email template with NatureScripts logo
 */
function generateVerificationEmailHtml({ 
  firstName, 
  verificationUrl, 
  protocolSummary 
}: Omit<SendVerificationEmailParams, 'to'>): string {
  const safeFirstName = escapeHtml(firstName);
  const safeUrl = sanitizeUrl(verificationUrl);
  const safeSummary = protocolSummary ? escapeHtml(protocolSummary) : null;

  // SVG logo inline (leaf icon + text)
  const logoSvg = `<svg width="160" height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4C16 4 8 8 8 16C8 20 10 24 16 28C22 24 24 20 24 16C24 8 16 4 16 4Z" fill="#408d59"/>
    <path d="M16 8C16 8 12 11 12 16C12 19 13.5 22 16 24C18.5 22 20 19 20 16C20 11 16 8 16 8Z" fill="#5ba872"/>
    <text x="36" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#408d59">NatureScripts</text>
  </svg>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Protocol is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #408d59; padding: 32px 40px; text-align: center;">
              ${logoSvg}
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 22px; font-weight: 600;">
                Hi ${safeFirstName}, your protocol is ready!
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Thank you for sharing your health concerns with us. We've created a personalized natural health protocol just for you.
              </p>
              
              ${safeSummary ? `
              <div style="background-color: #f8faf8; border-left: 4px solid #408d59; padding: 16px 20px; margin: 0 0 24px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #2d5a3d; font-size: 14px; font-weight: 500;">
                  Protocol Preview:
                </p>
                <p style="margin: 8px 0 0 0; color: #4a4a4a; font-size: 14px; line-height: 1.5;">
                  ${safeSummary}
                </p>
              </div>
              ` : ''}
              
              <p style="margin: 0 0 24px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                To access your full protocol and save it to your account, please set up your password:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${safeUrl}" style="display: inline-block; background-color: #408d59; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Set Password & View Protocol
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; color: #888888; font-size: 14px; line-height: 1.5;">
                This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 24px 40px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0; color: #888888; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} NatureScripts. Personalized natural health protocols.
              </p>
              <p style="margin: 8px 0 0 0; color: #888888; font-size: 12px; text-align: center;">
                This is not medical advice. Always consult a healthcare provider.
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
