"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks: Array<{ label: string; href: string; live?: boolean }> = [
  { label: "Platform", href: "/#services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Compliance", href: "/compliance" },
  { label: "Insights", href: "/insights", live: true },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isTransparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isTransparent ? "transparent" : "#ffffff",
          borderBottom: scrolled || !isTransparent
            ? "1px solid rgba(0,0,0,0.06)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo/logo_SOURCE_fulllogo_transparent.png"
                alt="NexaCare Management"
                width={193}
                height={160}
                priority
                className="h-9 w-auto md:h-11"
                style={{ objectFit: "contain" }}
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-150"
                  style={{
                    color:
                      pathname === link.href.replace("/#services", "/")
                        ? "#262262"
                        : "#555555",
                    fontFamily: "var(--font-plus-jakarta-sans)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#262262")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      pathname === link.href.replace("/#services", "/")
                        ? "#262262"
                        : "#555555")
                  }
                >
                  {link.label}
                  {link.live && (
                    <span
                      className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(39,170,225,0.12)", color: "#27AAE1" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: "#27AAE1" }}
                      />
                      LIVE
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/book-demo"
                className="hidden md:inline-flex items-center justify-center text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#262262",
                  borderRadius: "8px",
                  padding: "9px 20px",
                  fontFamily: "var(--font-plus-jakarta-sans)",
                }}
              >
                Book a Demo
              </Link>

              {/* Hamburger */}
              <button
                className="md:hidden p-2 rounded-lg transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                style={{ color: "#262262" }}
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
                  <span
                    className="block h-0.5 w-full transition-all duration-300 origin-center"
                    style={{
                      backgroundColor: "#262262",
                      transform: menuOpen
                        ? "translateY(8px) rotate(45deg)"
                        : "none",
                    }}
                  />
                  <span
                    className="block h-0.5 w-full transition-all duration-300"
                    style={{
                      backgroundColor: "#262262",
                      opacity: menuOpen ? 0 : 1,
                    }}
                  />
                  <span
                    className="block h-0.5 w-full transition-all duration-300 origin-center"
                    style={{
                      backgroundColor: "#262262",
                      transform: menuOpen
                        ? "translateY(-8px) rotate(-45deg)"
                        : "none",
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300 flex flex-col"
        style={{
          backgroundColor: "#ffffff",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          paddingTop: "64px",
        }}
      >
        <div className="flex flex-col px-6 pt-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xl font-medium transition-colors"
              style={{
                color: "#262262",
                fontFamily: "var(--font-plus-jakarta-sans)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t" style={{ borderColor: "#e8e7e4" }}>
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center w-full text-[15px] font-semibold text-white py-3 rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#262262" }}
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
