import Image from "next/image";
import type { VideoItem } from "@/types/roadmap";

type Props = {
  video: VideoItem;
};

export default function VideoCard({ video }: Props) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noreferrer"
      className="group grid gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3 transition hover:border-cyan-400/40"
    >
      <div className="relative h-32 w-full overflow-hidden rounded-lg">
        <Image src={video.thumbnail} alt={video.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <p className="line-clamp-2 text-sm font-medium text-slate-100">{video.title}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="truncate">{video.channel}</span>
        <span>{video.duration}</span>
      </div>
    </a>
  );
}
