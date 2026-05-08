import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HIPAA & CPOM Compliance — NexaCare Management",
  description:
    "NexaCare's full legal and compliance architecture. HIPAA infrastructure, state CPOM clearance, MSO/CPOM counsel engaged from day one.",
  openGraph: {
    title: "HIPAA & CPOM Compliance — NexaCare Management",
    description:
      "NexaCare's full legal and compliance architecture. HIPAA infrastructure, state CPOM clearance, MSO/CPOM counsel engaged from day one.",
  },
};

const stateTable = [
  {
    state: "Georgia",
    cpom: "Clear",
    permissible: "Yes",
    status: "PRIMARY MARKET",
    statusColor: "#22c55e",
    statusBg: "rgba(34,197,94,0.1)",
  },
  {
    state: "Florida",
    cpom: "Clear",
    permissible: "Yes",
    status: "PRIMARY MARKET",
    statusColor: "#22c55e",
    statusBg: "rgba(34,197,94,0.1)",
  },
  {
    state: "Texas",
    cpom: "Clear",
    permissible: "Yes",
    status: "PRIMARY MARKET",
    statusColor: "#22c55e",
    statusBg: "rgba(34,197,94,0.1)",
  },
  {
    state: "Arizona",
    cpom: "Clear",
    permissible: "Yes",
    status: "PRIMARY MARKET",
    statusColor: "#22c55e",
    statusBg: "rgba(34,197,94,0.1)",
  },
  {
    state: "California",
    cpom: "SB 351 Active",
    permissible: "Restricted",
    status: "AVOID",
    statusColor: "#ef4444",
    statusBg: "rgba(239,68,68,0.1)",
  },
  {
    state: "Oregon",
    cpom: "SB 951 Active",
    permissible: "Restricted",
    status: "AVOID",
    statusColor: "#ef4444",
    statusBg: "rgba(239,68,68,0.1)",
  },
];

