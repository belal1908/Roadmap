import { NextResponse } from "next/server";
import { markRoadmapViewed } from "@/lib/roadmap-service";

export async function POST(request: Request) {
  const body = (await request.json()) as { slug?: string };

  if (!body.slug) {
    return NextResponse.json({ error: "slug is required." }, { status: 400 });
  }

  await markRoadmapViewed(body.slug);
  return NextResponse.json({ ok: true }, { status: 200 });
}
