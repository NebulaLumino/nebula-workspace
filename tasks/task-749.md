# Task 749: AI Post-Mortem Report Generator

**Status:** ✅ Complete
**Type:** App Generator — Engineering/Operations
**Priority:** MEDIUM
**Cycle:** 26 (731-760)

---

## App Concept

Generate incident post-mortem reports for engineering teams. Input: incident date and duration, service affected, root cause (if known), impact metrics (users affected, revenue impact), resolution steps, team involved. Output: structured post-mortem document with timeline, root cause analysis, impact assessment, lessons learned, and action items (with owners and deadlines). Follows blameless post-mortem best practices.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- DeepSeek API (OpenAI-compatible)
- TypeScript

## Output

- GitHub repo: `ai-post-mortem-report`
- Deployed URL: `ai-post-mortem-report-{suffix}.vercel.app`
