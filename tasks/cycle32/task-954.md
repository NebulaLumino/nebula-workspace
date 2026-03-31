# Task 954: ai-restaurant-menu (Restaurant Menu & Recipe Card Generator)

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28
**Completed:** 2026-03-28
**Build:** npm run build passing ✅
**GitHub:** https://github.com/NebulaLumino/ai-restaurant-menu ✅
**DeepSeek API:** Integrated ✅
**Dark UI:** #0a0a0f to #1a1a2e gradient, purple accent (#a855f7) ✅
**Priority:** MEDIUM
**Cycle:** 32 (951-960)
**Generated:** 2026-03-28

---

## App Overview
**AI Generator:** Restaurant Menu & Recipe Card Generator
**Purpose:** Generate professional restaurant menu items with full recipe cards from dish descriptions
**GitHub:** https://github.com/NebulaLumino/ai-restaurant-menu

## Specs
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, dark gradient UI (#0a0a0f→#1a1a2e, purple accent #a855f7)
- **AI API:** DeepSeek via `https://api.deepseek.com/v1` (model: deepseek-chat)
- **Input:** Form with dish details (name, cuisine, type, dietary tags, price range, description)
- **Output:** Full menu item description + detailed recipe card in markdown
- **API Route:** `POST /api/generate` with `generateText` from `ai` + `@ai-sdk/deepseek`

## Prompt Template
Generate a professional restaurant menu item with a complete recipe card.

Dish Information:
- Dish Name: [dish_name]
- Cuisine Type: [cuisine_type]
- Course Type: [course_type] (Appetizer, Main, Dessert, Beverage)
- Restaurant Concept: [concept]
- Dietary Tags: [dietary_tags] (e.g., Vegetarian, Gluten-Free, Spicy, Vegan, GF)
- Price Range: [price_range]
- Serving Size: [serving_size]
- Chef's Description: [description]
- Flavor Profile: [flavor_profile]

Requirements:
- Generate a compelling menu description (100-150 words) with sensory language
- Create a complete standardized recipe card including:
  - Ingredients with precise measurements (metric + imperial)
  - Step-by-step preparation instructions
  - Cooking time and temperature
  - Plating presentation suggestions
  - Chef's plating notes
  - Substitution options for dietary modifications
  - Storage/holding instructions for commercial kitchen
- Menu description should match restaurant concept and price point
- Format as clean markdown with sections clearly delineated

## Status History
- 2026-03-28: Task created
