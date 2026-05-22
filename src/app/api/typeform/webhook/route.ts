// POST /api/typeform/webhook
//
// Receives Typeform form_response events and enrolls patients in RDS.
//
// Security: Typeform signs each POST with HMAC-SHA256 over the raw body.
// The signature is sent in the `Typeform-Signature` header as `sha256=<hex>`.
// We compare it against HMAC(TYPEFORM_WEBHOOK_SECRET, rawBody) and reject any
// request that fails the check (constant-time comparison to prevent timing attacks).
//
// Language is derived from the form_id present in the payload:
//   g2WVfC0n → EN
//   IpwsVhZw → ES
//   UbYJjIEG → FR
//
// Required Typeform field refs (set in your Typeform form builder):
//   first_name   — patient's first name (short_text)
//   phone_number — patient's phone (phone_number or short_text)
//   clinic_id    — NexaCare internal clinic ID (short_text or hidden field)
//   clinic_name  — human-readable clinic name (short_text or hidden field)
//
// Hidden fields are supported: they appear in form_response.hidden, not answers[].
// If clinic_id / clinic_name are passed as hidden fields (URL params ?clinic_id=X)
// they will be read from form_response.hidden automatically.

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { createPatient } from '@/lib/patients';
import { postSlack } from '@/lib/slack';

// Force Node.js runtime — required for `crypto` module and `pg` (via patients.ts)
export const runtime = 'nodejs';

// ── Form ID → language map ────────────────────────────────────────────────────
const FORM_LANGUAGE: Record<string, 'EN' | 'ES' | 'FR'> = {
  g2WVfC0n: 'EN',
  IpwsVhZw: 'ES',
  UbYJjIEG: 'FR',
};

// ── Typeform payload types ────────────────────────────────────────────────────

interface TypeformField {
  id: string;
  type: string;
  ref?: string;
  title?: string;
}

interface TypeformAnswer {
  field: TypeformField;
  type: string;
  text?: string;
  phone_number?: string;
  choice?: { label?: string; other?: string };
  boolean?: boolean;
}

interface TypeformHidden {
  [key: string]: string;
}

interface TypeformFormResponse {
  form_id: string;
  token: string;
  submitted_at: string;
  answers: TypeformAnswer[];
  hidden?: TypeformHidden;
}

