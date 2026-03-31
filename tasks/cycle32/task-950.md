# Task 950: AI Consulting Deliverable Framework Generator

**Status:** ✅ Complete
**Type:** App Generator
**Priority:** HIGH
**Cycle:** 32 (941-950)
**Created:** 2026-03-28

## Description
Create a web app that generates comprehensive consulting deliverable frameworks — from problem statements and hypotheses to analytical frameworks, executive presentations, and implementation roadmaps for consulting engagements.

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- DeepSeek API (deepseek-chat model)
- Dark gradient UI (#0a0a0f → #1a1a2e, purple accent)
- @ai-sdk/deepseek provider

## Features
- Input: Client problem, engagement type, scope, objectives, timeline
- Output: Full consulting deliverable framework with structure, analysis plan, and key outputs
- Deliverable type (Strategy Document, Operational Assessment, Digital Transformation Plan, Cost Optimization Study, Market Entry Strategy, Org Design, Technology Roadmap, M&A Integration Plan)
- Engagement type (Strategy, Operations, Technology, Financial, Organizational, Digital)
- Client industry and context
- Problem statement and business question
- Scope and objectives
- Key hypotheses
- Analytical framework recommendations
- Data requirements
- Stakeholder mapping
- Work plan and timeline
- Deliverable structure outline
- Key insights framework
- Recommendations architecture
- Implementation roadmap structure
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
