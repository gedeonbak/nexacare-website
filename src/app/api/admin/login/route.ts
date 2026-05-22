// POST /api/admin/login  — password → sets nxc_admin_session cookie
// DELETE /api/admin/login — clears the cookie (logout)

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSession } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let password: string;
  try {
    const body = await req.json() as { password?: string };
    password = (body.password ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const expected = (process.env.PORTAL_ADMIN_PASSWORD ?? '').trim();
  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = createAdminSession();
  const jar   = await cookies();
  jar.set('nxc_admin_session', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/admin',
    maxAge:   8 * 60 * 60,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete('nxc_admin_session');
  return NextResponse.json({ ok: true });
}
