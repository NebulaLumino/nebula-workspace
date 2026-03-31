# Task 960: ai-travel-itinerary (Travel Itinerary & Packing List Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-travel-itinerary ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28

---

## App Overview
**AI Generator:** Travel Itinerary & Packing List Generator
**Purpose:** Generate comprehensive travel itineraries with day-by-day plans and smart packing lists
**GitHub:** https://github.com/NebulaLumino/ai-travel-itinerary

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with trip details (destination, dates, travel style, budget, interests, travelers)
- **Output:** Full travel itinerary with packing list in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a comprehensive travel itinerary and packing list for the following trip:

Trip Information:
- Destination: [destination]
- Departure City: [departure_city]
- Travel Dates: [start_date] to [end_date]
- Trip Duration: [duration] days/[nights]
- Number of Travelers: [travelers]
- Traveler Ages/Composition: [composition] (e.g., couple, family with kids, solo, group of friends)
- Travel Style: [style] (Relaxed, Moderate, Packed/Active, Luxury, Adventure)
- Budget Level: [budget] (Budget, Moderate, Mid-Range, Luxury)
- Primary Interests: [interests] (e.g., food, history, nature, art, nightlife, shopping, family activities)
- Season/Weather Expected: [weather]
- Accommodation Type: [accommodation] (Hotel, Airbnb, Hostel, Resort, Camping)
- Transportation Within Destination: [transportation]
- Dietary Restrictions: [dietary]
- Travel Insurance?: [insurance]
- Special Occasions During Trip?: [occasion]

Requirements:
- Day-by-day itinerary with time-stamped activities
- Include: must-see attractions, dining recommendations, hidden gems, practical tips
- Prioritize based on travel style and interests
- Note opening hours, booking requirements, and estimated costs
- Include travel tips specific to destination and season
- Smart packing list organized by category (clothing, toiletries, electronics, documents, miscellaneous)
- Consider weather, activities, and cultural norms in packing list
- 800-1200 words
- Format as clean markdown with tables for packing lists

## Status History
- 2026-03-28: Task created
