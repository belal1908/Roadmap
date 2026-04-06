import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { listTrendingRoadmaps } from "@/lib/roadmap-service";

export default function Home() {
  const trending = listTrendingRoadmaps();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(45,212,191,0.2),transparent_45%),radial-gradient(circle_at_95%_20%,rgba(56,189,248,0.2),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-8 md:pt-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              RoadmapAI
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-100 md:text-5xl">
              Any Goal. One Roadmap.
            </h1>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/explore"
              className="rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-400"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-400"
            >
              Dashboard
            </Link>
            <Link
              href="/auth"
              className="rounded-lg border border-cyan-500/60 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
            >
              Log in
            </Link>
          </nav>
        </header>

        <section className="mt-12 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Generate personalized, phase-by-phase learning paths for careers,
              skills, and niche interests with curated videos and real-time job
              demand data.
            </p>
            <div className="mt-6 max-w-2xl">
              <SearchBar />
              <div className="mt-3 text-center text-sm text-slate-400">or</div>
              <Link
                href="/onboarding"
                className="mt-3 inline-flex w-full rounded-xl border border-emerald-500/60 bg-emerald-500/10 py-3 justify-center text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
              >
                Get Personalized Recommendations →
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="rounded-full border border-slate-700 px-2 py-1">
                Claude-powered generation
              </span>
              <span className="rounded-full border border-slate-700 px-2 py-1">
                YouTube milestone learning
              </span>
              <span className="rounded-full border border-slate-700 px-2 py-1">
                Live market demand badges
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["Avg generation", "< 5 sec"],
              ["Return target", "40%+"],
              ["Roadmap rating", ">= 4/5"],
              ["Demand usage", "60%+"],
            ].map(([label, value]) => (
              <article
                key={label}
                className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4"
              >
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-bold text-cyan-100">{value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">
              Trending this week
            </h2>
            <Link
              href="/explore"
              className="text-sm text-cyan-300 hover:text-cyan-200"
            >
              See all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trending.map((roadmap) => (
              <article
                key={roadmap.slug}
                className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
              >
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{roadmap.category}</span>
                  <span>{roadmap.view_count} views</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {roadmap.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                  {roadmap.data.description}
                </p>
                <Link
                  href={`/roadmap/${roadmap.slug}`}
                  className="mt-4 inline-flex rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Open Roadmap
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
