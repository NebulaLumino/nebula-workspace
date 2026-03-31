# Task 574: ai-release-notes

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-release-notes` — Release Notes Generator

## Description
A web app that generates polished release notes from git commit history or manual changelog entries. Users input commit messages, version number, and release date. The AI categorizes changes into Features, Bug Fixes, Breaking Changes, Performance Improvements, and Documentation updates.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Text area for commit messages or changelog entries
- Input: version number, release date, product name
- AI categorizes and formats into structured release notes
- Preview in formatted view (cards/sections)
- Copy/download as Markdown
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
