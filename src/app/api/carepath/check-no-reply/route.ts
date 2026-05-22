// GET|POST /api/carepath/check-no-reply
//
// Runs daily at 10 AM ET (15:00 UTC) — one hour after send-scheduled.
// Finds active patients whose most recent message (sent 2–7 days ago)
// has received no reply, then:
//   1. Bumps churn_risk_score by +2 (capped at 10)
//   2. Re-derives escalation_status from the new score
//   3. Posts to Slack #escalations for new escalations
//
// Risk thresholds:
//   < 5  → None
//   5–6  → Monitoring
//   7–8  → Monitoring  (higher)
//   9–10 → Founder Alerted
//
// Protected by: Authorization: Bearer <CAREPATH_CRON_KEY>
//
// Response: { checked, escalated, alerted, skipped, errors }

import { NextRequest, NextResponse } from 'next/server';
import { getPatientsWithNoRecentReply, updatePatientRiskScore } from '@/lib/patients';
import { postSlack, escalationBlocks } from '@/lib/slack';

type EscalationStatus = 'None' | 'Monitoring' | 'Founder Alerted';

function deriveEscalation(score: number): EscalationStatus {
  if (score >= 9) return 'Founder Alerted';
  if (score >= 5) return 'Monitoring';
  return 'None';
}

async function handler(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const cronKey = (process.env.CAREPATH_CRON_KEY ?? '').trim();
  if (cronKey) {
    const auth = (req.headers.get('authorization') ?? '').trim();
    if (auth !== `Bearer ${cronKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── Fetch patients with no recent reply ───────────────────────────────────────
  let patients;
  try {
    patients = await getPatientsWithNoRecentReply();
  } catch (err) {
    console.error('[check-no-reply] DB error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (patients.length === 0) {
    return NextResponse.json({ checked: 0, escalated: 0, alerted: 0, skipped: 0, errors: 0 });
  }

  const results = {
    checked:   0,
    escalated: 0,   // newly entered Monitoring
    alerted:   0,   // newly entered Founder Alerted
    skipped:   0,
    errors:    [] as string[],
  };

  for (const patient of patients) {
    try {
      const prevScore      = patient.churn_risk_score ?? 0;
      const prevEscalation = patient.escalation_status as EscalationStatus;

      // Bump score +2, cap at 10
      const newScore      = Math.min(prevScore + 2, 10);
      const newEscalation = deriveEscalation(newScore);

      // Only update if score or escalation changed
      if (newScore === prevScore && newEscalation === prevEscalation) {
        results.skipped++;
        continue;
      }

      // Persist — last_reply stays unchanged (we're not setting a new reply)
      await updatePatientRiskScore(
        patient.patient_id,
        newScore,
        newEscalation,
        patient.last_reply ?? '(no reply)',
      );

      results.checked++;

      const escalationChanged = newEscalation !== prevEscalation;

      if (escalationChanged && newEscalation === 'Monitoring') {
        results.escalated++;
        console.log(`[check-no-reply] ${patient.patient_id} → Monitoring (score ${prevScore}→${newScore})`);
      }

      if (escalationChanged && newEscalation === 'Founder Alerted') {
        results.alerted++;
        console.log(`[check-no-reply] ${patient.patient_id} → Founder Alerted (score ${prevScore}→${newScore})`);

        // Post to Slack #escalations — PHI-safe: no name beyond first name, no phone
        await postSlack(
          'escalations',
          escalationBlocks({
            patientId:   patient.patient_id,
            clinicName:  patient.clinic_name,
            riskScore:   newScore,
            lastReply:   '(no reply received)',
            carePathDay: patient.carepath_day,
          }),
          `⚠️ No-reply escalation: ${patient.clinic_name} — Day ${patient.carepath_day} — Risk ${newScore}/10`,
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // Log patient_id only — never name or phone
      console.error(`[check-no-reply] patient ${patient.patient_id}: ${msg}`);
      results.errors.push(`${patient.patient_id}: ${msg}`);
    }
  }

  return NextResponse.json({
    checked:   results.checked,
    escalated: results.escalated,
    alerted:   results.alerted,
    skipped:   results.skipped,
    errors:    results.errors.length,
    ...(results.errors.length > 0 && { errorDetails: results.errors }),
  });
}

export const GET  = handler;
export const POST = handler;
