# RoadmapAI

RoadmapAI is an AI-powered learning roadmap generator built with Next.js 14, TypeScript, Tailwind CSS, Claude API, YouTube Data API, Adzuna, and Supabase.

## Features

- Dynamic roadmap generation from natural-language goals
- Phase-based visual roadmap renderer with expandable milestones
- Lazy-loaded YouTube video recommendations per milestone
- Lazy-loaded job demand badges per milestone
- Auth scaffolding with Supabase (email + Google OAuth)
- Progress tracking API and dashboard view
- Public roadmap explore page with category filters and trending section

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zod
- Supabase Auth + PostgreSQL

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env template and fill values:

```bash
cp .env.example .env.local
```

3. Run dev server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Environment Variables

Use values defined in `.env.example`:

- `ANTHROPIC_API_KEY`
- `YOUTUBE_API_KEY`
- `ADZUNA_APP_ID`
- `ADZUNA_APP_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

If API keys are missing, the app uses safe local fallbacks so the UI and flows remain testable.

## Database

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor to create tables, indexes, and RLS policies.

## Routes

- `/` Landing with search + trending
- `/roadmap/[slug]` Dynamic roadmap view
- `/dashboard` Saved roadmap progress
- `/explore` Public community roadmaps
- `/auth` Sign up / log in

## API Endpoints

- `POST /api/generate-roadmap`
- `POST /api/fetch-videos`
- `GET /api/job-demand?query=`
- `GET /api/roadmaps/[slug]`
- `POST /api/progress`
- `GET /api/public-roadmaps`
- `POST /api/toggle-public`
- `POST /api/mark-viewed`
