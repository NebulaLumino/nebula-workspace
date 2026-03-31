# Task 945: AI HR Performance Review Writer

**Status:** ✅ Complete
**Type:** App Generator
**Priority:** HIGH
**Cycle:** 32 (941-950)
**Created:** 2026-03-28

## Description
Create a web app that generates professional HR performance reviews from employee information, goals, competencies, and achievements — producing structured reviews for performance ratings, development plans, and promotion recommendations.

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- DeepSeek API (deepseek-chat model)
- Dark gradient UI (#0a0a0f → #1a1a2e, purple accent)
- @ai-sdk/deepseek provider

## Features
- Input: Employee info, job role, goals, competencies, achievements, areas for improvement
- Output: Full performance review with ratings, written feedback, development plan, and recommendations
- Review type (Annual Review, Mid-Year Review, Probationary Review, 360-Degree Review, Promotion Review)
- Employee details (name, role, department, tenure)
- Goal achievement assessment
- Core competency evaluation (communication, leadership, technical skills, teamwork, initiative)
- Strengths and accomplishments
- Areas for improvement with constructive feedback
- Performance rating recommendation (1-5 scale)
- Development plan with SMART goals
- Promotion/compensation recommendations
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
