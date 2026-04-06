import Link from "next/link";
import ProgressDashboard from "@/components/ProgressDashboard";
import { getDashboardRoadmaps } from "@/lib/roadmap-service";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const demoUser = "demo-user";
  const roadmaps = getDashboardRoadmaps(demoUser);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-300">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-100 md:text-4xl">
            Your Learning Progress
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
        >
          Generate New Roadmap
        </Link>
      </div>

      <ProgressDashboard roadmaps={roadmaps} />
    </main>
  );
}
