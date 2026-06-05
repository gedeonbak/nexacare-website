'use client';

import { useState } from 'react';
import { Check, Stethoscope } from 'lucide-react';

const C = {
  bg: '#0f0e1a',
  surface: '#111827',
  border: 'rgba(255,255,255,0.08)',
  sky: '#27AAE1',
  text: 'rgba(255,255,255,0.85)',
  muted: 'rgba(255,255,255,0.4)',
  dim: 'rgba(255,255,255,0.2)',
  danger: '#ef4444',
  success: '#4ade80',
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid:     'That login link has expired or is invalid. Use the email lookup below to get a new one.',
  missing_key: 'The login link was incomplete. Use the email lookup below.',
};

interface Props {
  errorCode?: string;
}

export default function LoginClient({ errorCode }: Props) {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const urlError = errorCode ? (ERROR_MESSAGES[errorCode] ?? '') : '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/portal/lookup-email', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const json = await res.json() as { portalUrl?: string; error?: string };

      if (res.ok && json.portalUrl) {
        // Redirect to the portal URL (which sets the cookie via /api/portal/auth)
        window.location.href = json.portalUrl;
      } else {
        setSent(true); // Always show "check your email" to avoid enumeration
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 40,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #27AAE1, #262262)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}><Stethoscope size={18} strokeWidth={1.75} /></div>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>CarePath Portal</span>
          </div>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Clinic Coordinator Access</p>
        </div>

        {/* Error from redirect (bad/expired key) */}
        {urlError && (
          <div style={{
            background: `${C.danger}15`,
            border: `1px solid ${C.danger}40`,
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: 13,
            color: C.danger,
          }}>
            {urlError}
          </div>
        )}

        {sent ? (
          /* "Sent" state — same message regardless of whether email matched */
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: `${C.success}20`,
              border: `2px solid ${C.success}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: C.success,
              margin: '0 auto 20px',
            }}><Check size={22} strokeWidth={2.5} /></div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
              Check your email
            </h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
              If <strong style={{ color: C.text }}>{email}</strong> is registered, your
              portal link has been forwarded to you. Click it to log in instantly —
              no password needed.
            </p>
            <p style={{ fontSize: 12, color: C.dim, marginTop: 16 }}>
              Didn&apos;t receive it? Contact{' '}
              <a href="mailto:support@nexacaremanagement.com" style={{ color: C.sky }}>
                support@nexacaremanagement.com
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: 14, color: C.muted, margin: '0 0 20px', lineHeight: 1.6 }}>
              Enter the email address on your NexaCare account. We&apos;ll redirect
              you to your clinic&apos;s portal login link.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                color: C.muted,
                fontWeight: 500,
                marginBottom: 6,
              }}>
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="coordinator@clinic.com"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.text,
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <p style={{ color: C.danger, fontSize: 13, marginBottom: 12 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%',
                padding: '12px 0',
                background: loading || !email ? 'rgba(39,170,225,0.4)' : C.sky,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || !email ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Looking up…' : 'Find My Portal →'}
            </button>

            <p style={{ fontSize: 12, color: C.dim, textAlign: 'center', marginTop: 20 }}>
              New to CarePath?{' '}
              <a href="mailto:support@nexacaremanagement.com" style={{ color: C.sky }}>
                Contact NexaCare
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
