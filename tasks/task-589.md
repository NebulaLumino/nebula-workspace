# Task 589: AI Service Level Objective (SLO) Generator

**Status:** ✅ Complete
**Type:** App Generator — SRE/DevOps
**Priority:** HIGH
**Cycle:** 21 (571-600)

---

## App Concept

Generate SLO definitions and error budget policies. Input: service name, user-facing functionality, historical availability data, user tolerance for downtime, competitor SLAs, regulatory requirements. Output: SLO definition document with precise availability targets (e.g., 99.9%), error budget calculation (minutes of downtime allowed per month), SLO reporting cadence, error budget burn rate alerts, and what to do when error budget is depleted.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- DeepSeek API (OpenAI-compatible)
- TypeScript

## Output

- GitHub repo: `ai-service-level-objective`
- Deployed URL: `ai-service-level-objective-{suffix}.vercel.app`
