"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export type QuestionnaireAnswer = {
  learningGoal?: string;
  experience?: string;
  timeCommitment?: string;
  learningStyle?: string;
  resources?: string[];
};

type Question = {
  id: string;
  title: string;
  description?: string;
  type: "single" | "multiple" | "text";
  options: Array<{ label: string; value: string }>;
};

const questions: Question[] = [
  {
    id: "learning_goal",
    title: "What is your main learning goal?",
    type: "single",
    options: [
      { label: "Get a Job", value: "get_job" },
      { label: "Grow in my current role", value: "grow_current" },
      { label: "Build Projects / Side Hustles", value: "build_projects" },
      { label: "Strengthen Fundamentals", value: "fundamentals" },
      { label: "Explore a New Field", value: "explore_new" },
    ],
  },
  {
    id: "experience",
    title: "What is your current experience level?",
    type: "single",
    options: [
      { label: "Beginner / No experience", value: "beginner" },
      { label: "Some experience (1-2 years)", value: "some" },
      { label: "Intermediate (2-5 years)", value: "intermediate" },
      { label: "Advanced (5+ years)", value: "advanced" },
    ],
  },
  {
    id: "time_commitment",
    title: "How much time can you commit weekly?",
    type: "single",
    options: [
      { label: "< 5 hours", value: "low" },
      { label: "5-10 hours", value: "medium" },
      { label: "10-20 hours", value: "high" },
      { label: "20+ hours", value: "very_high" },
    ],
  },
  {
    id: "learning_style",
    title: "What is your preferred learning style?",
    type: "single",
    options: [
      { label: "Video tutorials", value: "video" },
      { label: "Written courses & books", value: "written" },
      { label: "Hands-on projects", value: "projects" },
      { label: "Mix of everything", value: "mixed" },
    ],
  },
  {
    id: "resources",
    title: "Which resources interest you most?",
    type: "multiple",
    options: [
      { label: "YouTube videos", value: "youtube" },
      { label: "Paid courses (Udemy, Coursera)", value: "paid_courses" },
      {
        label: "Free courses (freeCodeCamp, Khan Academy)",
        value: "free_courses",
      },
      { label: "Books", value: "books" },
      { label: "Developer docs & blogs", value: "docs" },
      { label: "Community (forums, Discord)", value: "community" },
    ],
  },
];

type Props = {
  onComplete: (answers: QuestionnaireAnswer) => void;
};

export default function QuestionnaireWizard({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswer>({});
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(),
  );

  const question = questions[currentStep];
  const progress = Math.round(((currentStep + 1) / questions.length) * 100);

  function handleSingleSelect(value: string) {
    setSelectedOptions(new Set([value]));
  }

  function handleMultipleSelect(value: string) {
    const next = new Set(selectedOptions);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setSelectedOptions(next);
  }

  function handleNext() {
    const updatedAnswers = { ...answers };

    if (question.type === "single" && selectedOptions.size > 0) {
      const value = Array.from(selectedOptions)[0];
      updatedAnswers[question.id as keyof QuestionnaireAnswer] = value as never;
    } else if (question.type === "multiple") {
      updatedAnswers.resources = Array.from(selectedOptions);
    }

    setAnswers(updatedAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOptions(new Set());
    } else {
      onComplete(updatedAnswers);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedOptions(new Set());
    }
  }

  const canContinue = selectedOptions.size > 0;

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-4">
      {/* Sidebar */}
      <aside className="col-span-1 border-r border-slate-700 bg-slate-900/50 p-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-cyan-300">
            Personalization
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-100">
            Learning Setup
          </h2>
        </div>

        <nav className="space-y-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => {
                if (index <= currentStep) {
                  setCurrentStep(index);
                  setSelectedOptions(new Set());
                }
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                index === currentStep
                  ? "border-l-2 border-cyan-400 bg-cyan-400/10 text-cyan-100"
                  : index < currentStep
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-400 cursor-not-allowed"
              }`}
              disabled={index > currentStep}
            >
              <span className="text-xs text-slate-400">Step {index + 1}</span>
              <p className="mt-1 truncate text-xs font-medium">
                {q.title.split("?")[0]}
              </p>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="col-span-1 flex flex-col items-center justify-center p-6 md:col-span-3">
        <div className="w-full max-w-2xl space-y-8">
          {/* Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>
                {currentStep + 1} of {questions.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div>
            <h1 className="text-4xl font-bold text-slate-100">
              {question.title}
            </h1>
            {question.description && (
              <p className="mt-2 text-slate-300">{question.description}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedOptions.has(option.value);
              const isSingle = question.type === "single";

              return (
                <button
                  key={option.value}
                  onClick={() => {
                    if (isSingle) {
                      handleSingleSelect(option.value);
                    } else {
                      handleMultipleSelect(option.value);
                    }
                  }}
                  className={`w-full rounded-xl border-2 p-4 text-left transition ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400/10 text-slate-100"
                      : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-400"
                          : "border-slate-500"
                      }`}
                    >
                      {isSelected && !isSingle && (
                        <div className="h-3 w-3 rounded-sm bg-slate-900" />
                      )}
                      {isSelected && isSingle && (
                        <div className="h-3 w-3 rounded-full bg-slate-900" />
                      )}
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-3 pt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-lg border border-slate-600 bg-slate-900 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canContinue}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === questions.length - 1
                ? "Create Roadmap"
                : "Next Question"}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
