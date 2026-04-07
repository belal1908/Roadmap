"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import MilestoneCard from "@/components/MilestoneCard";
import PhaseTracker from "@/components/PhaseTracker";
import { completionPercentage } from "@/lib/utils";
import type { MilestoneStatus, RoadmapRecord } from "@/types/roadmap";

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
  const [milestoneStatuses, setMilestoneStatuses] = useState<
    Record<string, MilestoneStatus>
  >(() => {
    const initial: Record<string, MilestoneStatus> = {};

    for (const milestoneId of initialCompletedMilestones) {
      initial[milestoneId] = "done";
    }

    return initial;
  });

  const totalMilestones = useMemo(
    () =>
      roadmap.data.phases.reduce(
        (acc, phase) => acc + phase.milestones.length,
        0,
      ),
    [roadmap.data.phases],
  );

  const doneCount = useMemo(
    () =>
      Object.values(milestoneStatuses).filter((status) => status === "done")
        .length,
    [milestoneStatuses],
  );

  const completion = completionPercentage(doneCount, totalMilestones);

  async function persistStatus(milestoneId: string, status: MilestoneStatus) {
    await fetch("/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roadmapId: roadmap.id,
        milestoneId,
        completed: status === "done",
      }),
    });
  }

  return (
    <div className="space-y-8">
      <PhaseTracker value={completion} />
      <p className="text-xs text-gray-500">
        Keyboard shortcuts per topic: <strong>D</strong> done,{" "}
        <strong>P</strong> pending, <strong>S</strong> skip, <strong>R</strong>{" "}
        reset.
      </p>

      {roadmap.data.phases.map((phase, phaseIndex) => (
        <section key={phase.id} className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
                Phase {phaseIndex + 1} · {phase.level}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {phase.title}
              </h3>
            </div>
            <span className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 font-medium">
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
                milestone={milestone}
                open={expandedMilestone === milestone.id}
                status={milestoneStatuses[milestone.id] ?? "pending"}
                onToggle={() => {
                  setExpandedMilestone((prev) =>
                    prev === milestone.id ? null : milestone.id,
                  );
                }}
                onStatusChange={async (nextStatus) => {
                  setMilestoneStatuses((prev) => ({
                    ...prev,
                    [milestone.id]: nextStatus,
                  }));

                  await persistStatus(milestone.id, nextStatus);
                }}
              />
            ))}
          </motion.div>
        </section>
      ))}
    </div>
  );
}
