// POST /api/portal/lookup-email
//
// Accepts { email } in body.
// Looks up a clinic by contact_email in Airtable.
// Returns { portalUrl } on match, or { error: 'not_found' } with 404.
//
// Security: we intentionally return the same 404 for both "not found"
// and "email invalid format" to avoid enumerating valid addresses.

import { NextRequest, NextResponse } from 'next/server';
import { getClinicByEmail } from '@/lib/airtable';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json() as { email?: string };
    email = (body.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const clinic = await getClinicByEmail(email);

  if (!clinic || !clinic.portal_key) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const baseUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexacaremanagement.com';
  const portalUrl = `${baseUrl}/portal?key=${clinic.portal_key}`;

  return NextResponse.json({ portalUrl });
}
