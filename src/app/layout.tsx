import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
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
  openGraph: {
    type: "website",
    siteName: "NexaCare Management",
    locale: "en_US",
    url: "https://nexacaremanagement.com",
    title:
      "NexaCare Management — GLP-1 MSO Infrastructure for Independent Clinics",
    description:
      "Full-stack operational infrastructure for GLP-1 weight loss programs. HIPAA-compliant, non-clinical, built for med spas and primary care in GA, FL, TX.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "NexaCare Management — GLP-1 MSO Infrastructure for Independent Clinics",
    description:
      "Full-stack operational infrastructure for GLP-1 weight loss programs. HIPAA-compliant, non-clinical, built for med spas and primary care in GA, FL, TX.",
  },
};

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
      </body>
    </html>
  );
}
