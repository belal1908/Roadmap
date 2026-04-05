# RoadmapAI Implementation Plan

## Scope

This plan translates the PRD into delivery-ready engineering tasks for the first build.

## MVP Acceptance Criteria

- User can search any topic and receive a structured roadmap in <= 5 seconds in normal load conditions.
- Roadmap is rendered phase-by-phase with expandable milestone cards.
- Milestone cards load YouTube videos lazily.
- Logged-in users can save roadmap and track milestone progress.

## Execution Sequence

### Milestone A - Foundation (Week 1)

- Initialize Next.js 14 app router project with TypeScript and Tailwind.
- Install and configure shadcn/ui.
- Add shared design tokens and base layout.
- Add strict TypeScript, ESLint, and Prettier config.
- Define core types in types/roadmap.ts.

Definition of done:

- App runs locally.
- CI lint/typecheck pass.

### Milestone B - AI Roadmap Generation (Week 1-2)

- Build POST API route for roadmap generation.
- Implement Claude client with JSON-only prompt strategy.
- Add schema validation (zod) and one retry on invalid JSON.
- Build landing page search flow and loading states.

Definition of done:

- Query returns validated roadmap JSON or graceful error state.

### Milestone C - Roadmap Experience (Week 2)

- Implement RoadmapGraph and MilestoneCard components.
- Add expand/collapse transitions with Framer Motion.
- Add node states (not started, in progress, complete).
- Add responsive fallback list rendering for mobile.

Definition of done:

- Full roadmap is navigable and accessible from keyboard.

### Milestone D - External Data (Week 2-3)

- Implement YouTube API route and client-side lazy loading on expand.
- Filter out videos shorter than 3 minutes.
- Implement Adzuna API route and demand-level mapping.
- Cache per milestone query with short TTL to reduce API calls.

Definition of done:

- Milestone shows 2-3 relevant videos and a demand badge.

### Milestone E - Auth and Persistence (Week 3)

- Set up Supabase auth with email/password and Google OAuth.
- Add middleware session handling.
- Create SQL migrations for roadmaps and progress tables.
- Auto-save generated roadmaps for authenticated users.

Definition of done:

- Authenticated users can log in and see saved roadmaps persistently.

### Milestone F - Progress Dashboard (Week 3-4)

- Implement progress writes on mark-complete action.
- Build dashboard cards with completion and last activity.
- Add Continue action to first incomplete milestone.

Definition of done:

- Progress remains synced across sessions.

### Milestone G - Community Explore (Week 4)

- Implement public/private toggle and slug generation.
- Build explore page with category filter and sorting.
- Add trending section on landing page.

Definition of done:

- Public roadmaps are discoverable and viewable read-only.

## Core Technical Decisions

- Validate all Claude responses server-side before render/persist.
- Keep YouTube and Adzuna fetch lazy and cache-backed.
- Use RLS policies in Supabase to isolate user data.
- Keep roadmap JSON immutable; store user state separately in progress table.

## Risks and Mitigations

- LLM malformed output: use zod validation + single retry + fallback error UI.
- API quota/rate limits: lazy load + TTL cache + debounce expands.
- Slow initial render: defer secondary data fetches until user interaction.
- Public roadmap privacy leaks: separate progress from shared roadmap data.

## Suggested Backlog for Next Sprint (5-day)

1. Project bootstrap and UI shell.
2. Roadmap schema type and validator.
3. Claude route with retry/validation.
4. Search form and loading/error UX.
5. Basic roadmap graph render.
