'use client';

import React, { useState } from 'react';
import { PopupButton } from '@typeform/embed-react';
import { Monitor, Smartphone, Stethoscope, Users } from 'lucide-react';
import type { Patient } from '@/lib/patients';

// ── Color palette (matches demo portal) ──────────────────────────────────────

const C = {
  bg:      '#0f0e1a',
  topbar:  '#0a0916',
  surface: '#111827',
  card:    'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.08)',
  sky:     '#27AAE1',
  navy:    '#262262',
  success: '#4ade80',
  warning: '#fbbf24',
  danger:  '#ef4444',
  text:    'rgba(255,255,255,0.85)',
  muted:   'rgba(255,255,255,0.4)',
  dim:     'rgba(255,255,255,0.2)',
};

// ── Typeform form IDs ─────────────────────────────────────────────────────────

const FORM_IDS: Record<'EN' | 'ES' | 'FR', string> = {
  EN: 'g2WVfC0n',
  ES: 'IpwsVhZw',
  FR: 'UbYJjIEG',
};

function buildEnrollUrl(lang: 'EN' | 'ES' | 'FR', clinicId: string, clinicName: string): string {
  return (
    `https://form.typeform.com/to/${FORM_IDS[lang]}` +
    `#clinic_id=${encodeURIComponent(clinicId)}&clinic_name=${encodeURIComponent(clinicName)}`
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Stats {
  active:      number;
  total:       number;
  escalations: number;
  optedOut:    number;
  avgRisk:     number;
}

interface Props {
  clinicId:   string;
  clinicName: string;
  patients:   Patient[];
  stats:      Stats;
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Patient['status'] }) {
  const colors: Record<Patient['status'], { bg: string; text: string }> = {
    Active:      { bg: `${C.success}20`, text: C.success },
    Paused:      { bg: `${C.warning}20`, text: C.warning },
    'Opted Out': { bg: `${C.danger}20`,  text: C.danger  },
    Churned:     { bg: 'rgba(255,255,255,0.06)', text: C.muted },
    Completed:   { bg: `${C.sky}20`,     text: C.sky     },
  };
  const { bg, text } = colors[status] ?? colors.Active;
  return (
    <span style={{
      padding: '3px 9px',
      borderRadius: 99,
      background: bg,
      color: text,
      fontSize: 12,
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

// ── Risk score badge ──────────────────────────────────────────────────────────

function RiskBadge({ score }: { score: number }) {
  const color = score >= 70 ? C.danger : score >= 40 ? C.warning : C.success;
  return (
    <span style={{ color, fontWeight: 700, fontSize: 13 }}>{score}</span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: {
  label: string;
  value: string | number;
  sub?:  string;
  accent?: string;
}) {
  return (
    <div style={{
      background: C.card,
      border:     `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '20px 24px',
    }}>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 800, color: accent ?? C.text, margin: 0 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>{sub}</p>
      )}
    </div>
  );
}

// ── Enrollment links ──────────────────────────────────────────────────────────

function EnrollmentLinks({ clinicId, clinicName }: { clinicId: string; clinicName: string }) {
  const [copied, setCopied] = useState<'EN' | 'ES' | 'FR' | null>(null);

  async function copy(lang: 'EN' | 'ES' | 'FR') {
    await navigator.clipboard.writeText(buildEnrollUrl(lang, clinicId, clinicName));
    setCopied(lang);
    setTimeout(() => setCopied(null), 2500);
  }

  const langs: Array<{ lang: 'EN' | 'ES' | 'FR'; label: string; flag: string }> = [
    { lang: 'EN', label: 'English',  flag: '🇺🇸' },
    { lang: 'ES', label: 'Español',  flag: '🇪🇸' },
    { lang: 'FR', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div style={{
      background: C.card,
      border:     `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '24px 28px',
      marginTop: 24,
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>
        Patient Self-Enrollment Links
      </h3>
      <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px' }}>
        Send these to patients so they can enroll in CarePath directly.
        Your clinic is pre-filled — they just enter their name and phone.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {langs.map(({ lang, label, flag }) => (
          <div key={lang} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '12px 16px',
          }}>
            <span style={{ fontSize: 18 }}>{flag}</span>
            <span style={{ fontSize: 14, color: C.text, flex: 1 }}>{label}</span>
            <span style={{
              fontSize: 11,
              color: C.muted,
              fontFamily: 'monospace',
              flex: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {buildEnrollUrl(lang, clinicId, clinicName)}
            </span>
            <button
              onClick={() => copy(lang)}
              style={{
                padding: '6px 14px',
                background: copied === lang ? `${C.success}20` : 'rgba(39,170,225,0.15)',
                border: `1px solid ${copied === lang ? C.success : 'rgba(39,170,225,0.3)'}`,
                borderRadius: 6,
                color: copied === lang ? C.success : C.sky,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {copied === lang ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main shell ────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'patients' | 'enroll';

export default function PortalShell({ clinicId, clinicName, patients, stats }: Props) {
  const [tab, setTab]   = useState<Tab>('overview');
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(p =>
    !search ||
    p.first_name.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_id.toLowerCase().includes(search.toLowerCase())
  );

  async function handleLogout() {
    await fetch('/api/portal/logout', { method: 'POST' });
    window.location.href = '/portal/login';
  }

  // ── Top bar ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Topbar */}
      <div style={{
        background:  C.topbar,
        borderBottom: `1px solid ${C.border}`,
        padding:     '0 28px',
        height:      60,
        display:     'flex',
        alignItems:  'center',
        gap:         16,
        position:    'sticky',
        top:         0,
        zIndex:      10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: 'linear-gradient(135deg, #27AAE1, #262262)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}><Stethoscope size={15} strokeWidth={1.75} /></div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>CarePath</span>
        </div>

        <div style={{ width: 1, height: 20, background: C.border }} />

        {/* Clinic name */}
        <span style={{ fontSize: 13, color: C.muted, flex: 1 }}>{clinicName}</span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 14px',
            background: 'transparent',
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.muted,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '0 28px',
        display: 'flex',
        gap: 0,
        background: C.topbar,
      }}>
        {(['overview', 'patients', 'enroll'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '14px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${tab === t ? C.sky : 'transparent'}`,
              color: tab === t ? C.sky : C.muted,
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'color 0.15s',
            }}
          >
            {t === 'overview' ? 'Overview' : t === 'patients' ? 'Patients' : 'Enroll Patient'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '32px 28px', maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Overview tab ─────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 24px', color: C.text }}>
              {clinicName}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}>
              <StatCard
                label="Active Patients"
                value={stats.active}
                sub={`${stats.total} total enrolled`}
                accent={C.sky}
              />
              <StatCard
                label="Escalations"
                value={stats.escalations}
                sub="need attention"
                accent={stats.escalations > 0 ? C.danger : C.success}
              />
              <StatCard
                label="Opted Out"
                value={stats.optedOut}
              />
              <StatCard
                label="Avg Risk Score"
                value={`${stats.avgRisk}/100`}
                sub="lower is better"
                accent={stats.avgRisk >= 70 ? C.danger : stats.avgRisk >= 40 ? C.warning : C.success}
              />
            </div>

            {/* Recent patients preview */}
            {patients.length > 0 && (
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: C.text }}>
                    Recent Patients
                  </h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {['Name', 'Status', 'CarePath Day', 'Risk Score', 'Last Reply'].map(h => (
                        <th key={h} style={{
                          padding: '10px 20px',
                          textAlign: 'left',
                          fontSize: 11,
                          fontWeight: 600,
                          color: C.muted,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients.slice(0, 8).map((p, i) => (
                      <tr key={p.patient_id} style={{
                        borderTop: i > 0 ? `1px solid ${C.border}` : undefined,
                      }}>
                        <td style={{ padding: '14px 20px', fontSize: 14, color: C.text, fontWeight: 500 }}>
                          {p.first_name}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <StatusBadge status={p.status} />
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 14, color: C.muted }}>
                          Day {p.carepath_day}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <RiskBadge score={p.churn_risk_score} />
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: C.muted }}>
                          {p.last_reply
                            ? `"${p.last_reply.slice(0, 40)}${p.last_reply.length > 40 ? '…' : ''}"`
                            : <span style={{ color: C.dim }}>—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {patients.length > 8 && (
                  <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}` }}>
                    <button
                      onClick={() => setTab('patients')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: C.sky,
                        fontSize: 13,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      View all {patients.length} patients →
                    </button>
                  </div>
                )}
              </div>
            )}

            {patients.length === 0 && (
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '48px 24px',
                textAlign: 'center',
              }}>
                <p style={{ margin: '0 0 12px', color: C.muted, display: 'flex', justifyContent: 'center' }}><Users size={32} strokeWidth={1.5} /></p>
                <p style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: '0 0 8px' }}>
                  No patients yet
                </p>
                <p style={{ fontSize: 14, color: C.muted, margin: '0 0 20px' }}>
                  Enroll your first patient to get started.
                </p>
                <button
                  onClick={() => setTab('enroll')}
                  style={{
                    padding: '10px 24px',
                    background: C.sky,
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Enroll a Patient
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Patients tab ─────────────────────────────────────────────────── */}
        {tab === 'patients' && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              gap: 16,
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: C.text }}>
                Patients
                <span style={{ fontSize: 14, fontWeight: 400, color: C.muted, marginLeft: 8 }}>
                  {patients.length}
                </span>
              </h2>
              <input
                type="text"
                placeholder="Search by name or ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '9px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.text,
                  fontSize: 13,
                  outline: 'none',
                  width: 240,
                }}
              />
            </div>

            {filteredPatients.length === 0 ? (
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '48px 24px',
                textAlign: 'center',
              }}>
                <p style={{ color: C.muted }}>
                  {search ? 'No patients match your search.' : 'No patients enrolled yet.'}
                </p>
              </div>
            ) : (
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {['Name', 'Lang', 'Status', 'Enrolled', 'CarePath Day', 'Risk', 'Escalation', 'Last Reply'].map(h => (
                        <th key={h} style={{
                          padding: '10px 16px',
                          textAlign: 'left',
                          fontSize: 11,
                          fontWeight: 600,
                          color: C.muted,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((p, i) => (
                      <tr key={p.patient_id} style={{
                        borderTop: i > 0 ? `1px solid ${C.border}` : undefined,
                      }}>
                        <td style={{ padding: '12px 16px', fontSize: 14, color: C.text, fontWeight: 500 }}>
                          {p.first_name}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: C.muted }}>
                          {p.preferred_language}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <StatusBadge status={p.status} />
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: C.muted, whiteSpace: 'nowrap' }}>
                          {p.enrollment_date}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: C.muted }}>
                          {p.carepath_day}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <RiskBadge score={p.churn_risk_score} />
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12 }}>
                          {p.escalation_status === 'None' ? (
                            <span style={{ color: C.dim }}>—</span>
                          ) : (
                            <span style={{
                              color: p.escalation_status === 'Founder Alerted' ? C.danger : C.warning,
                              fontWeight: 600,
                            }}>
                              {p.escalation_status}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: C.muted, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.last_reply
                            ? `"${p.last_reply.slice(0, 30)}${p.last_reply.length > 30 ? '…' : ''}"`
                            : <span style={{ color: C.dim }}>—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── Enroll tab ───────────────────────────────────────────────────── */}
        {tab === 'enroll' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: C.text }}>
              Enroll a Patient
            </h2>
            <p style={{ fontSize: 14, color: C.muted, margin: '0 0 32px' }}>
              Three ways to add a patient to CarePath.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

              {/* Staff-assisted enrollment */}
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 28,
              }}>
                <p style={{ margin: '0 0 12px', color: C.sky, display: 'flex' }}><Monitor size={22} strokeWidth={1.75} /></p>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                  Staff-Assisted (EN)
                </h3>
                <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px', lineHeight: 1.6 }}>
                  Open the English enrollment form right here. A staff member
                  helps the patient fill it out on your device.
                </p>
                <PopupButton
                  id={FORM_IDS.EN}
                  size={80}
                  hidden={{ clinic_id: clinicId, clinic_name: clinicName }}
                  autoClose={2500}
                  style={{
                    padding: '10px 20px',
                    background: C.sky,
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Open Form →
                </PopupButton>
              </div>

              {/* Spanish staff-assisted */}
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 28,
              }}>
                <p style={{ margin: '0 0 12px', color: C.sky, display: 'flex' }}><Monitor size={22} strokeWidth={1.75} /></p>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                  Staff-Assisted (ES)
                </h3>
                <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px', lineHeight: 1.6 }}>
                  Open the Spanish enrollment form. A staff member helps the
                  patient fill it out.
                </p>
                <PopupButton
                  id={FORM_IDS.ES}
                  size={80}
                  hidden={{ clinic_id: clinicId, clinic_name: clinicName }}
                  autoClose={2500}
                  style={{
                    padding: '10px 20px',
                    background: C.sky,
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Abrir formulario →
                </PopupButton>
              </div>

              {/* Self-enrollment links */}
              <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 28,
                gridColumn: 'span 2',
              }}>
                <p style={{ margin: '0 0 12px', color: C.sky, display: 'flex' }}><Smartphone size={22} strokeWidth={1.75} /></p>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                  Patient Self-Enrollment
                </h3>
                <p style={{ fontSize: 13, color: C.muted, margin: '0 0 4px', lineHeight: 1.6 }}>
                  Copy the link for the patient&apos;s preferred language and send it via
                  text or email. Your clinic is pre-filled — they just enter their
                  name and phone number.
                </p>
                <EnrollmentLinks clinicId={clinicId} clinicName={clinicName} />
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
