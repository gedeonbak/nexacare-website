// GET /api/portal/auth?key={portalKey}
//
// Validates a clinic's portal_key against Airtable.
// On success: sets nxc_portal_session cookie (30 days), redirects to /portal.
// On failure: redirects to /portal/login?error=invalid.

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getClinicByPortalKey } from '@/lib/airtable';
import { createPortalSession } from '@/lib/session';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')?.trim() ?? '';

  if (!key) {
    return NextResponse.redirect(new URL('/portal/login?error=missing_key', req.url));
  }

  const clinic = await getClinicByPortalKey(key);

  if (!clinic) {
    return NextResponse.redirect(new URL('/portal/login?error=invalid', req.url));
  }

  const token = createPortalSession({
    clinicId:   clinic.clinic_id,
    clinicName: clinic.name,
    airtableId: clinic._airtable_id,
  });

  const jar = await cookies();
  jar.set('nxc_portal_session', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/portal',
    maxAge:   30 * 24 * 60 * 60,
  });

  return NextResponse.redirect(new URL('/portal', req.url));
}
