"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";

type Props = {
  placeholder?: string;
  initialValue?: string;
  compact?: boolean;
};

export default function SearchBar({
  placeholder = "Try: become a patent lawyer",
  initialValue = "",
  compact = false,
}: Props) {
  const [query, setQuery] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      setError("Enter a topic or goal first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const payload = (await response.json()) as {
        roadmap: {
          slug: string;
        };
      };

      router.push(`/roadmap/${payload.roadmap.slug}`);
    } catch {
      setError(
        "We could not generate a roadmap right now. Try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <label htmlFor="roadmap-query" className="sr-only">
        Search topic
      </label>
      <div
        className={`group flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 ring-1 ring-transparent transition focus-within:border-blue-500 focus-within:ring-blue-500 focus-within:ring-opacity-20 ${
          compact ? "h-12" : "h-14"
        }`}
      >
        <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
        <input
          id="roadmap-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          aria-label="Search for a roadmap topic"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            "Generate"
          )}
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
