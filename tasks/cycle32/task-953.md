# Task 953: ai-insurance-claim (Insurance Claim Narrative Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-insurance-claim ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28

---

## App Overview
**AI Generator:** Insurance Claim Narrative Generator
**Purpose:** Generate professional, detailed insurance claim narratives from incident details
**GitHub:** https://github.com/NebulaLumino/ai-insurance-claim

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with claim details (policy type, incident date, description, damages, witnesses, etc.)
- **Output:** Professional claim narrative in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a professional insurance claim narrative for the following incident:

- Policy Type: [policy_type] (e.g., Homeowners, Auto, Property, Liability, Workers Comp)
- Policy Number: [policy_number]
- Claimant Name: [claimant_name]
- Date of Incident: [date]
- Time of Incident: [time]
- Location of Incident: [location]
- Description of Incident: [description]
- Damages/Injuries Sustained: [damages]
- Estimated Loss Amount: [estimated_amount]
- Witnesses: [witnesses]
- First Report Filed: [first_report]
- First Responder: [first_responder]
- Supporting Documentation: [documents]

Requirements:
- Write in formal, objective third-person language
- Chronological narrative structure
- Include all relevant facts without speculation
- Reference supporting documentation
- Include cause and origin analysis where relevant
- 400-700 words
- End with claim amount summary
- Format as clean professional markdown

## Status History
- 2026-03-28: Task created
