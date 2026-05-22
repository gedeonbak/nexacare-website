// ── Session signing & verification ───────────────────────────────────────────
//
// Cookie token format: {base64url(JSON payload)}.{HMAC-SHA256-base64url sig}
//
// Two named cookies:
//   nxc_admin_session  — NexaCare admin (8-hour TTL)
//   nxc_portal_session — Per-clinic coordinator (30-day TTL)
//
// Both are signed with PORTAL_SESSION_SECRET.
// Payload always contains `exp` (Unix ms timestamp) for expiry enforcement.

import { createHmac, timingSafeEqual } from 'crypto';

// ── Secret ────────────────────────────────────────────────────────────────────

function getSecret(): string {
  const s = (process.env.PORTAL_SESSION_SECRET ?? '').trim();
  if (!s) throw new Error('PORTAL_SESSION_SECRET is not configured');
  return s;
}

// ── Encoding helpers ──────────────────────────────────────────────────────────

function b64url(str: string): string {
  return Buffer.from(str, 'utf8').toString('base64url');
}

function b64urlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8');
}

// ── Sign ──────────────────────────────────────────────────────────────────────

/**
 * Sign an arbitrary payload object.
 * Automatically injects `iat` (issued-at) and requires caller to pass `exp`.
 * Returns a compact token string suitable for a cookie value.
 */
export function signSession(payload: object): string {
  const encoded = b64url(JSON.stringify(payload));
  const sig = createHmac('sha256', getSecret())
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

// ── Verify ────────────────────────────────────────────────────────────────────

/**
 * Verify a session token and return its payload, or null if:
 *   - token is malformed
 *   - HMAC doesn't match (constant-time comparison)
 *   - `exp` field is in the past
 */
export function verifySession<T extends object>(token: string): T | null {
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;

  const encoded = token.slice(0, dot);
  const sig     = token.slice(dot + 1);

  try {
    const expected = createHmac('sha256', getSecret())
      .update(encoded)
      .digest('base64url');

    const eBuf = Buffer.from(expected, 'utf8');
    const rBuf = Buffer.from(sig,      'utf8');
    if (eBuf.length !== rBuf.length) return null;
    if (!timingSafeEqual(eBuf, rBuf)) return null;

    const payload = JSON.parse(b64urlDecode(encoded)) as T & { exp?: number };
    if (typeof payload.exp === 'number' && payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

// ── Typed payload helpers ─────────────────────────────────────────────────────

export interface AdminSessionPayload {
  role: 'admin';
  iat:  number;
  exp:  number;
}

export interface PortalSessionPayload {
  clinicId:   string;
  clinicName: string;
  airtableId: string;
  iat:        number;
  exp:        number;
}

/** Create a signed admin session token (8-hour TTL). */
export function createAdminSession(): string {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    role: 'admin',
    iat:  now,
    exp:  now + 8 * 60 * 60 * 1000,
  };
  return signSession(payload);
}

/** Create a signed portal session token (30-day TTL). */
export function createPortalSession(data: {
  clinicId:   string;
  clinicName: string;
  airtableId: string;
}): string {
  const now = Date.now();
  const payload: PortalSessionPayload = {
    ...data,
    iat: now,
    exp: now + 30 * 24 * 60 * 60 * 1000,
  };
  return signSession(payload);
}

/** Verify an admin session token. Returns payload or null. */
export function verifyAdminSession(token: string): AdminSessionPayload | null {
  const payload = verifySession<AdminSessionPayload>(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

/** Verify a portal session token. Returns payload or null. */
export function verifyPortalSession(token: string): PortalSessionPayload | null {
  return verifySession<PortalSessionPayload>(token);
}