interface TypeformWebhookPayload {
  event_id: string;
  event_type: string;
  form_response: TypeformFormResponse;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * NOTE: Typeform webhook payloads do NOT include the question title in
 * answer.field — only id, type, and ref are present. Title-based matching
 * therefore never fires. We use answer TYPE as the primary extraction strategy
 * since it is set by Typeform regardless of how the coordinator named the field.
 */

/**
 * Extract the phone number from answers.
 * Strategy (in order):
 *   1. Any answer whose type === 'phone_number' (Typeform's dedicated phone field)
 *   2. Any text answer whose ref contains a phone-related keyword (if refs are set)
 */
function extractPhone(answers: TypeformAnswer[]): string | null {
  // Primary: Typeform phone_number question type — unambiguous regardless of ref/UUID
  const phoneAnswer = answers.find(a => a.type === 'phone_number');
  if (phoneAnswer?.phone_number) return phoneAnswer.phone_number;

  // Fallback: text answer with a phone-related ref (only works if ref was manually set)
  const phoneKeywords = ['phone', 'phone_number', 'mobile', 'cell', 'teléfono', 'téléphone'];
  for (const answer of answers) {
    const ref = (answer.field.ref ?? '').toLowerCase();
    if (phoneKeywords.some(k => ref.includes(k)) && answer.type === 'text' && answer.text) {
      return answer.text;
    }
  }
  return null;
}

/**
 * Extract the patient first name from answers.
 * Strategy (in order):
 *   1. Any answer whose ref contains a name-related keyword (if refs are manually set)
 *   2. First text-type answer (typically the name field in our form layout)
 */
function extractFirstName(answers: TypeformAnswer[]): string | null {
  const nameKeywords = ['first_name', 'first name', 'name', 'nombre', 'prénom', 'nom'];

  // Primary: ref-based match (works once refs are set to human-readable values)
  for (const answer of answers) {
    const ref = (answer.field.ref ?? '').toLowerCase();
    if (nameKeywords.some(k => ref.includes(k)) && answer.type === 'text' && answer.text) {
      return answer.text;
    }
  }

  // Fallback: first short_text answer in the form (Q1 in our layout = first name)
  const firstText = answers.find(a => a.type === 'text');
  return firstText?.text ?? null;
}

/**
 * Extract a value by ref keyword match — used for clinic_id / clinic_name
 * when they appear as answer fields rather than hidden fields.
 */
function extractByRef(answers: TypeformAnswer[], refCandidates: string[]): string | null {
  for (const answer of answers) {
    const ref = (answer.field.ref ?? '').toLowerCase();
    if (refCandidates.some(c => ref.includes(c.toLowerCase()))) {
      if (answer.type === 'text' && answer.text) return answer.text;
      if (answer.type === 'choice') return answer.choice?.label ?? answer.choice?.other ?? null;
    }
  }
  return null;
}

// ── Signature validation ──────────────────────────────────────────────────────

function validateSignature(rawBodyBuf: Buffer, signatureHeader: string): boolean {
  const secret = (process.env.TYPEFORM_WEBHOOK_SECRET ?? '').trim();
  if (!secret) return false;                          // no secret → reject all
  if (!signatureHeader.startsWith('sha256=')) return false;

  // Typeform encodes the HMAC digest as base64 (not hex).
  // Header format: sha256=<base64(HMAC-SHA256(secret, rawBody))>
  const received = signatureHeader.slice('sha256='.length);
  const expectedBase64 = createHmac('sha256', secret).update(rawBodyBuf).digest('base64');

  try {
    // timingSafeEqual requires same-length buffers — compare as UTF-8 byte sequences.
    // Both are HMAC-SHA256 base64 outputs (44 chars incl. padding) so lengths match.
    return timingSafeEqual(
      Buffer.from(expectedBase64),
      Buffer.from(received),
    );
  } catch {
    return false;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Read raw bytes — arrayBuffer guarantees no encoding transforms (same pattern
  // as our Stripe webhook which also does HMAC over raw bytes).
  const rawBodyBuf = Buffer.from(await req.arrayBuffer());

  // ── Signature check ─────────────────────────────────────────────────────────
  const signatureHeader = req.headers.get('Typeform-Signature') ?? '';
  if (!validateSignature(rawBodyBuf, signatureHeader)) {
    console.error('[typeform/webhook] Invalid or missing Typeform-Signature');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse payload ────────────────────────────────────────────────────────────
  let payload: TypeformWebhookPayload;
  try {
    payload = JSON.parse(rawBodyBuf.toString('utf8')) as TypeformWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Only process form_response events
  if (payload.event_type !== 'form_response') {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const { form_response } = payload;
  const { form_id, answers = [], hidden = {} } = form_response;

  // ── Derive language ──────────────────────────────────────────────────────────
  const lang: 'EN' | 'ES' | 'FR' = FORM_LANGUAGE[form_id] ?? 'EN';

  // ── Extract fields ───────────────────────────────────────────────────────────
  // phone: matched by answer TYPE (phone_number) — works with any ref/UUID
  // name:  matched by ref keyword first, then first text answer as fallback
  // clinic_id / clinic_name: come from Typeform hidden fields (passed via PopupButton
  //   or URL hash), with answer-field fallback for manually entered values.

  const firstName = extractFirstName(answers) ?? '';
  const rawPhone  = extractPhone(answers) ?? '';

  const clinicId =
    hidden['clinic_id'] ??
    hidden['clinicId'] ??
    extractByRef(answers, ['clinic_id', 'clinicid', 'clinic id']) ??
    '';

  const clinicName =
    hidden['clinic_name'] ??
    hidden['clinicName'] ??
    extractByRef(answers, ['clinic_name', 'clinicname', 'clinic name', 'clinic']) ??
    '';

  // ── Validate required fields ─────────────────────────────────────────────────
  const missing: string[] = [];
  if (!firstName.trim())  missing.push('first_name');
  if (!rawPhone.trim())   missing.push('phone_number');
  if (!clinicId.trim())   missing.push('clinic_id');
  if (!clinicName.trim()) missing.push('clinic_name');

  if (missing.length > 0) {
    console.error('[typeform/webhook] Missing required fields:', missing, '| form_id:', form_id);

    // Alert #leads so no submission slips through silently.
    // PHI-safe: only first name (no phone). Coordinator must manually follow up.
    postSlack(
      'leads',
      [],
      `⚠️ *Incomplete Enrollment — Manual Follow-Up Required*\nName: ${firstName.trim() || '(unknown)'}\nLanguage: ${lang}\nMissing: ${missing.join(', ')}\nLikely cause: patient used a direct form link without clinic context.\nAction: re-enroll via portal with correct clinic selected.`,
    ).catch((err: unknown) =>
      console.error('[typeform/webhook] Slack alert failed:', err instanceof Error ? err.message : err),
    );

    // Return 200 to prevent Typeform from retrying
    return NextResponse.json({
      ok: false,
      error: `Missing required fields: ${missing.join(', ')}`,
      form_id,
    });
  }

  // ── Normalize phone ──────────────────────────────────────────────────────────
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    console.error('[typeform/webhook] Invalid phone length for form_id:', form_id);
    return NextResponse.json({ ok: false, error: 'Invalid phone number length' });
  }
  const normalizedPhone = rawPhone.startsWith('+') ? rawPhone : `+1${digits}`;

  // ── Enroll patient in RDS ────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];

  try {
    const patient = await createPatient({
      clinicId:          clinicId.trim(),
      clinicName:        clinicName.trim(),
      firstName:         firstName.trim(),
      phoneNumber:       normalizedPhone,
      preferredLanguage: lang,
      enrollmentDate:    today,
      nextMessageDate:   today,
    });

    // Fire-and-forget Slack notification — never blocks response
    postSlack(
      'leads',
      [],
      `✅ *New Patient Enrolled (via Typeform)*\nName: ${firstName.trim()}\nClinic: ${clinicName.trim()}\nLanguage: ${lang}\nCarePath Day 1 SMS: sent`,
    ).catch((err: unknown) =>
      console.error(
        '[typeform/webhook] Slack alert failed:',
        err instanceof Error ? err.message : err,
      ),
    );

    console.log('[typeform/webhook] Patient enrolled:', patient.patient_id, '| clinic:', clinicId.trim());
    return NextResponse.json({ ok: true, patient_id: patient.patient_id }, { status: 201 });
  } catch (err) {
    console.error(
      '[typeform/webhook] createPatient failed:',
      err instanceof Error ? err.message : err,
    );
    // Return 500 so Typeform retries (this is a real server error, not a data issue)
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to enroll patient',
        detail: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// Typeform only POSTs to webhooks
export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
