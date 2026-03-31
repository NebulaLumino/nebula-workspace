# Task 951: ai-real-estate-listing (Real Estate Property Listing Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-real-estate-listing ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅

---

## App Overview
**AI Generator:** Real Estate Property Listing Generator
**Purpose:** Generate professional, compelling real estate listing descriptions from property details
**GitHub:** https://github.com/NebulaLumino/ai-real-estate-listing

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with property details (address, type, beds, baths, sqft, features, listing type, tone)
- **Output:** Professional real estate listing description in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a compelling real estate listing description based on the following property details. Write in [tone] tone — [listing_type] style.

Property Details:
- Address: [address]
- Property Type: [property_type] (e.g., Single Family Home, Condo, Townhouse, Multi-Family)
- Bedrooms: [bedrooms]
- Bathrooms: [bathrooms]
- Square Feet: [sqft]
- Year Built: [year_built]
- Lot Size: [lot_size]
- Special Features: [features]
- Listing Type: [listing_type] (For Sale / For Rent / For Lease)
- Target Buyer Profile: [buyer_profile]

Requirements:
- Open with an engaging hook that highlights the most compelling feature
- Include neighborhood/location context
- Highlight unique selling points
- Use sensory language (natural light, chef's kitchen, spa-like bathroom)
- Include relevant statistics (school ratings, commute times, Walk Score if provided)
- Close with a compelling call-to-action
- 300-500 words
- Format as clean markdown with bold headings for key sections

## Status History
- 2026-03-28: Task created, app scaffolding started
