import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.nexacaremanagement.com";
  const lastModified = new Date("2026-05-03");

  return [
    { url: `${baseUrl}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/how-it-works`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/compliance`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/book-demo`, lastModified, changeFrequency: "monthly", priority: 0.9 },
  ];
}
