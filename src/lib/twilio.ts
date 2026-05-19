// Twilio REST API helper — sending SMS and validating inbound webhooks.
// No Twilio SDK dependency; uses native fetch + crypto.
//
// Required env vars:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_MESSAGING_SERVICE_SID  (preferred — routes via Messaging Service)
//   TWILIO_FROM_NUMBER            (fallback if no Messaging Service SID)

import crypto from 'crypto';

function getSid()     { return (process.env.TWILIO_ACCOUNT_SID            ?? '').trim(); }
function getToken()   { return (process.env.TWILIO_AUTH_TOKEN              ?? '').trim(); }
function getMsgSvc()  { return (process.env.TWILIO_MESSAGING_SERVICE_SID  ?? '').trim(); }
function getFrom()    { return (process.env.TWILIO_FROM_NUMBER             ?? '').trim(); }

// ── Send ─────────────────────────────────────────────────────────────────────

/**
 * Send an SMS via the Twilio REST API.
 * Prefers MessagingServiceSid (A2P-registered) over a raw From number.
 * Returns the Twilio Message SID.
 * Throws on any non-2xx response.
 */
export async function sendSMS(to: string, body: string): Promise<string> {
  const sid    = getSid();
  const token  = getToken();
  const msgSvc = getMsgSvc();
  const from   = getFrom();

  if (!sid || !token || (!msgSvc && !from)) {
    throw new Error(
      'Twilio env vars not configured — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, ' +
      'and either TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_NUMBER',
    );
  }

  const url  = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const auth = Buffer.from(`${sid}:${token}`).toString('base64');

  // Use Messaging Service SID when available — bypasses per-number A2P restrictions
  const params: Record<string, string> = msgSvc
    ? { To: to, MessagingServiceSid: msgSvc, Body: body }
    : { To: to, From: from, Body: body };

  const res = await fetch(url, {
    method:  'POST',
    headers: {
      Authorization:  `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params).toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error(
      `Twilio send failed ${res.status}: ${err['message'] ?? JSON.stringify(err)}`,
    );
  }

  const data = await res.json() as { sid: string };
  return data.sid;
}

// ── Webhook signature validation ──────────────────────────────────────────────

/**
 * Validate an inbound Twilio webhook request.
 *
 * Algorithm (https://www.twilio.com/docs/usage/webhooks/webhooks-security):
 *   1. Full webhook URL (with https scheme)
 *   2. POST params sorted alphabetically → append key + value
 *   3. HMAC-SHA1 with auth token → base64
 *   4. Constant-time compare with X-Twilio-Signature header
 */
export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>,
): boolean {
  const token = getToken();
  if (!token || !signature) return false;

  const sortedKeys = Object.keys(params).sort();
  const paramStr   = sortedKeys.map(k => `${k}${params[k]}`).join('');
  const toSign     = url + paramStr;

  const expected = crypto
    .createHmac('sha1', token)
    .update(toSign, 'utf8')
    .digest('base64');

  // Constant-time to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'base64'),
      Buffer.from(expected, 'base64'),
    );
  } catch {
    return false;
  }
}

// ── TwiML builders ────────────────────────────────────────────────────────────

/** Empty TwiML — acknowledge without replying. */
export function twimlEmpty(): string {
  return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
}

/** TwiML with an outbound SMS reply to the patient. */
export function twimlReply(message: string): string {
  const safe = message
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&apos;');
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${safe}</Message></Response>`;
}
