# RoadmapAI - Product Requirements Document (PRD)

Version: 1.0  
Last Updated: April 2026  
Status: Ready for Development

---

## 1. Product Overview

### 1.1 What Is RoadmapAI?

RoadmapAI is a dynamic, AI-powered learning path generator that transforms any topic, career goal, or skill into a structured, phase-by-phase roadmap with curated YouTube content, live job market demand data, and persistent progress tracking per user.

Unlike static platforms like roadmap.sh (which mostly cover tech roles), RoadmapAI works for any niche, from patent lawyers and kitchenware designers to retro game collectors and investment bankers. The roadmap is generated on-demand using Claude API and personalized to the exact search query.

### 1.2 Core Problem Being Solved

There is no single place where someone can search "how do I become X" or "how do I learn Y" and receive:

- A structured, visual, phase-based learning path
- Relevant video content per step
- Real job market data showing what skills are in demand
- The ability to track their own progress over time and return to it

### 1.3 Target Users

- Career switchers looking for a clear path into a new field
- Students wanting structured self-learning beyond university curricula
- Professionals upskilling within or adjacent to their domain
- Recruiters evaluating candidates via shareable progress profiles
- Curious learners exploring niche topics

---

## 2. Goals and Success Metrics

| Goal                                       | Metric                                       |
| ------------------------------------------ | -------------------------------------------- |
| Users can generate a roadmap for any topic | Roadmap generated within 5 seconds of search |
| Users return to track progress             | 40%+ return visit rate within 7 days         |
| Roadmaps feel personalized, not generic    | User rating >= 4/5 on roadmap quality        |
| YouTube content is always relevant         | < 10% of videos flagged as irrelevant        |
| Job market data adds value                 | Feature used in 60%+ of roadmap views        |

---

## 3. Tech Stack

### 3.1 Frontend

| Tool          | Version | Purpose                     |
| ------------- | ------- | --------------------------- |
| Next.js       | 14      | App framework, routing, SSR |
| TypeScript    | 5.x     | Type safety across codebase |
| Tailwind CSS  | 3.x     | Utility-first styling       |
| shadcn/ui     | Latest  | Component library           |
| Framer Motion | 11.x    | Animations and transitions  |

### 3.2 AI and Intelligence

| Tool                                  | Purpose                                             |
| ------------------------------------- | --------------------------------------------------- |
| Claude API (claude-sonnet-4-20250514) | Roadmap generation via structured JSON prompting    |
| Structured JSON prompting             | Ensures consistent, parseable roadmap schema output |

### 3.3 Content and Data APIs

| API                 | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| YouTube Data API v3 | Fetch 2-3 relevant videos per milestone                     |
| Adzuna API          | Live job market data: open roles and skill demand per topic |

### 3.4 Auth, Database, and Progress

| Tool                | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| Supabase Auth       | Sign up, log in, session management (email + OAuth) |
| Supabase PostgreSQL | Store users, roadmaps, milestones, progress state   |
| Supabase Realtime   | Sync progress instantly across devices              |

### 3.5 Deployment and DevOps

| Tool                         | Purpose                   |
| ---------------------------- | ------------------------- |
| Vercel                       | Hosting and CI/CD         |
| GitHub                       | Version control           |
| Vercel Environment Variables | Secure API key management |

---

## 4. Application Architecture

```text
/
|- app/
|  |- page.tsx                  # Landing page with search
|  |- roadmap/[id]/page.tsx     # Individual roadmap view
|  |- dashboard/page.tsx        # User saved roadmaps + progress
|  |- explore/page.tsx          # Trending + community roadmaps
|  \- auth/page.tsx             # Login / sign up
|
|- components/
|  |- SearchBar.tsx
|  |- RoadmapGraph.tsx
|  |- MilestoneCard.tsx
|  |- PhaseTracker.tsx
|  |- JobMarketBadge.tsx
|  |- VideoCard.tsx
|  \- ProgressDashboard.tsx
|
|- lib/
|  |- claude.ts
|  |- youtube.ts
|  |- adzuna.ts
|  \- supabase.ts
|
|- types/
|  \- roadmap.ts
|
\- api/
   |- generate-roadmap/route.ts
   |- fetch-videos/route.ts
   \- job-demand/route.ts
```

---

## 5. Database Schema

### 5.1 users table

Managed by Supabase Auth. Extended with:

```sql
id           uuid PRIMARY KEY
email        text
created_at   timestamp
display_name text
```

### 5.2 roadmaps table

```sql
id           uuid PRIMARY KEY
user_id      uuid REFERENCES users(id)
title        text
search_query text
generated_at timestamp
is_public    boolean DEFAULT false
slug         text UNIQUE
data         jsonb
```

### 5.3 progress table

```sql
id             uuid PRIMARY KEY
user_id        uuid REFERENCES users(id)
roadmap_id     uuid REFERENCES roadmaps(id)
milestone_id   text
completed      boolean DEFAULT false
completed_at   timestamp
```

---

## 6. Roadmap JSON Schema

