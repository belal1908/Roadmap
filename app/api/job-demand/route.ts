import { NextResponse } from "next/server";
import { fetchJobDemand } from "@/lib/adzuna";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Query is required." }, { status: 400 });
  }

  try {
    const demand = await fetchJobDemand(query);
    return NextResponse.json({ demand }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Could not fetch demand data." },
      { status: 500 },
    );
  }
}
