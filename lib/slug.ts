import slugify from "slugify";

export function createRoadmapSlug(title: string): string {
  const base = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  const random = Math.random().toString(36).slice(2, 6);
  return `${base || "roadmap"}-${random}`;
}
