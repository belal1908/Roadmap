import { demandFromCount } from "@/lib/utils";
import type { JobDemand } from "@/types/roadmap";

type AdzunaResponse = {
  count?: number;
};

export async function fetchJobDemand(query: string): Promise<JobDemand> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    const pseudoCount = 500 + (query.length % 2500);
    return {
      openRoles: pseudoCount,
      demand: demandFromCount(pseudoCount),
    };
  }

  const url = new URL("https://api.adzuna.com/v1/api/jobs/us/search/1");
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("results_per_page", "1");
  url.searchParams.set("what", query);
  url.searchParams.set("content-type", "application/json");

  try {
    const response = await fetch(url.toString(), { next: { revalidate: 900 } });
    if (!response.ok) {
      throw new Error("Adzuna request failed");
    }

    const data = (await response.json()) as AdzunaResponse;
    const openRoles = data.count ?? 0;

    return {
      openRoles,
      demand: demandFromCount(openRoles),
    };
  } catch {
    const fallback = 400 + (query.length % 1800);
    return {
      openRoles: fallback,
      demand: demandFromCount(fallback),
    };
  }
}
