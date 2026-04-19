# Task 4209: AI Cohort Retention Analysis Generator

## Status
[x] Complete

## GitHub
https://github.com/NebulaLumino/ai-cohort-retention

## Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- DeepSeek API (OPENAI_API_KEY env var, deepseek-chat model)
- OpenAI SDK with DeepSeek baseURL

## Features
- Dark gradient UI (from-gray-900 via-gray-950 to-gray-900)
- Accent color: teal
- `page.tsx` client component with textarea input + result display
- `/api/generate` route using OpenAI SDK → DeepSeek API
- `npm run build` passes, `node_modules` + `.next` removed

## Deployment
`vercel --prod`
