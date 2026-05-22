// ── NexaCare route protection middleware ──────────────────────────────────────
//
// Runs at the Edge on every matching request BEFORE the page renders.
// Handles two protected sections:
//
//   /admin/*      — NexaCare internal admin (password-protected)
//   /portal       — Clinic coordinator portal (portal_key session)
//
// Security model:
//   This middleware checks COOKIE PRESENCE as a fast-path guard.
//   Full HMAC signature verification happens in the server-side page/layout,
//   which has access to Node.js crypto and will redirect if the token is forged.
//   This two-layer approach matches the pattern used by Auth.js / NextAuth.js.
//
// Public exceptions (never redirected):
//   /admin/login    — admin password form
//   /portal/login   — clinic email-lookup / key-entry form
//   /api/*          — API routes handle their own auth

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/admin/:path*',
    '/portal',
    '/portal/:path*',
  ],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── /admin/* ────────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      return NextResponse.next();
    }
    const cookie = req.cookies.get('nxc_admin_session')?.value ?? '';
    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search   = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── /portal/* ───────────────────────────────────────────────────────────────
  if (pathname.startsWith('/portal')) {
    if (pathname === '/portal/login' || pathname.startsWith('/portal/login/')) {
      return NextResponse.next();
    }
    const cookie = req.cookies.get('nxc_portal_session')?.value ?? '';
    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = '/portal/login';
      url.search   = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
