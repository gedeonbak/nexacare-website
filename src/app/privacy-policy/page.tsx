import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NexaCare Management",
  description:
    "Privacy Policy for NexaCare Management, LLC — including SMS / text message communications disclosure.",
};

// ── Section helper ────────────────────────────────────────────────────────────

function Section({
  number,
  title,
  children,
  highlight,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <section
      style={{
        backgroundColor: highlight ? "rgba(39,170,225,0.05)" : "#ffffff",
        border: highlight
          ? "1.5px solid rgba(39,170,225,0.35)"
          : "1px solid rgba(0,0,0,0.07)",
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
            textTransform: "uppercase",
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
      <div style={{ color: "#444", fontSize: "15px", lineHeight: "1.75" }}>
        {children}
      </div>
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
        textTransform: "uppercase",
        color: "#27AAE1",
        margin: "18px 0 4px",
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "40px" }}>
          NexaCare Management, LLC &nbsp;·&nbsp; Effective January 31, 2026
          &nbsp;·&nbsp; Last updated May 19, 2026
        </p>

        {/* 1 — Introduction */}
        <Section number="01" title="Introduction">
          <P>
            NexaCare Management, LLC (&ldquo;NexaCare,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
            or &ldquo;our&rdquo;) operates a care-management platform that helps independent
            weight-management clinics support their patients through the CarePath SMS program.
            This Privacy Policy explains how we collect, use, and protect information related
            to our services.
          </P>
          <P>
            By enrolling in the CarePath program through a participating clinic, or by using
            our website at nexacaremanagement.com, you agree to the practices described in
            this policy.
          </P>
        </Section>

        {/* 2 — Information We Collect */}
        <Section number="02" title="Information We Collect">
          <Label>Clinic Partner Information</Label>
          <Ul items={[
            "Business contact name, email, and phone",
            "Clinic name, address, and state of operation",
            "Billing information processed securely via Stripe",
          ]} />

          <Label>Patient Information (collected via clinic intake)</Label>
          <Ul items={[
            "First name and mobile phone number",
            "Preferred language (English, Spanish, or French)",
            "Enrollment date and program participation data (CarePath day, message responses)",
            "Only the last four digits of a phone number are stored in application logs",
          ]} />

          <Label>Website Usage Data</Label>
          <Ul items={[
            "Anonymous page-view and traffic data via Google Analytics (GA4)",
            "No personally identifiable information is collected through website analytics",
          ]} />
        </Section>

        {/* 3 — SMS Communications — HIGHLIGHTED */}
        <Section number="03" title="SMS / Text Message Communications" highlight>
          <P>
            NexaCare Management sends automated SMS messages to patients who have{" "}
            <strong>explicitly opted in</strong> through a clinic enrollment form.
          </P>

          <Label>Opt-In Consent</Label>
          <P>
            Patients provide explicit written consent by checking a mandatory opt-in checkbox
            on their clinic&rsquo;s enrollment form before receiving any messages. No messages
            are sent without this consent. Consent to receive SMS messages is{" "}
            <strong>not a condition of any treatment, purchase, or service</strong>.
          </P>

          <Label>Message Frequency</Label>
          <P>
            Up to <strong>20 messages</strong> over a <strong>90-day</strong> enrollment
            period. Message frequency varies based on program phase (weekly during Activation
            and Momentum phases; bi-weekly during Retention Lock phase).
          </P>

          <Label>To Opt Out</Label>
          <P>
            Reply <strong>STOP</strong> to any message at any time to immediately unsubscribe.
            You will receive one confirmation message and no further messages will be sent.
          </P>

          <Label>For Help</Label>
          <P>
            Reply <strong>HELP</strong> to any message, or contact us at{" "}
            <a
              href="mailto:hello@nexacaremanagement.com"
              style={{ color: "#27AAE1", textDecoration: "underline" }}
            >
              hello@nexacaremanagement.com
            </a>
            .
          </P>

          <Label>Non-Sharing Policy</Label>
          <P>
            We do <strong>not</strong> sell, rent, or share your mobile phone number with
            third parties for their marketing or promotional purposes.
          </P>

          <Label>Carrier Disclaimer</Label>
          <P>Carriers are not liable for delayed or undelivered messages.</P>

          <Label>Cost</Label>
          <P>Message and data rates may apply.</P>
        </Section>

        {/* 4 — How We Use Information */}
        <Section number="04" title="How We Use Information">
          <Ul items={[
            "Delivering CarePath wellness check-in SMS messages to enrolled patients",
            "Monitoring program engagement and churn-risk signals to support clinic care teams",
            "Billing clinic partners for monthly care-management services",
            "Improving the CarePath message sequence and program outcomes",
            "Complying with applicable law and our HIPAA obligations",
          ]} />
        </Section>

        {/* 5 — Information Sharing */}
        <Section number="05" title="Information Sharing">
          <P>
            We do <strong>not sell</strong> personal information. We share data only with the
            following service providers, each operating under appropriate data agreements:
          </P>
          <Ul items={[
            <>
              <strong>Amazon Web Services (AWS)</strong> — cloud infrastructure and database
              hosting. A Business Associate Agreement (BAA) is executed for patient data.
            </>,
            <>
              <strong>Twilio</strong> — SMS message delivery. A Business Associate Agreement
              (BAA) is executed for patient communications.
            </>,
            <>
              <strong>Stripe</strong> — clinic billing and payment processing. No patient
              health data is shared with Stripe.
            </>,
          ]} />
          <P>
            We do <strong>not</strong> share mobile phone numbers or patient information with
            third parties for marketing or promotional purposes.
          </P>
        </Section>

        {/* 6 — Data Security */}
        <Section number="06" title="Data Security">
          <P>
            Patient data is stored in HIPAA-eligible AWS RDS infrastructure (us-east-2
            region) under an executed AWS Business Associate Agreement. Data is encrypted at
            rest and in transit. Access is restricted to authorized NexaCare personnel only.
          </P>
          <P>
            We implement administrative, technical, and physical safeguards appropriate to
            the sensitivity of the information we handle. However, no transmission over the
            internet can be guaranteed to be 100% secure.
          </P>
        </Section>

        {/* 7 — Contact */}
        <Section number="07" title="Contact Us">
          <P>
            If you have questions about this Privacy Policy or our data practices, please
            contact us:
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
          </div>
        </Section>

      </div>
    </main>
  );
}
