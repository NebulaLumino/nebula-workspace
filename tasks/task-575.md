# Task 575: ai-oncall-schedule

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-oncall-schedule` — On-Call Schedule Generator

## Description
A web app that generates on-call rotation schedules for engineering teams. Users input team members, rotation frequency, and coverage requirements. The AI generates balanced rotation schedules accounting for time zones, handoff procedures, and escalation paths.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: team members (name, timezone), rotation type (weekly/bi-weekly), start date, coverage hours
- AI generates: rotation schedule, primary/secondary assignments, handoff notes, escalation contacts
- Export as calendar view (text/CSV)
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
