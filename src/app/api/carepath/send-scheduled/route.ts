// GET|POST /api/carepath/send-scheduled
//
// Sends today's due CarePath messages via Twilio.
// Called by Vercel Cron at 9 AM ET daily (see vercel.json).
// Also supports manual POST for testing.
//
// Protected by Authorization: Bearer <CRON_SECRET> header.
// If CRON_SECRET is not set, all requests are allowed (dev only).
//
// Response:
//   { sent: number, skipped: number, errors: number, errorDetails?: string[] }

import { NextRequest, NextResponse } from 'next/server';
import { getPatientsForTodaySchedule, updatePatientNextMessage } from '@/lib/patients';
import { createMessageLog } from '@/lib/messageLog';
import { getMessageBody, nextMessageDate } from '@/lib/carepath-schedule';
import { sendSMS } from '@/lib/twilio';

async function handler(req: NextRequest) {
  // ── Auth ───────────────────────────────────────────────────────────────────
  const cronSecret = (process.env.CRON_SECRET ?? '').trim();
  if (cronSecret) {
    const auth = (req.headers.get('authorization') ?? '').trim();
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── Fetch today's patients ─────────────────────────────────────────────────
  let patients;
  try {
    patients = await getPatientsForTodaySchedule();
  } catch (err) {
    console.error('[send-scheduled] DB error fetching patients:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Database error', detail: err instanceof Error ? err.message : 'Unknown' }, { status: 500 });
  }

  if (patients.length === 0) {
    return NextResponse.json({ sent: 0, skipped: 0, errors: 0, message: 'No patients due today' });
  }

  const today = new Date().toISOString().split('T')[0];
  const results = {
    sent:    0,
    skipped: 0,
    errors:  [] as string[],
  };

  // ── Send each message ──────────────────────────────────────────────────────
  for (const patient of patients) {
    const msgNum = patient.next_message_num;

    // Build the SMS body
    const body = getMessageBody(msgNum, patient.first_name, patient.preferred_language);
    if (!body) {
      console.warn(`[send-scheduled] No template for message ${msgNum} — skipping ${patient.patient_id}`);
      results.skipped++;
      continue;
    }

    try {
      // 1. Send via Twilio — never log phone_number to console (PHI)
      const twilioSid = await sendSMS(patient.phone_number, body);

      // 2. Log to carepath_message_log (PHI stored in RDS under BAA)
      await createMessageLog({
        patientId:        patient.patient_id,
        clinicId:         patient.clinic_id,
        messageNumber:    msgNum,
        scheduledDate:    patient.next_message_date ?? today,
        messageBody:      body,
        twilioMessageSid: twilioSid,
      });

      // 3. Advance the patient's schedule
      const sentAt         = new Date();
      const nextDate       = nextMessageDate(msgNum, sentAt);
      const nextNum        = msgNum + 1;
      const isLastMessage  = msgNum >= 20;

      await updatePatientNextMessage(
        patient.patient_id,
        isLastMessage ? 21 : nextNum,   // >20 excludes from future schedule runs
        nextDate ? nextDate.toISOString().split('T')[0] : null,
        isLastMessage ? 'Completed' : undefined,
      );

      results.sent++;
    } catch (err) {
      // Log patient_id only — never log name, phone, or message body
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[send-scheduled] patient ${patient.patient_id} msg ${msgNum}: ${msg}`);
      results.errors.push(`${patient.patient_id} msg${msgNum}: ${msg}`);
    }
  }

  return NextResponse.json({
    sent:    results.sent,
    skipped: results.skipped,
    errors:  results.errors.length,
    ...(results.errors.length > 0 && { errorDetails: results.errors }),
  });
}

// Vercel Cron triggers GET; manual testing can use POST
export const GET  = handler;
export const POST = handler;
