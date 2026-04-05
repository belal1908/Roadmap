import Anthropic from "@anthropic-ai/sdk";
import { createFallbackRoadmap, inferCategory } from "@/lib/sample-data";
import { roadmapSchema, type Roadmap } from "@/types/roadmap";

const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT = `You are an expert curriculum designer.
Return ONLY valid JSON that matches this schema exactly:
{
  "title": string,
  "description": string,
  "estimated_duration": string,
  "category": string,
  "phases": [
    {
      "id": string,
      "title": string,
      "level": string,
      "duration": string,
      "milestones": [
        {
          "id": string,
          "title": string,
          "description": string,
          "skills": string[],
          "tools": string[],
          "resources": [{ "type": string, "title": string, "author"?: string, "platform"?: string, "url"?: string }],
          "youtube_query": string,
          "job_skills_query": string
        }
      ]
    }
  ]
}
Do not include markdown code fences, comments, or extra keys.`;

function extractJsonBlock(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

async function parseClaudeResponse(content: string): Promise<Roadmap> {
  const parsed = JSON.parse(extractJsonBlock(content));
  return roadmapSchema.parse(parsed);
}

async function generateWithClaude(query: string): Promise<Roadmap> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const fallback = createFallbackRoadmap(query);
    fallback.category = inferCategory(query);
    return fallback;
  }

  const anthropic = new Anthropic({ apiKey });

  const run = async () => {
    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a roadmap for: ${query}. If the topic is vague, make sensible assumptions and proceed.`,
        },
      ],
    });

    const message = completion.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const roadmap = await parseClaudeResponse(message);
    if (!roadmap.category) {
      roadmap.category = inferCategory(query);
    }

    return roadmap;
  };

  try {
    return await run();
  } catch {
    // Retry once on malformed JSON or transient API error.
    return await run();
  }
}

export async function generateRoadmap(query: string): Promise<Roadmap> {
  return generateWithClaude(query);
}
