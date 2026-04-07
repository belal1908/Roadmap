import { NextResponse } from "next/server";
import {
  listPublicRoadmaps,
  listTrendingRoadmaps,
} from "@/lib/roadmap-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;

  const [trending, roadmaps] = await Promise.all([
    listTrendingRoadmaps(),
    listPublicRoadmaps(category),
  ]);

  return NextResponse.json(
    {
      trending,
      roadmaps,
    },
    { status: 200 },
  );
}
