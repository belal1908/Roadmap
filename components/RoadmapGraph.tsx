"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import MilestoneCard from "@/components/MilestoneCard";
import PhaseTracker from "@/components/PhaseTracker";
import { completionPercentage } from "@/lib/utils";
import type { RoadmapRecord } from "@/types/roadmap";

type Props = {
  roadmap: RoadmapRecord;
  initialCompletedMilestones?: string[];
};

export default function RoadmapGraph({
  roadmap,
  initialCompletedMilestones = [],
}: Props) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(
    null,
  );
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(
    new Set(initialCompletedMilestones),
  );

  const totalMilestones = useMemo(
    () =>
      roadmap.data.phases.reduce(
        (acc, phase) => acc + phase.milestones.length,
        0,
      ),
    [roadmap.data.phases],
  );

  const completion = completionPercentage(
    completedMilestones.size,
    totalMilestones,
  );

  return (
    <div className="space-y-8">
      <PhaseTracker value={completion} />

      {roadmap.data.phases.map((phase, phaseIndex) => (
        <section key={phase.id} className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan-300">
                Phase {phaseIndex + 1} · {phase.level}
              </p>
              <h3 className="text-2xl font-bold text-slate-100">
                {phase.title}
              </h3>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
              {phase.duration}
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: phaseIndex * 0.05 }}
            className="space-y-3"
          >
            {phase.milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                roadmapId={roadmap.id}
                milestone={milestone}
                open={expandedMilestone === milestone.id}
                completed={completedMilestones.has(milestone.id)}
                onToggle={() => {
                  setExpandedMilestone((prev) =>
                    prev === milestone.id ? null : milestone.id,
                  );
                }}
                onComplete={(isDone) => {
                  setCompletedMilestones((prev) => {
                    const next = new Set(prev);
                    if (isDone) {
                      next.add(milestone.id);
                    } else {
                      next.delete(milestone.id);
                    }
                    return next;
                  });
                }}
              />
            ))}
          </motion.div>
        </section>
      ))}
    </div>
  );
}
