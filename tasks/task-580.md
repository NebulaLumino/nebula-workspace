# Task 580: ai-api-rate-limit

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-api-rate-limit` — API Rate Limit Policy Generator

## Description
A web app that generates API rate limiting policies and configurations. Users describe their API endpoints, expected traffic, and user tiers. The AI generates structured rate limit policies for API gateways like Kong, AWS API Gateway, or Nginx.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: API endpoints, user tiers (free/paid/enterprise), expected request volumes, burst requirements
- AI generates: rate limit configurations (requests/minute), quota policies, throttling rules, response headers
- Multiple output formats: JSON, YAML, Kong declarative config, Nginx config
- Copy to clipboard / download
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
