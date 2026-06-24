import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — NexaCare Management",
  description:
    "Terms of Service for NexaCare Management, LLC — including SMS messaging terms required for CarePath enrollment.",
};

// ── Shared primitives ─────────────────────────────────────────────────────────

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "14px",
        padding: "32px",
        marginBottom: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "18px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#27AAE1",
            textTransform: "uppercase" as const,
            whiteSpace: "nowrap" as const,
          }}
        >
          {number}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "20px",
            fontWeight: 800,
            color: "#0f0e1a",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ color: "#444", fontSize: "15px", lineHeight: "1.75" }}>{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.07em",
        textTransform: "uppercase" as const,
        color: "#27AAE1",
        margin: "20px 0 4px",
      }}
    >
      {children}
    </p>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 12px" }}>{children}</p>;
}

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: "0 0 12px", paddingLeft: "20px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: "6px" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

// ── SMS highlight box ─────────────────────────────────────────────────────────

function SMSRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        fontSize: "14px",
        lineHeight: "1.6",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.55)", minWidth: "120px", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: "#ffffff" }}>{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TermsOfServicePage() {
  return (
    <main style={{ backgroundColor: "#f8f7f5", minHeight: "100vh", paddingTop: "64px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Header */}
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#27AAE1",
            marginBottom: "12px",
          }}
        >
          Legal
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#0f0e1a",
            marginBottom: "10px",
          }}
        >
          Terms of Service
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "40px" }}>
          NexaCare Management, LLC &nbsp;·&nbsp; Effective January 31, 2026
          &nbsp;·&nbsp; Last updated May 19, 2026
        </p>

        {/* §1 — Acceptance */}
        <Section number="01" title="Acceptance of Terms">
          <P>
            By using NexaCare Management services, visiting nexacaremanagement.com, or
            enrolling in a CarePath wellness program through a participating clinic, you agree
            to be bound by these Terms of Service and our{" "}
            <a href="/privacy-policy" style={{ color: "#27AAE1", textDecoration: "underline" }}>
              Privacy Policy
            </a>
            .
          </P>
          <P>
            If you do not agree to these terms, do not use our services or enroll in the
            CarePath program.
          </P>
        </Section>

        {/* §2 — SMS Terms — NAVY HIGHLIGHT */}
        <section
          style={{
            backgroundColor: "#1a1740",
            borderRadius: "14px",
            padding: "32px",
            marginBottom: "20px",
          }}
        >
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#27AAE1",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              02
            </span>
            <h2
              style={{
                fontFamily: "var(--font-playfair-display)",
                fontSize: "20px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              SMS Messaging Terms
            </h2>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "24px",
              letterSpacing: "0.04em",
            }}
          >
            REQUIRED CONSENT — READ BEFORE ENROLLING
          </p>

          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "15px",
              lineHeight: "1.75",
              marginBottom: "24px",
            }}
          >
            By providing your mobile phone number and checking the opt-in box on your
            clinic&rsquo;s enrollment form, you expressly agree to receive automated SMS text
            messages from NexaCare Management on behalf of your enrolled clinic.{" "}
            <strong>Consent to receive these messages is not a condition of treatment or
            enrollment in any clinical service.</strong>
          </p>

          {/* Quick-reference grid */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "4px 16px",
              marginBottom: "24px",
            }}
          >
            <SMSRow label="Program" value="CarePath 90-Day Wellness Program" />
            <SMSRow label="Frequency" value="Up to 20 messages over a 90-day enrollment period" />
            <SMSRow label="Rates" value="Message and data rates may apply" />
            <SMSRow
              label="Carriers"
              value="Carriers are not liable for delayed or undelivered messages"
            />
            <SMSRow
              label="Opt out"
              value={
                <>
                  Reply <strong style={{ color: "#ffffff" }}>STOP</strong> to any message. One
                  confirmation sent, then no further messages.
                </>
              }
            />
            <SMSRow
              label="Re-enroll"
              value={
                <>
                  Reply <strong style={{ color: "#ffffff" }}>START</strong> or contact your
                  clinic directly.
                </>
              }
            />
            <SMSRow
              label="Help"
              value={
                <>
                  Reply <strong style={{ color: "#ffffff" }}>HELP</strong> or email{" "}
                  <a
                    href="mailto:hello@nexacaremanagement.com"
                    style={{ color: "#27AAE1", textDecoration: "underline" }}
                  >
                    hello@nexacaremanagement.com
                  </a>
                </>
              }
            />
            <div
              style={{
                display: "flex",
                gap: "12px",
                padding: "10px 0",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.55)", minWidth: "120px", flexShrink: 0 }}>
                Privacy
              </span>
              <span style={{ color: "#ffffff" }}>
                Your mobile number will not be sold, rented, or shared with third parties for
                their marketing purposes.
              </span>
            </div>
          </div>
        </section>

        {/* §3 — Services */}
        <Section number="03" title="Services Description">
          <P>
            NexaCare Management is a Management Services Organization (MSO) providing
            non-clinical administrative and technology services to licensed healthcare clinics.
          </P>
          <Label>CarePath Program</Label>
          <P>
            CarePath is a patient wellness engagement system that delivers structured SMS
            check-in messages to enrolled patients on behalf of partner clinics. The program
            spans 90 days and consists of up to 20 messages across three phases: Activation,
            Momentum, and Retention Lock.
          </P>
          <Label>Medical Disclaimer</Label>
          <P>
            NexaCare does <strong>not</strong> provide medical advice, diagnoses, or treatment.
            All clinical decisions are made exclusively by licensed healthcare providers at
            partner clinics. CarePath messages are wellness engagement communications only and
            do not constitute medical care.
          </P>
        </Section>

        {/* §4 — Clinic Partner Terms */}
        <Section number="04" title="Clinic Partner Terms">
          <P>Clinics that partner with NexaCare Management agree to:</P>
          <Ul
            items={[
              "Execute a Management Services Agreement (MSA) before accessing any NexaCare services",
              "Obtain proper written patient consent — including SMS opt-in — before submitting patient information to NexaCare systems",
              "Maintain full clinical authority and responsibility for all patient care decisions",
              "Comply with all applicable HIPAA, state corporate practice of medicine (CPOM), and telehealth regulations",
              "Promptly notify NexaCare of any patient opt-out requests received outside the SMS channel",
            ]}
          />
        </Section>

        {/* §5 — Acceptable Use */}
        <Section number="05" title="Acceptable Use">
          <P>Users and clinic partners may not:</P>
          <Ul
            items={[
              "Enroll patients in CarePath without obtaining explicit, documented SMS consent",
              "Use NexaCare services to send messages unrelated to enrolled wellness programs",
              "Attempt to access data belonging to other clinics or patients",
              "Circumvent or delay patient opt-out requests",
              "Reverse-engineer, scrape, or otherwise misuse the NexaCare platform",
            ]}
          />
        </Section>

        {/* §6 — Limitation of Liability */}
        <Section number="06" title="Limitation of Liability">
          <P>
            NexaCare Management provides operational infrastructure and wellness engagement
            services only. We are not liable for clinical outcomes, adverse events, or medical
            decisions made by partner clinics or their providers.
          </P>
          <P>
            To the maximum extent permitted by applicable law, NexaCare&rsquo;s total liability
            for any claim arising out of these Terms shall not exceed the amounts paid by the
            applicable clinic partner in the three months preceding the claim.
          </P>
        </Section>

        {/* §7 — Governing Law */}
        <Section number="07" title="Governing Law">
          <P>
            These Terms of Service are governed by and construed in accordance with the laws
            of the State of Georgia, without regard to its conflict-of-law provisions. Any
            dispute arising under these Terms shall be subject to the exclusive jurisdiction
            of the state and federal courts located in Fulton County, Georgia.
          </P>
        </Section>

        {/* §8 — Contact */}
        <Section number="08" title="Contact Us">
          <P>
            Questions about these Terms? Contact us:
          </P>
          <div
            style={{
              backgroundColor: "#f8f7f5",
              borderRadius: "10px",
              padding: "20px 24px",
              fontSize: "14px",
              lineHeight: "2",
            }}
          >
            <strong>NexaCare Management, LLC</strong>
            <br />
            1870 The Exchange SE, Suite 220
            <br />
            Atlanta, GA 30339
            <br />
            <a
              href="mailto:hello@nexacaremanagement.com"
              style={{ color: "#27AAE1", textDecoration: "underline" }}
            >
              hello@nexacaremanagement.com
            </a>
            <br />
            (770) 647-8135
          </div>
        </Section>

      </div>
    </main>
  );
}
