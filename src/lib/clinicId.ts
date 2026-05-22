// ── Sequential clinic ID generator ───────────────────────────────────────────
//
// Format: CLINIC-001, CLINIC-002, …
//
// Reads all existing clinic IDs (including Churned) from Airtable,
// finds the highest numeric suffix, and returns the next in sequence.
//
// NOTE: This is not atomic — if two clinic onboardings happen
// simultaneously they could race. In practice NexaCare onboards
// one clinic at a time, so this is fine. If concurrency becomes
// a concern, move to a Postgres sequence or Airtable atomic counter.

import { getAllClinicsIncludingChurned } from '@/lib/airtable';

export async function generateClinicId(): Promise<string> {
  const clinics = await getAllClinicsIncludingChurned();

  let maxNum = 0;
  for (const c of clinics) {
    const match = (c.clinic_id ?? '').match(/^CLINIC-0*(\d+)$/i);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxNum) maxNum = n;
    }
  }

  const next = maxNum + 1;
  return `CLINIC-${String(next).padStart(3, '0')}`;
}
