import type { Metadata } from "next";
import { fetchNews } from "@/lib/news";
import InsightsClient from "./InsightsClient";

export const revalidate = 3600; // revalidate every hour

export const metadata: Metadata = {
  title: "GLP-1 Insights — NexaCare Management",
  description:
    "Live GLP-1 news from PubMed, STAT News, FDA, FTC, and more. Clinical research, industry updates, and regulatory developments for weight-loss clinic operators.",
  openGraph: {
    title: "GLP-1 Insights — NexaCare Management",
    description:
      "Live GLP-1 news from PubMed, STAT News, FDA, FTC, and more. Clinical research, industry updates, and regulatory developments for weight-loss clinic operators.",
  },
};

export default async function InsightsPage() {
  let items = await fetchNews().catch(() => []);

  // Fallback so the page always renders even if all feeds fail
  if (!items.length) {
    items = [];
  }

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="py-24" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="eyebrow">GLP-1 INTELLIGENCE</p>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(39,170,225,0.12)", color: "#27AAE1" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#27AAE1", animation: "pulse 2s infinite" }}
              />
              LIVE
            </span>
          </div>
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
            Stay ahead of the GLP-1 market.
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
            Clinical research, industry moves, and regulatory shifts — curated
            from the sources that matter. Updated hourly.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InsightsClient initialItems={items} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: "#f8f7f5" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h3
            className="text-[22px] font-bold mb-3"
            style={{ color: "#0f0e1a" }}
          >
            Ready to build your GLP-1 program?
          </h3>
          <p className="text-[15px] mb-6" style={{ color: "#555" }}>
            NexaCare handles the operational layer so your clinic can focus on
            patient outcomes.
          </p>
          <a
            href="/book-demo"
            className="inline-flex items-center justify-center text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#262262",
              borderRadius: "8px",
              padding: "12px 28px",
            }}
          >
            Book a Demo →
          </a>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  );
}
