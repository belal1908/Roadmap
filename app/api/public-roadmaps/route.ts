import { NextResponse } from "next/server";
import {
  listPublicRoadmaps,
  listTrendingRoadmaps,
} from "@/lib/roadmap-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;

  return NextResponse.json(
    {
      trending: listTrendingRoadmaps(),
      roadmaps: listPublicRoadmaps(category),
    },
    { status: 200 },
  );
}
