// GET|POST /api/stripe/billing-run
//
// Monthly billing cron — runs on the 1st of each month (see vercel.json).
// For each active clinic:
//   1. Count active patients in RDS
//   2. Update Stripe subscription quantity
//   3. Create a Draft BillingEvent in Airtable
//
// Stripe automatically generates and collects the invoice on the
// subscription's billing cycle date. The webhook handler marks it Paid/Failed.
//
// Protected by: Authorization: Bearer <CAREPATH_CRON_KEY>
//
// Response: { processed, skipped, errors, details[] }

import { NextRequest, NextResponse } from 'next/server';
import { getAllClinics, createBillingEvent } from '@/lib/airtable';
import { getActivePatientCountByClinic } from '@/lib/patients';
import { getStripe, updateSubscriptionQuantity } from '@/lib/stripe';

// We store the subscription ID in a separate Airtable field.
// Extend the Clinic type locally to include it.
type ClinicWithSub = Awaited<ReturnType<typeof getAllClinics>>[number] & {
  stripe_subscription_id?: string;
};

async function handler(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const cronKey = (process.env.CAREPATH_CRON_KEY ?? '').trim();
  if (cronKey) {
    const auth = (req.headers.get('authorization') ?? '').trim();
    if (auth !== `Bearer ${cronKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  // ── Load active clinics ───────────────────────────────────────────────────
  let clinics: ClinicWithSub[];
  try {
    clinics = (await getAllClinics()) as ClinicWithSub[];
  } catch (err) {
    console.error('[billing-run] Failed to load clinics:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to load clinics' }, { status: 500 });
  }

  const activeClinics = clinics.filter(c => c.status === 'Active');

  const results = {
    processed: 0,
    skipped:   0,
    errors:    [] as string[],
    details:   [] as object[],
  };

  for (const clinic of activeClinics) {
    const subId = clinic.stripe_subscription_id?.trim() ?? '';

    if (!subId) {
      console.warn(`[billing-run] Clinic ${clinic.clinic_id} has no subscription — skipping`);
      results.skipped++;
      results.details.push({ clinic_id: clinic.clinic_id, status: 'skipped', reason: 'no_subscription' });
      continue;
    }

    try {
      // 1. Count active patients in RDS
      const activePatients = await getActivePatientCountByClinic(clinic.clinic_id);
      const invoiceTotal   = activePatients * clinic.pmpm_rate;

      // 2. Update Stripe subscription quantity
      await updateSubscriptionQuantity(subId, activePatients);

      // 3. Create Draft BillingEvent in Airtable
      await createBillingEvent({
        clinic_id:       clinic.clinic_id,
        month,
        active_patients: activePatients,
        pmpm_rate:       clinic.pmpm_rate,
        invoice_total:   invoiceTotal,
        status:          'Draft',
      });

      console.log(`[billing-run] ${clinic.clinic_id}: ${activePatients} patients × $${clinic.pmpm_rate} = $${invoiceTotal}`);
      results.processed++;
      results.details.push({
        clinic_id:       clinic.clinic_id,
        active_patients: activePatients,
        invoice_total:   invoiceTotal,
        status:          'ok',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[billing-run] ${clinic.clinic_id} error: ${msg}`);
      results.errors.push(`${clinic.clinic_id}: ${msg}`);
      results.details.push({ clinic_id: clinic.clinic_id, status: 'error', error: msg });
    }
  }

  return NextResponse.json({
    month,
    processed: results.processed,
    skipped:   results.skipped,
    errors:    results.errors.length,
    ...(results.errors.length > 0 && { errorDetails: results.errors }),
    details:   results.details,
  });
}

// Vercel Cron triggers GET; manual testing can use POST
export const GET  = handler;
export const POST = handler;
