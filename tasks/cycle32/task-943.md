# Task 943: AI Architectural Design Brief Generator

**Status:** ✅ Complete
**Type:** App Generator
**Priority:** HIGH
**Cycle:** 32 (941-950)
**Created:** 2026-03-28

## Description
Create a web app that generates comprehensive architectural design briefs from project requirements, including site analysis, spatial programs, design concept narratives, and technical specifications.

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- DeepSeek API (deepseek-chat model)
- Dark gradient UI (#0a0a0f → #1a1a2e, purple accent)
- @ai-sdk/deepseek provider

## Features
- Input: Project type, site info, client requirements, budget, timeline, style preferences
- Output: Full architectural design brief with concept, spatial program, site analysis, design approach
- Project type selection (Residential, Commercial, Mixed-Use, Cultural, Healthcare, Educational, Industrial)
- Building scale (Single Family, Multi-Family, Small Commercial, Large Commercial, High-Rise)
- Site characteristics input (urban/suburban/rural, climate zone, setbacks)
- Client requirements (functional needs, aesthetic preferences, accessibility requirements)
- Budget and timeline constraints
- Design concept narrative generation
- Copy/download functionality
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
