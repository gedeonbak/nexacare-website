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
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse body ─────────────────────────────────────────────────────────────
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

    // ── Generate IDs ───────────────────────────────────────────────────────────
    let clinicId: string;
    try {
      clinicId = await generateClinicId();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[onboard-clinic] generateClinicId failed:', msg);
      // Fallback: timestamp suffix so the flow can continue even if Airtable lookup fails
      clinicId = `CLINIC-T${Date.now().toString().slice(-4)}`;
    }

    const portalKey = randomUUID();
    const today = new Date().toISOString().split('T')[0];

    // ── Create Airtable record ─────────────────────────────────────────────────
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
      console.log(`[onboard-clinic] Airtable record created: ${airtableId} for ${clinicId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[onboard-clinic] Airtable create failed:', msg);
      return NextResponse.json({ error: `Failed to create Airtable record: ${msg}` }, { status: 500 });
    }

    // ── Create Stripe customer ─────────────────────────────────────────────────
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
      console.log(`[onboard-clinic] Stripe customer created: ${stripeCustomerId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[onboard-clinic] Stripe customer failed:', msg);
      // Non-fatal — Airtable record exists, return portal URL anyway
      const baseUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexacaremanagement.com';
      const portalUrl = `${baseUrl}/portal?key=${portalKey}`;
      return NextResponse.json({ ok: true, clinicId, portalKey, portalUrl, warning: 'Stripe setup incomplete' }, { status: 201 });
    }

    // ── Create Stripe PMPM subscription (qty=1 placeholder) ───────────────────
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
      console.log(`[onboard-clinic] Stripe subscription created: ${sub.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[onboard-clinic] Stripe subscription failed:', msg);
      // Non-fatal — customer exists, subscription can be added later
    }

    // ── Slack notification ─────────────────────────────────────────────────────
    const baseUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexacaremanagement.com';
    const portalUrl = `${baseUrl}/portal?key=${portalKey}`;

    postSlack(
      'leads',
      [],
      `🏥 *New Clinic Onboarded*\nClinic: ${clinicName}\nID: ${clinicId}\nState: ${state}\nPMPM: $${pmpmRate}\nContact: ${contactName} (${contactEmail})\nPortal: ${portalUrl}`,
    ).catch((slackErr: unknown) =>
      console.error('[onboard-clinic] Slack failed:', slackErr instanceof Error ? slackErr.message : slackErr),
    );

    console.log(`[onboard-clinic] ✅ ${clinicId} (${clinicName}) fully onboarded`);
    return NextResponse.json({ ok: true, clinicId, portalKey, portalUrl }, { status: 201 });

  } catch (err) {
    // Top-level safety net — logs full stack so the real error is visible in Vercel logs
    const msg   = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : '';
    console.error('[onboard-clinic] Unhandled error:', msg, stack);
    return NextResponse.json({ error: `Unexpected error: ${msg}` }, { status: 500 });
  }
}
