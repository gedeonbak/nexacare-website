// POST /api/stripe/webhook
//
// Handles inbound Stripe webhook events.
// Stripe signature validated on every request.
//
// Events handled:
//   invoice.paid               → mark BillingEvent Paid, post Slack ✅
//   invoice.payment_failed     → mark BillingEvent Failed, alert Slack 🚨
//   customer.subscription.deleted → log warning (manual follow-up)
//
// Configure in Stripe Dashboard → Webhooks → nexacaremanagement.com/api/stripe/webhook

import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { constructWebhookEvent } from '@/lib/stripe';
import {
  getBillingEventByInvoiceId,
  getClinicByStripeCustomerId,
  updateBillingEvent,
} from '@/lib/airtable';
import { postSlack, billingPaidBlocks, billingFailedBlocks } from '@/lib/slack';

// Next.js must NOT parse the body — Stripe needs the raw bytes for HMAC validation
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // ── Read raw body ────────────────────────────────────────────────────────────
  const rawBody  = await req.arrayBuffer();
  const payload  = Buffer.from(rawBody);
  const signature = req.headers.get('stripe-signature') ?? '';

  // ── Validate signature ───────────────────────────────────────────────────────
  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid signature';
    console.error('[stripe/webhook] Signature validation failed:', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  console.log(`[stripe/webhook] ${event.type} — ${event.id}`);

  // ── Route events ─────────────────────────────────────────────────────────────
  try {
    switch (event.type) {

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        console.warn(`[stripe/webhook] Subscription deleted: ${sub.id} — clinic: ${sub.metadata?.clinic_id ?? 'unknown'}`);
        // Manual follow-up required — no automated action
        break;
      }

      default:
        // Acknowledge unhandled events without error
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[stripe/webhook] Handler error for ${event.type}:`, msg);
    // Return 500 so Stripe retries
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── Handler: invoice.paid ─────────────────────────────────────────────────────

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const invoiceId   = invoice.id;
  const customerId  = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id ?? '';
  const amountPaid  = invoice.amount_paid; // cents
  const invoiceUrl  = invoice.hosted_invoice_url ?? '';
  const paidDate    = new Date().toISOString().split('T')[0];

  // Lookup BillingEvent by Stripe invoice ID
  const billingEvent = await getBillingEventByInvoiceId(invoiceId);
  if (billingEvent) {
    await updateBillingEvent(billingEvent._airtable_id, {
      status:            'Paid',
      stripe_invoice_id: invoiceId,
      paid_date:         paidDate,
    });
  } else {
    console.warn(`[stripe/webhook] No BillingEvent found for invoice ${invoiceId} — may be a new invoice`);
  }

  // Lookup clinic for Slack message
  const clinic = await getClinicByStripeCustomerId(customerId);
  const clinicName = clinic?.name ?? `Customer ${customerId}`;

  const month = paidDate.slice(0, 7);
  const patients = billingEvent?.active_patients ?? 0;

  await postSlack(
    'leads',
    billingPaidBlocks({ clinicName, month, patients, amount: amountPaid, invoiceUrl }),
    `💳 Invoice paid: ${clinicName} — $${(amountPaid / 100).toLocaleString()}`,
  );
}

// ── Handler: invoice.payment_failed ──────────────────────────────────────────

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const invoiceId  = invoice.id;
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id ?? '';
  const amount     = invoice.amount_due; // cents
  const invoiceUrl = invoice.hosted_invoice_url ?? '';
  const reason     = invoice.last_finalization_error?.message
    ?? ((invoice as unknown as Record<string, unknown>)['last_payment_error'] as string | undefined)
    ?? 'Unknown reason';

  // Mark BillingEvent as Failed
  const billingEvent = await getBillingEventByInvoiceId(invoiceId);
  if (billingEvent) {
    await updateBillingEvent(billingEvent._airtable_id, {
      status:            'Failed',
      stripe_invoice_id: invoiceId,
    });
  }

  // Alert Slack
  const clinic = await getClinicByStripeCustomerId(customerId);
  const clinicName = clinic?.name ?? `Customer ${customerId}`;
  const month = new Date().toISOString().slice(0, 7);

  await postSlack(
    'leads',
    billingFailedBlocks({ clinicName, month, amount, invoiceUrl, reason: String(reason) }),
    `🚨 Payment failed: ${clinicName} — $${(amount / 100).toLocaleString()}`,
  );
}
