"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { JobDemand } from "@/types/roadmap";

type Props = {
  query: string;
  active: boolean;
};

const demandColor: Record<JobDemand["demand"], string> = {
  High: "text-emerald-300",
  Medium: "text-amber-300",
  Low: "text-slate-300",
};

export default function JobMarketBadge({ query, active }: Props) {
  const [data, setData] = useState<JobDemand | null>(null);

  useEffect(() => {
    if (!active || data) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      const response = await fetch(`/api/job-demand?query=${encodeURIComponent(query)}`);
      if (!response.ok || cancelled) {
        return;
      }

      const payload = (await response.json()) as { demand: JobDemand };
      if (!cancelled) {
        setData(payload.demand);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [active, data, query]);

  if (!active) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs">
      <BriefcaseBusiness className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
      {!data ? (
        <span className="text-slate-300">Checking demand...</span>
      ) : (
        <span className="text-slate-200">
          {formatNumber(data.openRoles)} open roles ·{" "}
          <strong className={demandColor[data.demand]}>{data.demand} Demand</strong>
        </span>
      )}
    </div>
  );
}
