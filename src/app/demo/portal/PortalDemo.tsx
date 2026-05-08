// DEMO ONLY — All data is synthetic.
// Not real patients or clinics.

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard, Users, MessageSquare, CreditCard,
  Building2, AlertTriangle, Activity, Receipt, TrendingUp,
  ChevronRight, CheckCircle2, ArrowLeft, Clock, ExternalLink,
} from 'lucide-react';
import {
  AreaChart, BarChart, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Area, Bar, Line,
  ReferenceLine, CartesianGrid,
} from 'recharts';

// ─── COLOR PALETTE ───────────────────────────────────────────────────────────

const C = {
  bg: '#0f0e1a',
  topbar: '#0a0916',
  surface: '#111827',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  sky: '#27AAE1',
  navy: '#262262',
  mid: '#264E8B',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#ef4444',
  text: 'rgba(255,255,255,0.85)',
  muted: 'rgba(255,255,255,0.4)',
  dim: 'rgba(255,255,255,0.2)',
};

// ─── INTERFACES ───────────────────────────────────────────────────────────────

interface Clinic {
  id: string; name: string; state: string; contact: string; email: string; phone: string;
  pmpmRate: number; status: 'Active' | 'Onboarding'; goLiveDate: string; onboardingDay: number;
  activePatients: number; totalEnrolled: number; mrr: number; churnRate: number;
  retentionRate90: number | null; stripeStatus: 'Paid' | 'Draft'; nextBillingDate: string;
}

interface Patient {
  id: string; clinicId: string; firstName: string; lastInitial: string;
  language: 'EN' | 'ES' | 'FR'; carePathDay: number; phase: 'Activation' | 'Momentum' | 'Retention Lock';
  status: 'Active' | 'Paused'; riskScore: number; escalationStatus: 'None' | 'Monitoring' | 'Founder Alerted';
  lastReply: string | null; lastReplyDate: string | null; nextMessageNum: number;
  nextMessageDate: string; enrollmentDate: string; notes: string;
}

interface MsgLog {
  num: number; day: number; phase: string; sentAt?: string; status: 'Delivered' | 'Queued' | 'Scheduled';
  scheduledFor?: string; body: string; reply: string | null; replyAt?: string; riskFlag: boolean;
}

interface BillingEvent {
  clinicId: string; month: string; patients: number; rate: number; amount: number;
  status: 'Paid' | 'Draft'; paidDate: string | null;
}

interface Lead {
  id: string; clinicName: string; contact: string; email: string; state: string;
  volume: string; source: string; utmCampaign: string | null; submittedAt: string;
  stage: 'Lead' | 'MQL' | 'SQL' | 'Won'; notes: string;
}

interface ActivityFeedItem {
  type: 'risk' | 'reply' | 'sent';
  patient: string;
  clinic: string;
  msg: string;
  time: string;
  reply: string | null;
}

interface TodayMessage {
  time: string;
  patient: string;
  clinic: string;
  msgNum: number;
  phase: string;
  delivery: string;
  reply: string | null;
  flag: boolean;
}

// ─── DATA CONSTANTS ───────────────────────────────────────────────────────────

const CLINICS: Clinic[] = [
  { id:'c1', name:'Alpharetta Weight & Wellness', state:'GA', contact:'Dr. Jennifer Walsh',
    email:'j.walsh@alpharettaww.com', phone:'(470) 555-0142', pmpmRate:99,
    status:'Active', goLiveDate:'Feb 14, 2026', onboardingDay:83,
    activePatients:148, totalEnrolled:171, mrr:14652, churnRate:3.8,
    retentionRate90:89, stripeStatus:'Paid', nextBillingDate:'Jun 1, 2026' },
  { id:'c2', name:'Buckhead Primary Care', state:'GA', contact:'Dr. Marcus Lee',
    email:'m.lee@buckheadpc.com', phone:'(404) 555-0287', pmpmRate:87,
    status:'Active', goLiveDate:'Mar 3, 2026', onboardingDay:66,
    activePatients:92, totalEnrolled:104, mrr:8004, churnRate:4.3,
    retentionRate90:85, stripeStatus:'Paid', nextBillingDate:'Jun 1, 2026' },
  { id:'c3', name:'Roswell Med Spa', state:'GA', contact:'Sarah Kim',
    email:'s.kim@roswellmedspa.com', phone:'(770) 555-0391', pmpmRate:75,
    status:'Onboarding', goLiveDate:'Apr 28, 2026', onboardingDay:10,
    activePatients:31, totalEnrolled:31, mrr:2325, churnRate:0,
    retentionRate90:null, stripeStatus:'Draft', nextBillingDate:'Jun 1, 2026' },
];

const PATIENTS: Patient[] = [
  { id:'p1', clinicId:'c1', firstName:'Sarah', lastInitial:'M', language:'EN',
    carePathDay:34, phase:'Momentum', status:'Active', riskScore:2,
    escalationStatus:'None', lastReply:'4 4 3', lastReplyDate:'May 5, 2026',
    nextMessageNum:8, nextMessageDate:'May 10, 2026', enrollmentDate:'Apr 1, 2026',
    notes:'Patient responding well. Consistent replies.' },
  { id:'p2', clinicId:'c1', firstName:'James', lastInitial:'K', language:'EN',
    carePathDay:67, phase:'Retention Lock', status:'Active', riskScore:8,
    escalationStatus:'Monitoring', lastReply:'3', lastReplyDate:'May 6, 2026',
    nextMessageNum:15, nextMessageDate:'May 8, 2026', enrollmentDate:'Feb 28, 2026',
    notes:'Replied 3 on Day 66 check-in. Support message sent. Monitor closely.' },
  { id:'p3', clinicId:'c1', firstName:'Robert', lastInitial:'T', language:'EN',
    carePathDay:70, phase:'Retention Lock', status:'Active', riskScore:10,
    escalationStatus:'Founder Alerted', lastReply:'4', lastReplyDate:'May 7, 2026',
    nextMessageNum:15, nextMessageDate:'May 8, 2026', enrollmentDate:'Feb 25, 2026',
    notes:'CRITICAL: Replied 4 (considering stopping). Founder alerted. Clinic notified.' },
  { id:'p4', clinicId:'c1', firstName:'Maria', lastInitial:'L', language:'ES',
    carePathDay:14, phase:'Activation', status:'Active', riskScore:0,
    escalationStatus:'None', lastReply:'YES', lastReplyDate:'May 6, 2026',
    nextMessageNum:6, nextMessageDate:'May 8, 2026', enrollmentDate:'Apr 24, 2026',
    notes:'Strong engagement. Replied YES to week 2 milestone.' },
  { id:'p5', clinicId:'c2', firstName:'David', lastInitial:'H', language:'EN',
    carePathDay:88, phase:'Retention Lock', status:'Active', riskScore:0,
    escalationStatus:'None', lastReply:'YES', lastReplyDate:'May 7, 2026',
    nextMessageNum:19, nextMessageDate:'May 8, 2026', enrollmentDate:'Feb 9, 2026',
    notes:'Day 88 renewal intent: YES. Renewal confirmed. Great outcome.' },
  { id:'p6', clinicId:'c2', firstName:'Carlos', lastInitial:'R', language:'ES',
    carePathDay:56, phase:'Momentum', status:'Active', riskScore:7,
    escalationStatus:'Monitoring', lastReply:null, lastReplyDate:null,
    nextMessageNum:12, nextMessageDate:'May 8, 2026', enrollmentDate:'Mar 12, 2026',
    notes:'No reply to Day 56 two-month milestone. 72hr no-reply flag triggered.' },
  { id:'p7', clinicId:'c2', firstName:'Aisha', lastInitial:'B', language:'FR',
    carePathDay:42, phase:'Momentum', status:'Active', riskScore:4,
    escalationStatus:'None', lastReply:'3 2 4', lastReplyDate:'May 4, 2026',
    nextMessageNum:10, nextMessageDate:'May 8, 2026', enrollmentDate:'Mar 27, 2026',
    notes:'Plateau week. Mood score 4 - stable. Watch energy score.' },
  { id:'p8', clinicId:'c3', firstName:'Lisa', lastInitial:'N', language:'EN',
    carePathDay:10, phase:'Activation', status:'Active', riskScore:0,
    escalationStatus:'None', lastReply:'1', lastReplyDate:'May 5, 2026',
    nextMessageNum:4, nextMessageDate:'May 8, 2026', enrollmentDate:'Apr 28, 2026',
    notes:'New patient. Day 3 check-in: replied 1 (great). On track.' },
];

