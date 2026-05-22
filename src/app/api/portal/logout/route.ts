// POST /api/portal/logout — clears nxc_portal_session cookie

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST() {
  const jar = await cookies();
  jar.delete('nxc_portal_session');
  return NextResponse.redirect(new URL('/portal/login', process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexacaremanagement.com'));
}
