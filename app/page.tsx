import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { listTrendingRoadmaps } from "@/lib/roadmap-service";

export default async function Home() {
  const trending = await listTrendingRoadmaps();

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Any Goal. One Roadmap.
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Generate personalized, phase-by-phase learning paths for careers,
              skills, and niche interests with curated videos and real-time job
              demand data.
            </p>
          </div>

          {/* Search Section */}
          <div className="mt-8 max-w-2xl">
            <SearchBar />
            <div className="mt-4 text-center text-sm text-gray-500">or</div>
            <Link
              href="/onboarding"
              className="mt-4 block rounded-lg border-2 border-blue-600 bg-blue-50 py-3 px-4 text-center font-semibold text-blue-600 hover:bg-blue-100 transition"
            >
              Get Personalized Recommendations →
            </Link>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Avg Generation", value: "< 5 sec" },
              { label: "Roadmaps", value: "100+" },
              { label: "Users", value: "50K+" },
              { label: "AI Powered", value: "Claude" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-gray-200 p-4 bg-gray-50"
              >
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 md:py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Trending This Week
            </h2>
            <Link
              href="/explore"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((roadmap) => (
              <article
                key={roadmap.slug}
                className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                    {roadmap.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {roadmap.view_count} views
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {roadmap.title}
                </h3>
                <p className="mt-3 text-gray-600 line-clamp-2">
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
      </section>
    </main>
  );
}
