import Link from "next/link";
import { notFound } from "next/navigation";
import RoadmapGraph from "@/components/RoadmapGraph";
import { findRoadmap, markRoadmapViewed } from "@/lib/roadmap-service";
import { Download, Share2 } from "lucide-react";

export default async function RoadmapPage({
  params,
}: {
  params: { slug: string };
}) {
  const roadmap = await findRoadmap(params.slug);

  if (!roadmap) {
    notFound();
  }

  await markRoadmapViewed(params.slug);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb & Top Actions */}
      <div className="border-b border-gray-200 bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Link
              href="/explore"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to All Roadmaps
            </Link>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-900 transition">
                <Download size={16} />
                Download
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-900 transition">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
              {roadmap.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{roadmap.title}</h1>
          <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">
            {roadmap.data.description}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Estimated Duration: {roadmap.data.estimated_duration}
          </p>

          {/* Tabs */}
          <div className="mt-8 flex gap-8 border-b border-gray-200">
            <button className="pb-4 px-1 font-semibold text-gray-900 border-b-2 border-blue-600 text-sm">
              Roadmap
            </button>
            <button className="pb-4 px-1 font-medium text-gray-500 hover:text-gray-700 text-sm">
              Projects
            </button>
            <button className="pb-4 px-1 font-medium text-gray-500 hover:text-gray-700 text-sm">
              AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Track your progress and get personalized recommendations
          </p>
          <Link
            href="/auth"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Sign up free
          </Link>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RoadmapGraph roadmap={roadmap} />
        </div>
      </div>
    </main>
  );
}
