# Task 368: AI Go-to-Market Strategy Generator

**Status:** 🔄 In Progress  
**Type:** App Generator — Strategy  
**Priority:** MEDIUM  

## Context
Systematic plan for launching a product into a market. Includes market segmentation, pricing strategy, sales channels, and launch timeline.

## Spec
- **Input:** Product description, target market, competitors, pricing model, launch timeline
- **Output:** Comprehensive GTM strategy with actionable steps
- **Framework:** Product-led growth / Sales-led growth options
- **Sections:** Market analysis, customer segments, value proposition, pricing, channels, timeline, KPIs

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI SDK (user provides API key via env var)

## Implementation
```bash
mkdir -p ai-gtm-strategy
cd ai-gtm-strategy
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack --import-alias "@/*"
```

## Build & Deploy
```bash
cd ai-gtm-strategy && npm run build
```
Vercel deploy blocked — token invalid. Push to GitHub when ready.
