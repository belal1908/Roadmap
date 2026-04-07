import Link from "next/link";
import ProgressDashboard from "@/components/ProgressDashboard";
import { getDashboardRoadmaps } from "@/lib/roadmap-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const demoUser = "demo-user";
  const roadmaps = await getDashboardRoadmaps(demoUser);

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Your Learning Progress
            </h1>
            <p className="mt-2 text-gray-600">Track your roadmap completion</p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            + Generate New
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <ProgressDashboard roadmaps={roadmaps} />
      </div>
    </main>
  );
}
