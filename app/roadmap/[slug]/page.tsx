import Link from "next/link";
import { notFound } from "next/navigation";
import RoadmapGraph from "@/components/RoadmapGraph";
import { findRoadmap, markRoadmapViewed } from "@/lib/roadmap-service";

export default async function RoadmapPage({
  params,
}: {
  params: { slug: string };
}) {
  const roadmap = findRoadmap(params.slug);

  if (!roadmap) {
    notFound();
  }

  markRoadmapViewed(params.slug);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-300">
            Roadmap
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-100 md:text-4xl">
            {roadmap.title}
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            {roadmap.data.description}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Estimated Duration: {roadmap.data.estimated_duration}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
            {roadmap.category}
          </span>
          <Link
            href="/dashboard"
            className="rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <RoadmapGraph roadmap={roadmap} />
    </main>
  );
}
