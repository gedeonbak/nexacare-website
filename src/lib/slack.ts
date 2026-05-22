// Slack webhook helpers.
//
// Env vars:
//   SLACK_WEBHOOK_ESCALATIONS  — patient risk alerts
//   SLACK_WEBHOOK_LEADS        — new demo/lead notifications + billing alerts

type SlackChannel = 'escalations' | 'leads';

function webhookUrl(channel: SlackChannel): string {
  const key =
    channel === 'escalations'
      ? 'SLACK_WEBHOOK_ESCALATIONS'
      : 'SLACK_WEBHOOK_LEADS';
  return (process.env[key] ?? '').trim();
}

/**
 * Post a message to a Slack channel via incoming webhook.
 * Silently no-ops if the webhook URL is not configured (dev safety).
 */
export async function postSlack(
  channel: SlackChannel,
  blocks: object[],
  fallbackText: string,
): Promise<void> {
  const url = webhookUrl(channel);
  if (!url) {
    console.warn(`[slack] ${channel} webhook not configured — skipping`);
    return;
  }

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ text: fallbackText, blocks }),
    });
    if (!res.ok) {
      console.error(`[slack] ${channel} post failed: ${res.status} ${await res.text()}`);
    }
  } catch (err) {
    console.error(`[slack] ${channel} fetch error:`, err instanceof Error ? err.message : err);
  }
}

// ── Pre-built message builders ────────────────────────────────────────────────

export function billingPaidBlocks(opts: {
  clinicName:  string;
  month:       string;
  patients:    number;
  amount:      number;
  invoiceUrl:  string;
}) {
  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '💳 Invoice Paid', emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Clinic*\n${opts.clinicName}` },
        { type: 'mrkdwn', text: `*Month*\n${opts.month}` },
        { type: 'mrkdwn', text: `*Patients*\n${opts.patients}` },
        { type: 'mrkdwn', text: `*Amount*\n$${(opts.amount / 100).toLocaleString()}` },
      ],
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'View Invoice' },
          url:  opts.invoiceUrl,
        },
      ],
    },
  ];
}

export function billingFailedBlocks(opts: {
  clinicName:  string;
  month:       string;
  amount:      number;
  invoiceUrl:  string;
  reason:      string;
}) {
  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '🚨 Payment Failed', emoji: true },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${opts.clinicName}* failed to pay their ${opts.month} invoice of *$${(opts.amount / 100).toLocaleString()}*.\n\n*Reason:* ${opts.reason}`,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text:  { type: 'plain_text', text: 'View Invoice' },
          url:   opts.invoiceUrl,
          style: 'danger',
        },
      ],
    },
  ];
}

export function newEnrollmentBlocks(opts: {
  patientId:   string;
  clinicName:  string;
  firstName:   string;
  language:    string;
  enrollDate:  string;
}) {
  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '🎉 New Patient Enrolled', emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Clinic*\n${opts.clinicName}` },
        { type: 'mrkdwn', text: `*First Name*\n${opts.firstName}` },
        { type: 'mrkdwn', text: `*Language*\n${opts.language}` },
        { type: 'mrkdwn', text: `*Enrolled*\n${opts.enrollDate}` },
      ],
    },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `Patient ID: ${opts.patientId} · CarePath Day 1 message queued` },
      ],
    },
  ];
}

export function optOutBlocks(opts: {
  patientId:   string;
  clinicName:  string;
  carePathDay: number;
  riskScore:   number;
}) {
  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '🚪 Patient Opted Out', emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Clinic*\n${opts.clinicName}` },
        { type: 'mrkdwn', text: `*CarePath Day*\n${opts.carePathDay}` },
        { type: 'mrkdwn', text: `*Risk Score at Opt-Out*\n${opts.riskScore}/10` },
      ],
    },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `Patient ID: ${opts.patientId} · Status set to Opted Out · No further messages will be sent` },
      ],
    },
  ];
}

export function escalationBlocks(opts: {
  patientId:   string;
  clinicName:  string;
  riskScore:   number;
  lastReply:   string;
  carePathDay: number;
}) {
  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '⚠️ Patient Escalation', emoji: true },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Clinic*\n${opts.clinicName}` },
        { type: 'mrkdwn', text: `*Day*\nCarePath Day ${opts.carePathDay}` },
        { type: 'mrkdwn', text: `*Risk Score*\n${opts.riskScore}/10` },
        { type: 'mrkdwn', text: `*Last Reply*\n"${opts.lastReply}"` },
      ],
    },
    {
      type: 'context',
      elements: [
        { type: 'mrkdwn', text: `Patient ID: ${opts.patientId} · Review in admin portal` },
      ],
    },
  ];
}
