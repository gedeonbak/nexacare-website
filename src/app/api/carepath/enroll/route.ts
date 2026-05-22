// POST /api/carepath/enroll
//
// Enroll a new patient in the NexaCare CarePath program.
// Protected by x-api-key header (INTERNAL_API_SECRET env var).
//
// Request body:
//   clinicId          string  required
//   clinicName        string  required
//   firstName         string  required
//   phoneNumber       string  required  E.164 format recommended (+15551234567)
//   preferredLanguage string  optional  EN | ES | FR  (default EN)
//   enrollmentDate    string  optional  YYYY-MM-DD    (default today)
//   hubspotContactId  string  optional
//
// Response 201:
//   { success: true, patient: Patient }

import { NextRequest, NextResponse } from 'next/server';
import { createPatient } from '@/lib/patients';
import { postSlack, newEnrollmentBlocks } from '@/lib/slack';

export async function POST(req: NextRequest) {
  // ── Auth ───────────────────────────────────────────────────────────────────
  const apiKey = (req.headers.get('x-api-key') ?? '').trim();
  const secret = (process.env.INTERNAL_API_SECRET ?? '').trim();

  if (!secret) {
    return NextResponse.json(
      { error: 'INTERNAL_API_SECRET is not configured on this server' },
      { status: 500 },
    );
  }
  if (apiKey !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  const {
    clinicId,
    clinicName,
    firstName,
    phoneNumber,
    preferredLanguage,
    enrollmentDate,
    hubspotContactId,
  } = body;

  // ── Validate required fields ───────────────────────────────────────────────
  if (!clinicId || typeof clinicId !== 'string') {
    return NextResponse.json({ error: 'clinicId is required' }, { status: 400 });
  }
  if (!clinicName || typeof clinicName !== 'string') {
    return NextResponse.json({ error: 'clinicName is required' }, { status: 400 });
  }
  if (!firstName || typeof firstName !== 'string') {
    return NextResponse.json({ error: 'firstName is required' }, { status: 400 });
  }
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return NextResponse.json({ error: 'phoneNumber is required' }, { status: 400 });
  }

  // Normalize phone — strip formatting, require 10–15 digits
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return NextResponse.json(
      { error: 'phoneNumber must contain 10–15 digits (E.164 format recommended)' },
      { status: 400 },
    );
  }

  // Normalize to E.164 if not already prefixed
  const normalizedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${digits}`;

  // Language validation
  const lang = (typeof preferredLanguage === 'string'
    ? preferredLanguage.toUpperCase()
    : 'EN') as 'EN' | 'ES' | 'FR';
  if (!['EN', 'ES', 'FR'].includes(lang)) {
    return NextResponse.json(
      { error: 'preferredLanguage must be EN, ES, or FR' },
      { status: 400 },
    );
  }

  // Enrollment date — default to today
  const today = new Date().toISOString().split('T')[0];
  const enrDate =
    typeof enrollmentDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(enrollmentDate)
      ? enrollmentDate
      : today;

  // ── Create patient ─────────────────────────────────────────────────────────
  try {
    const patient = await createPatient({
      clinicId,
      clinicName,
      firstName:         firstName.trim(),
      phoneNumber:       normalizedPhone,
      preferredLanguage: lang,
      enrollmentDate:    enrDate,
      nextMessageDate:   enrDate, // Message 1 sends on enrollment day
      hubspotContactId:
        typeof hubspotContactId === 'string' ? hubspotContactId : undefined,
    });

    // Fire-and-forget Slack alert — never blocks the response
    postSlack(
      'leads',
      [],
      `✅ *New Patient Enrolled*\nName: ${firstName.trim()}\nClinic: ${clinicName}\nLanguage: ${lang}\nCarePath Day 1 SMS: sent`,
    ).catch(err => console.error('[enroll] Slack alert failed:', err instanceof Error ? err.message : err));

    return NextResponse.json({ success: true, patient }, { status: 201 });
  } catch (error) {
    // Never log PHI — safe to log the error message only
    console.error('[enroll] createPatient error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        error:  'Failed to enroll patient',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: 'Use POST to enroll a patient' }, { status: 405 });
}
