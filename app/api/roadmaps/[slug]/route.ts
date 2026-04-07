import { NextResponse } from "next/server";
import { findRoadmap, getRoadmapProgress } from "@/lib/roadmap-service";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const roadmap = await findRoadmap(params.slug);

  if (!roadmap) {
    return NextResponse.json({ error: "Roadmap not found." }, { status: 404 });
  }

  const userId = "demo-user";
  const completedMilestones = await getRoadmapProgress(userId, roadmap.id);

  return NextResponse.json(
    {
      roadmap,
      completedMilestones,
      completion: Math.round(
        (completedMilestones.length /
          roadmap.data.phases.reduce(
            (acc, phase) => acc + phase.milestones.length,
            0,
          )) *
          100,
      ),
    },
    { status: 200 },
  );
}
