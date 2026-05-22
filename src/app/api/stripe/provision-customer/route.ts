// POST /api/stripe/provision-customer
//
// Creates a Stripe Customer + PMPM subscription for a clinic and saves
// the Stripe IDs back to Airtable. Safe to call multiple times — if the
// clinic already has a stripe_customer_id the customer step is skipped.
//
// Protected by x-api-key: INTERNAL_API_SECRET header.
//
// Body: { clinic_id: string }
//
// Response: { customerId, subscriptionId, activePatients }

import { NextRequest, NextResponse } from 'next/server';
import {
  getClinicById,
  updateClinicStripeCustomerId,
  updateClinicStripeSubscriptionId,
} from '@/lib/airtable';
import { getActivePatientCountByClinic } from '@/lib/patients';
import {
  createStripeCustomer,
  createPmpmSubscription,
  priceIdForRate,
} from '@/lib/stripe';

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const secret = (process.env.INTERNAL_API_SECRET ?? '').trim();
  if (secret) {
    const key = (req.headers.get('x-api-key') ?? '').trim();
    if (key !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── Parse body ───────────────────────────────────────────────────────────────
  let clinicId: string;
  try {
    const body = await req.json() as { clinic_id?: string };
    if (!body.clinic_id) throw new Error('missing clinic_id');
    clinicId = body.clinic_id.trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request body — expected { clinic_id }' }, { status: 400 });
  }

  // ── Load clinic from Airtable ────────────────────────────────────────────────
  const clinic = await getClinicById(clinicId);
  if (!clinic) {
    return NextResponse.json({ error: `Clinic not found: ${clinicId}` }, { status: 404 });
  }

  // ── Count active patients in RDS ─────────────────────────────────────────────
  const activePatients = await getActivePatientCountByClinic(clinicId);

  // ── Create or reuse Stripe Customer ──────────────────────────────────────────
  let stripeCustomerId = clinic.stripe_customer_id?.trim() ?? '';
  if (!stripeCustomerId) {
    const customer = await createStripeCustomer({
      clinicId,
      clinicName: clinic.name,
      email:      clinic.contact_email,
      phone:      clinic.contact_phone,
    });
    stripeCustomerId = customer.id;
    await updateClinicStripeCustomerId(clinic._airtable_id, stripeCustomerId);
    console.log(`[provision] Created Stripe customer ${stripeCustomerId} for clinic ${clinicId}`);
  } else {
    console.log(`[provision] Reusing existing Stripe customer ${stripeCustomerId} for clinic ${clinicId}`);
  }

  // ── Create PMPM subscription ──────────────────────────────────────────────────
  const priceId      = priceIdForRate(clinic.pmpm_rate);
  const subscription = await createPmpmSubscription({
    stripeCustomerId,
    priceId,
    quantity:    activePatients,
    clinicId,
    clinicName:  clinic.name,
  });

  await updateClinicStripeSubscriptionId(clinic._airtable_id, subscription.id);
  console.log(`[provision] Created subscription ${subscription.id} for clinic ${clinicId} (qty: ${activePatients})`);

  return NextResponse.json({
    customerId:      stripeCustomerId,
    subscriptionId:  subscription.id,
    activePatients,
    priceId,
  });
}
