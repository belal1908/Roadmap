import { NextResponse } from "next/server";
import { fetchYoutubeVideos } from "@/lib/youtube";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 },
      );
    }

    const videos = await fetchYoutubeVideos(query);
    return NextResponse.json({ videos }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Could not fetch videos." },
      { status: 500 },
    );
  }
}
