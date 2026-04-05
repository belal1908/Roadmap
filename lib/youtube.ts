import type { VideoItem } from "@/types/roadmap";

type YoutubeResponse = {
  items: Array<{
    id: { videoId?: string };
    snippet: {
      title: string;
      channelTitle: string;
      thumbnails?: {
        medium?: { url: string };
        high?: { url: string };
        default?: { url: string };
      };
    };
    contentDetails?: {
      duration?: string;
    };
  }>;
};

function parseIsoDuration(value: string): number {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return 0;
  }

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatSeconds(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}

async function getVideoDurations(
  ids: string[],
  apiKey: string,
): Promise<Record<string, number>> {
  if (ids.length === 0) {
    return {};
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("id", ids.join(","));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), { next: { revalidate: 600 } });
  if (!response.ok) {
    return {};
  }

  const data = (await response.json()) as YoutubeResponse;
  const map: Record<string, number> = {};

  for (const item of data.items) {
    const videoId = item.id?.videoId;
    const duration = item.contentDetails?.duration;

    if (videoId && duration) {
      map[videoId] = parseIsoDuration(duration);
    }
  }

  return map;
}

function fallbackVideos(query: string): VideoItem[] {
  return [1, 2, 3].map((index) => ({
    id: `${query}-${index}`,
    title: `${query} guide ${index}`,
    channel: "RoadmapAI Picks",
    thumbnail:
      "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?auto=format&fit=crop&w=800&q=80",
    duration: index === 1 ? "14:22" : index === 2 ? "9:45" : "22:08",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  }));
}

export async function fetchYoutubeVideos(query: string): Promise<VideoItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return fallbackVideos(query);
  }

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("maxResults", "8");
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("order", "relevance");
  searchUrl.searchParams.set("key", apiKey);

  const searchResponse = await fetch(searchUrl.toString(), {
    next: { revalidate: 600 },
  });
  if (!searchResponse.ok) {
    return fallbackVideos(query);
  }

  const searchData = (await searchResponse.json()) as YoutubeResponse;
  const ids = searchData.items
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  const durationMap = await getVideoDurations(ids, apiKey);

  const videos = searchData.items
    .map((item) => {
      const id = item.id?.videoId;
      if (!id) {
        return null;
      }

      const durationSeconds = durationMap[id] ?? 0;
      const thumbnail =
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url ||
        "";

      return {
        id,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail,
        duration: formatSeconds(durationSeconds),
        embedUrl: `https://www.youtube.com/embed/${id}`,
        durationSeconds,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item) => item.durationSeconds >= 180)
    .slice(0, 3)
    .map(({ durationSeconds: _durationSeconds, ...item }) => item);

  return videos.length > 0 ? videos : fallbackVideos(query);
}
