import Link from "next/link";
import { ArrowRight } from "lucide-react";

type DashboardRoadmap = {
  slug: string;
  title: string;
  completion: number;
  generated_at: string;
};

type Props = {
  roadmaps: DashboardRoadmap[];
};

export default function ProgressDashboard({ roadmaps }: Props) {
  if (roadmaps.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-slate-300">
        No saved roadmaps yet. Generate one from the homepage to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {roadmaps.map((roadmap) => (
        <article
          key={roadmap.slug}
          className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
        >
          <h3 className="text-lg font-semibold text-slate-100">
            {roadmap.title}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Last activity: {new Date(roadmap.generated_at).toLocaleDateString()}
          </p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Completion</span>
              <span>{roadmap.completion}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300"
                style={{ width: `${roadmap.completion}%` }}
              />
            </div>
          </div>

          <Link
            href={`/roadmap/${roadmap.slug}`}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  );
}
