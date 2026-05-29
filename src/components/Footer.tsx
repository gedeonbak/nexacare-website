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
                href="mailto:hello@nexacaremanagement.com"
                className="block text-[13px] transition-colors hover:text-white"
                style={{ color: "#9ca3af" }}
              >
                hello@nexacaremanagement.com
              </a>
              <a
                href="mailto:contact@nexacaremanagement.com"
                className="block text-[13px] transition-colors hover:text-white"
                style={{ color: "#9ca3af" }}
              >
                contact@nexacaremanagement.com
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
