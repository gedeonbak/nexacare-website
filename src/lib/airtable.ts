// HIPAA Architecture Note:
// This file handles NON-PHI operational data only.
//
//   Airtable (this file) → clinics, billing events, pharmacy partners
//   AWS RDS PostgreSQL   → patients (PHI)          → see lib/patients.ts
//   AWS RDS PostgreSQL   → carepath_message_log (PHI) → see lib/messageLog.ts
//   AWS RDS PostgreSQL   → pharmacy_orders (PHI)    → (future: lib/pharmacyOrders.ts)
//
// Airtable is NOT covered by an AWS BAA and MUST NOT store PHI.
// Never add patient names, phone numbers, diagnosis info, or replies here.

// ── Airtable base config ──────────────────────────────────────────────────────
// Set these env vars in Vercel + .env.local:
//   AIRTABLE_API_KEY      - personal access token from airtable.com/account
//   AIRTABLE_BASE_ID      - found in the API docs URL for your base

// Strip BOM (U+FEFF) and whitespace — Windows editors sometimes prepend an
// invisible BOM that causes "Cannot convert argument to a ByteString" in fetch.
function stripBom(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.charCodeAt(0) === 0xFEFF ? s.slice(1).trim() : s.trim();
}
const AIRTABLE_API_KEY = stripBom(process.env.AIRTABLE_API_KEY ?? '');
const AIRTABLE_BASE_ID = stripBom(process.env.AIRTABLE_BASE_ID ?? '');
const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

