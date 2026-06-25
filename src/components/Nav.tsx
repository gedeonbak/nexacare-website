"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks: Array<{ label: string; href: string; isInsights?: boolean; isDemo?: boolean }> = [
  { label: "Platform",      href: "/#services" },
  { label: "How It Works",  href: "/how-it-works" },
  { label: "Pricing",       href: "/pricing" },
  { label: "Compliance",    href: "/compliance" },
  { label: "Insights",      href: "/insights", isInsights: true },
  { label: "Live Demo",     href: "/demo/portal", isDemo: true },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // ── Colour tokens that vary by context ──────────────────────────────
  const darkNav = true; // always dark frosted glass on home
  // On inner pages we switch to white so light-page content stays readable
  const navBg     = isHome || menuOpen
    ? "rgba(26,23,64,0.92)"
    : "rgba(255,255,255,0.95)";
  const navBorder = isHome
    ? "1px solid rgba(39,170,225,0.12)"
    : "1px solid rgba(0,0,0,0.06)";
  const linkColor      = isHome ? "rgba(255,255,255,0.65)" : "#555555";
  const linkActive     = isHome ? "#ffffff" : "#262262";
  const hamburgerColor = isHome ? "#ffffff" : "#262262";

  return (
    <>
      {/* ── Main nav bar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          backgroundColor: navBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: navBorder,
          boxShadow: isHome ? "none" : "0 1px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── LEFT — Brand ── */}
        <Link
          href="/"
          className="flex flex-col items-start shrink-0"
          style={{ gap: "1px", textDecoration: "none" }}
        >
          {isHome ? (
            /* Dark nav → icon-only (the N-mark reads on navy) */
            <Image
              src="/images/logo/logo_SOURCE_icononly_transparent.png"
              alt="NexaCare Management"
              width={40}
              height={45}
              priority
              className="h-9 w-auto"
              style={{ objectFit: "contain" }}
            />
          ) : (
            /* Light nav → full logo */
            <Image
              src="/images/logo/logo_SOURCE_fulllogo_transparent.png"
              alt="NexaCare Management"
              width={193}
              height={160}
              priority
              className="h-11 w-auto"
              style={{ objectFit: "contain" }}
            />
          )}
          {/* Tagline (desktop only) — M18 */}
          <span
            className="hidden md:block"
            style={{
              fontSize: "10px",
              color: "#27AAE1",
              fontWeight: 400,
              letterSpacing: "0.06em",
              opacity: 0.9,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              marginTop: "2px",
            }}
          >
            The engagement layer behind GLP-1
          </span>
        </Link>

        {/* ── CENTER — Desktop links ── */}
        <div
          className="hidden md:flex items-center"
          style={{ gap: "36px" }}
        >
          {navLinks.map((link) => {
            if (link.isInsights) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center"
                  style={{
                    gap: "6px",
                    color: "#27AAE1",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#27AAE1",
                      display: "inline-block",
                      animation: "pulseDot 2s ease-in-out infinite",
                      flexShrink: 0,
                    }}
                  />
                  Insights
                </Link>
              );
            }
            if (link.isDemo) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center"
                  style={{
                    gap: "6px",
                    color: "#27AAE1",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    border: "1px solid rgba(39,170,225,0.3)",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    background: "rgba(39,170,225,0.08)",
                  }}
                >
                  ▶ Live Demo
                </Link>
              );
            }
            const isActive =
              pathname === link.href ||
              (link.href === "/#services" && pathname === "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-200"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: isActive ? linkActive : linkColor,
                  letterSpacing: "0.02em",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = linkActive)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive
                    ? linkActive
                    : linkColor)
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── RIGHT — CTA + hamburger ── */}
        <div className="flex items-center gap-4">
          <Link
            href="/book-demo"
            className="hidden md:inline-block"
            style={{
              background: isHome ? "#27AAE1" : "#262262",
              color: isHome ? "#1a1740" : "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 22px",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = isHome ? "#3cc0f5" : "#1a1740";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = isHome ? "#27AAE1" : "#262262";
              el.style.transform = "translateY(0)";
            }}
          >
            Book a Demo →
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
              {[
                menuOpen ? "translateY(8px) rotate(45deg)" : "none",
                undefined,
                menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
              ].map((transform, i) =>
                i === 1 ? (
                  <span
                    key={i}
                    className="block h-0.5 w-full transition-all duration-300"
                    style={{
                      backgroundColor: hamburgerColor,
                      opacity: menuOpen ? 0 : 1,
                    }}
                  />
                ) : (
                  <span
                    key={i}
                    className="block h-0.5 w-full transition-all duration-300 origin-center"
                    style={{
                      backgroundColor: hamburgerColor,
                      transform: transform ?? "none",
                    }}
                  />
                )
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay ── */}
      <div
        className="fixed inset-0 z-40 md:hidden flex flex-col transition-all duration-300"
        style={{
          backgroundColor: "#1a1740",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          paddingTop: "72px",
        }}
      >
        <div className="flex flex-col px-6 pt-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xl font-medium transition-colors"
              style={{
                color: (link.isInsights || link.isDemo) ? "#27AAE1" : "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-plus-jakarta-sans)",
                textDecoration: "none",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.isDemo ? "▶ Live Demo" : link.label}
            </Link>
          ))}
          <div
            className="pt-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center w-full text-[15px] font-semibold py-3 rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#27AAE1", color: "#1a1740", textDecoration: "none" }}
              onClick={() => setMenuOpen(false)}
            >
              Book a Demo →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
