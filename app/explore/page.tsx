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

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category || "All";
  const items = await listPublicRoadmaps(category);

  return (
    <main className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Community Roadmaps
          </h1>
          <p className="mt-2 text-gray-600">
            Explore roadmaps created by our community
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <Link
              key={item}
              href={
                item === "All"
                  ? "/explore"
                  : `/explore?category=${encodeURIComponent(item)}`
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                item === category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((roadmap) => (
            <article
              key={roadmap.slug}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                  {roadmap.category}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {roadmap.view_count} views
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {roadmap.title}
              </h2>
              <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                {roadmap.data.description}
              </p>
              <Link
                href={`/roadmap/${roadmap.slug}`}
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Open Roadmap
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