const MESSAGE_LOG_P1: MsgLog[] = [
  { num:1, day:1, phase:'Activation', sentAt:'Apr 1 9:02am', status:'Delivered',
    body:"Hi Sarah! Welcome to your GLP-1 program through Alpharetta Weight & Wellness...",
    reply:null, riskFlag:false },
  { num:2, day:3, phase:'Activation', sentAt:'Apr 3 9:00am', status:'Delivered',
    body:"Sarah, it's been 3 days — how are you feeling? Reply: 1=Great! 2=Some side effects 3=Struggling",
    reply:'1', replyAt:'Apr 3 9:47am', riskFlag:false },
  { num:3, day:5, phase:'Activation', sentAt:'Apr 5 9:00am', status:'Delivered',
    body:"Quick tip, Sarah: Staying hydrated is one of the most important things you can do this first week...",
    reply:null, riskFlag:false },
  { num:4, day:7, phase:'Activation', sentAt:'Apr 7 9:00am', status:'Delivered',
    body:"Sarah, a quick note on protein: aim for 25–30g per meal...",
    reply:null, riskFlag:false },
  { num:5, day:10, phase:'Activation', sentAt:'Apr 10 9:00am', status:'Delivered',
    body:"Myth check, Sarah: \"GLP-1 does all the work.\" Not quite...",
    reply:null, riskFlag:false },
  { num:6, day:14, phase:'Activation', sentAt:'Apr 14 9:00am', status:'Delivered',
    body:"Two weeks in, Sarah — that's real progress...",
    reply:'YES', replyAt:'Apr 14 10:12am', riskFlag:false },
  { num:7, day:21, phase:'Momentum', sentAt:'Apr 21 9:00am', status:'Delivered',
    body:"Week 3 check-in, Sarah. Reply with 3 numbers: 1) Energy (1-5) 2) Appetite control (1-5) 3) Mood (1-5)",
    reply:'4 4 4', replyAt:'Apr 21 9:31am', riskFlag:false },
  { num:8, day:28, phase:'Momentum', sentAt:'Apr 28 9:00am', status:'Delivered',
    body:"Week 4 check-in, Sarah. Energy / Appetite / Mood (1-5 each)...",
    reply:'4 4 3', replyAt:'Apr 28 11:04am', riskFlag:false },
  { num:9, day:35, phase:'Momentum', sentAt:'May 5 9:00am', status:'Delivered',
    body:"Week 5 check-in, Sarah. Energy / Appetite / Mood...",
    reply:'4 4 3', replyAt:'May 5 9:58am', riskFlag:false },
  { num:10, day:42, phase:'Momentum', sentAt:'May 12 9:00am', status:'Queued',
    scheduledFor:'May 12',
    body:"Week 6 — the plateau moment, Sarah...",
    reply:null, riskFlag:false },
  { num:11, day:49, phase:'Momentum', status:'Scheduled', scheduledFor:'Day 49', body:'...', reply:null, riskFlag:false },
  { num:12, day:56, phase:'Momentum', status:'Scheduled', scheduledFor:'Day 56', body:'...', reply:null, riskFlag:false },
  { num:13, day:63, phase:'Retention Lock', status:'Scheduled', scheduledFor:'Day 63', body:'...', reply:null, riskFlag:false },
  { num:14, day:66, phase:'Retention Lock', status:'Scheduled', scheduledFor:'Day 66', body:'...', reply:null, riskFlag:false },
  { num:15, day:70, phase:'Retention Lock', status:'Scheduled', scheduledFor:'Day 70', body:'...', reply:null, riskFlag:false },
  { num:16, day:74, phase:'Retention Lock', status:'Scheduled', scheduledFor:'Day 74', body:'...', reply:null, riskFlag:false },
  { num:17, day:78, phase:'Retention Lock', status:'Scheduled', scheduledFor:'Day 78', body:'...', reply:null, riskFlag:false },
  { num:18, day:84, phase:'Retention Lock', status:'Scheduled', scheduledFor:'Day 84', body:'...', reply:null, riskFlag:false },
  { num:19, day:88, phase:'Retention Lock', status:'Scheduled', scheduledFor:'Day 88', body:'...', reply:null, riskFlag:false },
  { num:20, day:90, phase:'Retention Lock', status:'Scheduled', scheduledFor:'Day 90', body:'...', reply:null, riskFlag:false },
];

const BILLING: BillingEvent[] = [
  { clinicId:'c1', month:'May 2026', patients:148, rate:99, amount:14652, status:'Paid', paidDate:'May 1, 2026' },
  { clinicId:'c2', month:'May 2026', patients:92, rate:87, amount:8004, status:'Paid', paidDate:'May 1, 2026' },
  { clinicId:'c3', month:'May 2026', patients:31, rate:75, amount:2325, status:'Draft', paidDate:null },
  { clinicId:'c1', month:'Apr 2026', patients:131, rate:99, amount:12969, status:'Paid', paidDate:'Apr 1, 2026' },
  { clinicId:'c2', month:'Apr 2026', patients:78, rate:87, amount:6786, status:'Paid', paidDate:'Apr 1, 2026' },
];

const PIPELINE_LEADS: Lead[] = [
  { id:'l1', clinicName:'Perimeter Wellness Center', contact:'Dr. Angela Torres',
    email:'atorres@perimeterwellness.com', state:'GA', volume:'51–150', source:'LinkedIn',
    utmCampaign:'clinic-cold-may26', submittedAt:'May 7, 2026 · 2:14pm', stage:'SQL',
    notes:'Replied positively to sequence. Demo scheduled May 12.' },
  { id:'l2', clinicName:'Midtown Aesthetic Medicine', contact:'Lisa Park, Practice Manager',
    email:'l.park@midtownaesthetic.com', state:'GA', volume:'1–50', source:'Apollo',
    utmCampaign:'clinic-cold-may26', submittedAt:'May 6, 2026 · 11:32am', stage:'MQL',
    notes:'Visited /pricing page 3 times. Has not booked.' },
  { id:'l3', clinicName:'Frisco Weight & Longevity', contact:'Dr. James Okafor',
    email:'j.okafor@friscowl.com', state:'TX', volume:'150–500', source:'Google',
    utmCampaign:null, submittedAt:'May 5, 2026 · 4:07pm', stage:'Lead',
    notes:'Organic search. High volume target. Follow up Monday.' },
  { id:'l4', clinicName:'Coral Springs Med Spa', contact:'Maria Reyes',
    email:'m.reyes@coralspa.com', state:'FL', volume:'51–150', source:'Referral',
    utmCampaign:null, submittedAt:'May 3, 2026 · 10:18am', stage:'SQL',
    notes:'Referred by Alpharetta W&W. Very warm lead.' },
];

const ACTIVITY_FEED: ActivityFeedItem[] = [
  { type:'risk', patient:'Robert T.', clinic:'Alpharetta W&W', msg:'Message 15 sent · Day 70 check-in. Reply received: "4" — CRITICAL risk flag', time:'May 7 · 9:02am', reply:'4' },
  { type:'reply', patient:'Sarah M.', clinic:'Alpharetta W&W', msg:'Message 9 replied · Day 35 check-in received', time:'May 5 · 9:58am', reply:'4 4 3' },
  { type:'sent', patient:'David H.', clinic:'Buckhead PC', msg:'Message 19 sent · Day 88 renewal intent check', time:'May 7 · 9:00am', reply:null },
  { type:'reply', patient:'David H.', clinic:'Buckhead PC', msg:'Replied YES to renewal intent · Day 88', time:'May 7 · 9:14am', reply:'YES' },
  { type:'sent', patient:'James K.', clinic:'Alpharetta W&W', msg:'Message 14 sent · Day 66 confidence check', time:'May 6 · 9:00am', reply:null },
  { type:'reply', patient:'James K.', clinic:'Alpharetta W&W', msg:'Replied "3" — Monitoring escalation triggered', time:'May 6 · 3:44pm', reply:'3' },
  { type:'sent', patient:'Carlos R.', clinic:'Buckhead PC', msg:'Message 12 sent · Day 56 two-month milestone', time:'May 4 · 9:00am', reply:null },
  { type:'risk', patient:'Carlos R.', clinic:'Buckhead PC', msg:'72-hour no-reply flag triggered for Day 56 milestone', time:'May 7 · 9:00am', reply:null },
];