```json
{
  "title": "Become a Patent Lawyer",
  "description": "A structured path from zero to practicing patent attorney",
  "estimated_duration": "4-6 years",
  "phases": [
    {
      "id": "phase_1",
      "title": "Foundation",
      "level": "Beginner",
      "duration": "6-12 months",
      "milestones": [
        {
          "id": "milestone_1_1",
          "title": "Understand Intellectual Property Law Basics",
          "description": "Learn the fundamentals of IP law: patents, trademarks, copyrights, and trade secrets.",
          "skills": [
            "IP law fundamentals",
            "Legal research",
            "Document analysis"
          ],
          "tools": ["LexisNexis", "Westlaw", "Google Patents"],
          "resources": [
            {
              "type": "book",
              "title": "Patent It Yourself",
              "author": "David Pressman"
            },
            {
              "type": "course",
              "title": "Introduction to Intellectual Property",
              "platform": "Coursera"
            }
          ],
          "youtube_query": "introduction to patent law for beginners",
          "job_skills_query": "patent lawyer IP law"
        }
      ]
    }
  ]
}
```

---

## 7. Feature Specifications

### 7.1 Search and Roadmap Generation

User flow:

1. User lands on homepage and sees a search bar.
2. User types any topic or goal.
3. Loading state appears while Claude generates roadmap JSON.
4. Roadmap renders as a visual, phase-by-phase node graph.
5. If logged in, roadmap is auto-saved.
6. If not logged in, show sign-up prompt for save/progress.

Claude prompt strategy:

- System prompt: structured curriculum designer.
- User prompt includes query and requires valid JSON only.
- Temperature: 0.3.
- Max tokens: 4000.

Edge cases:

- Malformed JSON: retry once, then friendly error.
- Vague topics: proceed with reasonable assumptions.
- Harmful topics: safe refusal with generic UI error.

### 7.2 Visual Roadmap Renderer

Roadmap uses a vertical node graph:

- Each phase is a labeled horizontal section.
- Each milestone is a clickable node.
- Node colors:
  - Grey: not started
  - Yellow: in progress
  - Green: completed
- Expanded MilestoneCard shows:
  - Description and skills
  - Tools and resources
  - 2-3 embedded YouTube videos
  - Job market demand badge
  - Mark complete button (logged in users)

### 7.3 YouTube Integration

For each milestone:

- Query YouTube API with youtube_query.
- Fetch top 3 by relevance.
- Filter out videos shorter than 3 minutes.
- Fetch lazily on milestone expand.

### 7.4 Job Market Demand Badge

For each milestone:

- Query Adzuna with job_skills_query.
- Show open roles + demand level.
- Example: 3200 open roles - High Demand.
- Fetch lazily on milestone expand.

### 7.5 User Auth and Accounts

Supabase auth flow:

- Email/password and Google OAuth.
- JWT sessions in cookies via Next.js middleware.

Logged-in user capabilities:

- Auto-save generated roadmaps.
- Cross-device milestone progress persistence.
- Dashboard with completion metrics.
- Delete or archive saved roadmaps.

### 7.6 Progress Tracking

- Milestones include mark-complete action.
- Write completion to progress table.
- Phase completion formula:

```text
(completed milestones / total milestones) * 100
```

- Roadmap completion aggregates all phases.
- Progress bar appears in roadmap and dashboard.
- Dashboard cards show title, completion %, last activity, and continue action.

### 7.7 Community and Explore Page

- Public roadmaps appear in Explore.
- Sorted by view count.
- Filter by inferred category.
- Homepage shows top 6 trending public roadmaps.
- Users can save a copy to their own account.

### 7.8 Shareable Roadmap URLs

- Every roadmap has unique slug.
- Owners can toggle public/private.
- Public URL is read-only for non-owners.
- Viewer cannot see owner progress.

---

## 8. UI and Design Principles

- Dark mode first, modern professional look.
- Minimal content-first UI.
- Framer Motion for expansions/transitions.
- Mobile responsive graph-to-list behavior.
- Accessibility: keyboard navigation + ARIA labels.

Key pages:

| Page         | Route           | Description                            |
| ------------ | --------------- | -------------------------------------- |
| Landing      | /               | Hero with search and trending roadmaps |
| Roadmap View | /roadmap/[slug] | Full roadmap graph and milestone cards |
| Dashboard    | /dashboard      | Saved roadmaps + progress              |
| Explore      | /explore        | Community and trending roadmaps        |
| Auth         | /auth           | Sign up / log in                       |

---

## 9. Environment Variables

```env
ANTHROPIC_API_KEY=
YOUTUBE_API_KEY=
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 10. Development Phases

Phase 1 - Core MVP:

- Project setup (Next.js 14 + TypeScript + Tailwind + shadcn/ui)
- Landing page with search bar
- Claude API integration + roadmap generation
- Visual roadmap renderer
- MilestoneCard with expand/collapse
- YouTube embedding per milestone

Phase 2 - Auth and Progress:

- Supabase Auth (email + Google OAuth)
- Auto-save roadmaps for logged-in users
- Milestone completion tracking
- Dashboard with roadmap cards and completion
- Continue where left off flow

Phase 3 - Intelligence Layer:

- Adzuna demand badges
- Trending section on homepage
- Public/private sharing
- Explore page filtering

Phase 4 - Polish and Launch:

- UI polish + animations
- Mobile responsiveness
- Error and loading states
- SEO metadata per roadmap
- Performance optimization and caching

---

## 11. Out of Scope

- Resume/CV builder
- Downloadable roadmap files
- Mobile native app
- Payment/premium tier
- In-roadmap AI chat assistant

---

## 12. Open Questions

1. Should roadmap generation be rate-limited for anonymous users?
2. Should generated roadmaps be cached for duplicate queries?
3. Which Explore categories should be available at launch?
4. Should users be allowed to edit generated roadmaps?
