import Image from "next/image";
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
            <Link href="/" className="inline-flex items-center mb-4">
              <Image
                src="/images/logo/logo_SOURCE_icononly_transparent.png"
                alt="NexaCare Management"
                width={160}
                height={178}
                className="h-10 w-auto"
                style={{ objectFit: "contain" }}
              />
            </Link>
            {/* Tagline — M18 */}
            <p className="text-[13px] leading-relaxed mb-5" style={{ color: "#9ca3af" }}>
              The engagement layer behind GLP-1
            </p>
            {/* Address */}
            <p className="text-[13px] leading-relaxed" style={{ color: "#6b7280" }}>
              1870 The Exchange SE, Suite 220
              <br />
              Atlanta, GA 30339
            </p>

            {/* Divider */}
            <div
              className="my-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            />

            {/* Emails */}
            <div className="space-y-2">
              <a
                href="mailto:contact@nexacaremanagement.com"
                className="block text-[13px] transition-colors hover:text-white"
                style={{ color: "#9ca3af" }}
              >
                contact@nexacaremanagement.com
              </a>
            </div>

            {/* Social — LinkedIn (M19) + Facebook (M15 vanity URL); no UTMs on outbound per M16 */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/nexacare-management"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NexaCare on LinkedIn"
                className="transition-colors hover:text-white"
                style={{ color: "#9ca3af" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/nexacaremanagement"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NexaCare on Facebook"
                className="transition-colors hover:text-white"
                style={{ color: "#9ca3af" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                </svg>
              </a>
            </div>
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
