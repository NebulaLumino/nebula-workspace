# Task 959: ai-wedding-timeline (Wedding Day Timeline Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-wedding-timeline ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28

---

## App Overview
**AI Generator:** Wedding Day Timeline Generator
**Purpose:** Generate a detailed, realistic wedding day timeline from event logistics
**GitHub:** https://github.com/NebulaLumino/ai-wedding-timeline

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with wedding logistics (ceremony time, cocktail hour, reception details, vendors, travel times)
- **Output:** Detailed wedding day timeline in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a detailed wedding day timeline for the following event:

Wedding Logistics:
- Ceremony Start Time: [ceremony_time]
- Ceremony Venue: [ceremony_venue]
- Reception Venue: [reception_venue]
- Are venues the same location?: [same_venue]
- Travel Time Between Venues: [travel_time]
- Cocktail Hour Duration: [cocktail_duration]
- Reception Start Time: [reception_start]
- Reception End Time: [reception_end]
- First Look Planned?: [first_look]
- Number of Bridesmaids/Groomsmen: [wedding_party_size]
- Photography Coverage: [photo_coverage] (hours)
- Videography Coverage: [video_coverage] (hours)
- DJ/Band Start Time: [dj_start]
- Dinner Service Style: [dinner_style] (Plated, Buffet, Family Style, Food Stations)
- Cake Cutting Time: [cake_time]
- Toasts/Speeches: [toasts_time]
- First Dance: [first_dance]
- Send-off Type: [send_off]
- Special Rituals: [rituals] (e.g., bouquet toss, garter toss, cake cutting)
- Season/Weather Considerations: [weather]

Requirements:
- Build a realistic timeline working backward from ceremony and forward from getting ready
- Include adequate buffer time between events
- Account for photography/videography needs
- Include vendor arrival times
- Factor in travel and transition time
- Show both bride/groom schedules if separate getting ready
- Add "vendor notes" section with key contact times
- Include photography must-have shot list
- 600-1000 words
- Format as clean markdown with time-stamped entries

## Status History
- 2026-03-28: Task created
