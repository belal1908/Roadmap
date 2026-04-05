import { createRoadmapSlug } from "@/lib/slug";
import { completionPercentage } from "@/lib/utils";
import {
  createFallbackRoadmap,
  inferCategory,
  seedRoadmaps,
} from "@/lib/sample-data";
import type { ProgressRecord, Roadmap, RoadmapRecord } from "@/types/roadmap";

const roadmaps = new Map<string, RoadmapRecord>();
const progress = new Map<string, ProgressRecord>();

for (const item of seedRoadmaps) {
  roadmaps.set(item.slug, item);
}

export function createRoadmapRecord(params: {
  query: string;
  data?: Roadmap;
  userId?: string | null;
}): RoadmapRecord {
  const data = params.data ?? createFallbackRoadmap(params.query);
  const title = data.title || `Roadmap for ${params.query}`;

  const record: RoadmapRecord = {
    id: crypto.randomUUID(),
    slug: createRoadmapSlug(title),
    user_id: params.userId ?? null,
    title,
    search_query: params.query,
    generated_at: new Date().toISOString(),
    is_public: false,
    view_count: 0,
    category: data.category || inferCategory(params.query),
    data,
  };

  roadmaps.set(record.slug, record);
  return record;
}

export function getRoadmapBySlug(slug: string): RoadmapRecord | null {
  return roadmaps.get(slug) ?? null;
}

export function getPublicRoadmaps(category?: string): RoadmapRecord[] {
  const items = Array.from(roadmaps.values()).filter((item) => item.is_public);
  const filtered =
    category && category !== "All"
      ? items.filter((item) => item.category === category)
      : items;

  return filtered.sort((a, b) => b.view_count - a.view_count);
}

export function getTrending(limit = 6): RoadmapRecord[] {
  return getPublicRoadmaps().slice(0, limit);
}

export function incrementViewCount(slug: string): void {
  const item = roadmaps.get(slug);
  if (!item) {
    return;
  }

  item.view_count += 1;
  roadmaps.set(slug, item);
}

export function toggleRoadmapPublic(
  slug: string,
  isPublic: boolean,
): RoadmapRecord | null {
  const item = roadmaps.get(slug);
  if (!item) {
    return null;
  }

  item.is_public = isPublic;
  roadmaps.set(slug, item);
  return item;
}

export function markProgress(params: {
  userId: string;
  roadmapId: string;
  milestoneId: string;
  completed: boolean;
}): ProgressRecord {
  const key = `${params.userId}:${params.roadmapId}:${params.milestoneId}`;

  const existing = progress.get(key);
  const record: ProgressRecord = {
    id: existing?.id ?? crypto.randomUUID(),
    user_id: params.userId,
    roadmap_id: params.roadmapId,
    milestone_id: params.milestoneId,
    completed: params.completed,
    completed_at: params.completed ? new Date().toISOString() : null,
  };

  progress.set(key, record);
  return record;
}

export function getProgressForRoadmap(
  userId: string,
  roadmapId: string,
): ProgressRecord[] {
  return Array.from(progress.values()).filter(
    (item) => item.user_id === userId && item.roadmap_id === roadmapId,
  );
}

export function completionForRoadmap(
  userId: string,
  roadmap: RoadmapRecord,
): number {
  const done = new Set(
    getProgressForRoadmap(userId, roadmap.id)
      .filter((item) => item.completed)
      .map((item) => item.milestone_id),
  );

  const total = roadmap.data.phases.reduce(
    (acc, phase) => acc + phase.milestones.length,
    0,
  );
  return completionPercentage(done.size, total);
}

export function getUserRoadmaps(
  userId: string,
): Array<RoadmapRecord & { completion: number }> {
  const owned = Array.from(roadmaps.values()).filter(
    (item) => item.user_id === userId,
  );

  return owned
    .map((item) => ({
      ...item,
      completion: completionForRoadmap(userId, item),
    }))
    .sort((a, b) => +new Date(b.generated_at) - +new Date(a.generated_at));
}
