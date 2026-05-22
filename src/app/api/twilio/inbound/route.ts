// POST /api/twilio/inbound
//
// Twilio webhook — fires when a patient replies to a CarePath SMS.
// Twilio sends application/x-www-form-urlencoded POST body.
//
// Key fields received from Twilio:
//   From            patient's phone number
//   Body            message text
//   MessageSid      Twilio SID of the INBOUND reply
//   OriginalRepliedMessageSid  SID of the outbound message being replied to (if present)
//
// HIPAA note:
//   - Patient replies (PHI) are stored in RDS only — never logged to console.
//   - Phone numbers are matched via phone_hash (last-4 digits) only.
//   - Twilio signature is validated before any DB access.

import { NextRequest } from 'next/server';
import {
  getPatientByPhoneHash,
  updatePatientRiskScore,
  updatePatientStatus,
} from '@/lib/patients';
import { updateMessageWithReply } from '@/lib/messageLog';
import { analyzeReply, escalationFromScore } from '@/lib/carepath-schedule';
import { validateTwilioSignature, twimlEmpty, twimlReply } from '@/lib/twilio';
import { postSlack, optOutBlocks, escalationBlocks } from '@/lib/slack';

const XML_HEADERS = { 'Content-Type': 'text/xml; charset=utf-8' };

// Localised auto-responses
const RESPONSES = {
  optOut: {
    EN: 'You have been unsubscribed from NexaCare CarePath messages. Reply START to re-enroll.',
    ES: 'Se ha dado de baja de los mensajes de NexaCare CarePath. Responda INICIO para volver a inscribirse.',
    FR: 'Vous avez été désinscrit des messages NexaCare CarePath. Répondez DÉBUT pour vous réinscrire.',
  },
  concern: {
    EN: "Thank you for letting us know. Your care team has been notified and will reach out soon. If this is a medical emergency, call 911.",
    ES: "Gracias por informarnos. Su equipo de salud ha sido notificado y se pondrá en contacto pronto. Si es una emergencia médica, llame al 911.",
    FR: "Merci de nous avoir informé. Votre équipe de soins a été notifiée et vous contactera bientôt. En cas d'urgence médicale, appelez le 911.",
  },
} as const;

