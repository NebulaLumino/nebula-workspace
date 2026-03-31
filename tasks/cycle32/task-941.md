# Task 941: AI Legal Document Redliner

**Status:** ✅ Complete
**Type:** App Generator
**Priority:** HIGH
**Cycle:** 32 (941-950)
**Created:** 2026-03-28

## Description
Create a web app that analyzes and redlines legal documents, tracking changes, identifying clauses, highlighting risks, and comparing document versions with professional legal markup.

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- DeepSeek API (deepseek-chat model)
- Dark gradient UI (#0a0a0f → #1a1a2e, purple accent)
- @ai-sdk/deepseek provider

## Features
- Input: Legal document text (contract, agreement, NDA, lease, etc.)
- Output: Redlined document with tracked changes, clause analysis, risk flags, and professional annotations
- Document type selection (NDA, contract, lease, terms of service, employment agreement)
- Change highlighting (additions, deletions, modifications)
- Clause-by-clause breakdown with legal risk ratings
- Copy/download redlined document
- Markdown-formatted output display

## API Integration
- Route: `src/app/api/generate/route.ts`
- Method: `generateText` from `ai` SDK
- Model: `deepseek-chat` via `@ai-sdk/deepseek`
- Env: `DEEPSEEK_API_KEY`

## Deliverable
- Fully functional Next.js app pushed to GitHub
- `npm run build` passes
- GitHub public repository created
- Task file updated to ✅ Complete
