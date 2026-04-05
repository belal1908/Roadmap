import type { Roadmap, RoadmapRecord } from "@/types/roadmap";

function makeDemoRoadmap(topic: string, category: string): Roadmap {
  return {
    title: `Become Confident in ${topic}`,
    description: `A practical roadmap to build real-world capability in ${topic}.`,
    estimated_duration: "4-8 months",
    category,
    phases: [
      {
        id: "phase_1",
        title: "Foundations",
        level: "Beginner",
        duration: "4-6 weeks",
        milestones: [
          {
            id: "milestone_1_1",
            title: `Understand ${topic} fundamentals`,
            description: "Build core concepts and vocabulary to avoid blind trial-and-error.",
            skills: ["Terminology", "Core concepts", "Learning strategy"],
            tools: ["Notion", "YouTube", "Spaced repetition"],
            resources: [
              {
                type: "course",
                title: `${topic} for Beginners",
                platform: "Coursera",
              },
            ],
            youtube_query: `${topic} full beginner guide`,
            job_skills_query: `${topic} fundamentals`,
          },
          {
            id: "milestone_1_2",
            title: "Practice with guided mini-projects",
            description: "Apply fundamentals in short, constrained exercises.",
            skills: ["Execution", "Feedback loops"],
            tools: ["Pomodoro timer", "Templates"],
            resources: [
              {
                type: "book",
                title: "Ultralearning",
                author: "Scott Young",
              },
            ],
            youtube_query: `${topic} project tutorial`,
            job_skills_query: `${topic} practical skills`,
          },
        ],
      },
      {
        id: "phase_2",
        title: "Applied Work",
        level: "Intermediate",
        duration: "6-10 weeks",
        milestones: [
          {
            id: "milestone_2_1",
            title: `Build a portfolio-grade ${topic} project`,
            description: "Create one substantial artifact you can publish or present.",
            skills: ["Project planning", "Delivery", "Documentation"],
            tools: ["GitHub", "Canva"],
            resources: [
              {
                type: "course",
                title: "Project-based learning masterclass",
                platform: "Udemy",
              },
            ],
            youtube_query: `${topic} portfolio project walkthrough`,
            job_skills_query: `${topic} portfolio`,
          },
        ],
      },
      {
        id: "phase_3",
        title: "Career Readiness",
        level: "Advanced",
        duration: "4-8 weeks",
        milestones: [
          {
            id: "milestone_3_1",
            title: `Position your ${topic} skills for opportunities`,
            description: "Translate your capabilities into market-relevant language.",
            skills: ["Personal branding", "Interview readiness", "Networking"],
            tools: ["LinkedIn", "Resume builder"],
            resources: [
              {
                type: "article",
                title: "How to present your projects to recruiters",
              },
            ],
            youtube_query: `${topic} interview preparation`,
            job_skills_query: `${topic} jobs`,
          },
        ],
      },
    ],
  };
}

export const seedRoadmaps: RoadmapRecord[] = [
  {
    id: "seed-1",
    slug: "become-a-ux-designer-for-gaming-a91k",
    user_id: null,
    title: "Become a UX Designer for Gaming",
    search_query: "become a ux designer for gaming",
    generated_at: new Date().toISOString(),
    is_public: true,
    view_count: 320,
    category: "Career",
    data: makeDemoRoadmap("Gaming UX Design", "Career"),
  },
  {
    id: "seed-2",
    slug: "learn-sourdough-baking-professionally-p3mt",
    user_id: null,
    title: "Learn Sourdough Baking Professionally",
    search_query: "learn sourdough baking professionally",
    generated_at: new Date().toISOString(),
    is_public: true,
    view_count: 280,
    category: "Lifestyle",
    data: makeDemoRoadmap("Sourdough Baking", "Lifestyle"),
  },
  {
    id: "seed-3",
    slug: "become-a-patent-lawyer-xk92",
    user_id: null,
    title: "Become a Patent Lawyer",
    search_query: "become a patent lawyer",
    generated_at: new Date().toISOString(),
    is_public: true,
    view_count: 412,
    category: "Legal/Finance",
    data: makeDemoRoadmap("Patent Law", "Legal/Finance"),
  },
];

export function createFallbackRoadmap(query: string): Roadmap {
  const trimmed = query.trim();
  const title = trimmed.length > 0 ? trimmed : "a New Skill";

  return makeDemoRoadmap(title, inferCategory(title));
}

export function inferCategory(query: string): string {
  const value = query.toLowerCase();

  if (/(engineer|developer|data|ai|cloud|devops|frontend|backend|programming)/.test(value)) {
    return "Tech";
  }

  if (/(law|finance|bank|account|invest|compliance)/.test(value)) {
    return "Legal/Finance";
  }

  if (/(design|music|art|photo|video|writer|creative)/.test(value)) {
    return "Creative";
  }

  if (/(career|job|interview|resume|recruiter)/.test(value)) {
    return "Career";
  }

  if (/(fitness|cooking|baking|health|lifestyle)/.test(value)) {
    return "Lifestyle";
  }

  return "Skill";
}