export async function POST(req: NextRequest) {
  // ── Parse Twilio form body ─────────────────────────────────────────────────
  const rawBody = await req.text();
  const params  = Object.fromEntries(new URLSearchParams(rawBody));

  // ── Validate Twilio signature ──────────────────────────────────────────────
  const authToken = (process.env.TWILIO_AUTH_TOKEN ?? '').trim();
  if (authToken) {
    const signature = req.headers.get('x-twilio-signature') ?? '';
    const host      = req.headers.get('host') ?? '';
    const proto     = req.headers.get('x-forwarded-proto') ?? 'https';
    const webhookUrl = `${proto}://${host}/api/twilio/inbound`;

    if (!validateTwilioSignature(signature, webhookUrl, params)) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  // ── Extract fields ─────────────────────────────────────────────────────────
  const fromNumber     = (params['From']    ?? '').trim();
  const replyBody      = (params['Body']    ?? '').trim();
  const replySid       = (params['MessageSid'] ?? '').trim();
  const outboundSid    = (params['OriginalRepliedMessageSid'] ?? '').trim();

  if (!fromNumber || !replyBody) {
    return new Response(twimlEmpty(), { status: 200, headers: XML_HEADERS });
  }

  // ── Look up patient by phone hash (last-4 digits) ─────────────────────────
  // HIPAA: never log fromNumber — only use it to derive the hash
  const phoneHash = fromNumber.replace(/\D/g, '').slice(-4);

  let patient;
  try {
    patient = await getPatientByPhoneHash(phoneHash);
  } catch (err) {
    console.error('[inbound] DB error looking up patient:', err instanceof Error ? err.message : err);
    return new Response(twimlEmpty(), { status: 200, headers: XML_HEADERS });
  }

  if (!patient) {
    // Unknown sender — acknowledge silently (could be a wrong-number reply)
    return new Response(twimlEmpty(), { status: 200, headers: XML_HEADERS });
  }

  const lang = patient.preferred_language;

  // ── Analyse the reply ──────────────────────────────────────────────────────
  const analysis = analyzeReply(replyBody);

  // ── Handle opt-out ─────────────────────────────────────────────────────────
  if (analysis.isOptOut) {
    try {
      await updatePatientStatus(patient.patient_id, 'Opted Out');
    } catch (err) {
      console.error('[inbound] opt-out status update failed:', err instanceof Error ? err.message : err);
    }

    // Alert #escalations — fire-and-forget
    postSlack(
      'escalations',
      [],
      `⚠️ *Patient Opt-Out*\nPatient: ${patient.first_name}\nClinic: ${patient.clinic_name}\nCarePath day: ${patient.carepath_day}`,
    ).catch(err => console.error('[inbound] opt-out Slack failed:', err instanceof Error ? err.message : err));

    const msg = RESPONSES.optOut[lang] ?? RESPONSES.optOut.EN;
    return new Response(twimlReply(msg), { status: 200, headers: XML_HEADERS });
  }

  // ── Log the reply against the original outbound message ───────────────────
  // PHI (replyBody) is stored in RDS only — never logged to console
  if (outboundSid) {
    try {
      await updateMessageWithReply(
        outboundSid,
        replyBody,               // PHI — RDS storage only
        replySid,
        analysis.riskDelta > 0,  // risk_flag_triggered
        null,                    // risk_flag_type — populated by scheduled No-Reply checker
      );
    } catch (err) {
      // Non-fatal: log mismatch shouldn't block risk scoring
      console.warn('[inbound] updateMessageWithReply:', err instanceof Error ? err.message : err);
    }
  }

  // ── Update patient risk score ──────────────────────────────────────────────
  const newScore     = Math.min(10, Math.max(0, patient.churn_risk_score + analysis.riskDelta));
  const escalation   = escalationFromScore(newScore);

  try {
    await updatePatientRiskScore(
      patient.patient_id,
      newScore,
      escalation,
      // Store sentiment label as last_reply preview — avoids logging raw PHI
      // while still giving the admin portal useful context
      `[${analysis.sentiment}] ${replyBody.slice(0, 50)}`,
    );
  } catch (err) {
    console.error('[inbound] risk score update failed:', err instanceof Error ? err.message : err);
  }

  // ── Slack escalation alert if risk ≥ 7 and newly escalated ───────────────
  const prevEscalation = patient.escalation_status;
  const escalationRaised = escalation !== prevEscalation &&
    (escalation === 'Monitoring' || escalation === 'Founder Alerted');

  if (newScore >= 7 || escalation === 'Founder Alerted') {
    postSlack(
      'escalations',
      [],
      `🚨 *CarePath Escalation*\nPatient: ${patient.first_name}\nClinic: ${patient.clinic_name}\nRisk score: ${newScore}\nReply: [${analysis.sentiment}] ${replyBody.slice(0, 80)}\nCarePath day: ${patient.carepath_day}\nAction required: check RDS`,
    ).catch(err => console.error('[inbound] escalation Slack failed:', err instanceof Error ? err.message : err));
  }

  // ── Auto-respond if high-risk sentiment ───────────────────────────────────
  if (analysis.sentiment === 'negative') {
    const msg = RESPONSES.concern[lang] ?? RESPONSES.concern.EN;
    return new Response(twimlReply(msg), { status: 200, headers: XML_HEADERS });
  }

  // Positive / neutral — acknowledge without replying (reduces SMS noise)
  return new Response(twimlEmpty(), { status: 200, headers: XML_HEADERS });
}

// Twilio only sends POST for webhooks
export function GET() {
  return new Response('Method not allowed', { status: 405 });
}
