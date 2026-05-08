"use client";

import { useState, useMemo } from "react";
import { ExternalLink, Search, RefreshCw } from "lucide-react";
import type { NewsItem } from "@/lib/news";
import { formatPubDate } from "@/lib/news";

const TABS = [
  { key: "all", label: "All" },
  { key: "clinical", label: "Clinical" },
  { key: "industry", label: "Industry" },
  { key: "regulatory", label: "Regulatory" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const CATEGORY_COLORS: Record<
  NewsItem["category"],
  { bg: string; text: string }
> = {
  clinical: { bg: "rgba(39,170,225,0.1)", text: "#27AAE1" },
  industry: { bg: "rgba(38,34,98,0.08)", text: "#262262" },
  regulatory: { bg: "rgba(217,119,6,0.1)", text: "#d97706" },
};

interface Props {
  initialItems: NewsItem[];
}

export default function InsightsClient({ initialItems }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<NewsItem[]>(initialItems);

  const filtered = useMemo(() => {
    let result = items;
    if (activeTab !== "all") {
      result = result.filter((i) => i.category === activeTab);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeTab, query]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <>
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        {/* Tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{ backgroundColor: "#f0efed" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150"
              style={{
                backgroundColor:
                  activeTab === tab.key ? "#ffffff" : "transparent",
                color: activeTab === tab.key ? "#262262" : "#777",
                boxShadow:
                  activeTab === tab.key
                    ? "0 1px 4px rgba(0,0,0,0.08)"
                    : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            strokeWidth={2}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          />
          <input
            type="text"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg"
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              outline: "none",
              backgroundColor: "#ffffff",
              color: "#0f0e1a",
              fontFamily: "var(--font-plus-jakarta-sans)",
            }}
          />
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-[13px] font-medium transition-opacity hover:opacity-70 ml-auto"
          style={{ color: "#555" }}
        >
          <RefreshCw
            size={13}
            strokeWidth={2}
            style={{
              animation: refreshing ? "spin 1s linear infinite" : "none",
            }}
          />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Results count */}
      <p className="text-[12px] mb-6" style={{ color: "#9ca3af" }}>
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        {activeTab !== "all" ? ` in ${activeTab}` : ""}
        {query ? ` matching "${query}"` : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="py-20 text-center rounded-xl"
          style={{
            backgroundColor: "#f8f7f5",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <p className="text-[15px]" style={{ color: "#777" }}>
            No articles found. Try a different filter or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const cat = CATEGORY_COLORS[item.category];
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl p-6 transition-all duration-200"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.09)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "rgba(0,0,0,0.07)";
                }}
              >
                {/* Category badge + icon */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cat.bg, color: cat.text }}
                  >
                    {item.category}
                  </span>
                  <ExternalLink
                    size={13}
                    strokeWidth={1.5}
                    style={{ color: "#9ca3af" }}
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
                <div className="flex items-center justify-between">
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
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
