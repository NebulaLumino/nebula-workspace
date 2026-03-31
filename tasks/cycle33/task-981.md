# Task 981: AI Restaurant Food Menu & Recipe Developer

**Status:** ✅ Complete
**Priority:** MEDIUM
**Cycle:** 33 (971-1000)
**Theme:** Advanced Professional AI Tools

---

## Concept & Vision
A tool for restaurant owners, chefs, and food entrepreneurs to develop complete menus with recipes, cost analysis, and supplier notes. The output is a full menu package — dish descriptions, ingredient lists, preparation steps, suggested pricing, and plate cost estimates. Feels like a professional culinary development studio.

## Specific Features
- Full menu generator from cuisine type + concept
- Recipe developer with ingredients, quantities, steps
- Plate cost calculator (estimated food cost per dish)
- Menu pricing suggester (food cost % method)
- Seasonal menu planner
- Wine/food pairing notes
- Supplier specification sheet generator
- Allergen and dietary flag generator

## Input Fields
- Restaurant concept / cuisine type
- Target price point (casual / mid-range / fine dining)
- Number of seats / expected covers
- Average spend per cover target
- Dietary priorities (vegetarian options %, vegan, gluten-free)
- Seasonal availability (current season / all year)
- Cuisine inspiration references

## Output
Complete menu package:
- Menu overview with dish names and descriptions
- Full recipe for each dish
- Ingredient quantities and unit costs
- Estimated plate cost and suggested menu price
- Food cost percentage per dish and overall
- Supplier spec sheet
- Dietary/allergen flags per dish

## AI Model
DeepSeek via `/api/generate`.

## Tech Stack
Next.js 16, TypeScript, Tailwind CSS, dark gradient UI.
