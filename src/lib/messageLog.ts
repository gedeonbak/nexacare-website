// HIPAA Architecture Note:
// Message bodies and patient replies contain PHI.
// All records are stored in AWS RDS PostgreSQL under the AWS BAA.
// Do NOT log message_body or patient_reply to console/Datadog in production.

import { query } from '@/lib/db';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MessageLog {
  id: string;
  log_id: string;
  patient_id: string;
  clinic_id: string;
  message_number: number;
  message_phase: 'Activation' | 'Momentum' | 'Retention Lock';
  scheduled_date: string | null;
  sent_at: string | null;
  delivery_status: 'Queued' | 'Sent' | 'Delivered' | 'Failed' | 'Opted Out';
  message_body: string | null;
  patient_reply: string | null;
  reply_received_at: string | null;
  risk_flag_triggered: boolean;
  risk_flag_type: string | null;
  twilio_message_sid: string | null;
  twilio_reply_sid: string | null;
  created_at: string;
}

export interface MessageStats {
  total_sent: number;
  total_delivered: number;
  total_replies: number;
  reply_rate: number;
  risk_flags_active: number;
}

// ── Phase helper ──────────────────────────────────────────────────────────────

export function phaseForMessage(
  messageNumber: number
): MessageLog['message_phase'] {
  if (messageNumber <= 6)  return 'Activation';
  if (messageNumber <= 12) return 'Momentum';
  return 'Retention Lock';
}

// ── Read queries ──────────────────────────────────────────────────────────────

export async function getMessageLogForPatient(
  patientId: string
): Promise<MessageLog[]> {
  return query<MessageLog>(
    `SELECT * FROM carepath_message_log
     WHERE patient_id = $1
     ORDER BY message_number ASC`,
    [patientId]
  );
}

export async function getTodaysMessages(): Promise<MessageLog[]> {
  return query<MessageLog>(
    `SELECT * FROM carepath_message_log
     WHERE DATE(sent_at) = CURRENT_DATE
     ORDER BY sent_at DESC`
  );
}

export async function getRiskFlaggedMessages(): Promise<MessageLog[]> {
  return query<MessageLog>(
    `SELECT * FROM carepath_message_log
     WHERE risk_flag_triggered = TRUE
     ORDER BY sent_at DESC
     LIMIT 50`
  );
}

export async function getMessageLogByClinic(
  clinicId: string
): Promise<MessageLog[]> {
  return query<MessageLog>(
    `SELECT * FROM carepath_message_log
     WHERE clinic_id = $1
     ORDER BY sent_at DESC
     LIMIT 200`,
    [clinicId]
  );
}

// ── Write queries ─────────────────────────────────────────────────────────────

export async function createMessageLog(data: {
  patientId: string;
  clinicId: string;
  messageNumber: number;
  scheduledDate: string;
  messageBody: string;
  twilioMessageSid?: string;
}): Promise<MessageLog> {
  const logId = `LOG-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const phase = phaseForMessage(data.messageNumber);

  const rows = await query<MessageLog>(
    `INSERT INTO carepath_message_log (
       log_id, patient_id, clinic_id,
       message_number, message_phase,
       scheduled_date, sent_at,
       delivery_status, message_body,
       twilio_message_sid
     ) VALUES (
       $1, $2, $3, $4, $5,
       $6, NOW(),
       'Sent', $7, $8
     ) RETURNING *`,
    [
      logId,
      data.patientId,
      data.clinicId,
      data.messageNumber,
      phase,
      data.scheduledDate,
      data.messageBody,
      data.twilioMessageSid ?? null,
    ]
  );
  return rows[0];
}

/**
 * Called by the Twilio inbound webhook when a patient replies.
 * Matches by outbound Twilio SID, stores reply + risk assessment.
 */
export async function updateMessageWithReply(
  twilioMessageSid: string,
  reply: string,
  replySid: string,
  riskFlagTriggered: boolean,
  riskFlagType: string | null
): Promise<void> {
  await query(
    `UPDATE carepath_message_log SET
       patient_reply       = $1,
       reply_received_at   = NOW(),
       delivery_status     = 'Delivered',
       twilio_reply_sid    = $2,
       risk_flag_triggered = $3,
       risk_flag_type      = $4
     WHERE twilio_message_sid = $5`,
    [reply, replySid, riskFlagTriggered, riskFlagType, twilioMessageSid]
  );
}

export async function markDelivered(
  twilioMessageSid: string
): Promise<void> {
  await query(
    `UPDATE carepath_message_log
     SET delivery_status = 'Delivered'
     WHERE twilio_message_sid = $1`,
    [twilioMessageSid]
  );
}

export async function markFailed(
  twilioMessageSid: string
): Promise<void> {
  await query(
    `UPDATE carepath_message_log
     SET delivery_status = 'Failed'
     WHERE twilio_message_sid = $1`,
    [twilioMessageSid]
  );
}

// ── Aggregate stats ───────────────────────────────────────────────────────────

export async function getMessageStats(): Promise<MessageStats> {
  const rows = await query<{
    total_sent:        string;
    total_delivered:   string;
    total_replies:     string;
    risk_flags_active: string;
  }>(
    `SELECT
       COUNT(*) FILTER (WHERE delivery_status IN ('Sent', 'Delivered')) AS total_sent,
       COUNT(*) FILTER (WHERE delivery_status = 'Delivered')            AS total_delivered,
       COUNT(*) FILTER (WHERE patient_reply IS NOT NULL)                 AS total_replies,
       COUNT(*) FILTER (WHERE risk_flag_triggered = TRUE)               AS risk_flags_active
     FROM carepath_message_log`
  );
  const r = rows[0];
  const sent    = parseInt(r.total_sent,    10);
  const replies = parseInt(r.total_replies, 10);
  return {
    total_sent:        sent,
    total_delivered:   parseInt(r.total_delivered,   10),
    total_replies:     replies,
    reply_rate:        sent > 0 ? Math.round((replies / sent) * 100) : 0,
    risk_flags_active: parseInt(r.risk_flags_active, 10),
  };
}
