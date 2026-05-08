"use client";
import { useEffect, useState } from "react";

// Placeholder data — not real clients

export default function DashboardPreview() {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidth(38);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const clinics = [
    {
      name: "Alpharetta Weight & Wellness",
      sub: "148 active patients · Since Feb 2026",
      status: "Active",
      active: true,
    },
    {
      name: "Buckhead Primary Care",
      sub: "92 active patients · Since Mar 2026",
      status: "Active",
      active: true,
    },
    {
      name: "Roswell Med Spa",
      sub: "Onboarding · Week 2",
      status: "Onboarding",
      active: false,
    },
  ];

  const stats = [
    { lbl: "MRR",            val: "$34.8K", delta: "↑ +12% MoM",  up: true  },
    { lbl: "Churn Rate",     val: "4.1%",   delta: "↓ −2.3pp",    up: false },
    { lbl: "Active Patients",val: "240",    delta: "↑ +38 this mo",up: true  },
  ];

  const phases = ["Activation", "Momentum", "Retention Lock"];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "18px",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(39,170,225,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(38,34,98,0.6)",
          borderBottom: "1px solid rgba(39,170,225,0.15)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.04em",
          }}
        >
          Clinic Operations Dashboard · Live
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "10px",
            fontWeight: 600,
            color: "#4ade80",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4ade80",
              animation: "pulseDot 2s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          Active
        </div>
      </div>

      {/* Clinic rows */}
      <div style={{ padding: "6px 0" }}>
        {clinics.map((clinic, i) => (
          <div
            key={i}
            style={{
              padding: "14px 20px",
              borderBottom:
                i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "3px",
                }}
              >
                {clinic.name}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {clinic.sub}
              </div>
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                padding: "3px 9px",
                borderRadius: "20px",
                background: clinic.active
                  ? "rgba(74,222,128,0.12)"
                  : "rgba(251,191,36,0.12)",
                color: clinic.active ? "#4ade80" : "#fbbf24",
                border: clinic.active
                  ? "1px solid rgba(74,222,128,0.25)"
                  : "1px solid rgba(251,191,36,0.25)",
              }}
            >
              {clinic.status}
            </span>
          </div>
        ))}
      </div>

      {/* CarePath strip */}
      <div
        style={{
          margin: "0 20px 16px",
          background: "rgba(38,34,98,0.4)",
          border: "1px solid rgba(39,170,225,0.12)",
          borderRadius: "10px",
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#27AAE1",
            marginBottom: "8px",
          }}
        >
          CarePath · Cohort 3 · Day 34 of 90
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "3px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "2px",
            marginBottom: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${barWidth}%`,
              background: "linear-gradient(90deg, #27AAE1, #264E8B)",
              borderRadius: "2px",
              transition: "width 2.5s ease-out",
            }}
          />
        </div>

        {/* Phase pills */}
        <div style={{ display: "flex", gap: "6px" }}>
          {phases.map((phase, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textAlign: "center",
                padding: "4px 8px",
                borderRadius: "4px",
                color: i === 1 ? "#27AAE1" : "rgba(255,255,255,0.3)",
                background:
                  i === 1
                    ? "rgba(39,170,225,0.1)"
                    : "rgba(255,255,255,0.04)",
                border:
                  i === 1 ? "1px solid rgba(39,170,225,0.2)" : "none",
              }}
            >
              {phase}
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderTop: "1px solid rgba(39,170,225,0.12)",
          background: "rgba(39,170,225,0.04)",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "16px 20px",
              borderRight:
                i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "3px",
              }}
            >
              {stat.lbl}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "18px",
                fontWeight: 500,
                color: "white",
                marginBottom: "4px",
              }}
            >
              {stat.val}
            </div>
            <div
              style={{
                fontSize: "10px",
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                color: stat.up ? "#4ade80" : "#27AAE1",
              }}
            >
              {stat.delta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
