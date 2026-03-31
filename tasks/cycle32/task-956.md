# Task 956: ai-auto-repair-estimate (Auto Repair Estimate Description Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-auto-repair-estimate ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28

---

## App Overview
**AI Generator:** Auto Repair Estimate Description Generator
**Purpose:** Generate clear, professional auto repair estimate documents with labor and parts descriptions
**GitHub:** https://github.com/NebulaLumino/ai-auto-repair-estimate

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with vehicle and repair details (make, model, year, VIN, issues, recommended repairs)
- **Output:** Professional estimate document in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a professional auto repair estimate document for the following vehicle and repair:

Vehicle Information:
- Make: [make]
- Model: [model]
- Year: [year]
- Mileage: [mileage]
- VIN: [vin]
- License Plate: [license_plate]
- Vehicle Color: [color]
- Shop Name: [shop_name]
- Shop Address: [shop_address]
- Customer Name: [customer_name]
- Advisor Name: [advisor]
- Estimate Date: [date]
- Estimated Completion: [completion_date]

Repair Needs:
- Reported Issues: [issues]
- Recommended Repairs: [repairs]
- Parts Needed: [parts]
- Labor Hours: [labor_hours]
- Shop Labor Rate: [labor_rate]

Requirements:
- Include: Vehicle information header, repair description with technical explanation of each repair, parts list with part numbers (or "to be determined" if unknown), labor breakdown, totals with tax estimate, disclaimer notes, authorization signature section
- Technical explanations should be clear to a non-mechanic customer
- Include recommended vs. optional repairs clearly labeled
- 500-800 words
- Format as clean professional markdown with tables for parts/labor

## Status History
- 2026-03-28: Task created
