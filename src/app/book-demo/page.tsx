import type { Metadata } from "next";
import DemoForm from "@/components/DemoForm";

export const metadata: Metadata = {
  title: "Book a Demo — NexaCare Management",
  description:
    "Schedule a 15-minute intro call to discuss your clinic's GLP-1 program and NexaCare's operational infrastructure.",
  openGraph: {
    title: "Book a Demo — NexaCare Management",
    description:
      "Schedule a 15-minute intro call to discuss your clinic's GLP-1 program and NexaCare's operational infrastructure.",
  },
};

export default function BookDemoPage() {
  return (
    <main className="pt-16" style={{ backgroundColor: "#f8f7f5", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left sidebar — sticky */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-8 text-white lg:sticky lg:top-24"
              style={{ backgroundColor: "#262262" }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-5"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                WHAT TO EXPECT
              </p>
              <ul className="space-y-3 mb-7">
                {[
                  "15-minute intro call",
                  "We'll review your clinic's current GLP-1 setup",
                  "Walk through the CarePath demo",
                  "Discuss PMPM pricing for your patient volume",
                  "Answer compliance questions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px]">
                    <span
                      className="mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
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

              <div
                className="my-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
              />

              <div className="space-y-5">
                {[
                  {
                    value: "$87 PMPM",
                    label: "Base case revenue per patient",
                  },
                  { value: "83 patients", label: "Breakeven threshold" },
                  { value: "5 days", label: "Average onboarding time" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="text-[24px] font-bold tabular-nums"
                      style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        lineHeight: 1.2,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-[12px]"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
              }}
            >
              <div className="mb-8">
                <h1
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-playfair-display)",
                    fontSize: "clamp(26px, 3vw, 36px)",
                    fontWeight: 900,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                    color: "#0f0e1a",
                  }}
                >
                  Book a Demo
                </h1>
                <p className="text-[14px]" style={{ color: "#777", lineHeight: 1.7 }}>
                  Tell us about your clinic and we&apos;ll set up a 15-minute call to walk
                  through NexaCare&apos;s platform and discuss pricing for your situation.
                </p>
              </div>
              <DemoForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
