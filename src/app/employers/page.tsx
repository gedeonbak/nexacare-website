'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3, BellRing, CheckCircle2, Coins,
  MessageSquare, Scale, Stethoscope, TrendingDown,
} from 'lucide-react';
import { captureUTM, getStoredUTM } from '@/lib/utm';

export default function EmployersPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    employeeCount: '',
    role: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Capture UTMs from URL on mount → sessionStorage + 90-day cookie.
  // Per _UTM_Convention.md: last-touch overwrite, attribution carries
  // across in-tab SPA nav AND returning-visitor sessions (90d).
  useEffect(() => {
    captureUTM();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Merge captured UTMs into submission payload.
      // Empty strings flow through cleanly to HubSpot + Slack for direct/organic traffic.
      const utm = getStoredUTM();
      const res = await fetch('/api/employers/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...utm }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please email hello@nexacaremanagement.com directly.');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --navy:  #262262;
          --navy-d:#1a1740;
          --navy-l:#2e2a78;
          --sky:   #27AAE1;
          --sky-d: #1a8bbf;
          --mid:   #264E8B;
          --white: #FFFFFF;
          --off:   #E8EDF5;
          --muted: rgba(255,255,255,0.55);
          --faint: rgba(255,255,255,0.07);
          --serif: 'Playfair Display', Georgia, serif;
          --sans:  'DM Sans', system-ui, sans-serif;
          --mono:  'DM Mono', monospace;
        }

        .emp-page {
          background: var(--navy-d);
          color: var(--white);
          font-family: var(--sans);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Grid texture */
        .emp-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(39,170,225,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(39,170,225,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .emp-inner { position: relative; z-index: 1; }

        /* ── HERO ── */
        .emp-hero {
          padding: 140px 48px 100px;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .emp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--sky);
          margin-bottom: 20px;
        }

        .emp-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 2px;
          background: var(--sky);
          flex-shrink: 0;
        }

        .emp-hero-headline {
          font-family: var(--serif);
          font-size: clamp(36px, 4.5vw, 58px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .emp-hero-headline em {
          font-style: italic;
          color: var(--sky);
        }

        .emp-hero-body {
          font-size: 15px;
          line-height: 1.7;
          font-weight: 300;
          color: var(--muted);
          margin-bottom: 32px;
          max-width: 500px;
        }

        .emp-cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: var(--sky);
          color: var(--navy-d);
          border: none;
          border-radius: 8px;
          padding: 13px 26px;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: #1a8bbf;
          transform: translateY(-1px);
        }

        .btn-ghost {
          background: transparent;
          color: var(--white);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 13px 26px;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-ghost:hover {
          border-color: var(--sky);
          background: rgba(39,170,225,0.08);
        }

        /* Hero evidence column */
        .emp-evidence {
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .emp-evidence-item {
          padding: 18px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: background 0.15s;
        }

        .emp-evidence-item:last-child {
          border-bottom: none;
        }

        .emp-evidence-item:hover {
          background: rgba(255,255,255,0.03);
        }

        .emp-evidence-source {
          font-family: var(--mono);
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }

        .emp-evidence-body {
          font-size: 13px;
          line-height: 1.55;
          color: rgba(255,255,255,0.85);
          font-weight: 300;
        }

        .emp-evidence-num {
          font-weight: 600;
          color: var(--sky);
        }

        /* ── PROBLEM SECTION ── */
        .emp-section {
          padding: 80px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sky);
          margin-bottom: 12px;
        }

        .section-headline {
          font-family: var(--serif);
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin-bottom: 16px;
        }

        .section-sub {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.7;
          max-width: 580px;
          font-weight: 300;
          margin-bottom: 48px;
        }

        /* Problem cards */
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .problem-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }

        .problem-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--sky), var(--mid));
        }

        .problem-icon {
          color: var(--sky);
          margin-bottom: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(39, 170, 225, 0.10);
          border: 1px solid rgba(39, 170, 225, 0.22);
        }

        .problem-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .problem-body {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.6;
        }

        .problem-num {
          font-family: var(--serif);
          font-size: 28px;
          font-weight: 700;
          color: #ef5350;
          margin-top: 16px;
        }

        .problem-num-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }

        /* ── SOLUTION SECTION ── */
        .solution-wrap {
          background: rgba(39,170,225,0.05);
          border: 1px solid rgba(39,170,225,0.15);
          border-radius: 16px;
          padding: 56px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }

        .solution-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .solution-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .solution-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(39,170,225,0.15);
          border: 1px solid rgba(39,170,225,0.3);
          color: var(--sky);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .solution-item-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .solution-item-body {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.6;
        }

        /* ROI calc */
        .roi-box {
          background: var(--navy-d);
          border: 1px solid rgba(39,170,225,0.2);
          border-radius: 12px;
          padding: 32px;
        }

        .roi-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--sky);
          margin-bottom: 24px;
        }

        .roi-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 13px;
        }

        .roi-row:last-child { border-bottom: none; }

        .roi-label { color: var(--muted); }
        .roi-val { font-family: var(--mono); font-size: 13px; }
        .roi-val.sky { color: var(--sky); }
        .roi-val.red { color: #ef5350; }
        .roi-val.green { color: #66bb6a; }

        .roi-divider {
          height: 1px;
          background: rgba(39,170,225,0.2);
          margin: 12px 0;
        }

        .roi-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          font-weight: 700;
          font-size: 15px;
        }

        .roi-total-val {
          font-family: var(--serif);
          font-size: 22px;
          color: var(--sky);
        }

        .roi-note {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          margin-top: 16px;
          line-height: 1.5;
        }

        /* ── HOW IT WORKS ── */
        .how-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          counter-reset: steps;
        }

        .how-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 28px 24px;
          position: relative;
        }

        .how-num {
          font-family: var(--serif);
          font-size: 48px;
          font-weight: 900;
          color: rgba(39,170,225,0.12);
          line-height: 1;
          margin-bottom: 16px;
        }

        .how-title {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--white);
        }

        .how-body {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
        }

        /* ── QUOTE ── */
        .quote-strip {
          background: linear-gradient(135deg, rgba(38,34,98,0.8), rgba(39,78,139,0.4));
          border: 1px solid rgba(39,170,225,0.15);
          border-radius: 16px;
          padding: 48px 56px;
          text-align: center;
          margin: 0 48px;
          max-width: 1104px;
          margin-left: auto;
          margin-right: auto;
        }

        .quote-text {
          font-family: var(--serif);
          font-size: clamp(18px, 2.5vw, 26px);
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 20px;
          color: var(--white);
        }

        .quote-attr {
          font-size: 12px;
          color: var(--sky);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── PDF DOWNLOAD ── */
        .pdf-banner {
          background: rgba(39,170,225,0.07);
          border: 1px solid rgba(39,170,225,0.2);
          border-radius: 12px;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .pdf-left { flex: 1; }

        .pdf-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--sky);
          margin-bottom: 8px;
        }

        .pdf-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .pdf-desc {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
        }

        /* ── CONTACT FORM ── */
        .form-section {
          padding: 80px 48px;
          max-width: 800px;
          margin: 0 auto;
        }

        .form-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 48px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field.full { grid-column: 1 / -1; }

        .form-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .form-label span { color: var(--sky); }

        .form-input,
        .form-select,
        .form-textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 12px 14px;
          color: var(--white);
          font-family: var(--sans);
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: var(--sky);
          background: rgba(39,170,225,0.05);
        }

        .form-select option { background: var(--navy-d); }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-submit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .form-disclaimer {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          line-height: 1.5;
          max-width: 360px;
        }

        .form-success {
          text-align: center;
          padding: 48px 24px;
        }

        .form-success-icon {
          color: #22c55e;
          margin-bottom: 16px;
          display: inline-flex;
        }

        .form-success-title {
          font-family: var(--serif);
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .form-success-body {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
        }

        .form-error-msg {
          font-size: 13px;
          color: #ef5350;
          margin-top: 8px;
        }

        /* ── FOOTER BAR ── */
        .emp-footer {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 32px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }

        .emp-footer a {
          color: var(--sky);
          text-decoration: none;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .emp-hero { grid-template-columns: 1fr; gap: 48px; padding: 120px 24px 60px; }
          .problem-grid { grid-template-columns: 1fr; }
          .solution-wrap { grid-template-columns: 1fr; gap: 32px; padding: 32px; }
          .how-grid { grid-template-columns: 1fr 1fr; }
          .emp-section { padding: 60px 24px; }
          .form-section { padding: 60px 24px; }
          .form-wrap { padding: 32px 24px; }
          .form-grid { grid-template-columns: 1fr; }
          .pdf-banner { flex-direction: column; align-items: flex-start; }
          .quote-strip { margin: 0 24px; padding: 32px 24px; }
          .emp-footer { flex-direction: column; gap: 8px; text-align: center; }
        }

        @media (max-width: 600px) {
          .emp-stat-grid { grid-template-columns: 1fr 1fr; }
          .how-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="emp-page">
        <div className="emp-inner">

          {/* ── HERO ── */}
          <section className="emp-hero">
            <div>
              <div className="emp-eyebrow">For Employers &amp; HR Leaders</div>
              <h1 className="emp-hero-headline">
                Your GLP-1 spend is growing.<br />
                <em>Most of it is wasted.</em>
              </h1>
              <p className="emp-hero-body">
                Half of employees who start a GLP-1 program quit within a year. The medication cost stays. The health benefit disappears. NexaCare builds the operational infrastructure that keeps patients on program — so your investment actually works.
              </p>
              <div className="emp-cta-row">
                <button className="btn-primary" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Talk to Our Team →
                </button>
                <a className="btn-ghost" href="/NexaCare_Employer_Sales_Tool.pdf" download="NexaCare_Employer_Sales_Tool.pdf">
                  Download the Brief ↓
                </a>
              </div>
            </div>

            <div className="emp-evidence">
              <div className="emp-evidence-item">
                <div className="emp-evidence-source">Rodriguez et al. · JAMA Network Open 2025</div>
                <div className="emp-evidence-body"><span className="emp-evidence-num">~50%</span> of GLP-1 patients discontinue within 12 months without structured engagement support</div>
              </div>
              <div className="emp-evidence-item">
                <div className="emp-evidence-source">EBRI Actuarial Analysis 2025</div>
                <div className="emp-evidence-body"><span className="emp-evidence-num">$6,000+</span> average annual drug cost per covered employee currently on a GLP-1 medication</div>
              </div>
              <div className="emp-evidence-item">
                <div className="emp-evidence-source">Greenway Health · MedCity News, May 2026</div>
                <div className="emp-evidence-body"><span className="emp-evidence-num">20.8%</span> of large employer specialty drug budgets now consumed by GLP-1 prescriptions</div>
              </div>
              <div className="emp-evidence-item">
                <div className="emp-evidence-source">NexaCare CarePath Protocol</div>
                <div className="emp-evidence-body">First <span className="emp-evidence-num">90 days</span> — the critical engagement window when dropout risk peaks and structured support matters most</div>
              </div>
            </div>
          </section>

          {/* ── PROBLEM ── */}
          <section className="emp-section">
            <div className="section-tag">The Problem</div>
            <h2 className="section-headline">You&apos;re paying for the drug.<br />Not the support that makes it work.</h2>
            <p className="section-sub">
              GLP-1 medications are clinically effective when patients stay on them. The problem isn&apos;t the drug — it&apos;s the dropout. Without structured engagement, patients stop, weight returns, and your spend produces no lasting outcome.
            </p>
            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-icon"><TrendingDown size={24} strokeWidth={1.75} /></div>
                <div className="problem-title">High dropout, zero recovery</div>
                <div className="problem-body">Real-world GLP-1 adherence at 12 months runs well below clinical trial results. Without behavioral support and check-ins, most patients discontinue in the first 90 days.</div>
                <div className="problem-num">~50%</div>
                <div className="problem-num-label">12-month discontinuation rate</div>
              </div>
              <div className="problem-card">
                <div className="problem-icon"><Coins size={24} strokeWidth={1.75} /></div>
                <div className="problem-title">Sunk cost, no ROI</div>
                <div className="problem-body">When a patient quits, the downstream health costs don&apos;t disappear — they defer. Cardiovascular risk, diabetes complications, and lost productivity continue. Your spend produced no durable benefit.</div>
                <div className="problem-num">$6K+</div>
                <div className="problem-num-label">annual cost per covered employee</div>
              </div>
              <div className="problem-card">
                <div className="problem-icon"><Stethoscope size={24} strokeWidth={1.75} /></div>
                <div className="problem-title">Clinics can&apos;t fill the gap</div>
                <div className="problem-body">Independent GLP-1 clinics want to keep patients engaged but lack the operational infrastructure to do it. No SMS system. No structured check-ins. No escalation workflow. Patients fall through the cracks.</div>
                <div className="problem-num">15,000+</div>
                <div className="problem-num-label">independent clinics with no retention system</div>
              </div>
            </div>
          </section>

          {/* ── SOLUTION ── */}
          <section className="emp-section" style={{ paddingTop: 0 }}>
            <div className="solution-wrap">
              <div>
                <div className="section-tag">The Solution</div>
                <h2 className="section-headline" style={{ marginBottom: '32px' }}>The operational layer that keeps patients on program</h2>
                <ul className="solution-list">
                  <li className="solution-item">
                    <div className="solution-dot"><MessageSquare size={16} strokeWidth={1.75} /></div>
                    <div>
                      <div className="solution-item-title">CarePath SMS engagement</div>
                      <div className="solution-item-body">20 structured text messages over 90 days. Weekly check-ins, milestone acknowledgments, and side effect education — timed to the moments patients are most likely to quit.</div>
                    </div>
                  </li>
                  <li className="solution-item">
                    <div className="solution-dot"><BellRing size={16} strokeWidth={1.75} /></div>
                    <div>
                      <div className="solution-item-title">Churn detection &amp; escalation</div>
                      <div className="solution-item-body">When a patient signals they&apos;re struggling or considering stopping, the clinic is alerted within 60 seconds. Human intervention at exactly the right moment.</div>
                    </div>
                  </li>
                  <li className="solution-item">
                    <div className="solution-dot"><BarChart3 size={16} strokeWidth={1.75} /></div>
                    <div>
                      <div className="solution-item-title">Retention data for employers</div>
                      <div className="solution-item-body">90-day retention rates, reply engagement, and program completion data — anonymized and aggregated for employer reporting.</div>
                    </div>
                  </li>
                  <li className="solution-item">
                    <div className="solution-dot"><Scale size={16} strokeWidth={1.75} /></div>
                    <div>
                      <div className="solution-item-title">HIPAA-compliant infrastructure</div>
                      <div className="solution-item-body">AWS HIPAA-eligible stack with executed BAA. Patient data never leaves the secure environment. Fully compliant with employer benefit program requirements.</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="roi-box">
                <div className="roi-title">Illustrative ROI — 500 Covered Employees</div>
                <div className="roi-row">
                  <span className="roi-label">Employees on GLP-1 (est. 8%)</span>
                  <span className="roi-val sky">40 employees</span>
                </div>
                <div className="roi-row">
                  <span className="roi-label">Annual drug spend</span>
                  <span className="roi-val red">$240,000</span>
                </div>
                <div className="roi-row">
                  <span className="roi-label">Without support: ~50% quit</span>
                  <span className="roi-val red">$120,000 wasted</span>
                </div>
                <div className="roi-divider" />
                <div className="roi-row">
                  <span className="roi-label">CarePath engagement cost</span>
                  <span className="roi-val sky">~$4,200/yr</span>
                </div>
                <div className="roi-row">
                  <span className="roi-label">Projected retention improvement</span>
                  <span className="roi-val green">+25–35 percentage pts</span>
                </div>
                <div className="roi-row">
                  <span className="roi-label">Protected drug spend (est.)</span>
                  <span className="roi-val green">$60,000–$84,000</span>
                </div>
                <div className="roi-total">
                  <span>Estimated net ROI</span>
                  <span className="roi-total-val">14–20×</span>
                </div>
                <div className="roi-note">
                  Illustrative only. Based on EBRI 2025 and Rodriguez et al. 2025 data. Actual results vary by employee population and clinic partner.
                </div>
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section className="emp-section" style={{ paddingTop: 0 }}>
            <div className="section-tag">How It Works</div>
            <h2 className="section-headline">Four steps to a working GLP-1 program</h2>
            <p className="section-sub">NexaCare partners with your employees&apos; existing GLP-1 clinics — no new provider relationships required.</p>
            <div className="how-grid">
              <div className="how-card">
                <div className="how-num">01</div>
                <div className="how-title">Employer benefit setup</div>
                <div className="how-body">NexaCare works with your benefits team to identify eligible employees and participating clinics. No new vendor credentialing.</div>
              </div>
              <div className="how-card">
                <div className="how-num">02</div>
                <div className="how-title">Patient enrollment</div>
                <div className="how-body">Employees enroll via a simple mobile form — available in English, Spanish, and French. Explicit SMS consent captured at enrollment.</div>
              </div>
              <div className="how-card">
                <div className="how-num">03</div>
                <div className="how-title">CarePath engagement</div>
                <div className="how-body">20 structured text messages over 90 days. Check-ins, education, milestone acknowledgment, and churn-risk detection — automatic.</div>
              </div>
              <div className="how-card">
                <div className="how-num">04</div>
                <div className="how-title">Employer reporting</div>
                <div className="how-body">Monthly retention reports delivered to your benefits team. Anonymized and aggregated — fully HIPAA compliant.</div>
              </div>
            </div>
          </section>

          {/* ── QUOTE ── */}
          <div style={{ paddingBottom: '80px' }}>
            <div className="quote-strip">
              <div className="quote-text">
                &ldquo;Without coordinated oversight, prescribing patterns become reactive. Patients receive medication without sustained behavioral support. Discontinuation rates are high. Weight regain is common. Downstream costs remain.&rdquo;
              </div>
              <div className="quote-attr">Michael Blackman, MD MBA — Chief Medical Officer, Greenway Health · MedCity News, May 2026</div>
            </div>
          </div>

          {/* ── PDF DOWNLOAD ── */}
          <section className="emp-section" style={{ paddingTop: 0 }}>
            <div className="pdf-banner">
              <div className="pdf-left">
                <div className="pdf-tag">Free Resource</div>
                <div className="pdf-title">The Employer&apos;s Guide to GLP-1 Retention</div>
                <div className="pdf-desc">Data-backed brief covering the cost of GLP-1 dropout, what structured engagement changes, and how NexaCare works within your existing benefit program. One page. No fluff.</div>
              </div>
              <a
                className="btn-primary"
                href="/NexaCare_Employer_Sales_Tool.pdf"
                download="NexaCare_Employer_Sales_Tool.pdf"
                style={{ flexShrink: 0 }}
              >
                Download PDF ↓
              </a>
            </div>
          </section>

          {/* ── CONTACT FORM ── */}
          <section className="form-section" id="contact-form">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="section-tag" style={{ display: 'inline-block' }}>Get Started</div>
              <h2 className="section-headline">Talk to our team</h2>
              <p className="section-sub" style={{ margin: '0 auto' }}>
                We&apos;ll show you how CarePath fits your benefit program and what retention improvement looks like for your employee population.
              </p>
            </div>

            <div className="form-wrap">
              {status === 'success' ? (
                <div className="form-success">
                  <div className="form-success-icon"><CheckCircle2 size={48} strokeWidth={1.75} /></div>
                  <div className="form-success-title">We&apos;ll be in touch within one business day.</div>
                  <div className="form-success-body">
                    Thanks for reaching out. A member of the NexaCare team will contact you at {formData.email} to schedule a 15-minute call.
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="firstName" className="form-label">First name <span>*</span></label>
                      <input
                        id="firstName"
                        className="form-input"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Sarah"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="lastName" className="form-label">Last name <span>*</span></label>
                      <input
                        id="lastName"
                        className="form-input"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Johnson"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="email" className="form-label">Work email <span>*</span></label>
                      <input
                        id="email"
                        className="form-input"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="sarah@company.com"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="company" className="form-label">Company <span>*</span></label>
                      <input
                        id="company"
                        className="form-input"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="employeeCount" className="form-label">Number of employees</label>
                      <select
                        id="employeeCount"
                        className="form-select"
                        name="employeeCount"
                        value={formData.employeeCount}
                        onChange={handleChange}
                      >
                        <option value="">Select range</option>
                        <option value="50-250">50–250</option>
                        <option value="250-1000">250–1,000</option>
                        <option value="1000-5000">1,000–5,000</option>
                        <option value="5000+">5,000+</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor="role" className="form-label">Your role</label>
                      <select
                        id="role"
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="">Select role</option>
                        <option value="hr-director">HR Director / CHRO</option>
                        <option value="benefits-manager">Benefits Manager</option>
                        <option value="cfo">CFO / Finance</option>
                        <option value="ceo">CEO / Founder</option>
                        <option value="broker">Benefits Broker</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-field full">
                      <label htmlFor="message" className="form-label">What&apos;s your main concern with GLP-1 spend? (optional)</label>
                      <textarea
                        id="message"
                        className="form-textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="e.g. High dropout rates, cost justification, tracking outcomes..."
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="form-error-msg">{errorMessage}</div>
                  )}

                  <div className="form-submit-row">
                    <div className="form-disclaimer">
                      No spam. We&apos;ll send one follow-up email and one calendar link. Unsubscribe anytime. Your information is never shared.
                    </div>
                    <button
                      className="btn-primary"
                      onClick={handleSubmit}
                      disabled={status === 'loading'}
                      style={{ opacity: status === 'loading' ? 0.7 : 1 }}
                    >
                      {status === 'loading' ? 'Sending…' : 'Request a Call →'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ── FOOTER BAR ── */}
          <div className="emp-footer">
            <div>© 2026 NexaCare Management, LLC · Atlanta, Georgia</div>
            <div>
              <a href="/privacy-policy">Privacy Policy</a>
              {' · '}
              <a href="/terms-of-service">Terms of Service</a>
              {' · '}
              <a href="mailto:hello@nexacaremanagement.com">hello@nexacaremanagement.com</a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