export default function CompliancePage() {
  return (
    <main className="pt-16">
      {/* Page Header */}
      <section className="py-24" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="eyebrow mb-4">COMPLIANCE ARCHITECTURE</p>
          <h1
            className="mb-5"
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#0f0e1a",
            }}
          >
            Compliance is a product feature, not an afterthought.
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
            The MSO structure requires precise execution. NexaCare&apos;s legal
            and compliance architecture is designed from day one — reviewed by
            healthcare counsel specializing in MSO/CPOM law across GA, FL, TX,
            and AZ.
          </p>
        </div>
      </section>

      {/* Section 1 — What we do / never do */}
      <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What we DO */}
            <div
              className="p-8 rounded-xl"
              style={{
                backgroundColor: "rgba(34,197,94,0.04)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(34,197,94,0.15)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2
                  className="text-[16px] font-bold"
                  style={{ color: "#166534" }}
                >
                  What NexaCare DOES
                </h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Provide admin, technology, and support services under MSA",
                  "Operate CarePath patient engagement (non-clinical only)",
                  "Handle subscription billing and pharmacy coordination",
                  "Maintain HIPAA compliance documentation",
                  "Provide BAAs to all technology vendors",
                  "Conduct state CPOM review before each market entry",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13px]"
                    style={{ color: "#374151" }}
                  >
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: "#22c55e" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What we NEVER DO */}
            <div
              className="p-8 rounded-xl"
              style={{
                backgroundColor: "rgba(239,68,68,0.03)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M3 3l6 6M9 3l-6 6"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h2
                  className="text-[16px] font-bold"
                  style={{ color: "#991b1b" }}
                >
                  What NexaCare NEVER DOES
                </h2>
              </div>
              <ul className="space-y-3">
                {[
                  "Practice medicine or make clinical recommendations",
                  "Issue prescriptions or control prescribing",
                  "Employ physicians in a clinical capacity",
                  "Set clinical protocols or treatment pathways",
                  "Process data requiring clinical licensure",
                  "Operate as a telehealth platform",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13px]"
                    style={{ color: "#374151" }}
                  >
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: "#ef4444" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Three pillars */}
      <section className="py-24" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">COMPLIANCE PILLARS</p>
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
              Three priorities, built in from day one
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                accent: "#22c55e",
                accentBg: "rgba(34,197,94,0.08)",
                label: "LEGAL",
                title: "Healthcare Counsel",
                desc: "MSO/CPOM specialist engaged for TX, FL, GA before pilot launch. $25–40K initial engagement + $2K/month retainer covering all state expansions.",
                details: [
                  "CPOM analysis per state",
                  "MSA review and drafting",
                  "Ongoing regulatory monitoring",
                ],
              },
              {
                accent: "#27AAE1",
                accentBg: "rgba(39,170,225,0.08)",
                label: "INFRASTRUCTURE",
                title: "HIPAA Infrastructure",
                desc: "AWS HIPAA-eligible stack with BAA executed before any patient data touches the platform. Compliancy Group software active.",
                details: ["S3, RDS, EC2, CloudWatch", "Secrets Manager", "BAA with all vendors"],
              },
              {
                accent: "#d97706",
                accentBg: "rgba(217,119,6,0.08)",
                label: "REGULATORY",
                title: "FTC Monitoring",
                desc: "GLP-1 telehealth has drawn FTC regulatory attention. Healthcare counsel monitors guidance and adjusts MSA terms and marketing copy accordingly.",
                details: [
                  "FTC guidance tracking",
                  "Marketing copy review",
                  "MSA term adjustments",
                ],
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="p-7 rounded-xl"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderTop: `3px solid ${pillar.accent}`,
                }}
              >
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4"
                  style={{ backgroundColor: pillar.accentBg, color: pillar.accent }}
                >
                  {pillar.label}
                </span>
                <h3
                  className="text-[18px] font-semibold mb-3"
                  style={{ color: "#0f0e1a" }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed mb-4"
                  style={{ color: "#555" }}
                >
                  {pillar.desc}
                </p>
                <ul className="space-y-2">
                  {pillar.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-[12px]"
                      style={{ color: "#777" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: pillar.accent }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — CPOM state table */}
      <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">STATE CPOM STATUS</p>
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
              Where NexaCare operates
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
              We conduct state-specific CPOM review before every market entry.
              Current clearance status:
            </p>
          </div>

          <div
            className="overflow-x-auto rounded-xl"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <table className="w-full min-w-[500px]">
              <thead>
                <tr style={{ backgroundColor: "#262262" }}>
                  {["State", "CPOM Status", "MSO Permissible", "NexaCare Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-4 text-[12px] font-semibold text-white"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {stateTable.map((row, i) => (
                  <tr
                    key={row.state}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8f7f5",
                      borderTop: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <td
                      className="px-5 py-4 text-[14px] font-semibold"
                      style={{ color: "#0f0e1a" }}
                    >
                      {row.state}
                    </td>
                    <td className="px-5 py-4 text-[13px]" style={{ color: "#555" }}>
                      {row.cpom}
                    </td>
                    <td className="px-5 py-4 text-[13px]" style={{ color: "#555" }}>
                      {row.permissible}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{
                          color: row.statusColor,
                          backgroundColor: row.statusBg,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h3
            className="text-[22px] font-bold mb-3"
            style={{ color: "#0f0e1a" }}
          >
            Questions about our compliance structure?
          </h3>
          <p className="text-[15px] mb-6" style={{ color: "#555" }}>
            We&apos;re happy to share our MSA template, CPOM analysis, and BAA
            documentation during the demo call.
          </p>
          <Link
            href="/book-demo"
            className="inline-flex items-center justify-center text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#262262",
              borderRadius: "8px",
              padding: "12px 28px",
            }}
          >
            Book a Demo →
          </Link>
        </div>
      </section>
    </main>
  );
}
