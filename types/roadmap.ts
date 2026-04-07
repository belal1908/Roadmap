import { z } from "zod";

export const resourceSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    author: z.string().optional(),
    platform: z.string().optional(),
    url: z.string().url().optional(),
  })
  .strict();

export const milestoneSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    skills: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    resources: z.array(resourceSchema).default([]),
    youtube_query: z.string(),
    job_skills_query: z.string(),
  })
  .strict();

export const phaseSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    level: z.string(),
    duration: z.string(),
    milestones: z.array(milestoneSchema).min(1),
  })
  .strict();

export const roadmapSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    estimated_duration: z.string(),
    category: z.string().default("Skill"),
    phases: z.array(phaseSchema).min(1),
  })
  .strict();

export type Resource = z.infer<typeof resourceSchema>;
export type Milestone = z.infer<typeof milestoneSchema>;
export type Phase = z.infer<typeof phaseSchema>;
export type Roadmap = z.infer<typeof roadmapSchema>;

export type RoadmapRecord = {
  id: string;
  slug: string;
  user_id: string | null;
  title: string;
  search_query: string;
  generated_at: string;
  is_public: boolean;
  view_count: number;
  category: string;
  data: Roadmap;
};

export type ProgressRecord = {
  id: string;
  user_id: string;
  roadmap_id: string;
  milestone_id: string;
  completed: boolean;
  completed_at: string | null;
};

export type MilestoneStatus = "pending" | "done" | "skip";

export type VideoItem = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  embedUrl: string;
};

export type JobDemand = {
  openRoles: number;
  demand: "High" | "Medium" | "Low";
};
