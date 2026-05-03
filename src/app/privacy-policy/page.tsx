import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NexaCare Management",
  description: "Privacy Policy for NexaCare Management, LLC.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" effectiveDate="January 31, 2026" />;
}

function LegalPage({ title, effectiveDate }: { title: string; effectiveDate: string }) {
  return (
    <main className="pt-16" style={{ backgroundColor: "#f8f7f5", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24">
        <p className="eyebrow mb-4">{title.toUpperCase()}</p>
        <h1
          className="mb-6"
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#0f0e1a",
          }}
        >
          {title}
        </h1>
        <div
          className="rounded-xl p-8"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <p className="text-[13px] font-semibold mb-4" style={{ color: "#9ca3af" }}>
            Effective {effectiveDate}
          </p>
          <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#555" }}>
            This page is being updated. Contact{" "}
            <a
              href="mailto:hello@nexacaremanagement.com"
              className="underline transition-colors"
              style={{ color: "#27AAE1" }}
            >
              hello@nexacaremanagement.com
            </a>{" "}
            for our current {title.toLowerCase()} practices.
          </p>
        </div>
      </div>
    </main>
  );
}
