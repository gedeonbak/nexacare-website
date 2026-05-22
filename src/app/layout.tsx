import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexacaremanagement.com"),
  title: {
    default:
      "NexaCare Management — GLP-1 MSO Infrastructure for Independent Clinics",
    template: "%s | NexaCare Management",
  },
  description:
    "Full-stack operational infrastructure for GLP-1 weight loss programs. HIPAA-compliant, non-clinical, built for med spas and primary care in GA, FL, TX.",
  icons: {
    icon: [
      { url: "/favicon.ico",        sizes: "any" },
      { url: "/favicon-32x32.png",  sizes: "32x32", type: "image/png" },
      { url: "/favicon-64x64.png",  sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple:    [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other:    [{ rel: "manifest", url: "/site.webmanifest" }],
  },
  openGraph: {
    type: "website",
    siteName: "NexaCare Management",
    locale: "en_US",
    url: "https://nexacaremanagement.com",
    title:
      "NexaCare Management — GLP-1 MSO Infrastructure for Independent Clinics",
    description:
      "Full-stack operational infrastructure for GLP-1 weight loss programs. HIPAA-compliant, non-clinical, built for med spas and primary care in GA, FL, TX.",
    // TODO: Create a 1200×630px branded OG card for optimal social sharing previews.
    // Current logo is 1280×1063 (portrait) — works but may crop on LinkedIn/WhatsApp.
    images: [
      {
        url: "/images/logo/logo_SOURCE_fulllogo_transparent.png",
        width: 1280,
        height: 1063,
        alt: "NexaCare Management — GLP-1 MSO Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "NexaCare Management — GLP-1 MSO Infrastructure for Independent Clinics",
    description:
      "Full-stack operational infrastructure for GLP-1 weight loss programs. HIPAA-compliant, non-clinical, built for med spas and primary care in GA, FL, TX.",
    images: ["/images/logo/logo_SOURCE_fulllogo_transparent.png"],
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NexaCare Management, LLC",
  url: "https://nexacaremanagement.com",
  foundingDate: "2026-01-31",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    addressCountry: "US",
  },
  areaServed: ["GA", "FL", "TX", "AZ"],
  description:
    "Healthcare MSO providing operational infrastructure for GLP-1 clinics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="canonical" href="https://nexacaremanagement.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />

        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}</Script>

        {/* Apollo.io website tracker */}
        <Script id="apollo-tracker" strategy="afterInteractive">{`
          function initApollo(){
            var n=Math.random().toString(36).substring(7),o=document.createElement("script");
            o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,
            o.async=!0,o.defer=!0,
            o.onload=function(){window.trackingFunctions.onLoad({appId:"69f7764691fc8b00159a4a07"})},
            document.head.appendChild(o);
          }
          initApollo();
        `}</Script>
      </body>
    </html>
  );
}
