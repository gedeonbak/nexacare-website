import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import {
  MessageSquare,
  CreditCard,
  ShieldCheck,
  Pill,
  BarChart3,
  UserPlus,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "NexaCare Management — GLP-1 MSO Infrastructure for Independent Clinics",
  description:
    "Full-stack operational infrastructure for GLP-1 weight loss programs. HIPAA-compliant, non-clinical, built for med spas and primary care in GA, FL, TX.",
  openGraph: {
    title:
      "NexaCare Management — GLP-1 MSO Infrastructure for Independent Clinics",
    description:
      "Full-stack operational infrastructure for GLP-1 weight loss programs. HIPAA-compliant, non-clinical, built for med spas and primary care in GA, FL, TX.",
  },
};

const featureCards = [
  {
    icon: (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:bg-[#27AAE1]/20"
        style={{ backgroundColor: "rgba(39,170,225,0.1)" }}
      >
        <MessageSquare className="w-6 h-6" strokeWidth={1.5} style={{ color: "#27AAE1" }} />
      </div>
    ),
    title: "CarePath SMS Engine",
    desc: "90-day patient engagement system. 20 structured messages across activation, momentum, and retention phases. Risk-trigger escalation. English, Spanish, and French.",
    tag: "Retention → 85%+",
  },
  {
    icon: (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:bg-[#262262]/12"
        style={{ backgroundColor: "rgba(38,34,98,0.08)" }}
      >
        <CreditCard className="w-6 h-6" strokeWidth={1.5} style={{ color: "#262262" }} />
      </div>
    ),
    title: "Subscription Billing",
    desc: "PMPM invoicing via Stripe, monthly reconciliation, failed-payment retry logic, and clinic billing dashboards. Zero billing headcount required.",
    tag: "$0 billing overhead",
  },
  {
    icon: (
      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-5 transition-colors group-hover:bg-green-100">
        <ShieldCheck className="w-6 h-6 text-green-600" strokeWidth={1.5} />
      </div>
    ),
    title: "HIPAA & Compliance",
    desc: "HIPAA-eligible AWS infrastructure, BAAs with every vendor, CPOM-reviewed MSA, state-by-state legal clearance before every market entry.",
    tag: "Legal risk: mitigated",
  },
  {
    icon: (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:bg-[#27AAE1]/20"
        style={{ backgroundColor: "rgba(39,170,225,0.1)" }}
      >
        <Pill className="w-6 h-6" strokeWidth={1.5} style={{ color: "#27AAE1" }} />
      </div>
    ),
    title: "Pharmacy Coordination",
    desc: "Pharmacy partner relationships, refill coordination, and supply chain monitoring. Patients receive medication without clinic staff involvement.",
    tag: "White-label ready",
  },
  {
    icon: (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:bg-[#262262]/12"
        style={{ backgroundColor: "rgba(38,34,98,0.08)" }}
      >
        <BarChart3 className="w-6 h-6" strokeWidth={1.5} style={{ color: "#262262" }} />
      </div>
    ),
    title: "Clinic Analytics",
    desc: "Retention rates, churn risk scores by patient, revenue-per-clinic dashboards, and CarePath progress tracking — all visible in a white-label portal.",
    tag: "Real-time data",
  },
  {
    icon: (
      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-5 transition-colors group-hover:bg-green-100">
        <UserPlus className="w-6 h-6 text-green-600" strokeWidth={1.5} />
      </div>
    ),
    title: "Patient Acquisition",
    desc: "Intake flow design, Typeform integration, consent capture, and onboarding automation. From inquiry to enrolled patient in under 24 hours.",
    tag: "< 24hr onboarding",
  },
];

const steps = [
  {
    num: "01",
    title: "You sign an MSA",
    desc: "A Management Services Agreement establishes the scope. NexaCare handles operations. Your clinic retains full clinical authority.",
    active: false,
  },
  {
    num: "02",
    title: "We onboard your program",
    desc: "HIPAA infrastructure, billing setup, CarePath configuration, and clinic portal access. Live within 5 business days of MSA execution.",
    active: false,
  },
  {
    num: "03",
    title: "Patients enroll",
    desc: "Your branded intake form captures consent, language preference, and contact details. NexaCare's automation handles everything from there.",
    active: false,
  },
  {
    num: "04",
    title: "Revenue compounds",
    desc: "Every retained patient = recurring PMPM. CarePath targets 85%+ 90-day retention. The longer patients stay, the more the math works in your favor.",
    active: true,
  },
];

export default function Home() {
  return (
    <>
      <AnnouncementBar />

      {/* HERO */}
      <section
        className="relative pt-32 pb-24 overflow-hidden"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left — 60% */}
            <div className="lg:col-span-3">
              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span
                  className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(39,170,225,0.1)",
                    color: "#27AAE1",
                  }}
                >
                  GLP-1 MSO Infrastructure · Georgia · Florida · Texas
                </span>
              </div>

              {/* H1 */}
              <h1
                className="mb-6"
                style={{
                  fontFamily: "var(--font-playfair-display)",
                  fontSize: "clamp(38px, 5vw, 56px)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  color: "#0f0e1a",
                }}
              >
                Your clinic&apos;s GLP-1 program.
                <br />
                <span style={{ color: "#262262" }}>Our operational stack.</span>
              </h1>

              {/* Lead */}
              <p
                className="mb-8 max-w-xl"
                style={{
                  fontSize: "16px",
                  lineHeight: 1.75,
                  color: "#555",
                  fontFamily: "var(--font-plus-jakarta-sans)",
                }}
              >
                NexaCare is a Management Services Organization that handles
                every non-clinical function of your GLP-1 weight loss program —
                billing, patient engagement, pharmacy coordination, and
                compliance infrastructure. You prescribe. We run everything
                else.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/book-demo"
                  className="inline-flex items-center justify-center text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#262262",
                    borderRadius: "8px",
                    padding: "12px 24px",
                  }}
                >
                  Book a Demo →
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center text-[14px] font-semibold transition-colors hover:bg-gray-50"
                  style={{
                    border: "1.5px solid #262262",
                    color: "#262262",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  See how it works
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["GW", "ML", "SK"].map((initials) => (
                    <div
                      key={initials}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
                      style={{ backgroundColor: "#262262" }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-[13px]" style={{ color: "#777" }}>
                  Serving clinics across GA, FL, and TX
                </p>
              </div>
            </div>

            {/* Right — Dashboard Card 40% */}
            <div className="lg:col-span-2">
              <div
                className="w-full"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  borderRadius: "14px",
                  overflow: "hidden",
                }}
              >
                {/* Card header */}
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ backgroundColor: "#262262" }}
                >
                  <span
                    className="text-[12px] font-medium text-white"
                    style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
                  >
                    Clinic Operations Dashboard · Live
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(39,170,225,0.2)", color: "#27AAE1" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#22c55e" }}
                    />
                    Active
                  </span>
                </div>

                {/* Clinic rows */}
                <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                  {[
                    {
                      name: "Alpharetta Weight & Wellness",
                      patients: "148 active patients",
                      status: "Active",
                      statusColor: "#22c55e",
                      statusBg: "rgba(34,197,94,0.1)",
                    },
                    {
                      name: "Buckhead Primary Care",
                      patients: "92 active patients",
                      status: "Active",
                      statusColor: "#22c55e",
                      statusBg: "rgba(34,197,94,0.1)",
                    },
                    {
                      name: "Roswell Med Spa",
                      patients: "Onboarding · Week 2",
                      status: "Onboarding",
                      statusColor: "#d97706",
                      statusBg: "rgba(217,119,6,0.1)",
                    },
                  ].map((clinic) => (
                    <div
                      key={clinic.name}
                      className="px-5 py-3.5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p
                          className="text-[13px] font-semibold"
                          style={{ color: "#0f0e1a" }}
                        >
                          {clinic.name}
                        </p>
                        <p className="text-[11px]" style={{ color: "#9ca3af" }}>
                          {clinic.patients}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          color: clinic.statusColor,
                          backgroundColor: clinic.statusBg,
                        }}
                      >
                        {clinic.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Metric tiles */}
                <div
                  className="grid grid-cols-3 divide-x"
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  {[
                    { value: "$34.8K", label: "MRR", delta: "↑ +12% MoM" },
                    { value: "4.1%", label: "Churn rate", delta: "↓ -2.3pp" },
                    { value: "240", label: "Active patients", delta: "↑ +38 this mo" },
                  ].map((metric) => (
                    <div key={metric.label} className="p-3 text-center">
                      <p
                        className="text-[16px] font-bold tabular-nums"
                        style={{ color: "#0f0e1a", fontFamily: "var(--font-plus-jakarta-sans)" }}
                      >
                        {metric.value}
                      </p>
                      <p className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>
                        {metric.label}
                      </p>
                      <p className="text-[10px] font-semibold" style={{ color: "#22c55e" }}>
                        {metric.delta}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST LOGOS BAR */}
      <section style={{ backgroundColor: "#f8f7f5" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-center text-[11px] font-medium uppercase tracking-widest mb-6"
            style={{ color: "#9ca3af" }}
          >
            HIPAA-compliant infrastructure built on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["AWS HIPAA", "Twilio Healthcare", "Stripe", "Compliancy Group"].map(
              (name) => (
                <span
                  key={name}
                  className="text-[12px] font-medium px-5 py-2 rounded-full"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.1)",
                    color: "#262262",
                  }}
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* WHAT WE HANDLE */}
      <section
        id="services"
        style={{ backgroundColor: "#ffffff" }}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">THE PLATFORM</p>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "clamp(30px, 4vw, 40px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f0e1a",
              }}
            >
              Everything your clinic needs to run a GLP-1 program.
            </h2>
            <p
              className="max-w-2xl mx-auto"
              style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}
            >
              NexaCare manages every non-clinical function under a Management
              Services Agreement. Your providers stay focused on medicine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="feature-card group flex flex-col p-6 transition-all duration-200"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderRadius: "12px",
                  cursor: "default",
                }}
              >
                {card.icon}
                <h3
                  className="text-[16px] font-semibold mb-2"
                  style={{ color: "#0f0e1a" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed flex-1"
                  style={{ color: "#555" }}
                >
                  {card.desc}
                </p>
                <p
                  className="text-[11px] font-bold uppercase tracking-widest mt-4"
                  style={{ color: "#27AAE1" }}
                >
                  {card.tag}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE MSO MODEL */}
      <section style={{ backgroundColor: "#f8f7f5" }} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">HOW IT WORKS</p>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "clamp(30px, 4vw, 40px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f0e1a",
              }}
            >
              The Shopify model for independent clinics.
            </h2>
            <p
              className="max-w-2xl mx-auto"
              style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}
            >
              Shopify didn&apos;t compete with Amazon. They built infrastructure for
              everyone who didn&apos;t want to be Amazon. NexaCare builds the
              operating rails for 15,000+ independent clinics who don&apos;t want to
              be Hims.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Steps */}
            <div className="relative">
              <div
                className="absolute left-5 top-8 bottom-8 w-px hidden sm:block"
                style={{ backgroundColor: "rgba(38,34,98,0.12)" }}
              />
              <div className="space-y-8">
                {steps.map((step) => (
                  <div key={step.num} className="flex gap-5 relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 z-10"
                      style={{
                        backgroundColor: step.active ? "#27AAE1" : "#262262",
                        boxShadow: step.active
                          ? "0 0 0 6px rgba(39,170,225,0.15)"
                          : "none",
                      }}
                    >
                      {step.num}
                    </div>
                    <div className="pt-1.5">
                      <h3
                        className="text-[16px] font-semibold mb-1"
                        style={{ color: "#0f0e1a" }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-[14px] leading-relaxed"
                        style={{ color: "#555" }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stat card */}
            <div
              className="rounded-2xl p-10 text-white"
              style={{ backgroundColor: "#262262" }}
            >
              <div className="mb-6">
                <p
                  className="mb-1"
                  style={{
                    fontFamily: "var(--font-playfair-display)",
                    fontSize: "64px",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  $87
                </p>
                <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Per patient per month
                </p>
              </div>

              <div
                className="my-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
              />

              <div className="space-y-5">
                {[
                  { value: "70%+", label: "Gross margin Y1" },
                  { value: "83 patients", label: "Breakeven threshold" },
                  { value: "~50%", label: "Churn prevented by CarePath" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <span
                      className="text-[22px] font-bold tabular-nums"
                      style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[13px]"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREPATH FEATURE */}
      <section style={{ backgroundColor: "#ffffff" }} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">CAREPATH</p>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "clamp(30px, 4vw, 40px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f0e1a",
              }}
            >
              The retention engine that makes the economics work.
            </h2>
            <p
              className="max-w-2xl mx-auto"
              style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}
            >
              Real-world GLP-1 adherence at 12 months without engagement
              infrastructure runs below 50%. CarePath is designed to change that
              — 20 structured messages across 90 days, with risk triggers that
              fire before a patient churns.
            </p>
          </div>

          {/* Phase cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {[
              {
                phase: "Phase 1",
                timeframe: "Days 1–14 · Activation",
                borderColor: "#27AAE1",
                bullets: [
                  "Welcome + expectations Day 1",
                  "Day 3 check-in with simple reply options",
                  "Hydration and protein education",
                  "Week 2 milestone framing",
                ],
              },
              {
                phase: "Phase 2",
                timeframe: "Days 15–60 · Momentum",
                borderColor: "#262262",
                bullets: [
                  "Weekly check-ins with 3 data points",
                  "Plateau education at Week 6",
                  "Adherence tracking YES/NO",
                  "Day 56 two-month milestone",
                ],
              },
              {
                phase: "Phase 3",
                timeframe: "Days 61–90 · Retention Lock",
                borderColor: "rgba(39,170,225,0.4)",
                bullets: [
                  "Renewal priming begins Day 63",
                  "Day 70 churn-risk detection",
                  "Day 88 renewal intent capture",
                  "Day 90 close — positive regardless of outcome",
                ],
              },
            ].map((phase) => (
              <div
                key={phase.phase}
                className="p-6"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderTop: `3px solid ${phase.borderColor}`,
                  borderRadius: "12px",
                }}
              >
                <p
                  className="text-[11px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: "#27AAE1" }}
                >
                  {phase.phase}
                </p>
                <h3
                  className="text-[15px] font-semibold mb-4"
                  style={{ color: "#0f0e1a" }}
                >
                  {phase.timeframe}
                </h3>
                <ul className="space-y-2">
                  {phase.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-[13px]"
                      style={{ color: "#555" }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "#27AAE1" }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Stats block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              className="p-8 rounded-xl"
              style={{ backgroundColor: "rgba(39,170,225,0.06)", border: "1px solid rgba(39,170,225,0.15)" }}
            >
              <h4
                className="text-[15px] font-semibold mb-6"
                style={{ color: "#0f0e1a" }}
              >
                Economics of retention
              </h4>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { value: "$0.16", label: "cost per patient 90-day" },
                  { value: "$80/mo", label: "SMS at 500 patients" },
                  { value: "$4,350", label: "MRR saved per 1% churn reduction" },
                  { value: "937×", label: "ROI on SMS cost" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="text-[22px] font-bold tabular-nums"
                      style={{ color: "#262262", fontFamily: "var(--font-plus-jakarta-sans)" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[12px]" style={{ color: "#777" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-8 rounded-xl"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <h4
                className="text-[15px] font-semibold mb-4"
                style={{ color: "#0f0e1a" }}
              >
                Multilingual · Non-clinical · Compliant
              </h4>
              <p className="text-[14px] leading-relaxed" style={{ color: "#555" }}>
                English, Spanish, and French. CarePath acknowledges, reassures,
                and escalates — it never advises, diagnoses, or recommends
                dosing changes.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {["English", "Español", "Français"].map((lang) => (
                  <span
                    key={lang}
                    className="text-[12px] font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(38,34,98,0.06)",
                      color: "#262262",
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section style={{ backgroundColor: "#f8f7f5" }} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">IDEAL PARTNER</p>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "clamp(30px, 4vw, 40px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f0e1a",
              }}
            >
              Built for independent clinics ready to run a GLP-1 program.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              {
                title: "Medical Spas",
                desc: "You have the patient base and the brand. You're adding GLP-1 as a revenue line but don't want to staff a whole new operational team.",
                tags: ["GA", "FL", "TX", "AZ"],
              },
              {
                title: "Primary Care Practices",
                desc: "Your patients are asking for GLP-1 options. You want to offer it without turning your front desk into a subscription billing department.",
                tags: ["2–10 providers", "$1–5M revenue"],
              },
              {
                title: "Weight Loss Clinics",
                desc: "You're already in the space but your operational infrastructure was built for a different model. NexaCare replaces the patchwork.",
                tags: ["Existing patient base", "Scaling"],
              },
            ].map((persona) => (
              <div
                key={persona.title}
                className="p-6"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderRadius: "12px",
                }}
              >
                <h3
                  className="text-[18px] font-semibold mb-3"
                  style={{ color: "#0f0e1a" }}
                >
                  {persona.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed mb-5"
                  style={{ color: "#555" }}
                >
                  {persona.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {persona.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(39,170,225,0.1)",
                        color: "#27AAE1",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div
            className="rounded-2xl p-10 text-center text-white"
            style={{ backgroundColor: "#262262" }}
          >
            <h3
              className="text-[24px] font-bold mb-3"
              style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
            >
              Ready to launch your GLP-1 program?
            </h3>
            <p
              className="mb-6 max-w-lg mx-auto text-[14px]"
              style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}
            >
              Join the pilot cohort. Subsidized pricing for the first 5 clinics
              in exchange for case study participation.
            </p>
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center text-[14px] font-semibold transition-opacity hover:opacity-90 px-7 py-3 rounded-lg"
              style={{ backgroundColor: "#27AAE1", color: "#ffffff" }}
            >
              Apply for the Pilot →
            </Link>
          </div>
        </div>
      </section>

      {/* HOME FOOTER CTA */}
      <section style={{ backgroundColor: "#ffffff" }} className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2
            className="mb-5"
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: "-0.025em",
              color: "#0f0e1a",
            }}
          >
            The infrastructure layer nobody else is building.
          </h2>
          <p
            className="mb-8 text-[16px]"
            style={{ color: "#555", lineHeight: 1.75 }}
          >
            NexaCare is accepting pilot clinic applications in GA, FL, and TX.
            Subsidized onboarding. Case study participation. Spots are limited.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#262262",
                borderRadius: "8px",
                padding: "12px 24px",
              }}
            >
              Book a Demo →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center text-[14px] font-semibold transition-colors hover:bg-gray-50"
              style={{
                border: "1.5px solid rgba(0,0,0,0.15)",
                color: "#374151",
                borderRadius: "8px",
                padding: "12px 24px",
                backgroundColor: "#ffffff",
              }}
            >
              See Pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
