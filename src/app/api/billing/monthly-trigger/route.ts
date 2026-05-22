// GET|POST /api/billing/monthly-trigger
//
// Runs on the 1st of each month at 12:00 UTC (8 AM ET).
// Creates Draft billing records in Airtable for human review.
// NO automatic Stripe charges — Jordan reviews drafts before invoicing.
//
// For each Active clinic:
//   1. Gets active_patient_count + pmpm_rate from Airtable
//   2. Calculates invoice_amount
//   3. Creates a Draft BillingEvent in Airtable
//   4. Posts summary to SLACK_WEBHOOK_LEADS
//
// Protected by: Authorization: Bearer <CAREPATH_CRON_KEY>
//
// Response: { month, drafted, skipped, errors }

import { NextRequest, NextResponse } from 'next/server';
import { getAllClinics, createBillingEvent } from '@/lib/airtable';
import { getActivePatientCountByClinic } from '@/lib/patients';
import { postSlack } from '@/lib/slack';

async function handler(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const cronKey = (process.env.CAREPATH_CRON_KEY ?? '').trim();
  if (cronKey) {
    const auth = (req.headers.get('authorization') ?? '').trim();
    if (auth !== `Bearer ${cronKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const now   = new Date();
  const month = now.toISOString().slice(0, 7); // "YYYY-MM"

  // ── Load active clinics from Airtable ────────────────────────────────────────
  let clinics;
  try {
    clinics = await getAllClinics();
  } catch (err) {
    console.error('[monthly-trigger] Failed to load clinics:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to load clinics' }, { status: 500 });
  }

  const activeClinics = clinics.filter(c => c.status === 'Active');

  const results = {
    month,
    drafted: 0,
    skipped: 0,
    errors:  [] as string[],
  };

  for (const clinic of activeClinics) {
    try {
      // Count active patients in RDS
      const activePatients = await getActivePatientCountByClinic(clinic.clinic_id);

      if (activePatients === 0) {
        console.log(`[monthly-trigger] ${clinic.clinic_id} has 0 active patients — skipping`);
        results.skipped++;
        continue;
      }

      const invoiceAmount = activePatients * clinic.pmpm_rate;

      // Create Draft BillingEvent in Airtable
      await createBillingEvent({
        clinic_id:       clinic.clinic_id,
        month,
        active_patients: activePatients,
        pmpm_rate:       clinic.pmpm_rate,
        invoice_total:   invoiceAmount,
        status:          'Draft',
      });

      // Post to #leads — non-blocking
      postSlack(
        'leads',
        [],
        `💰 *Monthly Billing Draft Created*\n${clinic.name}: ${activePatients} patients × $${clinic.pmpm_rate} = $${invoiceAmount.toLocaleString()}\nStatus: Draft — review in Airtable`,
      ).catch(err => console.error('[monthly-trigger] Slack failed:', err instanceof Error ? err.message : err));

      console.log(`[monthly-trigger] ${clinic.clinic_id}: ${activePatients} × $${clinic.pmpm_rate} = $${invoiceAmount} — Draft created`);
      results.drafted++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[monthly-trigger] ${clinic.clinic_id} error: ${msg}`);
      results.errors.push(`${clinic.clinic_id}: ${msg}`);
    }
  }

  return NextResponse.json({
    month:   results.month,
    drafted: results.drafted,
    skipped: results.skipped,
    errors:  results.errors.length,
    ...(results.errors.length > 0 && { errorDetails: results.errors }),
  });
}

export const GET  = handler;
export const POST = handler;
