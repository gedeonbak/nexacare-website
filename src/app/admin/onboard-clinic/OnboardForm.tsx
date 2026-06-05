'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope } from 'lucide-react';

const C = {
  bg: '#0f0e1a',
  surface: '#111827',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  sky: '#27AAE1',
  success: '#4ade80',
  danger: '#ef4444',
  text: 'rgba(255,255,255,0.85)',
  muted: 'rgba(255,255,255,0.4)',
  dim: 'rgba(255,255,255,0.15)',
};

const STATES = ['AL', 'AR', 'FL', 'GA', 'MS', 'NC', 'SC', 'TN', 'TX', 'VA'];
const RATES  = [
  { label: '$75/mo per patient — Starter',  value: 75  },
  { label: '$87/mo per patient — Standard', value: 87  },
  { label: '$99/mo per patient — Premium',  value: 99  },
];

interface Result {
  clinicId:  string;
  portalKey: string;
  portalUrl: string;
}

function Field({
  label, children, hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block',
        fontSize: 13,
        color: C.muted,
        fontWeight: 500,
        marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{hint}</p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  color: C.text,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
};

export default function OnboardForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    clinicName:   '',
    contactName:  '',
    contactEmail: '',
    contactPhone: '',
    state:        '',
    pmpmRate:     87,
  });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [result, setResult]     = useState<Result | null>(null);
  const [copied, setCopied]     = useState(false);

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/onboard-clinic', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      let json: Result & { error?: string; warning?: string };
      try {
        json = await res.json();
      } catch {
        setError(`Server error ${res.status} — check Vercel logs for details`);
        return;
      }

      if (!res.ok) {
        setError(json.error ?? `Server error (${res.status})`);
      } else {
        setResult(json);
      }
    } catch (err) {
      setError(`Network error — ${err instanceof Error ? err.message : 'please try again'}`);
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!result) return;
    await navigator.clipboard.writeText(result.portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  // ── Success state ─────────────────────────────────────────────────────────

  if (result) {
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
          maxWidth: 520,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 40,
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `${C.success}20`,
            border: `2px solid ${C.success}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            marginBottom: 24,
          }}>
            ✓
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
            {form.clinicName} is onboarded!
          </h2>
          <p style={{ fontSize: 14, color: C.muted, margin: '0 0 28px' }}>
            Clinic ID <strong style={{ color: C.sky }}>{result.clinicId}</strong> created in Airtable.
            Stripe customer + PMPM subscription provisioned.
          </p>

          {/* Portal URL */}
          <div style={{
            background: 'rgba(39,170,225,0.08)',
            border: `1px solid rgba(39,170,225,0.25)`,
            borderRadius: 10,
            padding: 20,
            marginBottom: 24,
          }}>
            <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Clinic Portal URL
            </p>
            <p style={{
              fontSize: 13,
              color: C.sky,
              margin: '0 0 16px',
              wordBreak: 'break-all',
              fontFamily: 'monospace',
            }}>
              {result.portalUrl}
            </p>
            <button
              onClick={copyLink}
              style={{
                padding: '8px 18px',
                background: copied ? C.success : C.sky,
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

          <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>
            Share this link with the clinic coordinator. Opening it will log them into their portal automatically and set a 30-day session cookie.
          </p>

          <button
            onClick={() => setResult(null)}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              color: C.text,
              fontSize: 14,
              cursor: 'pointer',
              marginRight: 12,
            }}
          >
            Onboard Another Clinic
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              color: C.muted,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      padding: 24,
    }}>
      {/* Header */}
      <div style={{
        maxWidth: 680,
        margin: '0 auto 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 7,
            background: 'linear-gradient(135deg, #27AAE1, #262262)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}><Stethoscope size={16} strokeWidth={1.75} /></div>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>NexaCare Admin</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 14px',
            background: 'transparent',
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.muted,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Form card */}
      <div style={{
        maxWidth: 680,
        margin: '0 auto',
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: '40px 40px 48px',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 6px' }}>
          Onboard New Clinic
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '0 0 36px' }}>
          This creates the Airtable record, Stripe customer, and PMPM subscription, and generates the clinic's portal login link.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Two-column row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Field label="Clinic Name">
              <input
                type="text"
                value={form.clinicName}
                onChange={e => set('clinicName', e.target.value)}
                placeholder="Alpharetta Weight & Wellness"
                required
                style={inputStyle}
              />
            </Field>
            <Field label="State">
              <select
                value={form.state}
                onChange={e => set('state', e.target.value)}
                required
                style={selectStyle}
              >
                <option value="">Select state…</option>
                {STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Field label="Contact Name">
              <input
                type="text"
                value={form.contactName}
                onChange={e => set('contactName', e.target.value)}
                placeholder="Dr. Jennifer Walsh"
                required
                style={inputStyle}
              />
            </Field>
            <Field label="Contact Phone">
              <input
                type="tel"
                value={form.contactPhone}
                onChange={e => set('contactPhone', e.target.value)}
                placeholder="(470) 555-0142"
                required
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="Contact Email" hint="This email is used for Stripe invoices and portal login recovery.">
            <input
              type="email"
              value={form.contactEmail}
              onChange={e => set('contactEmail', e.target.value)}
              placeholder="coordinator@clinic.com"
              required
              style={inputStyle}
            />
          </Field>

          <Field label="PMPM Rate" hint="Monthly per-patient fee charged via Stripe.">
            <select
              value={form.pmpmRate}
              onChange={e => set('pmpmRate', Number(e.target.value))}
              required
              style={selectStyle}
            >
              {RATES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </Field>

          {error && (
            <div style={{
              background: `${C.danger}15`,
              border: `1px solid ${C.danger}40`,
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 20,
              fontSize: 13,
              color: C.danger,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '13px 32px',
              background: loading ? 'rgba(39,170,225,0.4)' : C.sky,
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Creating…' : 'Onboard Clinic →'}
          </button>
        </form>
      </div>
    </div>
  );
}
