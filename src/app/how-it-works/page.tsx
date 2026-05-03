import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How NexaCare Works — GLP-1 MSO Model Explained",
  description:
    "Learn how NexaCare's Management Services Organization structure handles every non-clinical function of your clinic's GLP-1 program.",
  openGraph: {
    title: "How NexaCare Works — GLP-1 MSO Model Explained",
    description:
      "Learn how NexaCare's Management Services Organization structure handles every non-clinical function of your clinic's GLP-1 program.",
  },
};

const onboardingDays = [
  {
    day: "Day 1",
    title: "MSA executed",
    detail: "Legal clearance confirmed for your state",
  },
  {
    day: "Day 2",
    title: "HIPAA infrastructure active",
    detail: "Clinic added to platform · BAA signed",
  },
  {
    day: "Day 3",
    title: "CarePath configured",
    detail: "Intake form white-labeled with your brand",
  },
  {
    day: "Day 4",
    title: "Clinic portal access granted",
    detail: "Dashboard populated · First patient batch configured",
  },
  {
    day: "Day 5",
    title: "Go-live",
    detail: "First patients enrolled · CarePath automated sequences begin",
  },
];

const faqs = [
  {
    q: "Do you employ our physicians?",
    a: "No. NexaCare is non-clinical by design. We never employ physicians in a clinical capacity, direct prescribing decisions, or set treatment protocols.",
  },
  {
    q: "Which states do you operate in?",
    a: "Currently GA, FL, TX, and AZ. We conduct a state-specific CPOM analysis before entering any new market.",
  },
  {
    q: "How does billing work?",
    a: "NexaCare invoices your clinic monthly based on active patient count at $75–$99 per patient per month. You invoice patients directly under your brand.",
  },
  {
    q: "What is CarePath?",
    a: "A 90-day SMS engagement system — 20 messages across activation, momentum, and retention phases. Non-clinical, risk-trigger-enabled, available in English, Spanish, and French.",
  },
  {
    q: "How long is the contract?",
    a: "MSAs are typically 12-month initial terms with renewal options. Pilot clinic agreements are 6 months.",
  },
  {
    q: "What if a patient has a clinical question?",
    a: "CarePath acknowledges and escalates to your clinical team. We never advise, diagnose, or recommend changes to treatment.",
  },
];