const TODAY_MESSAGES: TodayMessage[] = [
  { time:'9:00am', patient:'Robert T.', clinic:'Alpharetta', msgNum:15, phase:'Retention Lock', delivery:'Delivered', reply:'4', flag:true },
  { time:'9:00am', patient:'David H.', clinic:'Buckhead', msgNum:19, phase:'Retention Lock', delivery:'Delivered', reply:'YES', flag:false },
  { time:'9:00am', patient:'James K.', clinic:'Alpharetta', msgNum:15, phase:'Retention Lock', delivery:'Delivered', reply:null, flag:false },
  { time:'9:00am', patient:'Maria L.', clinic:'Alpharetta', msgNum:6, phase:'Activation', delivery:'Delivered', reply:'YES', flag:false },
  { time:'9:00am', patient:'Carlos R.', clinic:'Buckhead', msgNum:12, phase:'Momentum', delivery:'Delivered', reply:null, flag:false },
  { time:'9:00am', patient:'Aisha B.', clinic:'Buckhead', msgNum:10, phase:'Momentum', delivery:'Delivered', reply:'3 2 4', flag:false },
  { time:'9:00am', patient:'Lisa N.', clinic:'Roswell', msgNum:4, phase:'Activation', delivery:'Delivered', reply:'1', flag:false },
  { time:'9:00am', patient:'Sarah M.', clinic:'Alpharetta', msgNum:9, phase:'Momentum', delivery:'Delivered', reply:'4 4 3', flag:false },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function riskColor(score: number): string {
  if (score <= 3) return C.success;
  if (score <= 6) return C.warning;
  if (score <= 9) return '#fb923c';
  return C.danger;
}

function riskLabel(score: number): string {
  if (score <= 3) return 'On track';
  if (score <= 6) return 'Monitor';
  if (score <= 9) return 'High risk';
  return 'CRITICAL';
}

function phaseColor(phase: string): string {
  if (phase === 'Activation') return C.sky;
  if (phase === 'Momentum') return '#264E8B';
  return '#d97706';
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  delta?: string;
  deltaUp?: boolean;
  accent?: string;
  pulse?: boolean;
}

function StatCard({ label, value, sub, delta, deltaUp, accent, pulse }: StatCardProps) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${accent ? accent + '40' : C.border}`,
      borderRadius: 12,
      padding: '20px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {accent && <div style={{ position:'absolute', top:0, left:0, width:3, height:'100%', background: accent, borderRadius:'12px 0 0 12px' }} />}
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color: C.muted, marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color: accent || 'white', lineHeight:1, marginBottom:6,
                    ...(pulse ? { animation:'pulse 2s infinite' } : {}) }}>
        {value}
      </div>
      {sub && <div style={{ fontSize:12, color: C.muted }}>{sub}</div>}
      {delta && <div style={{ fontSize:11, fontWeight:600, color: deltaUp ? C.success : C.sky, marginTop:4 }}>{delta}</div>}
    </div>
  );
}

// ─── DEMO HEADER ──────────────────────────────────────────────────────────────

function DemoHeader() {
  return (
    <div style={{ background: C.bg, padding:'60px 48px 40px', textAlign:'center' }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', color: C.sky, textTransform:'uppercase', marginBottom:16 }}>
        INTERACTIVE DEMO
      </div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(32px,4vw,52px)', fontWeight:900, color:'white', letterSpacing:'-0.03em', marginBottom:16 }}>
        The NexaCare Platform
      </h1>
      <p style={{ fontSize:16, lineHeight:1.7, color:'rgba(255,255,255,0.55)', maxWidth:560, margin:'0 auto 24px' }}>
        Explore the full clinic and admin portal. All data is synthetic — built to show exactly how the platform works for clinic operators and the NexaCare team.
      </p>
      <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
        {['2 portal views','10 interactive tabs'].map(t => (
          <span key={t} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:100,
                                  background:'rgba(39,170,225,0.1)', border:'1px solid rgba(39,170,225,0.25)', color: C.sky }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── DEMO CTA ────────────────────────────────────────────────────────────────

function DemoCTA() {
  return (
    <div style={{ background:'#262262', padding:'60px 48px', textAlign:'center' }}>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,3vw,36px)', fontWeight:700, color:'white', marginBottom:12 }}>
        Ready to see this with your clinic&apos;s real data?
      </h2>
      <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', marginBottom:28 }}>
        Book a 15-minute call → we&apos;ll walk through your specific patient volume.
      </p>
      <a href="/book-demo" style={{ background: C.sky, color:'#1a1740', textDecoration:'none', borderRadius:10,
                                     padding:'14px 32px', fontSize:14, fontWeight:700, display:'inline-block' }}>
        Book a Demo →
      </a>
    </div>
  );
}

// ─── SECTION HEADING ─────────────────────────────────────────────────────────

function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h2 style={{ fontSize:18, fontWeight:700, color: C.text, margin:0, letterSpacing:'-0.02em' }}>{title}</h2>
      {sub && <p style={{ fontSize:13, color: C.muted, margin:'4px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ─── CLINIC OVERVIEW TAB ──────────────────────────────────────────────────────

function ClinicOverviewTab({ clinic }: { clinic: Clinic }) {
  const clinicPatients = PATIENTS.filter(p => p.clinicId === clinic.id);
  const activation = clinicPatients.filter(p => p.phase === 'Activation').length;
  const momentum = clinicPatients.filter(p => p.phase === 'Momentum').length;
  const retention = clinicPatients.filter(p => p.phase === 'Retention Lock').length;
  const total = clinicPatients.length;

  const recentMessages = MESSAGE_LOG_P1
    .filter(m => m.status === 'Delivered')
    .slice(-5)
    .reverse();

  return (
    <div>
      <SectionHeading title={`${clinic.name} — Overview`} sub={`Go-live: ${clinic.goLiveDate} · Day ${clinic.onboardingDay}`} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
        <StatCard label="Active Patients" value={String(clinic.activePatients)}
          sub={`of ${clinic.totalEnrolled} enrolled`} delta="+12 this month" deltaUp />
        <StatCard label="Monthly Recurring Revenue" value={`$${clinic.mrr.toLocaleString()}`}
          sub={`$${clinic.pmpmRate} PMPM`} delta="+$1,305 MoM" deltaUp />
        <StatCard label="90-Day Retention"
          value={clinic.retentionRate90 !== null ? `${clinic.retentionRate90}%` : 'N/A'}
          sub="Industry avg: ~50%" />
        <StatCard label="Churn Rate" value={`${clinic.churnRate}%`} sub="Monthly patient churn" />
      </div>

      {/* Phase Distribution */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px', marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:14 }}>
          CarePath Phase Distribution
        </div>
        {total > 0 ? (
          <>
            <div style={{ display:'flex', height:32, borderRadius:8, overflow:'hidden', marginBottom:10 }}>
              {activation > 0 && <div style={{ flex:activation, background: C.sky, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#0a0916' }}>{activation}</div>}
              {momentum > 0 && <div style={{ flex:momentum, background: C.mid, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'white' }}>{momentum}</div>}
              {retention > 0 && <div style={{ flex:retention, background: C.navy, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'white' }}>{retention}</div>}
            </div>
            <div style={{ display:'flex', gap:16, fontSize:11, color: C.muted }}>
              <span><span style={{ color: C.sky }}>■</span> Activation ({activation})</span>
              <span><span style={{ color: C.mid }}>■</span> Momentum ({momentum})</span>
              <span><span style={{ color: C.navy }}>■</span> Retention Lock ({retention})</span>
            </div>
          </>
        ) : (
          <div style={{ color: C.muted, fontSize:13 }}>No patient data for this clinic.</div>
        )}
      </div>

      {/* Recent Activity */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px', marginBottom:20 }}>
        <div style={{ fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:14 }}>
          Recent CarePath Activity (Sarah M.)
        </div>
        {recentMessages.map(m => (
          <div key={m.num} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:`${C.sky}20`, border:`1px solid ${C.sky}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:10, fontWeight:700, color: C.sky }}>#{m.num}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color: C.text, marginBottom:2 }}>{m.body.slice(0, 80)}{m.body.length > 80 ? '...' : ''}</div>
              <div style={{ fontSize:11, color: C.muted, display:'flex', gap:12 }}>
                <span><Clock size={10} style={{ display:'inline', marginRight:3 }} />{m.sentAt}</span>
                {m.reply && <span style={{ color: C.success }}>Reply: {m.reply}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display:'flex', gap:12, marginTop:24, flexWrap:'wrap' }}>
        <button style={{ background: C.sky, color:'#0a0916', border:'none', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}>+ Enroll New Patient</button>
        <button style={{ background:'transparent', color:'rgba(255,255,255,0.6)', border:`1px solid ${C.border}`, borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:500, cursor:'pointer' }}>Download Monthly Report</button>
      </div>
    </div>
  );
}

// ─── PATIENT DETAIL ───────────────────────────────────────────────────────────

