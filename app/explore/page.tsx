import Link from "next/link";
import { listPublicRoadmaps } from "@/lib/roadmap-service";

const categories = [
  "All",
  "Career",
  "Tech",
  "Creative",
  "Legal/Finance",
  "Lifestyle",
  "Skill",
];

export const dynamic = "force-dynamic";

export default function ExplorePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category || "All";
  const items = listPublicRoadmaps(category);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-cyan-300">
          Explore
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-100 md:text-4xl">
          Community Roadmaps
        </h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((item) => (
          <Link
            key={item}
            href={
              item === "All"
                ? "/explore"
                : `/explore?category=${encodeURIComponent(item)}`
            }
            className={`rounded-full border px-3 py-1 text-sm transition ${
              item === category
                ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-100"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
            }`}
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((roadmap) => (
          <article
            key={roadmap.slug}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
          >
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>{roadmap.category}</span>
              <span>{roadmap.view_count} views</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-100">
              {roadmap.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-300">
              {roadmap.data.description}
            </p>
            <Link
              href={`/roadmap/${roadmap.slug}`}
              className="mt-4 inline-flex rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
            >
              Open Roadmap
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
