// Stripe client singleton + billing helpers.
//
// Required env vars:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET
//   STRIPE_PMPM_PRICE_ID          (standard ~$99)
//   STRIPE_PMPM_PRICE_ID_FLOOR    (entry-tier ~$87)
//   STRIPE_PMPM_PRICE_ID_PREMIUM  (premium ~$120+)

import Stripe from 'stripe';

// ── Singleton ─────────────────────────────────────────────────────────────────

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = (process.env.STRIPE_SECRET_KEY ?? '').trim();
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  _stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' });
  return _stripe;
}

// ── Price ID resolution ───────────────────────────────────────────────────────

/**
 * Map a clinic's PMPM rate to the matching Stripe Price ID.
 * Floor  < $92  → STRIPE_PMPM_PRICE_ID_FLOOR
 * Standard $92–$109 → STRIPE_PMPM_PRICE_ID
 * Premium $110+  → STRIPE_PMPM_PRICE_ID_PREMIUM
 */
export function priceIdForRate(pmpmRate: number): string {
  const floor   = (process.env.STRIPE_PMPM_PRICE_ID_FLOOR   ?? '').trim();
  const standard = (process.env.STRIPE_PMPM_PRICE_ID        ?? '').trim();
  const premium = (process.env.STRIPE_PMPM_PRICE_ID_PREMIUM ?? '').trim();

  if (!floor || !standard || !premium) {
    throw new Error('STRIPE_PMPM_PRICE_ID* env vars are not all configured');
  }

  if (pmpmRate >= 110) return premium;
  if (pmpmRate >= 92)  return standard;
  return floor;
}

// ── Webhook signature validation ──────────────────────────────────────────────

/**
 * Construct and validate an inbound Stripe webhook event.
 * Throws if the signature is invalid or the secret is missing.
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  const secret = (process.env.STRIPE_WEBHOOK_SECRET ?? '').trim();
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  return getStripe().webhooks.constructEvent(payload, signature, secret);
}

// ── Customer helpers ──────────────────────────────────────────────────────────

/**
 * Create a Stripe Customer for a clinic.
 * Returns the new customer object.
 */
export async function createStripeCustomer(opts: {
  clinicId:    string;
  clinicName:  string;
  email:       string;
  phone:       string;
}): Promise<Stripe.Customer> {
  return getStripe().customers.create({
    name:     opts.clinicName,
    email:    opts.email,
    phone:    opts.phone,
    metadata: { clinic_id: opts.clinicId },
  });
}

// ── Subscription helpers ──────────────────────────────────────────────────────

/**
 * Create a quantity-based PMPM subscription for a clinic.
 * quantity = current active patient count.
 * billing_cycle_anchor = 1st of next month.
 */
export async function createPmpmSubscription(opts: {
  stripeCustomerId: string;
  priceId:          string;
  quantity:         number;
  clinicId:         string;
  clinicName:       string;
}): Promise<Stripe.Subscription> {
  // Anchor billing to the 1st of next month (UTC)
  const now   = new Date();
  const anchor = new Date(Date.UTC(
    now.getUTCMonth() === 11 ? now.getUTCFullYear() + 1 : now.getUTCFullYear(),
    (now.getUTCMonth() + 1) % 12,
    1,
  ));

  return getStripe().subscriptions.create({
    customer:              opts.stripeCustomerId,
    billing_cycle_anchor:  Math.floor(anchor.getTime() / 1000),
    proration_behavior:    'none',
    items: [
      { price: opts.priceId, quantity: Math.max(opts.quantity, 1) },
    ],
    metadata: {
      clinic_id:   opts.clinicId,
      clinic_name: opts.clinicName,
      billing_model: 'PMPM',
    },
  });
}

/**
 * Update a subscription's patient quantity.
 * Finds the first item on the subscription and updates its quantity.
 */
export async function updateSubscriptionQuantity(
  subscriptionId: string,
  quantity:        number,
): Promise<Stripe.Subscription> {
  const stripe = getStripe();
  const sub    = await stripe.subscriptions.retrieve(subscriptionId);
  const itemId = sub.items.data[0]?.id;
  if (!itemId) throw new Error(`Subscription ${subscriptionId} has no items`);

  return stripe.subscriptions.update(subscriptionId, {
    items: [{ id: itemId, quantity: Math.max(quantity, 1) }],
    proration_behavior: 'none',
  });
}
