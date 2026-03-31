# Task 571: ai-incident-postmortem

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-incident-postmortem` — Incident Postmortem Generator

## Description
A web app that generates structured incident postmortems (post-mortems) from incident details. Users input incident timeline, impact, root cause, and action items. The AI generates a comprehensive, blameless postmortem document.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input form: incident title, date, severity, timeline events, impact summary, root cause, action items
- AI-powered postmortem generation with structured sections (Summary, Timeline, Root Cause, Impact, Action Items, Lessons Learned)
- Copy to clipboard / download as markdown
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
