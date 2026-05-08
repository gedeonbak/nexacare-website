"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { MESSAGES, type Language } from "@/lib/carepath-messages";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function interpolate(text: string, firstName: string, clinicName: string) {
  return text
    .replace(/\{firstName\}/g, firstName || "Sarah")
    .replace(/\{clinicName\}/g, clinicName || "Your Clinic");
}

function getRiskScore(idx: number) {
  if (idx >= 14) return 0;
  if (idx >= 10) return 7;
  return 0;
}

function getPhaseProgress(idx: number) {
  const p1 = Math.min(100, ((Math.min(idx, 5) + 1) / 6) * 100);
  const p2 = idx < 6 ? 0 : Math.min(100, ((Math.min(idx - 6, 5) + 1) / 6) * 100);
  const p3 = idx < 12 ? 0 : Math.min(100, ((Math.min(idx - 12, 7) + 1) / 8) * 100);
  return { p1, p2, p3 };
}

function riskColor(score: number) {
  if (score <= 3) return "#22c55e";
  if (score <= 6) return "#f59e0b";
  if (score <= 9) return "#f97316";
  return "#ef4444";
}

function riskLabel(score: number) {
  if (score <= 3) return "On track";
  if (score <= 6) return "Monitor";
  if (score <= 9) return "At risk";
  return "URGENT";
}

function statusBg(type: string) {
  if (type === "success") return "rgba(34,197,94,0.08)";
  if (type === "warning") return "rgba(245,158,11,0.1)";
  return "rgba(39,170,225,0.08)";
}

function statusBorder(type: string) {
  if (type === "success") return "rgba(34,197,94,0.25)";
  if (type === "warning") return "rgba(245,158,11,0.3)";
  return "rgba(39,170,225,0.2)";
}

function statusColor(type: string) {
  if (type === "success") return "#166534";
  if (type === "warning") return "#92400e";
  return "#0369a1";
}

const PHASE_META = [
  { num: 1, label: "Activation", days: "Days 1–14", msgs: "Msgs 1–6", color: "#27AAE1" },
  { num: 2, label: "Momentum", days: "Days 15–60", msgs: "Msgs 7–12", color: "#262262" },
  { num: 3, label: "Retention Lock", days: "Days 61–90", msgs: "Msgs 13–20", color: "#4f8ec9" },
];

const LANG_LABELS: Record<Language, string> = { en: "English", es: "Español", fr: "Français" };

// ─── Component ───────────────────────────────────────────────────────────────

