# Task 942: AI Medical Clinical Note Generator

**Status:** ✅ Complete
**Type:** App Generator
**Priority:** HIGH
**Cycle:** 32 (941-950)
**Created:** 2026-03-28

## Description
Create a web app that generates comprehensive medical clinical notes including SOAP notes, History & Physical (H&P) examinations, and Discharge Summaries from patient information inputs.

## Tech Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- DeepSeek API (deepseek-chat model)
- Dark gradient UI (#0a0a0f → #1a1a2e, purple accent)
- @ai-sdk/deepseek provider

## Features
- Input: Patient demographics, chief complaint, history of present illness, physical exam findings, assessment/plan
- Output: Professionally formatted SOAP note, H&P, or Discharge Summary
- Note type selection (SOAP Note, History & Physical, Discharge Summary, Progress Note, Consultation Note)
- Specialty selection (Internal Medicine, Family Medicine, Cardiology, Surgery, Pediatrics, etc.)
- Chief complaint and HPI input
- Objective findings entry (vitals, lab results, imaging)
- Assessment with differential diagnosis
- Plan with treatment and follow-up
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
