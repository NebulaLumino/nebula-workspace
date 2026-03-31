# Task 369: AI Investor One-Pager Generator

**Status:** ⏳ Pending  
**Type:** App Generator — Finance  
**Priority:** MEDIUM  

## Context
A single-page investment summary that communicates the key metrics and thesis of a startup to investors.

## Spec
- **Input:** Company name, industry, stage, key metrics (MRR, ARR, growth rate, users), team size, funding ask
- **Output:** Polished one-pager with company overview, traction, team, financial highlights, use of funds
- **Format:** Single-page, investor-ready document

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI SDK

## Implementation
```bash
mkdir -p ai-investor-onepager
cd ai-investor-onepager
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack --import-alias "@/*"
```
