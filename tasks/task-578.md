# Task 578: ai-feature-flag-config

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-feature-flag-config` — Feature Flag Configuration Generator

## Description
A web app that generates feature flag configurations. Users describe a feature and its targeting rules, and the AI generates structured feature flag configurations compatible with popular tools like LaunchDarkly, Unleash, or Flagsmith.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: feature name, description, targeting rules (percentage rollouts, user segments, environment)
- AI generates: JSON/YAML flag configurations, targeting rules, percentage splits
- Support multiple flag SDK formats (LaunchDarkly, Unleash, custom JSON)
- Copy to clipboard / download
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
