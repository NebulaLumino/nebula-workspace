# Task 582: ai-access-control-matrix

**Status:** ✅ Complete
**Type:** AI App (DevOps)
**Priority:** MEDIUM
**Cycle:** 21 (571-600)

---

## App Name
`ai-access-control-matrix` — Access Control Matrix Generator

## Description
A web app that generates access control matrices (RBAC/ABAC). Users input roles and their required permissions. The AI generates structured access control matrices with role-permission mappings, suitable for implementation in IAM systems.

## Tech Stack
- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- AI: DeepSeek API (model=deepseek-chat, baseURL=https://api.deepseek.com/v1)
- Deployment: GitHub only (Vercel limit reached)

## Features
- Input: list of roles and their permissions (text description)
- AI generates: structured RBAC matrix (role × permission table), IAM policy JSON, least-privilege recommendations
- Visual matrix display with checkboxes
- Export as JSON, YAML, or Markdown
- Dark/light theme toggle

## Spec Source
Internal — implement based on app description above.
