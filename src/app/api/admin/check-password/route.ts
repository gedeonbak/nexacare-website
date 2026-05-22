// POST /api/admin/check-password
//
// Server-side password check for the demo admin portal gate.
// Keeps PORTAL_ADMIN_PASSWORD out of the client bundle entirely.
//
// Body: { password: string }
// Response 200: { ok: true }
// Response 401: { ok: false }

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = (process.env.PORTAL_ADMIN_PASSWORD ?? '').trim();

  let password: string;
  try {
    const body = await req.json() as { password?: string };
    password = (body.password ?? '').trim();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!password || !secret || password !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
