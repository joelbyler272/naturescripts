// Email HTML template helpers for NatureScripts

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          <!-- Content -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e4e4e7;">
                <tr><td style="height: 4px; background-color: #408d59; font-size: 0; line-height: 0;">&nbsp;</td></tr>
                <tr><td style="padding: 40px 36px 36px 36px;">${content}</td></tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 28px 16px 0 16px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #a1a1aa; font-size: 12px;">&copy; ${new Date().getFullYear()} NatureScripts</p>
              <p style="margin: 0 0 6px 0; color: #a1a1aa; font-size: 11px;">This is not medical advice. Always consult a healthcare provider.</p>
              <p style="margin: 0; font-size: 11px;"><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://naturescripts.com'}/settings" style="color: #a1a1aa; text-decoration: underline;">Manage email preferences</a> &middot; <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://naturescripts.com'}/settings" style="color: #a1a1aa; text-decoration: underline;">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function progressBar(pct: number, color: string): string {
  return `<div style="background: #f0f0f0; border-radius: 6px; height: 8px; width: 100%; overflow: hidden;">
    <div style="background: ${color}; height: 100%; width: ${Math.min(100, Math.max(0, pct))}%; border-radius: 6px;"></div>
  </div>`;
}

export interface WeeklySummaryEmailParams {
  firstName: string;
  weekOf: string;
  symptomSummary: { name: string; avgSeverity: number; trend: string }[];
  supplementAdherence: number;
  habitCompletion: number;
  insights: string[];
  dashboardUrl: string;
}

export function generateWeeklySummaryHtml(params: WeeklySummaryEmailParams): string {
  const { firstName, weekOf, symptomSummary, supplementAdherence, habitCompletion, insights, dashboardUrl } = params;

  const symptomRows = symptomSummary.slice(0, 5).map(s => {
    const trendIcon = s.trend === 'improving' ? '&#x2193;' : s.trend === 'worsening' ? '&#x2191;' : '&#x2194;';
    const trendColor = s.trend === 'improving' ? '#22c55e' : s.trend === 'worsening' ? '#ef4444' : '#a1a1aa';
    return `<tr>
      <td style="padding: 8px 0; font-size: 14px; color: #3f3f46;">${escapeHtml(s.name)}</td>
      <td style="padding: 8px 0; font-size: 14px; text-align: right;"><span style="color: ${trendColor};">${trendIcon}</span> ${s.avgSeverity.toFixed(1)}/10</td>
    </tr>`;
  }).join('');

  const insightCards = insights.map(i =>
    `<div style="background: #f8faf8; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; font-size: 14px; color: #3f3f46; border-left: 3px solid #408d59;">
      ${escapeHtml(i)}
    </div>`
  ).join('');

  const content = `
    <h1 style="margin: 0 0 4px 0; color: #18181b; font-size: 22px; font-weight: 600;">Weekly Progress Report</h1>
    <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">Week of ${escapeHtml(weekOf)} &middot; Hi ${escapeHtml(firstName)}!</p>

    <!-- Adherence Stats -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td width="48%" style="padding-right: 8px;">
          <div style="background: #fafaf8; border-radius: 12px; padding: 16px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Supplements</p>
            <p style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: ${supplementAdherence >= 80 ? '#22c55e' : supplementAdherence >= 50 ? '#f59e0b' : '#ef4444'};">${supplementAdherence}%</p>
            ${progressBar(supplementAdherence, supplementAdherence >= 80 ? '#22c55e' : supplementAdherence >= 50 ? '#f59e0b' : '#ef4444')}
          </div>
        </td>
        <td width="48%" style="padding-left: 8px;">
          <div style="background: #fafaf8; border-radius: 12px; padding: 16px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Habits</p>
            <p style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: ${habitCompletion >= 80 ? '#22c55e' : habitCompletion >= 50 ? '#f59e0b' : '#ef4444'};">${habitCompletion}%</p>
            ${progressBar(habitCompletion, habitCompletion >= 80 ? '#22c55e' : habitCompletion >= 50 ? '#f59e0b' : '#ef4444')}
          </div>
        </td>
      </tr>
    </table>

    ${symptomRows ? `
    <!-- Symptoms -->
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Symptom Trends</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-top: 1px solid #e4e4e7;">
      ${symptomRows}
    </table>
    ` : ''}

    ${insightCards ? `
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">AI Insights</p>
    <div style="margin-bottom: 24px;">${insightCards}</div>
    ` : ''}

    <!-- CTA -->
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #408d59;">
          <a href="${escapeHtml(dashboardUrl)}" style="display: block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; text-align: center;">
            View Dashboard &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  return emailWrapper(content);
}

export interface ReminderEmailParams {
  firstName: string;
  daysSinceLastLog: number;
  dashboardUrl: string;
}

export function generateReminderHtml(params: ReminderEmailParams): string {
  const { firstName, daysSinceLastLog, dashboardUrl } = params;

  const content = `
    <h1 style="margin: 0 0 8px 0; color: #18181b; font-size: 22px; font-weight: 600;">We miss tracking with you!</h1>
    <p style="margin: 0 0 24px 0; color: #71717a; font-size: 15px; line-height: 1.6;">
      Hi ${escapeHtml(firstName)}, it's been ${daysSinceLastLog} days since your last log. Consistency is key to seeing results from your protocol. Even a quick check-in helps!
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: #408d59;">
          <a href="${escapeHtml(dashboardUrl)}" style="display: block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; text-align: center;">
            Log Today &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  return emailWrapper(content);
}
