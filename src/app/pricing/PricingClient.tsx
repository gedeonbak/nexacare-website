"use client";

import Link from "next/link";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const included = [
  "CarePath SMS engagement (90-day, 20 messages)",
  "Subscription billing management",
  "HIPAA infrastructure (AWS HIPAA-eligible stack)",
  "Pharmacy coordination",
  "Clinic analytics portal",
  "Compliance documentation",
  "Dedicated onboarding support",
];

const tiers = [
  {
    label: "83 patients",
    sublabel: "Breakeven",
    revenue: "$7,221",
    cogs: "($2,166)",
    gross: "$5,055",
    fixed: "($3,000)",
    net: "$2,055",
    highlight: false,
  },
  {
    label: "300 patients",
    sublabel: "Month 6 target",
    revenue: "$26,100",
    cogs: "($7,830)",
    gross: "$18,270",
    fixed: "($3,000)",
    net: "$15,270",
    highlight: false,
  },
  {
    label: "500 patients",
    sublabel: "Series A milestone",
    revenue: "$43,500",
    cogs: "($13,050)",
    gross: "$30,450",
    fixed: "($3,000)",
    net: "$27,450",
    highlight: true,
  },
];

function fireCtaEvent(label: string) {
  if (window.gtag) {
    window.gtag("event", "cta_click", {
      event_category: "pricing_page",
      event_label: label,
      page_location: window.location.href,
    });
  }
}

export default function PricingClient() {
  return (
    <>
      {/* Main pricing card */}
      <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl p-10 text-white text-center"
            style={{ backgroundColor: "#262262" }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              BASE PRICING
            </p>
            <div className="mb-2">
              <span
                style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "80px",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                $75–$99
              </span>
            </div>
            <p
              className="text-[16px] mb-2"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              per active patient per month
            </p>
            <p
              className="text-[14px] mb-8 max-w-sm mx-auto"
              style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}
            >
              Base case: $87 PMPM — approximately 22% of your clinic&apos;s
              $399 average patient charge
            </p>

            <div
              className="my-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
            />

            <div className="text-left mb-8">
              <p
                className="text-[12px] font-semibold uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                What&apos;s included
              </p>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[14px]">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(39,170,225,0.2)" }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4l2 2 3-3"
                          stroke="#27AAE1"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/book-demo"
              onClick={() => fireCtaEvent("book_demo_pricing")}
              className="inline-flex items-center justify-center w-full py-3.5 text-[15px] font-semibold rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#27AAE1", color: "#ffffff" }}
            >
              Book a Demo to discuss your clinic&apos;s volume →
            </Link>
          </div>
        </div>
      </section>

      {/* Economics table */}
      <section className="py-24" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">CLINIC ECONOMICS</p>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f0e1a",
              }}
            >
              The numbers at scale
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
              Monthly P&amp;L model for your clinic at 3 patient thresholds.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
            <table className="w-full min-w-[500px]">
              <thead>
                <tr style={{ backgroundColor: "#ffffff" }}>
                  <th
                    className="text-left px-6 py-4 text-[12px] font-semibold"
                    style={{ color: "#9ca3af", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    &nbsp;
                  </th>
                  {tiers.map((tier) => (
                    <th
                      key={tier.label}
                      className="px-6 py-4 text-center"
                      style={{
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        backgroundColor: tier.highlight ? "#262262" : "#ffffff",
                      }}
                    >
                      <p
                        className="text-[15px] font-bold"
                        style={{ color: tier.highlight ? "#ffffff" : "#0f0e1a" }}
                      >
                        {tier.label}
                      </p>
                      <p
                        className="text-[11px] font-medium mt-0.5"
                        style={{ color: tier.highlight ? "#27AAE1" : "#9ca3af" }}
                      >
                        {tier.sublabel}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    { label: "Monthly Revenue", key: "revenue" as const, bold: true },
                    { label: "COGS (NexaCare fee)", key: "cogs" as const, bold: false },
                    { label: "Gross Profit", key: "gross" as const, bold: true },
                    { label: "Clinic fixed costs (est.)", key: "fixed" as const, bold: false },
                    { label: "Net to clinic", key: "net" as const, bold: true },
                  ] as const
                ).map((row, i) => (
                  <tr
                    key={row.label}
                    style={{ backgroundColor: i % 2 === 0 ? "#f8f7f5" : "#ffffff" }}
                  >
                    <td
                      className="px-6 py-4 text-[13px]"
                      style={{
                        color: row.bold ? "#0f0e1a" : "#555",
                        fontWeight: row.bold ? 600 : 400,
                        borderTop: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      {row.label}
                    </td>
                    {tiers.map((tier) => (
                      <td
                        key={tier.label}
                        className="px-6 py-4 text-center text-[14px] tabular-nums"
                        style={{
                          color: tier.highlight
                            ? row.bold ? "#ffffff" : "rgba(255,255,255,0.7)"
                            : row.bold ? "#0f0e1a" : "#555",
                          fontWeight: row.bold ? 600 : 400,
                          backgroundColor: tier.highlight
                            ? i % 2 === 0 ? "#262262" : "#2d2872"
                            : "transparent",
                          borderTop: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        {tier[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-[12px] mt-4" style={{ color: "#9ca3af" }}>
            Based on $87 PMPM blended rate · Assumes $399 avg patient charge ·
            Fixed costs vary by clinic
          </p>
        </div>
      </section>

      {/* Retention math callout */}
      <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="p-8 rounded-xl"
            style={{
              backgroundColor: "rgba(39,170,225,0.06)",
              border: "1px solid rgba(39,170,225,0.2)",
            }}
          >
            <h3
              className="text-[18px] font-semibold mb-3"
              style={{ color: "#0f0e1a" }}
            >
              The retention math
            </h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "#555" }}>
              Every 1% improvement in monthly churn at 500 patients ={" "}
              <strong style={{ color: "#262262" }}>$4,350/month</strong> in
              protected MRR. CarePath is designed to move 8% monthly churn
              toward 4–5%.
            </p>
          </div>
        </div>
      </section>

      {/* Pilot callout */}
      <section className="py-16" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-2xl p-10 text-center text-white"
            style={{ backgroundColor: "#262262" }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              PILOT PROGRAM
            </p>
            <h3
              className="text-[24px] font-bold mb-3"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              First 5 clinics get subsidized pricing
            </h3>
            <p
              className="text-[14px] mb-7 max-w-md mx-auto"
              style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}
            >
              Pilot partners receive reduced onboarding fees in exchange for
              case study participation. Limited spots available in GA, FL, and
              TX.
            </p>
            <Link
              href="/book-demo"
              onClick={() => fireCtaEvent("apply_pilot_pricing")}
              className="inline-flex items-center justify-center px-7 py-3 text-[14px] font-semibold rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#27AAE1", color: "#ffffff" }}
            >
              Apply for the pilot →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
