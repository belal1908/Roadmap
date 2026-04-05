import { generateRoadmap } from "@/lib/claude";
import {
  completionForRoadmap,
  createRoadmapRecord,
  getProgressForRoadmap,
  getPublicRoadmaps,
  getRoadmapBySlug,
  getTrending,
  getUserRoadmaps,
  incrementViewCount,
  markProgress,
  toggleRoadmapPublic,
} from "@/lib/in-memory-db";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { RoadmapRecord } from "@/types/roadmap";

export async function createRoadmapFromQuery(
  query: string,
  userId?: string | null,
): Promise<RoadmapRecord> {
  const roadmap = await generateRoadmap(query);
  const local = createRoadmapRecord({ query, data: roadmap, userId });

  const supabase = getSupabaseServerClient();
  if (!supabase || !userId) {
    return local;
  }

  await supabase.from("roadmaps").insert({
    id: local.id,
    user_id: userId,
    title: local.title,
    search_query: local.search_query,
    generated_at: local.generated_at,
    is_public: local.is_public,
    slug: local.slug,
    data: local.data,
  });

  return local;
}

export function findRoadmap(slug: string): RoadmapRecord | null {
  return getRoadmapBySlug(slug);
}

export function listPublicRoadmaps(category?: string): RoadmapRecord[] {
  return getPublicRoadmaps(category);
}

export function listTrendingRoadmaps(): RoadmapRecord[] {
  return getTrending(6);
}

export function markRoadmapViewed(slug: string): void {
  incrementViewCount(slug);
}

export function setRoadmapVisibility(
  slug: string,
  isPublic: boolean,
): RoadmapRecord | null {
  return toggleRoadmapPublic(slug, isPublic);
}

export async function updateMilestoneProgress(params: {
  userId: string;
  roadmapId: string;
  milestoneId: string;
  completed: boolean;
}) {
  const local = markProgress(params);
  const supabase = getSupabaseServerClient();

  if (supabase) {
    await supabase.from("progress").upsert({
      id: local.id,
      user_id: params.userId,
      roadmap_id: params.roadmapId,
      milestone_id: params.milestoneId,
      completed: params.completed,
      completed_at: local.completed_at,
    });
  }

  return local;
}

export function getRoadmapProgress(
  userId: string,
  roadmapId: string,
): string[] {
  return getProgressForRoadmap(userId, roadmapId)
    .filter((item) => item.completed)
    .map((item) => item.milestone_id);
}

export function getDashboardRoadmaps(
  userId: string,
): Array<RoadmapRecord & { completion: number }> {
  return getUserRoadmaps(userId);
}

export function getRoadmapCompletion(
  userId: string,
  roadmap: RoadmapRecord,
): number {
  return completionForRoadmap(userId, roadmap);
}
