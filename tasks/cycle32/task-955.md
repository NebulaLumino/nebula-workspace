# Task 955: ai-hotel-welcome (Hotel Guest Welcome Packet Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-hotel-welcome ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28

---

## App Overview
**AI Generator:** Hotel Guest Welcome Packet Generator
**Purpose:** Generate comprehensive, personalized hotel guest welcome packets
**GitHub:** https://github.com/NebulaLumino/ai-hotel-welcome

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with hotel and guest details (hotel name, room type, amenities, purpose of stay, etc.)
- **Output:** Personalized welcome packet in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a personalized hotel guest welcome packet for the following stay:

- Hotel Name: [hotel_name]
- Hotel Brand/Chain: [brand]
- Room Type: [room_type]
- Guest Name: [guest_name]
- Check-in Date: [checkin]
- Check-out Date: [checkout]
- Number of Guests: [num_guests]
- Purpose of Stay: [purpose] (e.g., Business, Vacation, Honeymoon, Family Reunion)
- Hotel Amenities: [amenities]
- Local Area Highlights: [local_attractions]
- Hotel Restaurant Info: [restaurant_info]
- Check-out Time: [checkout_time]
- Loyalty Program: [loyalty_tier]
- Special Occasions: [occasion]

Requirements:
- Warm, welcoming tone personalized to purpose of stay and loyalty tier
- Include: Welcome message, room amenities guide, WiFi instructions, hotel services, dining options, local recommendations, spa/fitness info, business center info, emergency procedures, checkout instructions
- Add relevant tips based on purpose (business traveler vs. vacation)
- Include estimated drive times to key destinations
- 600-900 words
- Format as clean, elegant markdown

## Status History
- 2026-03-28: Task created
