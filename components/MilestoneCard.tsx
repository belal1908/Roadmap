"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, ExternalLink, SkipForward } from "lucide-react";
import { useMemo } from "react";
import JobMarketBadge from "@/components/JobMarketBadge";
import type { Milestone, MilestoneStatus } from "@/types/roadmap";

type Props = {
  milestone: Milestone;
  open: boolean;
  onToggle: () => void;
  status: MilestoneStatus;
  onStatusChange: (status: MilestoneStatus) => void;
};

const TOOL_LINKS: Record<string, string> = {
  github: "https://github.com",
  gitlab: "https://gitlab.com",
  notion: "https://www.notion.so",
  figma: "https://www.figma.com",
  canva: "https://www.canva.com",
  linkedin: "https://www.linkedin.com",
  vscode: "https://code.visualstudio.com",
};

function resolveToolUrl(tool: string): string {
  const key = tool.toLowerCase();
  for (const [name, url] of Object.entries(TOOL_LINKS)) {
    if (key.includes(name)) {
      return url;
    }
  }

  return `https://www.google.com/search?q=${encodeURIComponent(tool)}`;
}

function resolveResourceUrl(resource: Milestone["resources"][number]): string {
  if (resource.url) {
    return resource.url;
  }

  const parts = [resource.title, resource.platform, resource.author].filter(
    Boolean,
  );
  return `https://www.google.com/search?q=${encodeURIComponent(parts.join(" "))}`;
}

export default function MilestoneCard({
  milestone,
  open,
  onToggle,
  status,
  onStatusChange,
}: Props) {
  const statusChip = useMemo(() => {
    if (status === "done") {
      return {
        label: "Done",
        icon: (
          <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
        ),
        classes: "border-green-200 bg-green-50 text-green-700",
      };
    }

    if (status === "skip") {
      return {
        label: "Skipped",
        icon: (
          <SkipForward className="h-4 w-4 text-amber-600" aria-hidden="true" />
        ),
        classes: "border-amber-200 bg-amber-50 text-amber-700",
      };
    }

    return {
      label: "Pending",
      icon: <Circle className="h-4 w-4 text-gray-400" aria-hidden="true" />,
      classes: "border-gray-200 bg-gray-50 text-gray-600",
    };
  }, [status]);

  const statusButtons: Array<{ label: string; value: MilestoneStatus }> = [
    { label: "Pending", value: "pending" },
    { label: "Done", value: "done" },
    { label: "Skip", value: "skip" },
  ];

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-blue-300"
      tabIndex={0}
      onKeyDown={(event) => {
        const key = event.key.toLowerCase();
        if (key === "d") {
          event.preventDefault();
          onStatusChange("done");
        } else if (key === "p") {
          event.preventDefault();
          onStatusChange("pending");
        } else if (key === "s") {
          event.preventDefault();
          onStatusChange("skip");
        } else if (key === "r") {
          event.preventDefault();
          onStatusChange("pending");
        }
      }}
      aria-label={`${milestone.title} milestone`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          onClick={onToggle}
          className="text-left"
          aria-expanded={open}
          aria-controls={`milestone-${milestone.id}`}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {milestone.id.replaceAll("_", " ")}
          </p>
          <h4 className="mt-1 text-lg font-semibold text-gray-900">
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
            <p className="text-sm leading-6 text-gray-600">
              {milestone.description}
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {milestone.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700 border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  Tools
                </p>
                <div className="flex flex-wrap gap-2">
                  {milestone.tools.map((tool) => (
                    <a
                      key={tool}
                      href={resolveToolUrl(tool)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs text-purple-700 hover:border-purple-300"
                    >
                      {tool}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  Articles & Blogs
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {milestone.resources.map((resource) => (
                    <li key={`${resource.type}:${resource.title}`}>
                      <a
                        href={resolveResourceUrl(resource)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-700 hover:underline"
                      >
                        {resource.title}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>{" "}
                      <span className="text-gray-400 text-xs">
                        · {resource.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <JobMarketBadge query={milestone.job_skills_query} active={open} />

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status Controls (keyboard: D done, P pending, S skip, R reset)
              </p>
              <div className="flex flex-wrap gap-2">
                {statusButtons.map((button) => (
                  <button
                    key={button.value}
                    type="button"
                    onClick={() => onStatusChange(button.value)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      status === button.value
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onStatusChange("pending")}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
