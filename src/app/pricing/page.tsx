import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "NexaCare Pricing — $75–$99 PMPM GLP-1 MSO",
  description:
    "Simple per-patient pricing. No setup costs for pilot clinics. See the full P&L model at 83, 300, and 500 active patients.",
  openGraph: {
    title: "NexaCare Pricing — $75–$99 PMPM GLP-1 MSO",
    description:
      "Simple per-patient pricing. No setup costs for pilot clinics. See the full P&L model at 83, 300, and 500 active patients.",
  },
};

export default function PricingPage() {
  return (
    <main className="pt-16">
      {/* Page Header (server-rendered) */}
      <section className="py-24" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="eyebrow mb-4">TRANSPARENT PRICING</p>
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
            Simple per-patient pricing. No hidden fees.
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
            One monthly fee per active patient. No setup costs for pilot
            clinics. No long-term lock-in.
          </p>
        </div>
      </section>

      {/* Interactive sections with GA4 CTA tracking */}
      <PricingClient />
    </main>
  );
}