async function airtableFetch<T>(
  table:    string,
  params?:  Record<string, string>,
  noCache?: boolean,
): Promise<T[]> {
  const url = new URL(`${BASE_URL}/${encodeURIComponent(table)}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    // Auth-critical lookups (portal_key, email) bypass the cache entirely.
    ...(noCache ? { cache: 'no-store' } : { next: { revalidate: 300 } }),
  });
  if (!res.ok) {
    throw new Error(`Airtable fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { records: Array<{ id: string; fields: T }> };
  return json.records.map((r) => ({ ...r.fields, _airtable_id: r.id } as T));
}

// ── Clinic (non-PHI) ──────────────────────────────────────────────────────────

export interface Clinic {
  _airtable_id:          string;
  clinic_id:             string;
  name:                  string;
  state:                 string;
  contact_name:          string;
  contact_email:         string;
  contact_phone:         string;
  pmpm_rate:             number;
  status:                'Active' | 'Onboarding' | 'Churned';
  go_live_date:          string;
  stripe_customer_id:    string | null;
  stripe_subscription_id: string | null;
  next_billing_date:     string | null;
  hubspot_company_id:    string | null;
  portal_key:            string | null;
}

export async function getAllClinics(): Promise<Clinic[]> {
  return airtableFetch<Clinic>('Clinics', {
    filterByFormula: "NOT({status} = 'Churned')",
    sort: '[{"field":"go_live_date","direction":"desc"}]',
  });
}

/** All clinics including Churned — used for sequential ID generation. */
export async function getAllClinicsIncludingChurned(): Promise<Clinic[]> {
  return airtableFetch<Clinic>('Clinics', undefined, true /* noCache */);
}

export async function getClinicById(clinicId: string): Promise<Clinic | null> {
  const rows = await airtableFetch<Clinic>('Clinics', {
    filterByFormula: `{clinic_id} = '${clinicId}'`,
    maxRecords: '1',
  });
  return rows[0] ?? null;
}

/**
 * Look up a clinic by its portal_key UUID.
 * Auth-critical — always bypasses cache.
 */
export async function getClinicByPortalKey(portalKey: string): Promise<Clinic | null> {
  const rows = await airtableFetch<Clinic>(
    'Clinics',
    {
      filterByFormula: `{portal_key} = '${portalKey.replace(/'/g, "\\'")}'`,
      maxRecords:      '1',
    },
    true, /* noCache */
  );
  return rows[0] ?? null;
}

/**
 * Look up a clinic by the coordinator's contact email.
 * Used by the /portal/login email-lookup flow.
 */
export async function getClinicByEmail(email: string): Promise<Clinic | null> {
  const rows = await airtableFetch<Clinic>(
    'Clinics',
    {
      filterByFormula: `{contact_email} = '${email.toLowerCase().replace(/'/g, "\\'")}'`,
      maxRecords:      '1',
    },
    true, /* noCache */
  );
  return rows[0] ?? null;
}

export interface CreateClinicInput {
  clinic_id:    string;
  name:         string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  state:         string;
  pmpm_rate:     number;
  status:        'Active' | 'Onboarding';
  go_live_date:  string;
  portal_key:    string;
}

/** Create a new Clinic record. Returns the Airtable record ID. */
export async function createClinic(data: CreateClinicInput): Promise<string> {
  return airtableCreate('Clinics', data as unknown as Record<string, unknown>);
}

// ── Billing events (non-PHI) ──────────────────────────────────────────────────

export interface BillingEvent {
  _airtable_id: string;
  clinic_id: string;
  month: string;
  active_patients: number;
  pmpm_rate: number;
  invoice_total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Failed';
  stripe_invoice_id: string | null;
  paid_date: string | null;
}

export async function getBillingByClinic(clinicId: string): Promise<BillingEvent[]> {
  return airtableFetch<BillingEvent>('BillingEvents', {
    filterByFormula: `{clinic_id} = '${clinicId}'`,
    sort: '[{"field":"month","direction":"desc"}]',
  });
}

export async function getAllBillingEvents(): Promise<BillingEvent[]> {
  return airtableFetch<BillingEvent>('BillingEvents', {
    sort: '[{"field":"month","direction":"desc"}]',
  });
}

// ── Pharmacy partners (non-PHI) ───────────────────────────────────────────────

export interface PharmacyPartner {
  _airtable_id: string;
  pharmacy_id: string;
  name: string;
  state: string;
  api_endpoint: string | null;
  contact_email: string;
  status: 'Active' | 'Inactive';
  medications_supported: string[];
}

export async function getActivePharmacies(): Promise<PharmacyPartner[]> {
  return airtableFetch<PharmacyPartner>('PharmacyPartners', {
    filterByFormula: "{status} = 'Active'",
  });
}

export async function getPharmacyById(pharmacyId: string): Promise<PharmacyPartner | null> {
  const rows = await airtableFetch<PharmacyPartner>('PharmacyPartners', {
    filterByFormula: `{pharmacy_id} = '${pharmacyId}'`,
    maxRecords: '1',
  });
  return rows[0] ?? null;
}

// ── Write helpers ─────────────────────────────────────────────────────────────

async function airtablePatch(
  table: string,
  airtableId: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const url = `${BASE_URL}/${encodeURIComponent(table)}/${airtableId}`;
  const res = await fetch(url, {
    method:  'PATCH',
    headers: {
      Authorization:  `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable PATCH failed: ${res.status} ${err}`);
  }
}

async function airtableCreate(
  table: string,
  fields: Record<string, unknown>,
): Promise<string> {
  const url = `${BASE_URL}/${encodeURIComponent(table)}`;
  const res = await fetch(url, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable POST failed: ${res.status} ${err}`);
  }
  const json = await res.json() as { id: string };
  return json.id;
}

// ── Clinic writes ─────────────────────────────────────────────────────────────

/** Save a Stripe Customer ID back to the Clinics table. */
export async function updateClinicStripeCustomerId(
  airtableId:       string,
  stripeCustomerId: string,
): Promise<void> {
  await airtablePatch('Clinics', airtableId, { stripe_customer_id: stripeCustomerId });
}

/** Save the stripe_subscription_id to the Clinics table. */
export async function updateClinicStripeSubscriptionId(
  airtableId:           string,
  stripeSubscriptionId: string,
): Promise<void> {
  await airtablePatch('Clinics', airtableId, { stripe_subscription_id: stripeSubscriptionId });
}

// ── Billing event writes ──────────────────────────────────────────────────────

export interface CreateBillingEventInput {
  clinic_id:        string;
  month:            string;       // "YYYY-MM"
  active_patients:  number;
  pmpm_rate:        number;
  invoice_total:    number;
  status:           'Draft' | 'Sent' | 'Paid' | 'Failed';
  stripe_invoice_id?: string;
  paid_date?:       string;
}

/** Create a new BillingEvent record. Returns the new Airtable record ID. */
export async function createBillingEvent(data: CreateBillingEventInput): Promise<string> {
  return airtableCreate('BillingEvents', data as unknown as Record<string, unknown>);
}

/** Update an existing BillingEvent record. */
export async function updateBillingEvent(
  airtableId: string,
  fields:     Partial<CreateBillingEventInput>,
): Promise<void> {
  await airtablePatch('BillingEvents', airtableId, fields as Record<string, unknown>);
}

/**
 * Look up a BillingEvent by Stripe invoice ID.
 * Returns null if not found.
 */
export async function getBillingEventByInvoiceId(
  stripeInvoiceId: string,
): Promise<BillingEvent | null> {
  const rows = await airtableFetch<BillingEvent>('BillingEvents', {
    filterByFormula: `{stripe_invoice_id} = '${stripeInvoiceId}'`,
    maxRecords: '1',
  });
  return rows[0] ?? null;
}

/**
 * Look up a Clinic by Stripe customer ID.
 */
export async function getClinicByStripeCustomerId(
  stripeCustomerId: string,
): Promise<Clinic | null> {
  const rows = await airtableFetch<Clinic>('Clinics', {
    filterByFormula: `{stripe_customer_id} = '${stripeCustomerId}'`,
    maxRecords: '1',
  });
  return rows[0] ?? null;
}
