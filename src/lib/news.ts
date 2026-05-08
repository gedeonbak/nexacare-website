import Parser from "rss-parser";

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: "clinical" | "industry" | "regulatory";
  summary: string;
}

interface CacheEntry {
  items: NewsItem[];
  fetchedAt: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let cache: CacheEntry | null = null;

const FEEDS: Array<{
  url: string;
  source: string;
  category: NewsItem["category"];
}> = [
  // Clinical
  {
    url: "https://pubmed.ncbi.nlm.nih.gov/rss/search/?term=GLP-1+weight+loss&format=rss",
    source: "PubMed",
    category: "clinical",
  },
  {
    url: "https://www.nejm.org/action/showFeed?jc=nejm&type=etoc&feed=rss",
    source: "NEJM",
    category: "clinical",
  },
  // Industry
  {
    url: "https://www.statnews.com/feed/",
    source: "STAT News",
    category: "industry",
  },
  {
    url: "https://medcitynews.com/feed/",
    source: "MedCity News",
    category: "industry",
  },
  {
    url: "https://www.fiercepharma.com/rss/xml",
    source: "Fierce Pharma",
    category: "industry",
  },
  {
    url: "https://endpts.com/feed/",
    source: "Endpoints News",
    category: "industry",
  },
  // Regulatory
  {
    url: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml",
    source: "FDA",
    category: "regulatory",
  },
  {
    url: "https://www.ftc.gov/feeds/press-release.xml",
    source: "FTC",
    category: "regulatory",
  },
  {
    url: "https://www.cms.gov/newsroom/rss",
    source: "CMS",
    category: "regulatory",
  },
];

const GLP1_KEYWORDS = [
  "glp-1",
  "glp1",
  "semaglutide",
  "tirzepatide",
  "ozempic",
  "wegovy",
  "mounjaro",
  "zepbound",
  "liraglutide",
  "weight loss",
  "obesity",
  "compounded",
  "telehealth",
  "mso",
];

function isRelevant(title: string, summary: string): boolean {
  const text = (title + " " + summary).toLowerCase();
  // Regulatory feeds: always include (FDA/FTC/CMS news is broadly relevant)
  return GLP1_KEYWORDS.some((kw) => text.includes(kw));
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<NewsItem[]> {
  const parser = new Parser({ timeout: 8000 });
  try {
    const result = await parser.parseURL(feed.url);
    const items: NewsItem[] = [];

    for (const entry of result.items ?? []) {
      const title = entry.title?.trim() ?? "";
      const link = entry.link?.trim() ?? "";
      const pubDate = entry.pubDate ?? entry.isoDate ?? new Date().toISOString();
      const rawSummary =
        entry.contentSnippet ?? entry.content ?? entry.summary ?? "";
      const summary = stripHtml(rawSummary);

      if (!title || !link) continue;

      // For regulatory sources always include; for others filter by keywords
      const alwaysInclude = feed.category === "regulatory";
      if (!alwaysInclude && !isRelevant(title, summary)) continue;

      items.push({
        id: `${feed.source}-${Buffer.from(link).toString("base64").slice(0, 16)}`,
        title,
        link,
        pubDate,
        source: feed.source,
        category: feed.category,
        summary: summary || "Read the full article for details.",
      });
    }

    return items.slice(0, 6); // cap per source
  } catch {
    // Silently skip broken feeds — don't crash the page
    return [];
  }
}

export async function fetchNews(
  category?: NewsItem["category"]
): Promise<NewsItem[]> {
  const now = Date.now();

  // Serve from cache if fresh
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    const items = cache.items;
    return category ? items.filter((i) => i.category === category) : items;
  }

  // Fetch all feeds concurrently
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const all = results
    .flat()
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

  cache = { items: all, fetchedAt: now };

  return category ? all.filter((i) => i.category === category) : all;
}

export function formatPubDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