export default function CarePathDemo() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clinicName, setClinicName] = useState("Alpharetta Weight & Wellness");
  const [patientName, setPatientName] = useState("Sarah");
  const [language, setLanguage] = useState<Language>("en");
  const [displayRisk, setDisplayRisk] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const riskScore = getRiskScore(currentIdx);
  const progress = getPhaseProgress(currentIdx);
  const currentMsg = MESSAGES[currentIdx];
  const isComplete = currentIdx === 19;
  const activePhase = currentMsg.phase;
  const repliesReceived = MESSAGES.slice(0, currentIdx + 1).filter((m) => m.reply).length;
  const daysRemaining = 90 - currentMsg.day;

  // Animate risk counter
  useEffect(() => {
    if (displayRisk === riskScore) return;
    const dir = displayRisk < riskScore ? 1 : -1;
    const t = setTimeout(() => setDisplayRisk((d) => d + dir), 55);
    return () => clearTimeout(t);
  }, [displayRisk, riskScore]);

  // Auto-scroll phone to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentIdx]);

  // Scroll timeline to keep active day in view
  useEffect(() => {
    const el = timelineRef.current?.querySelector(`[data-idx="${currentIdx}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [currentIdx]);

  // Playback
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setCurrentIdx((prev) => {
        if (prev >= 19) return 19;
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    if (currentIdx >= 19 && isPlaying) setIsPlaying(false);
  }, [currentIdx, isPlaying]);

  const go = useCallback((idx: number) => {
    setIsPlaying(false);
    setCurrentIdx(Math.max(0, Math.min(19, idx)));
  }, []);

  return (
    <main className="pt-16" style={{ backgroundColor: "#f8f7f5", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes completePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.3); }
          50%       { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .msg-bubble { animation: fadeUp 0.3s ease both; }
        .risk-bar-fill { transition: width 0.6s cubic-bezier(0.4,0,0.2,1), background-color 0.4s ease; }
        .phase-bar-fill { transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      {/* Confetti on completion */}
      {isComplete &&
        Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              position: "fixed",
              left: `${5 + i * 5.5}%`,
              top: "-12px",
              width: 8,
              height: 8,
              borderRadius: i % 2 === 0 ? "50%" : "2px",
              background:
                i % 3 === 0 ? "#27AAE1" : i % 3 === 1 ? "#262262" : "#22c55e",
              animation: `confettiFall ${1.5 + (i % 5) * 0.4}s ease-in ${(i % 6) * 0.15}s forwards`,
              pointerEvents: "none",
              zIndex: 999,
            }}
          />
        ))}

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="eyebrow">LIVE DEMO</p>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(39,170,225,0.12)", color: "#27AAE1" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#27AAE1", animation: "pulse 2s infinite" }}
              />
              INTERACTIVE
            </span>
          </div>
          <h1
            className="mb-4"
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#0f0e1a",
            }}
          >
            CarePath in action.
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.75, color: "#555", marginBottom: "24px" }}>
            See exactly what your patients receive — and how NexaCare responds when they need
            support. Click any day or press Play to watch the full 90-day sequence.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "20 messages", color: "#27AAE1" },
              { label: "90 days", color: "#262262" },
              { label: "3 languages", color: "#d97706" },
            ].map((pill) => (
              <span
                key={pill.label}
                className="text-[12px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.05)", color: pill.color }}
              >
                {pill.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Demo area ──────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 mb-8">

            {/* ── LEFT PANEL ── */}
            <div className="space-y-4">

              {/* Phase tracker */}
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <p
                  className="text-[11px] font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#9ca3af" }}
                >
                  Phase Progress
                </p>
                <div className="space-y-4">
                  {PHASE_META.map((ph) => {
                    const pct = ph.num === 1 ? progress.p1 : ph.num === 2 ? progress.p2 : progress.p3;
                    const isActive = activePhase === ph.num;
                    return (
                      <div key={ph.num}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: isActive ? ph.color : "rgba(0,0,0,0.04)",
                                color: isActive ? "#fff" : "#9ca3af",
                              }}
                            >
                              Phase {ph.num}
                            </span>
                            <span
                              className="text-[13px] font-semibold"
                              style={{ color: isActive ? "#0f0e1a" : "#9ca3af" }}
                            >
                              {ph.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px]" style={{ color: "#9ca3af" }}>
                              {ph.days}
                            </span>
                            <span
                              className="text-[12px] font-bold tabular-nums"
                              style={{ color: isActive ? ph.color : "#9ca3af" }}
                            >
                              {Math.round(pct)}%
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            height: 6,
                            borderRadius: 4,
                            backgroundColor: "rgba(0,0,0,0.06)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="phase-bar-fill"
                            style={{
                              height: "100%",
                              width: `${pct}%`,
                              backgroundColor: ph.color,
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats row */}
              <div
                className="grid grid-cols-3 gap-3"
              >
                {[
                  { value: currentIdx + 1, label: "Messages sent", suffix: "/20" },
                  { value: repliesReceived, label: "Replies received", suffix: "" },
                  { value: Math.max(0, daysRemaining), label: "Days remaining", suffix: "" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-4 text-center"
                    style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.07)" }}
                  >
                    <p
                      className="text-[24px] font-bold tabular-nums"
                      style={{ color: "#262262", fontFamily: "var(--font-plus-jakarta-sans)" }}
                    >
                      {s.value}
                      <span className="text-[14px] font-normal" style={{ color: "#9ca3af" }}>
                        {s.suffix}
                      </span>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Risk meter */}
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <p
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "#9ca3af" }}
                  >
                    Patient Risk Score
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-[32px] font-black tabular-nums leading-none"
                      style={{
                        color: riskColor(displayRisk),
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        transition: "color 0.3s",
                      }}
                    >
                      {displayRisk}
                    </span>
                    <span className="text-[14px]" style={{ color: "#9ca3af" }}>
                      /10
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div
                  style={{
                    height: 10,
                    borderRadius: 6,
                    backgroundColor: "rgba(0,0,0,0.06)",
                    overflow: "hidden",
                    marginBottom: 10,
                  }}
                >
                  <div
                    className="risk-bar-fill"
                    style={{
                      height: "100%",
                      width: `${riskScore * 10}%`,
                      backgroundColor: riskColor(riskScore),
                      borderRadius: 6,
                    }}
                  />
                </div>

                {/* Tick labels */}
                <div className="flex justify-between mb-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <span
                      key={n}
                      className="text-[9px]"
                      style={{ color: n <= riskScore ? riskColor(riskScore) : "#d1d5db" }}
                    >
                      {n}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: riskColor(riskScore) }}
                  >
                    {riskLabel(riskScore)}
                  </span>
                  <span className="text-[11px]" style={{ color: "#9ca3af" }}>
                    0–3 on track · 4–6 monitor · 7+ at risk
                  </span>
                </div>
              </div>

              {/* Context explanation */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: "rgba(39,170,225,0.05)",
                  border: "1px solid rgba(39,170,225,0.18)",
                }}
              >
                <p
                  className="text-[11px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#27AAE1" }}
                >
                  What CarePath is doing
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: "#374151" }}>
                  {currentMsg.explanation}
                </p>
              </div>

              {/* Status message */}
              {currentMsg.statusMessage && (
                <div
                  key={currentIdx}
                  className="msg-bubble rounded-xl p-5"
                  style={{
                    backgroundColor: statusBg(currentMsg.statusMessage.type),
                    border: `1px solid ${statusBorder(currentMsg.statusMessage.type)}`,
                  }}
                >
                  <p
                    className="text-[13px] font-semibold leading-relaxed"
                    style={{ color: statusColor(currentMsg.statusMessage.type) }}
                  >
                    {currentMsg.statusMessage.text}
                  </p>
                </div>
              )}

              {/* Completion banner */}
              {isComplete && (
                <div
                  className="msg-bubble rounded-xl p-6 text-center"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.06)",
                    border: "1.5px solid rgba(34,197,94,0.3)",
                    animation: "completePulse 2s ease infinite",
                  }}
                >
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-[15px] font-bold" style={{ color: "#166534" }}>
                    90-day program complete
                  </p>
                  <p className="text-[13px] mt-1" style={{ color: "#166534" }}>
                    Patient retained · Clinic handoff scheduled
                  </p>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN — Phone Mockup ── */}
            <div className="flex justify-center lg:justify-end items-start">
              <div
                style={{
                  width: "100%",
                  maxWidth: 320,
                  backgroundColor: "#1a1a2e",
                  borderRadius: 40,
                  padding: "10px 10px 16px",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                  border: "2px solid #2e2e4a",
                }}
              >
                {/* Screen */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 32,
                    overflow: "hidden",
                    height: 580,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Status bar */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 18px 6px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#0f0e1a",
                      flexShrink: 0,
                    }}
                  >
                    <span>9:41</span>
                    <span style={{ fontSize: 12 }}>●●● ▂▄▆ 🔋</span>
                  </div>

                  {/* Contact header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 14px 10px",
                      borderBottom: "1px solid rgba(0,0,0,0.07)",
                      flexShrink: 0,
                    }}
                  >
                    {/* Back arrow */}
                    <span style={{ fontSize: 16, color: "#27AAE1", marginRight: 2 }}>‹</span>
                    {/* Avatar */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "#262262",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      NC
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#0f0e1a", lineHeight: 1.2 }}>
                        NexaCare · {clinicName.length > 22 ? clinicName.slice(0, 22) + "…" : clinicName}
                      </p>
                      <p style={{ fontSize: 11, color: "#9ca3af" }}>GLP-1 Program</p>
                    </div>
                  </div>

                  {/* Message thread */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "12px 10px",
                      backgroundColor: "#f7f8fc",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    {MESSAGES.slice(0, currentIdx + 1).map((msg, i) => {
                      const isNew = i === currentIdx;
                      const text = interpolate(msg.text[language], patientName, clinicName);
                      const hasReply = !!msg.reply;
                      const hasAutomated = !!msg.reply?.automated;

                      return (
                        <div
                          key={i}
                          className={isNew ? "msg-bubble" : ""}
                          style={{ marginBottom: 12 }}
                        >
                          {/* Day label */}
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: 10,
                              color: "#9ca3af",
                              fontWeight: 600,
                              marginBottom: 6,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            Day {msg.day}
                          </div>

                          {/* NexaCare bubble */}
                          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: hasReply ? 6 : 0 }}>
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                backgroundColor: "#262262",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 7,
                                fontWeight: 700,
                                color: "#fff",
                                flexShrink: 0,
                                marginBottom: 2,
                              }}
                            >
                              NC
                            </div>
                            <div
                              style={{
                                backgroundColor: "#27AAE1",
                                color: "#fff",
                                borderRadius: "18px 18px 18px 4px",
                                padding: "9px 12px",
                                maxWidth: "82%",
                                fontSize: 12,
                                lineHeight: 1.5,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {text}
                            </div>
                          </div>

                          {/* Patient reply */}
                          {hasReply && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: hasAutomated ? 6 : 0,
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: "#3a3a4a",
                                  color: "#fff",
                                  borderRadius: "18px 18px 4px 18px",
                                  padding: "9px 12px",
                                  maxWidth: "58%",
                                  fontSize: 12,
                                  lineHeight: 1.4,
                                }}
                              >
                                {msg.reply!.text}
                              </div>
                            </div>
                          )}

                          {/* Automated NexaCare response */}
                          {hasAutomated && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: 6,
                              }}
                            >
                              <div
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: "50%",
                                  backgroundColor: "#262262",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 7,
                                  fontWeight: 700,
                                  color: "#fff",
                                  flexShrink: 0,
                                  marginBottom: 2,
                                }}
                              >
                                NC
                              </div>
                              <div
                                style={{
                                  backgroundColor: "#1d8bc7",
                                  color: "#fff",
                                  borderRadius: "18px 18px 18px 4px",
                                  padding: "9px 12px",
                                  maxWidth: "82%",
                                  fontSize: 12,
                                  lineHeight: 1.5,
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                  borderLeft: "3px solid rgba(255,255,255,0.3)",
                                }}
                              >
                                {interpolate(msg.reply!.automated![language], patientName, clinicName)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Decorative input bar */}
                  <div
                    style={{
                      padding: "8px 12px",
                      borderTop: "1px solid rgba(0,0,0,0.07)",
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        backgroundColor: "#f3f4f6",
                        borderRadius: 20,
                        padding: "7px 14px",
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      {language === "es" ? "Mensaje…" : language === "fr" ? "Message…" : "Message…"}
                    </div>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: "#27AAE1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      ↑
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTROLS ── */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ backgroundColor: "#ffffff", border: "1px solid rgba(0,0,0,0.07)" }}
          >
            {/* Inputs row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
              <div>
                <label
                  className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: "#9ca3af" }}
                >
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                  style={{
                    border: "1px solid rgba(0,0,0,0.12)",
                    outline: "none",
                    fontFamily: "var(--font-plus-jakarta-sans)",
                    color: "#0f0e1a",
                    backgroundColor: "#fff",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: "#9ca3af" }}
                >
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                  style={{
                    border: "1px solid rgba(0,0,0,0.12)",
                    outline: "none",
                    fontFamily: "var(--font-plus-jakarta-sans)",
                    color: "#0f0e1a",
                    backgroundColor: "#fff",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wider"
                  style={{ color: "#9ca3af" }}
                >
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full text-[13px] px-3 py-2.5 rounded-lg"
                  style={{
                    border: "1px solid rgba(0,0,0,0.12)",
                    outline: "none",
                    fontFamily: "var(--font-plus-jakarta-sans)",
                    color: "#0f0e1a",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {(Object.entries(LANG_LABELS) as [Language, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timeline scrubber */}
            <div className="mb-6">
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "#9ca3af" }}
              >
                Message Timeline — click any day to jump
              </p>
              <div
                ref={timelineRef}
                style={{ overflowX: "auto", paddingBottom: 8 }}
              >
                <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
                  {MESSAGES.map((msg, i) => {
                    const isActive = i === currentIdx;
                    const isPast = i < currentIdx;
                    const phaseColor =
                      msg.phase === 1 ? "#27AAE1" : msg.phase === 2 ? "#262262" : "#4f8ec9";
                    return (
                      <button
                        key={i}
                        data-idx={i}
                        onClick={() => go(i)}
                        className="flex flex-col items-center gap-1 transition-all duration-150"
                        style={{ outline: "none" }}
                      >
                        <div
                          style={{
                            width: 46,
                            padding: "5px 4px",
                            borderRadius: 8,
                            backgroundColor: isActive
                              ? phaseColor
                              : isPast
                              ? "rgba(0,0,0,0.06)"
                              : "#f3f4f6",
                            color: isActive ? "#fff" : isPast ? "#6b7280" : "#9ca3af",
                            fontSize: 11,
                            fontWeight: isActive ? 700 : 500,
                            textAlign: "center",
                            border: `1.5px solid ${isActive ? phaseColor : "transparent"}`,
                            transform: isActive ? "scale(1.08)" : "scale(1)",
                            transition: "all 0.15s ease",
                          }}
                        >
                          Day
                          <br />
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{msg.day}</span>
                        </div>
                        {/* Phase dot */}
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: isActive || isPast ? phaseColor : "#e5e7eb",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => go(currentIdx - 1)}
                disabled={currentIdx === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.12)",
                  color: currentIdx === 0 ? "#d1d5db" : "#374151",
                  backgroundColor: "#fff",
                  cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronLeft size={15} strokeWidth={2} />
                Previous
              </button>

              <button
                onClick={() => {
                  if (isComplete) {
                    setCurrentIdx(0);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying((p) => !p);
                  }
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#262262", minWidth: 140 }}
              >
                {isPlaying ? (
                  <><Pause size={15} strokeWidth={2} /> Pause</>
                ) : isComplete ? (
                  <><Play size={15} strokeWidth={2} /> Replay</>
                ) : (
                  <><Play size={15} strokeWidth={2} /> Play sequence</>
                )}
              </button>

              <button
                onClick={() => go(currentIdx + 1)}
                disabled={currentIdx === 19}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all"
                style={{
                  border: "1.5px solid rgba(0,0,0,0.12)",
                  color: currentIdx === 19 ? "#d1d5db" : "#374151",
                  backgroundColor: "#fff",
                  cursor: currentIdx === 19 ? "not-allowed" : "pointer",
                }}
              >
                Next
                <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>

            {/* Progress label */}
            <p className="text-center text-[12px] mt-4" style={{ color: "#9ca3af" }}>
              Message {currentIdx + 1} of 20 · Day {currentMsg.day} · Phase {activePhase} — {PHASE_META[activePhase - 1].label}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ─────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl p-10 text-center text-white"
            style={{ backgroundColor: "#262262" }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              READY TO DEPLOY
            </p>
            <h2
              className="text-[24px] font-bold mb-3"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              Ready to deploy CarePath for your clinic?
            </h2>
            <p
              className="text-[14px] mb-7 max-w-md mx-auto"
              style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}
            >
              Book a 15-minute call and we'll walk through your specific patient volume and
              retention goals. First 5 clinics get subsidized pilot pricing.
            </p>
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center px-7 py-3 text-[14px] font-semibold rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#27AAE1", color: "#ffffff" }}
            >
              Book a Demo →
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  );
}
