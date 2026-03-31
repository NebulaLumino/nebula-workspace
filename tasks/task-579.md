# Task 579: ai-migration-checklist

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-migration-checklist` — Database Migration Checklist Generator

## Description
A web app that generates comprehensive database migration checklists. Users describe their migration scenario (e.g., PostgreSQL 12 to 16, or MySQL to PostgreSQL), and the AI generates step-by-step checklists covering pre-migration, execution, and post-migration phases.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: source DB, target DB, version/specs, migration type (major version, engine switch, schema redesign)
- AI generates: pre-migration checks, execution steps, post-migration validation, rollback plan
- Checkable checklist UI
- Download as Markdown or copy to clipboard
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
