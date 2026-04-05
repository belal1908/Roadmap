import { NextResponse } from "next/server";
import { updateMilestoneProgress } from "@/lib/roadmap-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      roadmapId?: string;
      milestoneId?: string;
      completed?: boolean;
      userId?: string;
    };

    if (
      !body.roadmapId ||
      !body.milestoneId ||
      typeof body.completed !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const record = await updateMilestoneProgress({
      userId: body.userId ?? "demo-user",
      roadmapId: body.roadmapId,
      milestoneId: body.milestoneId,
      completed: body.completed,
    });

    return NextResponse.json({ progress: record }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update progress." },
      { status: 500 },
    );
  }
}
