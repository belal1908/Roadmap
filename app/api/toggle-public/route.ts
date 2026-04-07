import { NextResponse } from "next/server";
import { setRoadmapVisibility } from "@/lib/roadmap-service";

export async function POST(request: Request) {
  const body = (await request.json()) as { slug?: string; isPublic?: boolean };

  if (!body.slug || typeof body.isPublic !== "boolean") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const updated = await setRoadmapVisibility(body.slug, body.isPublic);

  if (!updated) {
    return NextResponse.json({ error: "Roadmap not found." }, { status: 404 });
  }

  return NextResponse.json({ roadmap: updated }, { status: 200 });
}
