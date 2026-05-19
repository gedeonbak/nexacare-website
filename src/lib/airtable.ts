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

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? '';
const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

async function airtableFetch<T>(
  table: string,
  params?: Record<string, string>
): Promise<T[]> {
  const url = new URL(`${BASE_URL}/${encodeURIComponent(table)}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    next: { revalidate: 300 }, // cache for 5 minutes
  });
  if (!res.ok) {
    throw new Error(`Airtable fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { records: Array<{ id: string; fields: T }> };
  return json.records.map((r) => ({ ...r.fields, _airtable_id: r.id } as T));
}

// ── Clinic (non-PHI) ──────────────────────────────────────────────────────────

export interface Clinic {
  _airtable_id: string;
  clinic_id: string;
  name: string;
  state: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  pmpm_rate: number;
  status: 'Active' | 'Onboarding' | 'Churned';
  go_live_date: string;
  stripe_customer_id: string | null;
  next_billing_date: string | null;
  hubspot_company_id: string | null;
}

export async function getAllClinics(): Promise<Clinic[]> {
  return airtableFetch<Clinic>('Clinics', {
    filterByFormula: "NOT({status} = 'Churned')",
    sort: '[{"field":"go_live_date","direction":"desc"}]',
  });
}

export async function getClinicById(clinicId: string): Promise<Clinic | null> {
  const rows = await airtableFetch<Clinic>('Clinics', {
    filterByFormula: `{clinic_id} = '${clinicId}'`,
    maxRecords: '1',
  });
  return rows[0] ?? null;
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
