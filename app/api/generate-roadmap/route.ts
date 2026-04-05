import { NextResponse } from "next/server";
import { createRoadmapFromQuery } from "@/lib/roadmap-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string; userId?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 },
      );
    }

    const roadmap = await createRoadmapFromQuery(query, body.userId ?? null);
    return NextResponse.json({ roadmap }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "We could not generate a roadmap right now. Please try again." },
      { status: 500 },
    );
  }
}