const patientJourney = [
  {
    step: "Inquiry arrives",
    nexaCare: "Intake form captures name, contact, consent, language preference",
    clinic: "—",
  },
  {
    step: "Patient enrolled",
    nexaCare: "CarePath sequence begins — Day 1 welcome message sent",
    clinic: "Provider reviews patient intake",
  },
  {
    step: "Days 1–14",
    nexaCare: "Activation phase: 4 structured messages, check-ins, education",
    clinic: "Initial consultation and prescription",
  },
  {
    step: "Days 15–60",
    nexaCare: "Momentum phase: weekly check-ins, adherence tracking, plateau support",
    clinic: "Follow-up appointments as clinically indicated",
  },
  {
    step: "Days 61–90",
    nexaCare: "Retention lock: renewal priming, churn-risk detection, Day 90 close",
    clinic: "30-day clinical check-in",
  },
  {
    step: "Renewal",
    nexaCare: "Billing cycle continues — PMPM invoice issued to clinic",
    clinic: "Patient continues on program",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="pt-16">
      {/* Page Header */}
      <section
        className="py-24"
        style={{ backgroundColor: "#f8f7f5" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="eyebrow mb-4">THE MSO MODEL</p>
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
            How NexaCare works with your clinic
          </h1>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.75,
              color: "#555",
            }}
          >
            A Management Services Organization provides non-clinical operational
            services to licensed healthcare practices under a formal Management
            Services Agreement. Here&apos;s exactly what that means for your
            GLP-1 program.
          </p>
        </div>
      </section>

      {/* Section 1 — Legal structure */}
      <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow mb-3">THE LEGAL STRUCTURE</p>
              <h2
                className="mb-5"
                style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "clamp(26px, 3vw, 36px)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "#0f0e1a",
                }}
              >
                What an MSO does — and what it never does
              </h2>
              <div className="space-y-4">
                <div>
                  <h3
                    className="text-[15px] font-semibold mb-2"
                    style={{ color: "#0f0e1a" }}
                  >
                    What NexaCare handles
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Billing, invoicing, and payment reconciliation",
                      "CarePath patient engagement (SMS — non-clinical)",
                      "HIPAA-compliant data infrastructure",
                      "Pharmacy coordination and refill logistics",
                      "Compliance documentation and state clearance",
                      "Clinic analytics and performance dashboards",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[14px]"
                        style={{ color: "#555" }}
                      >
                        <span
                          className="mt-1.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "#22c55e" }}
                          />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <h3
                    className="text-[15px] font-semibold mb-2"
                    style={{ color: "#0f0e1a" }}
                  >
                    What NexaCare never does
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Practice medicine or make clinical recommendations",
                      "Issue prescriptions or control prescribing",
                      "Employ physicians in a clinical capacity",
                      "Set clinical protocols or treatment pathways",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[14px]"
                        style={{ color: "#555" }}
                      >
                        <span
                          className="mt-1.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "#ef4444" }}
                          />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Diagram */}
            <div className="flex flex-col items-center gap-4">
              {/* Partner Clinic box */}
              <div
                className="w-full max-w-sm rounded-xl p-6 text-center"
                style={{
                  border: "1.5px solid rgba(38,34,98,0.2)",
                  backgroundColor: "rgba(38,34,98,0.03)",
                }}
              >
                <p
                  className="text-[13px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#262262" }}
                >
                  Partner Clinic
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Medical decisions", "Prescribing", "Clinical care"].map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: "rgba(38,34,98,0.08)", color: "#262262" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow + label */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-px h-6"
                  style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                />
                <span
                  className="text-[11px] font-semibold px-3 py-1 rounded-full border"
                  style={{
                    color: "#264E8B",
                    borderColor: "#264E8B",
                    backgroundColor: "rgba(38,78,139,0.06)",
                  }}
                >
                  MSA Contract
                </span>
                <div
                  className="w-px h-6"
                  style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                />
              </div>

              {/* NexaCare box */}
              <div
                className="w-full max-w-sm rounded-xl p-6 text-center"
                style={{
                  border: "1.5px solid rgba(39,170,225,0.3)",
                  backgroundColor: "rgba(39,170,225,0.05)",
                }}
              >
                <p
                  className="text-[13px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#27AAE1" }}
                >
                  NexaCare Management
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Billing", "CarePath", "Compliance", "Analytics", "Pharmacy"].map(
                    (t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: "rgba(39,170,225,0.1)",
                          color: "#27AAE1",
                        }}
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — 5-day onboarding */}
      <section className="py-24" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">ONBOARDING</p>
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
              Live in 5 business days.
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
              From MSA execution to first patient enrolled in under a week.
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute left-[19px] top-4 bottom-4 w-0.5 hidden sm:block"
              style={{ backgroundColor: "rgba(38,34,98,0.12)" }}
            />
            <div className="space-y-6">
              {onboardingDays.map((item, i) => (
                <div key={item.day} className="flex gap-5 relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 z-10"
                    style={{
                      backgroundColor: i === 4 ? "#27AAE1" : "#262262",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="flex-1 p-5 rounded-xl"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-[11px] font-bold uppercase tracking-widest"
                        style={{ color: "#27AAE1" }}
                      >
                        {item.day}
                      </span>
                      <span
                        className="text-[15px] font-semibold"
                        style={{ color: "#0f0e1a" }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[13px]" style={{ color: "#777" }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Patient journey */}
      <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">PATIENT JOURNEY</p>
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
              What happens to your patients
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
              From first inquiry to Day 90 and renewal — who handles what.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ backgroundColor: "#262262" }}>
                  <th
                    className="text-left px-5 py-4 text-[12px] font-semibold text-white"
                    style={{ width: "25%" }}
                  >
                    Stage
                  </th>
                  <th className="text-left px-5 py-4 text-[12px] font-semibold" style={{ color: "#27AAE1", width: "45%" }}>
                    NexaCare handles
                  </th>
                  <th className="text-left px-5 py-4 text-[12px] font-semibold text-white" style={{ width: "30%" }}>
                    Your clinic handles
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientJourney.map((row, i) => (
                  <tr
                    key={row.step}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8f7f5",
                      borderTop: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <td
                      className="px-5 py-4 text-[13px] font-semibold"
                      style={{ color: "#262262" }}
                    >
                      {row.step}
                    </td>
                    <td className="px-5 py-4 text-[13px]" style={{ color: "#555" }}>
                      {row.nexaCare}
                    </td>
                    <td className="px-5 py-4 text-[13px]" style={{ color: "#777" }}>
                      {row.clinic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 4 — FAQ */}
      <section className="py-24" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">FAQ</p>
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
              Common questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="p-6 rounded-xl"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <h3
                  className="text-[15px] font-semibold mb-2"
                  style={{ color: "#0f0e1a" }}
                >
                  {faq.q}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "#555" }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#262262",
                borderRadius: "8px",
                padding: "12px 28px",
              }}
            >
              Book a 15-min intro call →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
