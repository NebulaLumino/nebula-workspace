# Task 586: ai-api-changelog

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-api-changelog` — API Changelog Generator

## Description
A web app that generates developer-friendly API changelogs. Users input API changes (endpoints added/modified/deprecated), and the AI generates structured changelogs in formats like Keep a Changelog, GitHub Releases, or OpenAPI diff summaries.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: API version, list of changes (added/modified/deprecated/removed endpoints)
- AI generates: structured changelog with semantic versioning suggestions, breaking change flags, migration notes
- Multiple formats: Keep a Changelog, GitHub Release notes, OpenAPI summary
- Copy to clipboard / download as Markdown
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
