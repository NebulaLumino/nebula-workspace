# Task 952: ai-construction-sow (Construction Scope of Work Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-construction-sow ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅

---

## App Overview
**AI Generator:** Construction Scope of Work Generator
**Purpose:** Generate detailed, professional construction SOW documents from project specifications
**GitHub:** https://github.com/NebulaLumino/ai-construction-sow

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with project details (project name, type, scope, location, budget, timeline, parties)
- **Output:** Comprehensive SOW document in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a professional Construction Scope of Work (SOW) document for the following project:

- Project Name: [project_name]
- Project Type: [project_type] (e.g., Residential Remodel, Commercial Build-Out, New Construction, Renovation)
- Project Location: [location]
- Owner/Client: [client_name]
- Contractor: [contractor_name]
- Architect/Engineer: [architect]
- Estimated Budget: [budget]
- Project Timeline: [timeline]
- Scope Description: [scope_description]
- Site Conditions: [site_conditions]
- Permits Required: [permits]

Requirements:
- Include: Project Overview, Scope of Work, Site Preparation, Phases/Milestones, Materials & Specifications, Performance Standards, Insurance & Safety Requirements, Change Order Process, Payment Schedule, Acceptance Criteria, Warranty Information
- Use numbered sections and bullet points for clarity
- Include placeholder for signatures/dates at bottom
- 800-1200 words
- Format as clean professional markdown

## Status History
- 2026-03-28: Task created
