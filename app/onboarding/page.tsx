"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import QuestionnaireWizard, {
  type QuestionnaireAnswer,
} from "@/components/QuestionnaireWizard";

export default function OnboardingPage() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  async function handleQuestionnaireComplete(answers: QuestionnaireAnswer) {
    setGenerating(true);

    const prompt = buildPromptFromAnswers(answers);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: prompt }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const payload = (await response.json()) as {
        roadmap: { slug: string };
      };

      router.push(`/roadmap/${payload.roadmap.slug}`);
    } catch {
      alert("Failed to generate roadmap. Please try again.");
      setGenerating(false);
    }
  }

  if (generating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          <p className="mt-4 text-slate-300">
            Creating your personalized roadmap...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout currentHref="/onboarding">
      <QuestionnaireWizard onComplete={handleQuestionnaireComplete} />
    </AppLayout>
  );
}

function buildPromptFromAnswers(answers: QuestionnaireAnswer): string {
  const parts: string[] = [];

  if (answers.learningGoal) {
    const goalMap: Record<string, string> = {
      get_job: "secure a job",
      grow_current: "grow in my current role",
      build_projects: "build projects and side hustles",
      fundamentals: "strengthen my fundamentals",
      explore_new: "explore a completely new field",
    };
    parts.push(
      `My main goal is to ${goalMap[answers.learningGoal] || answers.learningGoal}`,
    );
  }

  if (answers.experience) {
    const expMap: Record<string, string> = {
      beginner: "I have no prior experience",
      some: "I have 1-2 years of experience",
      intermediate: "I have 2-5 years of experience",
      advanced: "I have 5+ years of experience",
    };
    parts.push(expMap[answers.experience] || "");
  }

  if (answers.timeCommitment) {
    const timeMap: Record<string, string> = {
      low: "I can commit less than 5 hours per week",
      medium: "I can commit 5-10 hours per week",
      high: "I can commit 10-20 hours per week",
      very_high: "I can commit 20+ hours per week",
    };
    parts.push(timeMap[answers.timeCommitment] || "");
  }

  if (answers.learningStyle) {
    const styleMap: Record<string, string> = {
      video: "I prefer learning through video tutorials",
      written: "I prefer written courses and books",
      projects: "I learn best by doing hands-on projects",
      mixed: "I like a mix of all learning formats",
    };
    parts.push(styleMap[answers.learningStyle] || "");
  }

  if (answers.resources && answers.resources.length > 0) {
    const resourceLabels = answers.resources
      .map((r) => {
        const map: Record<string, string> = {
          youtube: "YouTube",
          paid_courses: "Paid courses",
          free_courses: "Free courses",
          books: "Books",
          docs: "Documentation",
          community: "Community forums",
        };
        return map[r] || r;
      })
      .join(", ");
    parts.push(`I'm interested in using: ${resourceLabels}`);
  }

  return (
    parts.filter(Boolean).join(". ") ||
    "Create a comprehensive learning roadmap for me based on industry best practices."
  );
}
