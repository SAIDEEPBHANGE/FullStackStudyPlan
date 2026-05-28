# Full Stack Study Plan

A concise full-stack developer study plan covering backend, frontend, database, system design, deployment, and interview readiness phases.

## Phase 0 — system design primer (moved earlier)

- Weeks: Week 1 · 1 week
- Difficulty: Medium
- Tasks:
  - **Read** System Design Primer (GitHub) — 2 hrs total
  - **Sketch** your SaaS app's architecture before writing any code: DB schema, API routes, folder structure
  - **Learn** REST API design basics: versioning, status codes, error formats, pagination
  - **Understand** monolith-first — start with a monolith, don't jump to microservices
- Warning: Critical fix: doing this before Phase 1 prevents architectural regrets in your real projects.

## Phase 1 — core fundamentals

- Weeks: Weeks 2–4 · 3 weeks
- Difficulty: Hard
- Tasks:
  - **Node.js**: event loop deeply, async/await, error handling, streams basics, Express middleware
  - **JavaScript**: closures, prototypes, promises, ES6+ — do exercises, not just reading
  - **React**: useEffect, useMemo, useCallback — build small components for each, don't just read docs
  - **State management**: Context API first, Redux only if project demands it
  - **PostgreSQL**: joins, indexes, transactions — run real queries in psql, not just ORM
- Warning: Do not spend more than 3 weeks here. Good enough > perfect. Move to projects by week 5.

## Phase 2 — build real projects (apply clean code here)

- Weeks: Weeks 5–12 · 8 weeks
- Difficulty: Hard
- Tasks:
  - **Project 1 (weeks 5–8)**: Full-stack SaaS — Task Manager or CRM. Stack: Next.js + Node.js/Express + PostgreSQL. Must include: JWT auth, CRUD, role-based access, deployed live.
  - **Project 2 (weeks 9–11)**: AI-powered app — pick a specific real problem (e.g. 'job listing summarizer for non-English speakers'), not just an OpenAI wrapper. Streaming responses, clean UI.
  - **Project 3 (weeks 12)**: Production-grade REST API — pagination, filtering, rate limiting, logging (use Winston or Pino), proper error middleware.
  - **Clean code integrated**: Apply SOLID, DRY, folder structure, unit tests as you build — not after.
- Warning: Each project must be deployed with a live URL and README before moving on. No exceptions.

## Phase 3 — deepen system design

- Weeks: Weeks 13–15 · 3 weeks
- Difficulty: Medium
- Tasks:
  - **Caching**: Redis basics — what to cache, TTL, cache invalidation
  - **DB design**: indexing strategies, normalization vs denormalization tradeoffs
  - **Scalability thinking**: read replicas, connection pooling, N+1 query problem
  - **Practice**: verbally design a URL shortener, a Twitter feed, a notification system — out loud

## Phase 4 — tools & workflow

- Weeks: Weeks 14–16 · 2 weeks (parallel with Phase 3)
- Difficulty: Easy
- Tasks:
  - **Git**: feature branching, rebasing, squash commits, pull request workflow
  - **CI/CD**: GitHub Actions — auto-run tests on PR, auto-deploy on merge to main
  - **Deployment**: Render or Railway for backend, Vercel for frontend — keep it simple at this stage
  - **Docker basics**: containerize your Node.js app — this shows up in interviews

## Phase 5 — portfolio polish

- Weeks: Weeks 17–18 · 2 weeks
- Difficulty: Medium
- Tasks:
  - **3–5 projects**: each needs live demo, clean README with architecture diagram, problem statement, tech choices explained
  - **GitHub profile**: pinned repos, contribution graph visible, profile README
  - **Get feedback**: post your code in communities (r/webdev, dev.to, Discord servers) — you need external review
  - **Open source**: at least 1 small contribution — a bug fix counts
- Warning: Missing: your original plan had no feedback loop. This is the most important fix — get a senior dev to review at least one project.

## Phase 6 — interview readiness

- Weeks: Weeks 19–20 · 2 weeks
- Difficulty: Hard
- Tasks:
  - **DSA**: by now you should have 60+ days of daily practice done — focus on patterns: sliding window, two pointers, BFS/DFS, DP basics
  - **System design mock**: do 2–3 mock designs with a peer or record yourself
  - **Resume**: 1 page, each bullet = impact + tech used, link to live projects
  - **LinkedIn**: 'Open to work', list projects with URLs, connect with 20+ devs in your target companies
  - **Apply**: start applying by week 18, not after — interviews take 3–6 weeks to materialise
