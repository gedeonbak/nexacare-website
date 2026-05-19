import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NexaCare Management",
  description: "Privacy Policy for NexaCare Management, LLC.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-16" style={{ backgroundColor: "#f8f7f5", minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24">
        <p className="eyebrow mb-4">PRIVACY POLICY</p>
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
          Privacy Policy
        </h1>

        <div
          className="rounded-xl p-8 mb-6"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <p className="text-[13px] font-semibold mb-4" style={{ color: "#9ca3af" }}>
            Effective January 31, 2026
          </p>
          <p className="text-[15px] leading-relaxed" style={{ color: "#555" }}>
            This page is being updated. Contact{" "}
            <a
              href="mailto:hello@nexacaremanagement.com"
              className="underline transition-colors"
              style={{ color: "#27AAE1" }}
            >
              hello@nexacaremanagement.com
            </a>{" "}
            for our current privacy policy practices.
          </p>
        </div>

        {/* SMS Communications — required for Twilio A2P / carrier compliance */}
        <div
          className="rounded-xl p-8"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <h2
            className="mb-6"
            style={{
              fontFamily: "var(--font-playfair-display)",
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#0f0e1a",
            }}
          >
            SMS Communications
          </h2>

          <div className="space-y-5" style={{ color: "#444" }}>
            <p className="text-[15px] leading-relaxed">
              NexaCare Management sends automated SMS messages to patients who have explicitly
              opted in through a clinic enrollment form.
            </p>

            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#27AAE1" }}>
                Message Frequency
              </p>
              <p className="text-[15px] leading-relaxed">
                Message frequency varies based on your program enrollment. CarePath participants
                receive up to 20 messages over a 90-day period.
              </p>
            </div>

            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#27AAE1" }}>
                To Opt Out
              </p>
              <p className="text-[15px] leading-relaxed">
                Reply <strong>STOP</strong> to any message to immediately unsubscribe. You will
                receive one confirmation message and no further messages will be sent.
              </p>
            </div>

            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#27AAE1" }}>
                For Help
              </p>
              <p className="text-[15px] leading-relaxed">
                Reply <strong>HELP</strong> to any message or contact us at{" "}
                <a
                  href="mailto:hello@nexacaremanagement.com"
                  className="underline transition-colors"
                  style={{ color: "#27AAE1" }}
                >
                  hello@nexacaremanagement.com
                </a>
                .
              </p>
            </div>

            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#27AAE1" }}>
                Non-Sharing Policy
              </p>
              <p className="text-[15px] leading-relaxed">
                We do not sell, rent, or share your mobile phone number with third parties for
                their marketing purposes.
              </p>
            </div>

            <div
              className="rounded-lg px-4 py-3 text-[13px] leading-relaxed"
              style={{
                backgroundColor: "rgba(39,170,225,0.06)",
                border: "1px solid rgba(39,170,225,0.15)",
                color: "#666",
              }}
            >
              Message and data rates may apply. Carriers are not liable for delayed or
              undelivered messages.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
