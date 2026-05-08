"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsItem } from "@/lib/news";
import { formatPubDate } from "@/lib/news";

const CATEGORY_COLORS: Record<NewsItem["category"], { bg: string; text: string; label: string }> = {
  clinical: { bg: "rgba(39,170,225,0.1)", text: "#27AAE1", label: "Clinical" },
  industry: { bg: "rgba(38,34,98,0.08)", text: "#262262", label: "Industry" },
  regulatory: { bg: "rgba(217,119,6,0.1)", text: "#d97706", label: "Regulatory" },
};

interface Props {
  items: NewsItem[];
}

export default function NewsCarousel({ items }: Props) {
  const autoplayRef = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  if (!items.length) return null;

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5" style={{ touchAction: "pan-y" }}>
          {items.map((item) => {
            const cat = CATEGORY_COLORS[item.category];
            return (
              <div
                key={item.id}
                className="shrink-0"
                style={{ flex: "0 0 calc(33.333% - 14px)", minWidth: "280px" }}
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div
                    className="h-full rounded-xl p-6 transition-all duration-200"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(0,0,0,0.07)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 4px 20px rgba(0,0,0,0.09)";
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(0,0,0,0.07)";
                    }}
                  >
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: cat.bg, color: cat.text }}
                      >
                        {cat.label}
                      </span>
                      <ExternalLink
                        size={13}
                        style={{ color: "#9ca3af" }}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-[14px] font-semibold leading-snug mb-2 line-clamp-3"
                      style={{ color: "#0f0e1a" }}
                    >
                      {item.title}
                    </h3>

                    {/* Summary */}
                    <p
                      className="text-[12px] leading-relaxed line-clamp-3 mb-4"
                      style={{ color: "#777" }}
                    >
                      {item.summary}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: "#262262" }}
                      >
                        {item.source}
                      </span>
                      <span className="text-[11px]" style={{ color: "#9ca3af" }}>
                        {formatPubDate(item.pubDate)}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === selectedIndex ? "20px" : "6px",
                height: "6px",
                backgroundColor:
                  i === selectedIndex ? "#262262" : "rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              backgroundColor: "#ffffff",
              color: "#555",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#262262";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#262262";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
              (e.currentTarget as HTMLButtonElement).style.color = "#555";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.12)";
            }}
          >
            <ChevronLeft size={14} strokeWidth={2} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              backgroundColor: "#ffffff",
              color: "#555",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#262262";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#262262";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
              (e.currentTarget as HTMLButtonElement).style.color = "#555";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.12)";
            }}
          >
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* View all link */}
      <div className="text-center mt-6">
        <Link
          href="/insights"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#27AAE1" }}
        >
          View all GLP-1 insights →
        </Link>
      </div>
    </div>
  );
}
