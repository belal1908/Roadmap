"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import JobMarketBadge from "@/components/JobMarketBadge";
import VideoCard from "@/components/VideoCard";
import type { Milestone, VideoItem } from "@/types/roadmap";

type Props = {
  roadmapId: string;
  milestone: Milestone;
  open: boolean;
  onToggle: () => void;
  completed: boolean;
  onComplete: (completed: boolean) => void;
};

export default function MilestoneCard({
  roadmapId,
  milestone,
  open,
  onToggle,
  completed,
  onComplete,
}: Props) {
  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [loadingVideos, setLoadingVideos] = useState(false);

  useEffect(() => {
    if (!open || videos) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoadingVideos(true);
      try {
        const response = await fetch("/api/fetch-videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: milestone.youtube_query }),
        });

        if (!response.ok || cancelled) {
          return;
        }

        const payload = (await response.json()) as { videos: VideoItem[] };
        if (!cancelled) {
          setVideos(payload.videos);
        }
      } finally {
        if (!cancelled) {
          setLoadingVideos(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [milestone.youtube_query, open, videos]);

  const statusChip = useMemo(() => {
    if (completed) {
      return {
        label: "Completed",
        icon: (
          <CheckCircle2
            className="h-4 w-4 text-emerald-300"
            aria-hidden="true"
          />
        ),
        classes: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
      };
    }

    if (open) {
      return {
        label: "In progress",
        icon: (
          <CircleDot className="h-4 w-4 text-amber-300" aria-hidden="true" />
        ),
        classes: "border-amber-400/40 bg-amber-400/10 text-amber-200",
      };
    }

    return {
      label: "Not started",
      icon: <Circle className="h-4 w-4 text-slate-300" aria-hidden="true" />,
      classes: "border-slate-500/40 bg-slate-500/10 text-slate-200",
    };
  }, [completed, open]);

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          onClick={onToggle}
          className="text-left"
          aria-expanded={open}
          aria-controls={`milestone-${milestone.id}`}
        >
          <p className="text-sm text-slate-300">
            {milestone.id.replaceAll("_", " ")}
          </p>
          <h4 className="mt-1 text-lg font-semibold text-slate-100">
            {milestone.title}
          </h4>
        </button>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusChip.classes}`}
        >
          {statusChip.icon}
          {statusChip.label}
        </span>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={`milestone-${milestone.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4"
          >
            <p className="text-sm leading-6 text-slate-300">
              {milestone.description}
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {milestone.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                  Tools
                </p>
                <div className="flex flex-wrap gap-2">
                  {milestone.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                  Resources
                </p>
                <ul className="space-y-1 text-sm text-slate-200">
                  {milestone.resources.map((resource) => (
                    <li key={`${resource.type}:${resource.title}`}>
                      {resource.title} ·{" "}
                      <span className="text-slate-400">{resource.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <JobMarketBadge query={milestone.job_skills_query} active={open} />

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                Video Lessons
              </p>
              {loadingVideos && !videos ? (
                <p className="text-sm text-slate-300">Loading videos...</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-3">
                  {videos?.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={async () => {
                const nextCompleted = !completed;
                onComplete(nextCompleted);

                await fetch("/api/progress", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    roadmapId,
                    milestoneId: milestone.id,
                    completed: nextCompleted,
                  }),
                });
              }}
              className="inline-flex rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
            >
              {completed ? "Mark as Incomplete" : "Mark as Complete"}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
