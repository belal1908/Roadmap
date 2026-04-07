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
import {
  getSupabaseServerClient,
  getSupabaseServiceClient,
} from "@/lib/supabase/server";
import type { RoadmapRecord } from "@/types/roadmap";

function asRoadmapRecord(row: unknown): RoadmapRecord | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const item = row as Partial<RoadmapRecord>;
  if (
    !item.id ||
    !item.slug ||
    !item.title ||
    !item.search_query ||
    !item.data
  ) {
    return null;
  }

  return {
    id: item.id,
    slug: item.slug,
    user_id: item.user_id ?? null,
    title: item.title,
    search_query: item.search_query,
    generated_at: item.generated_at ?? new Date().toISOString(),
    is_public: Boolean(item.is_public),
    view_count: Number(item.view_count ?? 0),
    category: item.category ?? "Skill",
    data: item.data,
  } as RoadmapRecord;
}

export async function createRoadmapFromQuery(
  query: string,
  userId?: string | null,
): Promise<RoadmapRecord> {
  const roadmap = await generateRoadmap(query);
  const local = createRoadmapRecord({ query, data: roadmap, userId });

  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();
  if (!supabase) {
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

export async function findRoadmap(slug: string): Promise<RoadmapRecord | null> {
  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();

  if (supabase) {
    const { data } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    const remote = asRoadmapRecord(data);
    if (remote) {
      return remote;
    }
  }

  return getRoadmapBySlug(slug);
}

export async function listPublicRoadmaps(
  category?: string,
): Promise<RoadmapRecord[]> {
  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();

  if (supabase) {
    let query = supabase
      .from("roadmaps")
      .select("*")
      .eq("is_public", true)
      .order("view_count", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data } = await query;
    if (Array.isArray(data)) {
      return data
        .map((item) => asRoadmapRecord(item))
        .filter((item): item is RoadmapRecord => item !== null);
    }
  }

  return getPublicRoadmaps(category);
}

export async function listTrendingRoadmaps(): Promise<RoadmapRecord[]> {
  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();

  if (supabase) {
    const { data } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("is_public", true)
      .order("view_count", { ascending: false })
      .limit(6);

    if (Array.isArray(data)) {
      return data
        .map((item) => asRoadmapRecord(item))
        .filter((item): item is RoadmapRecord => item !== null);
    }
  }

  return getTrending(6);
}

export async function markRoadmapViewed(slug: string): Promise<void> {
  incrementViewCount(slug);

  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();
  if (!supabase) {
    return;
  }

  const { data } = await supabase
    .from("roadmaps")
    .select("id, view_count")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    return;
  }

  await supabase
    .from("roadmaps")
    .update({ view_count: Number(data.view_count ?? 0) + 1 })
    .eq("id", data.id);
}

export async function setRoadmapVisibility(
  slug: string,
  isPublic: boolean,
): Promise<RoadmapRecord | null> {
  const local = toggleRoadmapPublic(slug, isPublic);

  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();
  if (!supabase) {
    return local;
  }

  const { data } = await supabase
    .from("roadmaps")
    .update({ is_public: isPublic })
    .eq("slug", slug)
    .select("*")
    .maybeSingle();

  return asRoadmapRecord(data) ?? local;
}

export async function updateMilestoneProgress(params: {
  userId: string;
  roadmapId: string;
  milestoneId: string;
  completed: boolean;
}) {
  const local = markProgress(params);
  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();

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

export async function getRoadmapProgress(
  userId: string,
  roadmapId: string,
): Promise<string[]> {
  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();

  if (supabase) {
    const { data } = await supabase
      .from("progress")
      .select("milestone_id, completed")
      .eq("user_id", userId)
      .eq("roadmap_id", roadmapId)
      .eq("completed", true);

    if (Array.isArray(data)) {
      return data.map((item) => item.milestone_id);
    }
  }

  return getProgressForRoadmap(userId, roadmapId)
    .filter((item) => item.completed)
    .map((item) => item.milestone_id);
}

export async function getDashboardRoadmaps(
  userId: string,
): Promise<Array<RoadmapRecord & { completion: number }>> {
  const supabase = getSupabaseServiceClient() ?? getSupabaseServerClient();

  if (supabase) {
    const { data } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .order("generated_at", { ascending: false });

    if (Array.isArray(data)) {
      const roadmaps = data
        .map((item) => asRoadmapRecord(item))
        .filter((item): item is RoadmapRecord => item !== null);

      const completedRows = await supabase
        .from("progress")
        .select("roadmap_id, milestone_id")
        .eq("user_id", userId)
        .eq("completed", true);

      const doneByRoadmap = new Map<string, Set<string>>();
      for (const row of completedRows.data ?? []) {
        const existing = doneByRoadmap.get(row.roadmap_id) ?? new Set<string>();
        existing.add(row.milestone_id);
        doneByRoadmap.set(row.roadmap_id, existing);
      }

      return roadmaps.map((item) => {
        const total = item.data.phases.reduce(
          (acc, phase) => acc + phase.milestones.length,
          0,
        );
        const completed = doneByRoadmap.get(item.id)?.size ?? 0;
        const completion =
          total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          ...item,
          completion,
        };
      });
    }
  }

  return getUserRoadmaps(userId);
}

export function getRoadmapCompletion(
  userId: string,
  roadmap: RoadmapRecord,
): number {
  return completionForRoadmap(userId, roadmap);
}