function PatientDetail({ patient, onBack }: { patient: Patient; onBack: () => void }) {
  const [noteText, setNoteText] = useState(patient.notes);
  const messages: MsgLog[] = patient.id === 'p1' ? MESSAGE_LOG_P1 : Array.from({ length: 20 }, (_, i): MsgLog => ({
    num: i + 1, day: (i + 1) * 4, phase: i < 5 ? 'Activation' : i < 14 ? 'Momentum' : 'Retention Lock',
    status: (i < 3 ? 'Delivered' : 'Scheduled') as 'Delivered' | 'Queued' | 'Scheduled',
    sentAt: i < 3 ? `Day ${(i + 1) * 4} 9:00am` : undefined,
    scheduledFor: i >= 3 ? `Day ${(i + 1) * 4}` : undefined,
    body: `Message ${i + 1} — Day ${(i + 1) * 4} check-in`,
    reply: null, riskFlag: false,
  }));

  const riskData = [
    { day: 3, risk: 0 }, { day: 21, risk: 0 }, { day: 28, risk: 1 },
    { day: 35, risk: 2 }, { day: 42, risk: 2 },
  ];

  const deliveredCount = messages.filter(m => m.status === 'Delivered').length;
  const repliedCount = messages.filter(m => m.reply !== null).length;
  const replyRate = deliveredCount > 0 ? Math.round((repliedCount / deliveredCount) * 100) : 0;
  const dayPct = Math.min((patient.carePathDay / 90) * 100, 100);

  return (
    <div>
      {/* Back button */}
      <button onClick={onBack} style={{ background:'transparent', border:'none', color: C.muted, cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', gap:6, marginBottom:20, padding:0 }}>
        <ArrowLeft size={14} /> Back to patients
      </button>

      {/* Patient header */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28, background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px' }}>
        <div style={{ width:60, height:60, borderRadius:'50%', background: riskColor(patient.riskScore) + '25', border:`2px solid ${riskColor(patient.riskScore)}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:20, fontWeight:700, color: riskColor(patient.riskScore) }}>
            {patient.firstName[0]}{patient.lastInitial}
          </span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:18, fontWeight:700, color: C.text, marginBottom:6 }}>
            {patient.firstName} {patient.lastInitial}.
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:4, background:`${C.sky}20`, color: C.sky }}>{patient.language}</span>
            <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:4, background:'rgba(255,255,255,0.06)', color: C.muted }}>Day {patient.carePathDay}</span>
            <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:4, background: riskColor(patient.riskScore) + '20', color: riskColor(patient.riskScore) }}>
              Risk {patient.riskScore}/10 — {riskLabel(patient.riskScore)}
            </span>
            <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:4, background: phaseColor(patient.phase) + '30', color: phaseColor(patient.phase) }}>
              {patient.phase}
            </span>
          </div>
        </div>
        <div style={{ textAlign:'right', fontSize:12, color: C.muted }}>
          <div>Enrolled: {patient.enrollmentDate}</div>
          <div style={{ color: C.sky, marginTop:2 }}>Clinic: {CLINICS.find(c => c.id === patient.clinicId)?.name}</div>
        </div>
      </div>

      {/* 90-Day timeline */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:12, color: C.muted, marginBottom:8 }}>90-Day CarePath Progress · Day {patient.carePathDay}</div>
        <div style={{ position:'relative', height:8, background:'rgba(255,255,255,0.06)', borderRadius:4, overflow:'visible' }}>
          <div style={{ position:'absolute', left:0, width:'15.5%', height:'100%', background: C.sky, borderRadius:'4px 0 0 4px' }} />
          <div style={{ position:'absolute', left:'15.5%', width:'50%', height:'100%', background: C.navy }} />
          <div style={{ position:'absolute', left:'65.5%', right:0, height:'100%', background: C.mid, borderRadius:'0 4px 4px 0' }} />
          <div style={{ position:'absolute', top:'50%', transform:'translate(-50%,-50%)', left:`${dayPct}%`,
                        width:14, height:14, borderRadius:'50%', background:'white',
                        boxShadow:`0 0 8px ${C.sky}`, zIndex:2 }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color: C.dim, marginTop:4 }}>
          <span>Day 1</span><span>Activation</span><span>Momentum</span><span>Retention Lock</span><span>Day 90</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display:'grid', gridTemplateColumns:'60% 40%', gap:20 }}>
        {/* Message timeline */}
        <div>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:14 }}>
            Message Timeline
          </div>
          <div style={{ maxHeight:480, overflowY:'auto', paddingRight:4 }}>
            {messages.map(m => (
              <div key={m.num} style={{ marginBottom:12 }}>
                {m.status === 'Delivered' || m.status === 'Queued' ? (
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                      <div style={{ width:24, height:24, borderRadius:'50%', background: C.sky, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ fontSize:9, fontWeight:700, color:'#0a0916' }}>{m.num}</span>
                      </div>
                      <div style={{ width:1, flex:1, background: C.border, margin:'4px 0' }} />
                    </div>
                    <div style={{ flex:1, paddingBottom:8 }}>
                      <div style={{ background:'rgba(39,170,225,0.08)', border:`1px solid ${C.sky}30`, borderRadius:'4px 12px 12px 12px', padding:'10px 14px', marginBottom: m.reply ? 6 : 0 }}>
                        <div style={{ fontSize:10, color: C.sky, marginBottom:4 }}>NexaCare · {m.sentAt || m.scheduledFor}</div>
                        <div style={{ fontSize:12, color: C.text, lineHeight:1.6 }}>{m.body}</div>
                      </div>
                      {m.reply && (
                        <div style={{ background:'rgba(74,222,128,0.08)', border:`1px solid ${C.success}30`, borderRadius:'12px 12px 12px 4px', padding:'8px 14px', marginLeft:20 }}>
                          <div style={{ fontSize:10, color: C.success, marginBottom:2 }}>Patient replied · {m.replyAt}</div>
                          <div style={{ fontSize:13, fontWeight:600, color: C.success }}>{m.reply}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', border:`1px dashed ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:9, color: C.dim }}>{m.num}</span>
                    </div>
                    <div style={{ flex:1, padding:'6px 10px', border:`1px dashed ${C.border}`, borderRadius:8, fontSize:11, color: C.dim }}>
                      Scheduled · {m.scheduledFor}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div>
          {/* Risk chart (only p1) */}
          {patient.id === 'p1' && (
            <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:8 }}>Risk Score History</div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={riskData}>
                  <XAxis dataKey="day" tick={{ fontSize:10, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize:10, fill: C.muted }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={7} stroke={C.danger} strokeDasharray="3 3" />
                  <Tooltip contentStyle={{ background:'#1a1740', border:`1px solid ${C.border}`, borderRadius:8, fontSize:11 }}
                           formatter={(v: unknown) => [v as number, 'Risk Score']} />
                  <Line type="monotone" dataKey="risk" stroke={C.sky} strokeWidth={2} dot={{ fill: C.sky, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Stats */}
          <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:12 }}>Current Stats</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Messages Sent', value:`${deliveredCount} / 20` },
                { label:'Reply Rate', value:`${replyRate}%` },
                { label:'Last Reply', value: patient.lastReply ?? '—' },
                { label:'Next Msg #', value:`#${patient.nextMessageNum}` },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:18, fontWeight:700, color: C.text }}>{stat.value}</div>
                  <div style={{ fontSize:10, color: C.muted }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:8 }}>Notes</div>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, borderRadius:8, padding:'10px 12px',
                       color: C.text, fontSize:12, lineHeight:1.6, resize:'vertical', minHeight:80, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
            />
            <button style={{ marginTop:8, background: C.sky, color:'#0a0916', border:'none', borderRadius:6, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Save Note
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:`1px solid rgba(239,68,68,0.25)`, borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Mark Churned
            </button>
            <button style={{ background:'rgba(255,255,255,0.04)', color: C.muted, border:`1px solid ${C.border}`, borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Pause CarePath
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CLINIC PATIENTS TAB ──────────────────────────────────────────────────────

function ClinicPatientsTab({ clinic, onSelectPatient }: { clinic: Clinic; onSelectPatient: (p: Patient) => void }) {
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('All');

  const clinicPatients = PATIENTS.filter(p => p.clinicId === clinic.id);
  const filtered = clinicPatients.filter(p => {
    const name = `${p.firstName} ${p.lastInitial}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase());
    const matchPhase = phaseFilter === 'All' || p.phase === phaseFilter;
    return matchSearch && matchPhase;
  });

  const phases = ['All', 'Activation', 'Momentum', 'Retention Lock'];

  return (
    <div>
      <SectionHeading title="Patients" sub={`${clinicPatients.length} enrolled patients`} />

      {/* Filter row */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search patients..."
          style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 14px', color: C.text, fontSize:13, outline:'none', width:200 }}
        />
        <div style={{ display:'flex', gap:4 }}>
          {phases.map(ph => (
            <button key={ph} onClick={() => setPhaseFilter(ph)}
              style={{ background: phaseFilter === ph ? C.sky : 'transparent', color: phaseFilter === ph ? '#0a0916' : C.muted,
                       border:`1px solid ${phaseFilter === ph ? C.sky : C.border}`, borderRadius:6, padding:'6px 12px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              {ph}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {['Patient','Day','Phase','Risk Score','Last Reply','Next Message',''].map(col => (
                <th key={col} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onClick={() => onSelectPatient(p)}
                style={{ borderBottom:`1px solid ${C.border}`, cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {/* Patient */}
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background: riskColor(p.riskScore) + '20', border:`2px solid ${riskColor(p.riskScore)}`,
                                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:11, fontWeight:700, color: riskColor(p.riskScore) }}>{p.firstName[0]}{p.lastInitial}</span>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color: C.text }}>{p.firstName} {p.lastInitial}.</div>
                      <div style={{ fontSize:11, color: C.muted }}>{p.language} · {p.status}</div>
                    </div>
                  </div>
                </td>
                {/* Day */}
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ fontSize:13, fontWeight:600, color: C.text, marginBottom:4 }}>Day {p.carePathDay}</div>
                  <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, width:60 }}>
                    <div style={{ width:`${Math.min((p.carePathDay/90)*100,100)}%`, height:'100%', background: C.sky, borderRadius:2 }} />
                  </div>
                </td>
                {/* Phase */}
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:4, background: phaseColor(p.phase) + '25', color: phaseColor(p.phase) }}>
                    {p.phase}
                  </span>
                </td>
                {/* Risk */}
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background: riskColor(p.riskScore) + '20', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:11, fontWeight:700, color: riskColor(p.riskScore) }}>{p.riskScore}</span>
                    </div>
                    <span style={{ fontSize:11, color: riskColor(p.riskScore) }}>{riskLabel(p.riskScore)}</span>
                  </div>
                </td>
                {/* Last Reply */}
                <td style={{ padding:'14px 16px' }}>
                  {p.lastReply ? (
                    <div>
                      <span style={{ fontSize:13, fontWeight:600, color: C.success }}>{p.lastReply}</span>
                      <div style={{ fontSize:10, color: C.muted }}>{p.lastReplyDate}</div>
                    </div>
                  ) : (
                    <span style={{ fontSize:12, color: C.warning }}>No reply</span>
                  )}
                </td>
                {/* Next Message */}
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ fontSize:12, color: C.text }}>#{p.nextMessageNum}</div>
                  <div style={{ fontSize:10, color: C.muted }}>{p.nextMessageDate}</div>
                </td>
                {/* Action */}
                <td style={{ padding:'14px 16px' }}>
                  <button onClick={e => { e.stopPropagation(); onSelectPatient(p); }}
                    style={{ background:'transparent', border:`1px solid ${C.border}`, borderRadius:6, padding:'5px 12px', fontSize:11, color: C.muted, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                    View <ChevronRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:32, textAlign:'center', color: C.muted, fontSize:13 }}>No patients match the current filters.</div>
        )}
      </div>
    </div>
  );
}

// ─── CLINIC CAREPATH ACTIVITY TAB ─────────────────────────────────────────────

function ClinicCarePathTab({ clinic }: { clinic: Clinic }) {
  const activityBorderColor = (type: string) => {
    if (type === 'risk') return C.danger;
    if (type === 'reply') return C.success;
    return C.sky;
  };

  return (
    <div>
      <SectionHeading title="CarePath Activity" sub="Real-time message delivery and patient replies" />

      {/* Header stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Messages Today', value:'4' },
          { label:'Replies Received', value:'2' },
          { label:'Reply Rate', value:'50%' },
          { label:'Risk Flags', value:'1', accent: C.danger },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border:`1px solid ${s.accent ? s.accent + '40' : C.border}`, borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontSize:11, color: C.muted, marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:26, fontWeight:700, color: s.accent || C.text }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted }}>
          Activity Feed — {clinic.name}
        </div>
        {ACTIVITY_FEED.map((item, i) => (
          <div key={i} style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'flex-start', gap:14,
                                 borderLeft:`3px solid ${activityBorderColor(item.type)}` }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background: activityBorderColor(item.type), flexShrink:0, marginTop:5 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ fontSize:13, fontWeight:600, color: C.text }}>{item.patient}</span>
                <span style={{ fontSize:11, color: C.dim }}>{item.time}</span>
              </div>
              <div style={{ fontSize:12, color: C.muted, marginBottom: item.reply ? 6 : 0 }}>{item.msg}</div>
              {item.reply && (
                <div style={{ display:'inline-block', background:'rgba(255,255,255,0.06)', border:`1px solid ${C.border}`, borderRadius:6, padding:'3px 10px', fontSize:12, fontWeight:600, color: C.text }}>
                  Reply: {item.reply}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLINIC BILLING TAB ───────────────────────────────────────────────────────

function ClinicBillingTab({ clinic }: { clinic: Clinic }) {
  const currentInvoice = BILLING.find(b => b.clinicId === clinic.id && b.month === 'May 2026');
  const history = BILLING.filter(b => b.clinicId === clinic.id);

  return (
    <div>
      <SectionHeading title="Billing & Invoices" sub="Current invoice and payment history" />

      {/* Current invoice */}
      {currentInvoice && (
        <div style={{ background:'rgba(39,170,225,0.06)', border:`1px solid ${C.sky}40`, borderRadius:14, padding:'24px 28px', marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color: C.sky, marginBottom:6 }}>Current Invoice</div>
              <div style={{ fontSize:22, fontWeight:700, color: C.text }}>{currentInvoice.month}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:40, fontWeight:700, color: C.sky }}>${currentInvoice.amount.toLocaleString()}</div>
              <span style={{ fontSize:12, fontWeight:600, padding:'3px 10px', borderRadius:100,
                             background: currentInvoice.status === 'Paid' ? `${C.success}20` : `${C.warning}20`,
                             color: currentInvoice.status === 'Paid' ? C.success : C.warning }}>
                {currentInvoice.status}
              </span>
            </div>
          </div>
          <div style={{ display:'flex', gap:24, fontSize:13, color: C.muted }}>
            <span>{currentInvoice.patients} patients × ${currentInvoice.rate} PMPM</span>
            {currentInvoice.paidDate && <span style={{ color: C.success }}>Paid {currentInvoice.paidDate}</span>}
            <span>Next billing: {clinic.nextBillingDate}</span>
          </div>
        </div>
      )}

      {/* History table */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden', marginBottom:24 }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted }}>
          Invoice History
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {['Month','Patients','Rate','Amount','Status','Paid Date'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, color: C.muted, fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((b, i) => (
              <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                <td style={{ padding:'12px 16px', fontSize:13, color: C.text, fontWeight:600 }}>{b.month}</td>
                <td style={{ padding:'12px 16px', fontSize:13, color: C.text }}>{b.patients}</td>
                <td style={{ padding:'12px 16px', fontSize:13, color: C.text }}>${b.rate}</td>
                <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color: C.text }}>${b.amount.toLocaleString()}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:100,
                                 background: b.status === 'Paid' ? `${C.success}20` : `${C.warning}20`,
                                 color: b.status === 'Paid' ? C.success : C.warning }}>
                    {b.status}
                  </span>
                </td>
                <td style={{ padding:'12px 16px', fontSize:12, color: C.muted }}>{b.paidDate ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* What's included */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px' }}>
        <div style={{ fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:14 }}>What&apos;s Included</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {[
            'Automated 90-day CarePath messaging',
            'Multi-language SMS delivery (EN / ES / FR)',
            'Real-time risk scoring & escalation alerts',
            'Clinic portal with patient dashboard',
            'Monthly billing reports',
            'Founder-level escalation for critical patients',
            'Onboarding & technical support',
          ].map(item => (
            <div key={item} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color: C.text }}>
              <CheckCircle2 size={14} style={{ color: C.success, flexShrink:0 }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD TAB ──────────────────────────────────────────────────────

function AdminDashboardTab({ activeEscalationCount }: { activeEscalationCount: number }) {
  const mrrData = [
    { month:'Jan', mrr:0 },
    { month:'Feb', mrr:4200 },
    { month:'Mar', mrr:10800 },
    { month:'Apr', mrr:16455 },
    { month:'May', mrr:24981 },
  ];

  const topEscalations = PATIENTS.filter(p => p.riskScore >= 7).slice(0, 2);

  return (
    <div>
      <SectionHeading title="Admin Dashboard" sub="NexaCare Management · May 8, 2026" />

      {/* 6 stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginBottom:28 }}>
        <StatCard label="Total MRR" value="$24,981" delta="+$8,553 MoM" deltaUp />
        <StatCard label="Active Patients" value="271" sub="Across 3 clinics" />
        <StatCard label="Active Clinics" value="3" sub="2 active · 1 onboarding" />
        <StatCard label="Avg Churn Rate" value="4.1%" sub="Target: < 5%" />
        <StatCard label="Escalations" value={String(activeEscalationCount)} accent={C.danger} pulse />
        <StatCard label="Messages Today" value="12" sub="4 replies received" />
      </div>

      {/* MRR Chart */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px', marginBottom:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color: C.text, marginBottom:16 }}>MRR Growth</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={mrrData}>
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.sky} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.sky} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize:11, fill: C.muted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <Tooltip contentStyle={{ background:'#1a1740', border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}
                     formatter={(v: unknown) => [`$${(v as number).toLocaleString()}`, 'MRR']} />
            <Area type="monotone" dataKey="mrr" stroke={C.sky} strokeWidth={2} fill="url(#mrrGrad)" animationDuration={1000} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Clinic overview table */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden', marginBottom:24 }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted }}>
          Clinic Overview
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {['Clinic','Status','Patients','MRR','Churn','Retention','Stripe'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, color: C.muted, fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLINICS.map(c => (
              <tr key={c.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ fontSize:13, fontWeight:600, color: C.text }}>{c.name}</div>
                  <div style={{ fontSize:11, color: C.muted }}>{c.state}</div>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:100,
                                 background: c.status === 'Active' ? `${C.success}20` : `${C.sky}20`,
                                 color: c.status === 'Active' ? C.success : C.sky }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding:'12px 16px', fontSize:13, color: C.text }}>{c.activePatients}</td>
                <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color: C.sky }}>${c.mrr.toLocaleString()}</td>
                <td style={{ padding:'12px 16px', fontSize:13, color: c.churnRate > 5 ? C.danger : C.text }}>{c.churnRate}%</td>
                <td style={{ padding:'12px 16px', fontSize:13, color: C.text }}>{c.retentionRate90 !== null ? `${c.retentionRate90}%` : '—'}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:100,
                                 background: c.stripeStatus === 'Paid' ? `${C.success}20` : `${C.warning}20`,
                                 color: c.stripeStatus === 'Paid' ? C.success : C.warning }}>
                    {c.stripeStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent escalations preview */}
      {topEscalations.length > 0 && (
        <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px' }}>
          <div style={{ fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:14 }}>
            Recent Escalations
          </div>
          {topEscalations.map(p => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10, padding:'10px 14px', background:'rgba(239,68,68,0.06)', border:`1px solid rgba(239,68,68,0.2)`, borderRadius:8 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background: riskColor(p.riskScore) + '20', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <AlertTriangle size={14} style={{ color: riskColor(p.riskScore) }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color: C.text }}>{p.firstName} {p.lastInitial}. · Day {p.carePathDay}</div>
                <div style={{ fontSize:11, color: C.muted }}>{CLINICS.find(c => c.id === p.clinicId)?.name} · {p.escalationStatus}</div>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color: riskColor(p.riskScore) }}>Risk {p.riskScore}/10</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN ALL CLINICS TAB ────────────────────────────────────────────────────

function AdminClinicsTab() {
  const onboardingSteps = [
    'Clinic contract signed & Stripe billing connected',
    'Patient CSV uploaded & verified',
    'Phone numbers provisioned (770-XXX-XXXX)',
    'CarePath sequences configured & reviewed',
    'Soft launch: first 10 patients enrolled',
  ];

  return (
    <div>
      <SectionHeading title="All Clinics" sub="3 clinics under management" />

      {/* Clinic cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginBottom:32 }}>
        {CLINICS.map(c => {
          const cp = PATIENTS.filter(p => p.clinicId === c.id);
          const act = cp.filter(p => p.phase === 'Activation').length;
          const mom = cp.filter(p => p.phase === 'Momentum').length;
          const ret = cp.filter(p => p.phase === 'Retention Lock').length;
          const tot = cp.length;
          return (
            <div key={c.id} style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:4 }}>{c.name}</div>
                  <div style={{ fontSize:11, color: C.muted }}>{c.state} · {c.contact}</div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:100,
                               background: c.status === 'Active' ? `${C.success}20` : `${C.sky}20`,
                               color: c.status === 'Active' ? C.success : C.sky }}>
                  {c.status}
                </span>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  { label:'Patients', value: c.activePatients },
                  { label:'MRR', value:`$${c.mrr.toLocaleString()}` },
                  { label:'PMPM', value:`$${c.pmpmRate}` },
                  { label:'Churn', value:`${c.churnRate}%` },
                ].map(s => (
                  <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:6, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color: C.muted }}>{s.label}</div>
                    <div style={{ fontSize:15, fontWeight:700, color: C.text }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Phase mini-bar */}
              {tot > 0 && (
                <div>
                  <div style={{ fontSize:10, color: C.muted, marginBottom:4 }}>Phase distribution</div>
                  <div style={{ display:'flex', height:6, borderRadius:3, overflow:'hidden' }}>
                    {act > 0 && <div style={{ flex:act, background: C.sky }} />}
                    {mom > 0 && <div style={{ flex:mom, background: C.mid }} />}
                    {ret > 0 && <div style={{ flex:ret, background: C.navy }} />}
                  </div>
                </div>
              )}

              <div style={{ fontSize:11, color: C.muted }}>
                <span>{c.email}</span><br />
                <span>{c.phone}</span>
              </div>

              <div style={{ display:'flex', gap:8 }}>
                <button style={{ flex:1, background: C.sky, color:'#0a0916', border:'none', borderRadius:6, padding:'7px 10px', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                  View Portal
                </button>
                <button style={{ flex:1, background:'transparent', color: C.muted, border:`1px solid ${C.border}`, borderRadius:6, padding:'7px 10px', fontSize:11, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                  Invoice <ExternalLink size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Onboarding Timeline for Roswell */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px 24px' }}>
        <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:4 }}>Onboarding Timeline · Roswell Med Spa</div>
        <div style={{ fontSize:12, color: C.muted, marginBottom:20 }}>Day 10 of onboarding · Go-live: Apr 28, 2026</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {onboardingSteps.map((step, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:22, height:22, borderRadius:'50%', background:`${C.success}20`, border:`1px solid ${C.success}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <CheckCircle2 size={12} style={{ color: C.success }} />
              </div>
              <span style={{ fontSize:13, color: C.text }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN ESCALATIONS TAB ────────────────────────────────────────────────────

function AdminEscalationsTab({ resolvedEscalations, onResolve }: {
  resolvedEscalations: string[];
  onResolve: (id: string) => void;
}) {
  const escalations = PATIENTS
    .filter(p => p.riskScore >= 7 && !resolvedEscalations.includes(p.id))
    .sort((a, b) => b.riskScore - a.riskScore);

  const escalationBorder = (score: number) => {
    if (score >= 10) return C.danger;
    if (score >= 7) return C.warning;
    return '#6366f1';
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color: C.text, margin:0 }}>Escalations</h2>
        {escalations.length > 0 && (
          <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:100, background:'rgba(239,68,68,0.2)', color: C.danger }}>
            {escalations.length} active
          </span>
        )}
        <span style={{ fontSize:11, color: C.muted, marginLeft:'auto' }}>
          <Clock size={11} style={{ display:'inline', marginRight:3 }} />Auto-refreshes every 5 min
        </span>
      </div>

      {escalations.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <CheckCircle2 size={48} style={{ color: C.success, marginBottom:16 }} />
          <div style={{ fontSize:18, fontWeight:700, color: C.text, marginBottom:8 }}>No active escalations</div>
          <div style={{ fontSize:13, color: C.muted }}>All patients are on track. Great work.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {escalations.map(p => {
            const clinic = CLINICS.find(c => c.id === p.clinicId);
            const borderColor = escalationBorder(p.riskScore);
            const isCritical = p.riskScore >= 10;
            return (
              <div key={p.id} style={{
                background: C.card,
                border:`1px solid ${borderColor}40`,
                borderLeft:`4px solid ${borderColor}`,
                borderRadius:12,
                padding:'20px 24px',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:42, height:42, borderRadius:'50%', background: borderColor + '20', border:`2px solid ${borderColor}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:14, fontWeight:700, color: borderColor }}>{p.firstName[0]}{p.lastInitial}</span>
                    </div>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:15, fontWeight:700, color: C.text }}>{p.firstName} {p.lastInitial}.</span>
                        <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:4, background: borderColor + '20', color: borderColor }}>
                          {isCritical ? '🔴 CRITICAL' : '⚠ HIGH RISK'}
                        </span>
                      </div>
                      <div style={{ fontSize:12, color: C.muted, marginTop:2 }}>
                        {clinic?.name} · Day {p.carePathDay} · {p.phase}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:28, fontWeight:700, color: borderColor, lineHeight:1 }}>{p.riskScore}/10</div>
                    <div style={{ fontSize:10, color: C.muted }}>Risk Score</div>
                  </div>
                </div>

                <div style={{ fontSize:12, color: C.muted, marginBottom:10 }}>
                  <strong style={{ color: C.text }}>Trigger: </strong>{p.escalationStatus} · Last contact: {p.lastReplyDate}
                </div>

                {p.lastReply && (
                  <div style={{ background: borderColor + '10', border:`1px solid ${borderColor}30`, borderRadius:8, padding:'10px 14px', marginBottom:14 }}>
                    <div style={{ fontSize:10, color: borderColor, fontWeight:600, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Patient Reply</div>
                    <div style={{ fontSize:16, fontWeight:700, color: borderColor }}>&ldquo;{p.lastReply}&rdquo;</div>
                    <div style={{ fontSize:11, color: C.muted, marginTop:4 }}>{p.lastReplyDate} · Message #{p.nextMessageNum - 1}</div>
                  </div>
                )}

                <div style={{ fontSize:12, color: C.muted, marginBottom:16 }}>{p.notes}</div>

                <div style={{ display:'flex', gap:10 }}>
                  <button style={{ background: C.sky, color:'#0a0916', border:'none', borderRadius:7, padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    Contact Clinic
                  </button>
                  <button style={{ background:'transparent', color: C.muted, border:`1px solid ${C.border}`, borderRadius:7, padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    View Timeline
                  </button>
                  <button onClick={() => onResolve(p.id)}
                    style={{ background:'transparent', color: C.dim, border:`1px solid ${C.border}`, borderRadius:7, padding:'8px 16px', fontSize:12, fontWeight:600, cursor:'pointer', marginLeft:'auto' }}>
                    Mark Resolved
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN CAREPATH MONITOR TAB ───────────────────────────────────────────────

function AdminMonitorTab() {
  const pills = [
    { label:'Messages Today', value:'12', color: C.sky },
    { label:'Delivered', value:'12', color: C.success },
    { label:'Awaiting Reply', value:'7', color: C.warning },
    { label:'Replies', value:'4', color: C.success },
    { label:'Risk Flags', value:'1', color: C.danger },
    { label:'No-Reply Flags', value:'1', color: '#fb923c' },
  ];

  return (
    <div>
      <SectionHeading title="CarePath Monitor" sub="Today · May 8, 2026" />

      {/* Stat pills */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:24 }}>
        {pills.map(p => (
          <div key={p.label} style={{ background: C.card, border:`1px solid ${p.color}30`, borderRadius:8, padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background: p.color }} />
            <span style={{ fontSize:11, color: C.muted }}>{p.label}</span>
            <span style={{ fontSize:16, fontWeight:700, color: p.color }}>{p.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
        {/* Message table */}
        <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted }}>
            Today&apos;s Messages
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['Time','Patient','Clinic','Msg','Phase','Delivery','Reply','Flag'].map(h => (
                  <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:10, color: C.muted, fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TODAY_MESSAGES.map((m, i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, background: m.flag ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                  <td style={{ padding:'10px 12px', fontSize:11, color: C.muted }}>{m.time}</td>
                  <td style={{ padding:'10px 12px', fontSize:12, fontWeight:600, color: C.text }}>{m.patient}</td>
                  <td style={{ padding:'10px 12px', fontSize:11, color: C.muted }}>{m.clinic}</td>
                  <td style={{ padding:'10px 12px', fontSize:11, color: C.sky }}>#{m.msgNum}</td>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ fontSize:10, fontWeight:600, padding:'2px 6px', borderRadius:3, background: phaseColor(m.phase) + '25', color: phaseColor(m.phase) }}>
                      {m.phase.split(' ')[0]}
                    </span>
                  </td>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ fontSize:11, color: C.success }}>{m.delivery}</span>
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:12, fontWeight:600, color: m.reply ? C.success : C.dim }}>
                    {m.reply ?? '—'}
                  </td>
                  <td style={{ padding:'10px 12px', textAlign:'center' }}>
                    {m.flag && <AlertTriangle size={12} style={{ color: C.danger }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right stats */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px' }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:14 }}>Overall Stats</div>
            {[
              { label:'Total Patients', value:'271' },
              { label:'Messages All-Time', value:'1,847' },
              { label:'Reply Rate', value:'68%' },
              { label:'Avg Risk Score', value:'2.3' },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:12, color: C.muted }}>{s.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color: C.text }}>{s.value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px' }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:14 }}>Phase Distribution</div>
            {[
              { phase:'Activation', pct:18, color: C.sky },
              { phase:'Momentum', pct:58, color: C.mid },
              { phase:'Retention Lock', pct:24, color: C.navy },
            ].map(p => (
              <div key={p.phase} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color: C.muted, marginBottom:4 }}>
                  <span>{p.phase}</span>
                  <span style={{ color: p.color }}>{p.pct}%</span>
                </div>
                <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3 }}>
                  <div style={{ width:`${p.pct}%`, height:'100%', background: p.color, borderRadius:3 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'18px' }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted, marginBottom:14 }}>Risk Distribution</div>
            {[
              { label:'On Track (0-3)', count:5, color: C.success },
              { label:'Monitor (4-6)', count:1, color: C.warning },
              { label:'High Risk (7-9)', count:1, color: '#fb923c' },
              { label:'Critical (10)', count:1, color: C.danger },
            ].map(r => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:11, color: C.muted }}>{r.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color: r.color }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN BILLING TAB ────────────────────────────────────────────────────────

function AdminBillingTab() {
  const totalMrr = CLINICS.reduce((s, c) => s + c.mrr, 0);
  const paidThisMonth = BILLING.filter(b => b.month === 'May 2026' && b.status === 'Paid').reduce((s, b) => s + b.amount, 0);
  const pending = BILLING.filter(b => b.status === 'Draft').reduce((s, b) => s + b.amount, 0);

  const clinicMrrData = CLINICS.map(c => ({
    name: c.name.split(' ').slice(0, 2).join(' '),
    mrr: c.mrr,
  }));

  return (
    <div>
      <SectionHeading title="Billing" sub="May 2026 billing cycle" />

      {/* Summary row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:28 }}>
        <StatCard label="Total MRR" value={`$${totalMrr.toLocaleString()}`} />
        <StatCard label="Collected May" value={`$${paidThisMonth.toLocaleString()}`} />
        <StatCard label="Pending" value={`$${pending.toLocaleString()}`} accent={C.warning} />
        <StatCard label="Active Invoices" value="3" sub="2 paid · 1 draft" />
      </div>

      {/* Bar chart */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px', marginBottom:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color: C.text, marginBottom:16 }}>MRR by Clinic</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={clinicMrrData} layout="vertical">
            <XAxis type="number" tick={{ fontSize:11, fill: C.muted }} axisLine={false} tickLine={false}
                   tickFormatter={(v: number) => `$${v.toLocaleString()}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill: C.muted }} axisLine={false} tickLine={false} width={120} />
            <Tooltip contentStyle={{ background:'#1a1740', border:`1px solid ${C.border}`, borderRadius:8, fontSize:12 }}
                     formatter={(v: unknown) => [`$${(v as number).toLocaleString()}`, 'MRR']} />
            <Bar dataKey="mrr" fill={C.sky} radius={[0, 4, 4, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Billing events table */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden', marginBottom:24 }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: C.muted }}>
          All Billing Events
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {['Clinic','Month','Patients','Rate','Amount','Status','Paid Date',''].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, color: C.muted, fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BILLING.map((b, i) => {
              const clinic = CLINICS.find(c => c.id === b.clinicId);
              return (
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:'12px 16px', fontSize:13, color: C.text, fontWeight:600 }}>{clinic?.name.split(' ').slice(0,2).join(' ')}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, color: C.text }}>{b.month}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, color: C.text }}>{b.patients}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, color: C.text }}>${b.rate}</td>
                  <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color: C.sky }}>${b.amount.toLocaleString()}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:100,
                                   background: b.status === 'Paid' ? `${C.success}20` : `${C.warning}20`,
                                   color: b.status === 'Paid' ? C.success : C.warning }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:12, color: C.muted }}>{b.paidDate ?? '—'}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <button style={{ background:'transparent', border:`1px solid ${C.border}`, borderRadius:6, padding:'4px 10px', fontSize:11, color: C.muted, cursor:'pointer' }}>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Billing health */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px' }}>
        <div style={{ fontSize:14, fontWeight:600, color: C.text, marginBottom:12 }}>Billing Health</div>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {[
            { label:'Collection Rate', value:'86.6%', color: C.success },
            { label:'Avg Invoice Size', value:`$${Math.round(totalMrr/3).toLocaleString()}`, color: C.sky },
            { label:'MoM Growth', value:'+34%', color: C.success },
            { label:'Next Billing', value:'Jun 1, 2026', color: C.text },
          ].map(s => (
            <div key={s.label} style={{ flex:1, minWidth:120, background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'12px 14px' }}>
              <div style={{ fontSize:10, color: C.muted, marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:18, fontWeight:700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PIPELINE TAB ───────────────────────────────────────────────────────

function AdminPipelineTab() {
  const stageColor = (stage: string) => {
    if (stage === 'Won') return C.success;
    if (stage === 'SQL') return C.sky;
    if (stage === 'MQL') return C.warning;
    return C.muted;
  };

  return (
    <div>
      <SectionHeading title="Pipeline" sub="Inbound leads and outbound outreach" />

      {/* Lead cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:32 }}>
        {PIPELINE_LEADS.map(lead => (
          <div key={lead.id} style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color: C.text, marginBottom:3 }}>{lead.clinicName}</div>
                <div style={{ fontSize:12, color: C.muted }}>{lead.contact}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100, background: stageColor(lead.stage) + '20', color: stageColor(lead.stage) }}>
                {lead.stage}
              </span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
              {[
                { label:'State', value: lead.state },
                { label:'Volume', value: lead.volume },
                { label:'Source', value: lead.source },
                { label:'Submitted', value: lead.submittedAt.split(' · ')[0] },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize:10, color: C.dim }}>{s.label}</div>
                  <div style={{ fontSize:12, color: C.muted, fontWeight:500 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {lead.utmCampaign && (
              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:6, padding:'6px 10px', marginBottom:10, fontSize:11, color: C.dim }}>
                UTM: {lead.utmCampaign}
              </div>
            )}

            <div style={{ fontSize:12, color: C.muted, marginBottom:14, lineHeight:1.5 }}>{lead.notes}</div>

            <div style={{ display:'flex', gap:8 }}>
              <button style={{ background: C.sky, color:'#0a0916', border:'none', borderRadius:6, padding:'7px 14px', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                Send Demo Link
              </button>
              <button style={{ background:'transparent', color: C.muted, border:`1px solid ${C.border}`, borderRadius:6, padding:'7px 14px', fontSize:11, fontWeight:600, cursor:'pointer' }}>
                Update Stage
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline velocity */}
      <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px' }}>
        <div style={{ fontSize:14, fontWeight:600, color: C.text, marginBottom:16 }}>Pipeline Velocity</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:20 }}>
          {[
            { label:'Leads', value:4 },
            { label:'MQL', value:1 },
            { label:'SQL', value:2 },
            { label:'Won', value:3 },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:700, color: [C.muted, C.warning, C.sky, C.success][i] }}>{s.value}</div>
              <div style={{ fontSize:11, color: C.dim }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color: C.muted, marginBottom:6 }}>
            <span>Patient capacity fill rate</span>
            <span style={{ color: C.sky }}>271 / 500 patients (54%)</span>
          </div>
          <div style={{ height:10, background:'rgba(255,255,255,0.06)', borderRadius:5 }}>
            <div style={{ width:'54%', height:'100%', background: `linear-gradient(90deg, ${C.navy}, ${C.sky})`, borderRadius:5 }} />
          </div>
          <div style={{ fontSize:11, color: C.dim, marginTop:4 }}>Target: 500 patients by end of Q3 2026</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

// ─── ADMIN GATE MODAL ────────────────────────────────────────────────────────

function AdminGate({
  onSuccess, onCancel,
}: { onSuccess: () => void; onCancel: () => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    const secret = process.env.NEXT_PUBLIC_PORTAL_ADMIN_KEY ?? '';
    if (secret && input === secret) {
      // Remember in sessionStorage so the gate doesn't re-fire this session
      sessionStorage.setItem('nxc_admin_unlocked', '1');
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10,9,22,0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#111827',
        border: '1px solid rgba(39,170,225,0.2)',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%', maxWidth: 380,
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        transform: shake ? 'translateX(0)' : undefined,
        animation: shake ? 'gateShake 0.45s ease' : undefined,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(39,170,225,0.12)',
            border: '1px solid rgba(39,170,225,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 20,
          }}>🔐</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 6 }}>
            Admin Access
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
            This portal view is restricted.<br />Enter the admin password to continue.
          </p>
        </div>

        <input
          type="password"
          placeholder="Password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 8,
            fontSize: 14, color: 'white',
            outline: 'none',
            marginBottom: 8,
            fontFamily: 'monospace',
          }}
        />
        {error && (
          <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>
            Incorrect password. Try again.
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px 0',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, cursor: 'pointer',
            fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)',
          }}>
            Cancel
          </button>
          <button onClick={attempt} style={{
            flex: 2, padding: '11px 0',
            background: '#27AAE1', border: 'none',
            borderRadius: 8, cursor: 'pointer',
            fontSize: 13, fontWeight: 700, color: '#0a0916',
          }}>
            Unlock Admin →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes gateShake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function PortalDemo() {
  const [view, setView] = useState<'clinic' | 'admin'>('clinic');
  const [activeClinic, setActiveClinic] = useState<Clinic>(CLINICS[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [resolvedEscalations, setResolvedEscalations] = useState<string[]>([]);
  const [fading, setFading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAdminGate, setShowAdminGate] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const doSwitchView = (newView: 'clinic' | 'admin') => {
    setFading(true);
    setTimeout(() => {
      setView(newView);
      setActiveTab(newView === 'clinic' ? 'overview' : 'dashboard');
      setActivePatient(null);
      setFading(false);
    }, 150);
  };

  const switchView = (newView: 'clinic' | 'admin') => {
    if (newView === 'admin') {
      // Already unlocked this session?
      if (typeof window !== 'undefined' &&
          sessionStorage.getItem('nxc_admin_unlocked') === '1') {
        doSwitchView('admin');
      } else {
        setShowAdminGate(true);
      }
    } else {
      doSwitchView('clinic');
    }
  };

  const switchTab = (tab: string) => {
    setFading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setActivePatient(null);
      setFading(false);
    }, 100);
  };

  const handleResolve = (id: string) => {
    setResolvedEscalations(prev => [...prev, id]);
  };

  const activeEscalationCount = PATIENTS.filter(
    p => p.riskScore >= 7 && !resolvedEscalations.includes(p.id)
  ).length;

  const clinicTabs = [
    { id:'overview', label:'Overview', Icon: LayoutDashboard, badge: 0 },
    { id:'patients', label:'Patients', Icon: Users, badge: 0 },
    { id:'carepath', label:'CarePath Activity', Icon: MessageSquare, badge: 0 },
    { id:'billing', label:'Billing & Invoices', Icon: CreditCard, badge: 0 },
  ];

  const adminTabs = [
    { id:'dashboard', label:'Dashboard', Icon: LayoutDashboard, badge: 0 },
    { id:'clinics', label:'All Clinics', Icon: Building2, badge: 0 },
    { id:'escalations', label:'Escalations', Icon: AlertTriangle, badge: activeEscalationCount },
    { id:'monitor', label:'CarePath Monitor', Icon: Activity, badge: 0 },
    { id:'adminbilling', label:'Billing', Icon: Receipt, badge: 0 },
    { id:'pipeline', label:'Pipeline', Icon: TrendingUp, badge: 0 },
  ];

  const currentTabs = view === 'clinic' ? clinicTabs : adminTabs;

  const renderContent = () => {
    if (view === 'clinic') {
      if (activeTab === 'overview') return <ClinicOverviewTab clinic={activeClinic} />;
      if (activeTab === 'patients') {
        if (activePatient) return <PatientDetail patient={activePatient} onBack={() => setActivePatient(null)} />;
        return <ClinicPatientsTab clinic={activeClinic} onSelectPatient={setActivePatient} />;
      }
      if (activeTab === 'carepath') return <ClinicCarePathTab clinic={activeClinic} />;
      if (activeTab === 'billing') return <ClinicBillingTab clinic={activeClinic} />;
    } else {
      if (activeTab === 'dashboard') return <AdminDashboardTab activeEscalationCount={activeEscalationCount} />;
      if (activeTab === 'clinics') return <AdminClinicsTab />;
      if (activeTab === 'escalations') return <AdminEscalationsTab resolvedEscalations={resolvedEscalations} onResolve={handleResolve} />;
      if (activeTab === 'monitor') return <AdminMonitorTab />;
      if (activeTab === 'adminbilling') return <AdminBillingTab />;
      if (activeTab === 'pipeline') return <AdminPipelineTab />;
    }
    return null;
  };

  return (
    <>
      {/* Pulse keyframe injected inline */}
      <style>{`
        @keyframes nexaPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background: C.bg }}>
        {/* Demo header */}
        <DemoHeader />

        {/* Portal shell */}
        <div style={{ display:'flex', flex:1, position:'relative', minHeight:'calc(100vh - 340px)' }}>

          {/* TopBar */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:'56px',
            background: C.topbar, borderBottom:`1px solid ${C.border}`,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 20px', zIndex:50,
          }}>
            {/* Left */}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Image src="/images/logo/logo_SOURCE_icononly_transparent.png" alt="NexaCare" width={24} height={27}
                     style={{ height:24, width:'auto' }} />
              <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.8)' }}>CarePath Platform</span>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', padding:'3px 8px', borderRadius:4,
                             background:'rgba(251,146,60,0.15)', color:'#fb923c' }}>
                DEMO · SYNTHETIC DATA
              </span>
            </div>

            {/* Center - view switcher */}
            <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.06)', borderRadius:8, padding:3 }}>
              {(['clinic','admin'] as const).map(v => (
                <button key={v} onClick={() => switchView(v)}
                  style={{
                    padding:'6px 16px', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
                    background: view === v ? C.sky : 'transparent',
                    color: view === v ? C.topbar : 'rgba(255,255,255,0.4)',
                    transition:'all 0.2s',
                  }}>
                  {v === 'clinic' ? '🏥 Clinic Portal' : '⚙ Admin Portal'}
                </button>
              ))}
            </div>

            {/* Right */}
            <div style={{ fontSize:11, color: C.muted, textAlign:'right' }}>
              <span style={{ color: C.dim }}>Logged in as: </span>
              {view === 'clinic'
                ? `${activeClinic.name} · Clinic Admin`
                : 'jordan@nexacaremanagement.com · NexaCare Admin'}
            </div>
          </div>

          {/* Sidebar + content */}
          <div style={{ display:'flex', flex:1, marginTop:'56px' }}>

            {/* Sidebar (desktop) */}
            {!isMobile && (
              <div style={{ width:220, background: C.topbar, borderRight:`1px solid ${C.border}`, padding:'16px 12px', flexShrink:0, overflowY:'auto' }}>

                {/* Clinic selector for clinic view */}
                {view === 'clinic' && (
                  <>
                    <div style={{ marginBottom:16, padding:'10px 12px', background:'rgba(255,255,255,0.04)', borderRadius:8 }}>
                      <div style={{ fontSize:11, color: C.muted, marginBottom:4 }}>Active Clinic</div>
                      <div style={{ fontSize:13, fontWeight:600, color: C.text }}>{activeClinic.name}</div>
                      <div style={{ fontSize:11, color: C.sky }}>{activeClinic.state} · {activeClinic.status}</div>
                    </div>
                    <div style={{ marginBottom:12 }}>
                      {CLINICS.map(c => (
                        <button key={c.id} onClick={() => { setActiveClinic(c); switchTab('overview'); }}
                          style={{
                            width:'100%', textAlign:'left', background: activeClinic.id === c.id ? 'rgba(39,170,225,0.08)' : 'transparent',
                            border:'none', borderRadius:6, padding:'6px 10px', cursor:'pointer', marginBottom:2,
                            color: activeClinic.id === c.id ? C.sky : C.dim, fontSize:11,
                          }}>
                          {c.name.split(' ').slice(0, 2).join(' ')} {c.status === 'Onboarding' ? '(Onboarding)' : ''}
                        </button>
                      ))}
                    </div>
                    <div style={{ height:1, background: C.border, marginBottom:12 }} />
                  </>
                )}

                {/* Tabs */}
                {currentTabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  const badgeCount = tab.badge;
                  return (
                    <button key={tab.id} onClick={() => switchTab(tab.id)}
                      style={{
                        width:'100%', textAlign:'left', border:'none', cursor:'pointer', borderRadius:6,
                        padding:'9px 12px', marginBottom:2, display:'flex', alignItems:'center', gap:9,
                        background: isActive ? 'rgba(39,170,225,0.12)' : 'transparent',
                        color: isActive ? C.sky : 'rgba(255,255,255,0.45)',
                        borderLeft: isActive ? `2px solid ${C.sky}` : '2px solid transparent',
                        marginLeft:'-2px',
                        transition:'all 0.15s',
                        fontSize:13, fontWeight: isActive ? 600 : 400,
                      }}>
                      <tab.Icon size={15} />
                      <span style={{ flex:1 }}>{tab.label}</span>
                      {badgeCount > 0 && (
                        <span style={{ fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:100, background:'rgba(239,68,68,0.3)', color: C.danger, animation:'nexaPulse 2s infinite' }}>
                          {badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main content */}
            <main style={{
              flex:1,
              overflow:'auto',
              padding: isMobile ? '20px 16px 80px' : '28px',
              background: C.surface,
              opacity: fading ? 0 : 1,
              transition:'opacity 0.15s ease,transform 0.15s ease',
              transform: fading ? 'translateY(4px)' : 'translateY(0)',
            }}>
              {renderContent()}
            </main>
          </div>

          {/* Mobile bottom tab bar */}
          {isMobile && (
            <div style={{
              position:'absolute', bottom:0, left:0, right:0, height:'60px',
              background: C.topbar, borderTop:`1px solid ${C.border}`,
              display:'flex', overflowX:'auto', zIndex:40,
            }}>
              {currentTabs.map(tab => {
                const isActive = activeTab === tab.id;
                const badgeCount = tab.badge;
                return (
                  <button key={tab.id} onClick={() => switchTab(tab.id)}
                    style={{
                      flex:1, minWidth:60, border:'none', cursor:'pointer', background:'transparent',
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3,
                      color: isActive ? C.sky : 'rgba(255,255,255,0.35)',
                      borderTop: isActive ? `2px solid ${C.sky}` : '2px solid transparent',
                      position:'relative',
                      padding:'6px 4px',
                    }}>
                    <tab.Icon size={16} />
                    <span style={{ fontSize:9, fontWeight:600 }}>{tab.label.split(' ')[0]}</span>
                    {badgeCount > 0 && (
                      <div style={{ position:'absolute', top:6, right:'50%', marginRight:-18, width:14, height:14, borderRadius:'50%', background: C.danger, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontSize:8, fontWeight:700, color:'white' }}>{badgeCount}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <DemoCTA />
      </div>

      {/* Admin password gate */}
      {showAdminGate && (
        <AdminGate
          onSuccess={() => {
            setShowAdminGate(false);
            doSwitchView('admin');
          }}
          onCancel={() => setShowAdminGate(false)}
        />
      )}
    </>
  );
}
