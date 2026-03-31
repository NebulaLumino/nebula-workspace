# Task 577: ai-infra-cost-estimate

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-infra-cost-estimate` — Infrastructure Cost Estimator

## Description
A web app that estimates cloud infrastructure costs. Users input service configurations (compute, storage, database, CDN, etc.) and the AI generates detailed cost breakdowns with monthly/annual estimates across AWS, GCP, and Azure.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input form: compute (instances, specs), storage (type, size), database (type, size), CDN bandwidth, data transfer
- AI generates: cost breakdown by service, monthly/annual estimates, cost optimization recommendations
- Side-by-side cloud provider comparison
- Download as Markdown or JSON
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
