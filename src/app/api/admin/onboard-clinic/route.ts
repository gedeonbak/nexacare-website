// POST /api/admin/onboard-clinic
//
// Protected by nxc_admin_session cookie.
//
// Steps:
//   1. Validate admin session cookie
//   2. Generate sequential clinic_id (CLINIC-00N)
//   3. Generate portal_key (UUID)
//   4. Create Airtable record
//   5. Create Stripe Customer
//   6. Create Stripe PMPM subscription (quantity = 1 initial)
//   7. Patch Airtable with Stripe IDs
//   8. Return { clinicId, portalKey, portalUrl }

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { verifyAdminSession } from '@/lib/session';
import { generateClinicId } from '@/lib/clinicId';
import {
  createClinic,
  updateClinicStripeCustomerId,
  updateClinicStripeSubscriptionId,
} from '@/lib/airtable';
import { createStripeCustomer, createPmpmSubscription, priceIdForRate } from '@/lib/stripe';
import { postSlack } from '@/lib/slack';

export const runtime = 'nodejs';

// ── Auth guard ────────────────────────────────────────────────────────────────

async function requireAdmin(): Promise<boolean> {
  const jar   = await cookies();
  const token = jar.get('nxc_admin_session')?.value ?? '';
  return !!verifyAdminSession(token);
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse body ───────────────────────────────────────────────────────────────
  let body: {
    clinicName?:    string;
    contactName?:   string;
    contactEmail?:  string;
    contactPhone?:  string;
    state?:         string;
    pmpmRate?:      number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const clinicName   = (body.clinicName   ?? '').trim();
  const contactName  = (body.contactName  ?? '').trim();
  const contactEmail = (body.contactEmail ?? '').trim().toLowerCase();
  const contactPhone = (body.contactPhone ?? '').trim();
  const state        = (body.state        ?? '').trim().toUpperCase();
  const pmpmRate     = Number(body.pmpmRate ?? 0);

  const missing: string[] = [];
  if (!clinicName)          missing.push('clinicName');
  if (!contactName)         missing.push('contactName');
  if (!contactEmail)        missing.push('contactEmail');
  if (!contactPhone)        missing.push('contactPhone');
  if (!state)               missing.push('state');
  if (!pmpmRate || pmpmRate < 50 || pmpmRate > 200) missing.push('pmpmRate');

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing or invalid fields: ${missing.join(', ')}` },
      { status: 400 },
    );
  }

  // ── Generate IDs ─────────────────────────────────────────────────────────────
  const clinicId = await generateClinicId();
  const portalKey = randomUUID();
  const today = new Date().toISOString().split('T')[0];

  // ── Create Airtable record ───────────────────────────────────────────────────
  let airtableId: string;
  try {
    airtableId = await createClinic({
      clinic_id:     clinicId,
      name:          clinicName,
      contact_name:  contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      state,
      pmpm_rate:     pmpmRate,
      status:        'Onboarding',
      go_live_date:  today,
      portal_key:    portalKey,
    });
  } catch (err) {
    console.error('[onboard-clinic] Airtable create failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to create Airtable record' }, { status: 500 });
  }

  // ── Create Stripe customer ───────────────────────────────────────────────────
  let stripeCustomerId: string;
  try {
    const customer = await createStripeCustomer({
      clinicId,
      clinicName,
      email: contactEmail,
      phone: contactPhone,
    });
    stripeCustomerId = customer.id;
    await updateClinicStripeCustomerId(airtableId, stripeCustomerId);
  } catch (err) {
    console.error('[onboard-clinic] Stripe customer failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to create Stripe customer' }, { status: 500 });
  }

  // ── Create Stripe PMPM subscription (qty=1 placeholder) ─────────────────────
  try {
    const priceId = priceIdForRate(pmpmRate);
    const sub = await createPmpmSubscription({
      stripeCustomerId,
      priceId,
      quantity:   1,
      clinicId,
      clinicName,
    });
    await updateClinicStripeSubscriptionId(airtableId, sub.id);
  } catch (err) {
    console.error('[onboard-clinic] Stripe subscription failed:', err instanceof Error ? err.message : err);
    // Non-fatal — clinic is in Airtable, subscription can be retried
    // Don't return error — still return the portal URL
  }

  // ── Slack notification ───────────────────────────────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexacaremanagement.com';
  const portalUrl = `${baseUrl}/portal?key=${portalKey}`;

  postSlack(
    'leads',
    [],
    `🏥 *New Clinic Onboarded*\nClinic: ${clinicName}\nID: ${clinicId}\nState: ${state}\nPMPM: $${pmpmRate}\nContact: ${contactName} (${contactEmail})\nPortal URL: ${portalUrl}`,
  ).catch((err: unknown) =>
    console.error('[onboard-clinic] Slack failed:', err instanceof Error ? err.message : err),
  );

  console.log(`[onboard-clinic] Created ${clinicId} for ${clinicName}, airtableId=${airtableId}`);

  return NextResponse.json(
    { ok: true, clinicId, portalKey, portalUrl },
    { status: 201 },
  );
}
