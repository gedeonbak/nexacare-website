import { NextRequest, NextResponse } from "next/server";
import { fetchNews, type NewsItem } from "@/lib/news";

export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as NewsItem["category"] | null;

  try {
    const items = await fetchNews(category ?? undefined);
    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    console.error("News API error:", err);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
