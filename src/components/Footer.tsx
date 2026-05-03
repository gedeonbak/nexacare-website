import Link from "next/link";

const platformLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Compliance", href: "/compliance" },
  { label: "Book a Demo", href: "/book-demo" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "HIPAA Notice", href: "/hipaa-notice" },
  { label: "MSA Overview", href: "/msa-overview" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0f0e1a" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-0 mb-4">
              <span
                className="text-lg font-bold"
                style={{ color: "#ffffff", fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                Nexa
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: "#27AAE1", fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                Care
              </span>
              <span
                className="text-sm font-normal ml-1.5"
                style={{ color: "#9ca3af", fontFamily: "var(--font-plus-jakarta-sans)" }}
              >
                Management
              </span>
            </div>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
              The operating system for GLP-1 clinics.
            </p>
            <p className="text-[13px] mb-1" style={{ color: "#6b7280" }}>
              Alpharetta, Georgia
            </p>
            <a
              href="mailto:hello@nexacaremanagement.com"
              className="text-[13px] transition-colors hover:text-white"
              style={{ color: "#9ca3af" }}
            >
              hello@nexacaremanagement.com
            </a>
          </div>

          {/* Col 2 — Platform */}
          <div>
            <h4
              className="text-[11px] font-bold uppercase tracking-widest mb-5"
              style={{ color: "#6b7280" }}
            >
              Platform
            </h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] transition-colors hover:text-white"
                    style={{ color: "#9ca3af" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Legal */}
          <div>
            <h4
              className="text-[11px] font-bold uppercase tracking-widest mb-5"
              style={{ color: "#6b7280" }}
            >
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] transition-colors hover:text-white"
                    style={{ color: "#9ca3af" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Company */}
          <div>
            <h4
              className="text-[11px] font-bold uppercase tracking-widest mb-5"
              style={{ color: "#6b7280" }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] transition-colors hover:text-white"
                    style={{ color: "#9ca3af" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.linkedin.com/in/nexacare-management-5b36b8407"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] transition-colors hover:text-white"
                  style={{ color: "#9ca3af" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[12px]" style={{ color: "#6b7280" }}>
            © 2026 NexaCare Management, LLC · Atlanta, Georgia · EIN 41-3988326
          </p>
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(39,170,225,0.15)", color: "#27AAE1" }}
            >
              HIPAA Compliant
            </span>
            <span
              className="text-[11px] font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(39,170,225,0.15)", color: "#27AAE1" }}
            >
              MSO Non-Clinical
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
