// HIPAA Architecture Note:
// This file handles PHI (Protected Health Information).
// All patient records are stored in AWS RDS PostgreSQL,
// which operates under the AWS Business Associate Agreement (BAA).
// Do NOT log phone numbers, full names, or reply content.

import { query, queryOne } from '@/lib/db';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Patient {
  id: string;
  patient_id: string;
  clinic_id: string;
  clinic_name: string;
  first_name: string;
  phone_number: string;
  /** Last 4 digits of phone — used for Twilio inbound matching */
  phone_hash: string;
  preferred_language: 'EN' | 'ES' | 'FR';
  enrollment_date: string;
  /** Computed by DB: days since enrollment_date */
  carepath_day: number;
  status: 'Active' | 'Paused' | 'Opted Out' | 'Churned' | 'Completed';
  churn_risk_score: number;
  escalation_status: 'None' | 'Monitoring' | 'Founder Alerted';
  last_reply: string | null;
  last_reply_date: string | null;
  next_message_num: number;
  next_message_date: string | null;
  notes: string | null;
  hubspot_contact_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientStats {
  total_active: number;
  total_enrolled: number;
  avg_risk_score: number;
  escalations_count: number;
  opted_out_count: number;
  completed_count: number;
}

// ── Read queries ─────────────────────────────────────────────────────────────

export async function getAllPatients(): Promise<Patient[]> {
  return query<Patient>(
    `SELECT * FROM patients
     ORDER BY churn_risk_score DESC, created_at DESC`
  );
}

export async function getPatientsByClinic(clinicId: string): Promise<Patient[]> {
  return query<Patient>(
    `SELECT * FROM patients
     WHERE clinic_id = $1
     ORDER BY churn_risk_score DESC`,
    [clinicId]
  );
}

export async function getActivePatients(): Promise<Patient[]> {
  return query<Patient>(
    `SELECT * FROM patients
     WHERE status = 'Active'
     ORDER BY churn_risk_score DESC`
  );
}

export async function getPatientById(patientId: string): Promise<Patient | null> {
  return queryOne<Patient>(
    `SELECT * FROM patients WHERE patient_id = $1`,
    [patientId]
  );
}

/**
 * Look up an active patient by the last-4 of their phone.
 * Used when Twilio delivers an inbound reply — the From number's
 * last-4 is the lookup key to avoid storing full numbers in logs.
 */
export async function getPatientByPhoneHash(phoneHash: string): Promise<Patient | null> {
  return queryOne<Patient>(
    `SELECT * FROM patients
     WHERE phone_hash = $1 AND status = 'Active'
     LIMIT 1`,
    [phoneHash]
  );
}

/**
 * Return every active patient whose next_message_date is today or overdue.
 * Called by the scheduled send-scheduled route at 9 AM.
 */
export async function getPatientsForTodaySchedule(): Promise<Patient[]> {
  return query<Patient>(
    `SELECT * FROM patients
     WHERE status = 'Active'
       AND next_message_date <= CURRENT_DATE
       AND next_message_num <= 20
     ORDER BY next_message_date ASC`
  );
}

/** Return all active patients with a non-None escalation status. */
export async function getEscalations(): Promise<Patient[]> {
  return query<Patient>(
    `SELECT * FROM patients
     WHERE escalation_status IN ('Founder Alerted', 'Monitoring')
       AND status = 'Active'
     ORDER BY churn_risk_score DESC, last_reply_date DESC`
  );
}

// ── Write queries ─────────────────────────────────────────────────────────────

export async function createPatient(data: {
  clinicId: string;
  clinicName: string;
  firstName: string;
  phoneNumber: string;
  preferredLanguage: 'EN' | 'ES' | 'FR';
  enrollmentDate: string;
  nextMessageDate: string;
  hubspotContactId?: string;
}): Promise<Patient> {
  const patientId = `PT-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 11)
    .toUpperCase()}`;

  // Last-4 of phone — never log or expose the full number
  const phoneHash = data.phoneNumber.replace(/\D/g, '').slice(-4);

  const rows = await query<Patient>(
    `INSERT INTO patients (
       patient_id, clinic_id, clinic_name,
       first_name, phone_number, phone_hash,
       preferred_language, enrollment_date,
       next_message_num, next_message_date,
       status, churn_risk_score, escalation_status,
       hubspot_contact_id
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8,
       1, $9, 'Active', 0, 'None', $10
     ) RETURNING *`,
    [
      patientId,
      data.clinicId,
      data.clinicName,
      data.firstName,
      data.phoneNumber,
      phoneHash,
      data.preferredLanguage,
      data.enrollmentDate,
      data.nextMessageDate,
      data.hubspotContactId ?? null,
    ]
  );
  return rows[0];
}

export async function updatePatientRiskScore(
  patientId: string,
  score: number,
  escalationStatus: Patient['escalation_status'],
  lastReply: string
): Promise<void> {
  await query(
    `UPDATE patients SET
       churn_risk_score = $1,
       escalation_status = $2,
       last_reply = $3,
       last_reply_date = NOW()
     WHERE patient_id = $4`,
    [score, escalationStatus, lastReply, patientId]
  );
}

export async function updatePatientNextMessage(
  patientId: string,
  nextMessageNum: number,
  nextMessageDate: string | null,
  newStatus?: Patient['status']
): Promise<void> {
  await query(
    `UPDATE patients SET
       next_message_num  = $1,
       next_message_date = $2,
       status            = COALESCE($3, status)
     WHERE patient_id = $4`,
    [nextMessageNum, nextMessageDate, newStatus ?? null, patientId]
  );
}

export async function updatePatientStatus(
  patientId: string,
  status: Patient['status']
): Promise<void> {
  await query(
    `UPDATE patients SET status = $1 WHERE patient_id = $2`,
    [status, patientId]
  );
}

export async function updatePatientNotes(
  patientId: string,
  notes: string
): Promise<void> {
  await query(
    `UPDATE patients SET notes = $1 WHERE patient_id = $2`,
    [notes, patientId]
  );
}

// ── Aggregate stats ───────────────────────────────────────────────────────────

export async function getPatientStats(): Promise<PatientStats> {
  const rows = await query<{
    total_active:      string;
    total_enrolled:    string;
    avg_risk_score:    string;
    escalations_count: string;
    opted_out_count:   string;
    completed_count:   string;
  }>(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'Active')                              AS total_active,
       COUNT(*)                                                               AS total_enrolled,
       ROUND(AVG(churn_risk_score) FILTER (WHERE status = 'Active'), 1)      AS avg_risk_score,
       COUNT(*) FILTER (WHERE escalation_status != 'None' AND status = 'Active') AS escalations_count,
       COUNT(*) FILTER (WHERE status = 'Opted Out')                          AS opted_out_count,
       COUNT(*) FILTER (WHERE status = 'Completed')                          AS completed_count
     FROM patients`
  );
  const r = rows[0];
  return {
    total_active:      parseInt(r.total_active,      10),
    total_enrolled:    parseInt(r.total_enrolled,    10),
    avg_risk_score:    parseFloat(r.avg_risk_score)  || 0,
    escalations_count: parseInt(r.escalations_count, 10),
    opted_out_count:   parseInt(r.opted_out_count,   10),
    completed_count:   parseInt(r.completed_count,   10),
  };
}
